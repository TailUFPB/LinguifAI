import random
import re
import os
from collections import Counter
from functools import partial
from pathlib import Path
import joblib

import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from nltk import wordpunct_tokenize
from tqdm import tqdm
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch import optim
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import Dataset, DataLoader
from torch.utils.data.dataset import random_split
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence

tqdm.pandas()

import nltk
nltk.download('stopwords')

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def remove_rare_words(tokens, common_tokens, max_len):
    return [token if token in common_tokens
            else '<UNK>' for token in tokens][-max_len:]

def tokenize(text, stop_words):
    text = str(text)
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    tokens = wordpunct_tokenize(text)
    tokens = [token for token in tokens if token not in stop_words]
    return tokens


class CustomDataset(Dataset):
    def __init__(self, df, max_vocab, max_len, name):
        # Clean and tokenize
        stop_words = set(stopwords.words('english'))
        
        df['tokens'] = df.input_text.progress_apply(
            partial(tokenize, stop_words=stop_words),
        )

        # Replace rare words with <UNK>
        all_tokens = [sublst for lst in df.tokens.tolist() for sublst in lst]
        common_tokens = set(list(zip(
            *Counter(all_tokens).most_common(max_vocab)))[0])
        df.loc[:, 'tokens'] = df.tokens.progress_apply(
            partial(
                remove_rare_words,
                common_tokens=common_tokens,
                max_len=max_len,
            ),
        )

        # Remove sequences with only <UNK>
        df = df[df.tokens.progress_apply(
            lambda tokens: any(token != '<UNK>' for token in tokens),
        )]

        vocab = sorted({
            sublst for lst in df.tokens.tolist() for sublst in lst
        })
        self.token2idx = {token: idx for idx, token in enumerate(vocab)}

        # Add a padding idx
        self.token2idx['<PAD>'] = max(self.token2idx.values()) + 1

        self.idx2token = {idx: token for token, idx in self.token2idx.items()}

        df['indexed_tokens'] = df.tokens.apply(
            lambda tokens: [self.token2idx[token] for token in tokens],
        )

        label_encoder = LabelEncoder()
        df['encoded_labels'] = label_encoder.fit_transform(df['labels'])
        encoder_name = f"LabelMapping-{name}"
        encoder_filename = os.path.join("api", "encoders", f"{encoder_name}.joblib")
        os.makedirs(os.path.dirname(encoder_filename), exist_ok=True)
        joblib.dump(label_encoder, encoder_filename)

        self.text = df.input_text.tolist()
        self.sequences = df.indexed_tokens.tolist()
        self.targets = df.encoded_labels.tolist()

    def __getitem__(self, i):
        return self.sequences[i], self.targets[i],  self.text[i]

    def __len__(self):
        return len(self.sequences)
    

def split_train_valid_test(corpus, valid_ratio=0.1, test_ratio=0.1):
    """Split dataset into train, validation, and test."""
    test_length = int(len(corpus) * test_ratio)
    valid_length = int(len(corpus) * valid_ratio)
    train_length = len(corpus) - valid_length - test_length
    return random_split(
        corpus, lengths=[train_length, valid_length, test_length],
    )


def collate(batch):
    inputs = [item[0] for item in batch]
    target = torch.LongTensor([item[1] for item in batch])
    text = [item[2] for item in batch]
    return inputs, target, text

def pad_sequences(sequences, padding_val=0, pad_left=False):
    """Pad a list of sequences to the same length with a padding_val."""
    sequence_length = max(len(sequence) for sequence in sequences)
    if not pad_left:
        return [
            sequence + (sequence_length - len(sequence)) * [padding_val]
            for sequence in sequences
        ]
    return [
        (sequence_length - len(sequence)) * [padding_val] + sequence
        for sequence in sequences
    ]


class RNNClassifier(nn.Module):
    def __init__(self, output_size, hidden_size, vocab_size, padding_idx,
                 device, dropout_probability=0.3, bidirectional=False, n_layers=1,
                 embedding_dimension=50, batch_size=32):
        super(RNNClassifier, self).__init__()
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.batch_size = batch_size
        self.n_layers = n_layers
        self.dropout_probability = dropout_probability
        self.device = device
        self.padding_idx = padding_idx

        # We need to multiply some layers by two if the model is bidirectional
        self.input_size_factor = 2 if bidirectional else 1

        self.embedding = nn.Embedding(vocab_size, embedding_dimension)

        self.rnn = nn.LSTM(
            embedding_dimension,
            self.hidden_size,
            self.n_layers,
            bidirectional=bidirectional,
        )

        self.fc1 = nn.Linear(
            self.hidden_size * self.input_size_factor,
            16,
        )
        self.fc2 = nn.Linear(
            16,
            self.output_size,
        )


    def init_hidden(self):
        """Set initial hidden states."""
        h0 = torch.randn(
            self.n_layers * self.input_size_factor,
            self.batch_size,
            self.hidden_size,
        )
        c0 = torch.randn(
            self.n_layers * self.input_size_factor,
            self.batch_size,
            self.hidden_size,
        )

        h0 = h0.to(self.device)
        c0 = c0.to(self.device)

        return h0, c0

    def apply_rnn(self, embedding_out, lengths):
        packed = pack_padded_sequence(
            embedding_out,
            lengths,
            batch_first=True,
        )
        activations, _ = self.rnn(packed, self.init_hidden())
        activations, _ = pad_packed_sequence(activations, batch_first=True)

        indices = (lengths - 1).view(-1, 1).expand(
            activations.size(0), activations.size(2),
        ).unsqueeze(1)
        indices = indices.to(self.device)

        activations = activations.gather(1, indices).squeeze(1)
        return activations

    def forward(self, inputs, return_activations=False):
        batch_size = len(inputs)

        # This makes the model not break for the last batch that might be less
        # than batch_size in size
        if batch_size != self.batch_size:
            self.batch_size = batch_size

        lengths = torch.LongTensor([len(x) for x in inputs])
        lengths, permutation_indices = lengths.sort(0, descending=True)

        # Pad sequences so that they are all the same length
        padded_inputs = pad_sequences(inputs, padding_val=self.padding_idx)
        inputs = torch.LongTensor(padded_inputs)

        # Sort inputs
        inputs = inputs[permutation_indices].to(self.device)

        # Get embeddings
        embedding_out = self.embedding(inputs)

        activations = self.apply_rnn(embedding_out, lengths)

        x = F.dropout(torch.relu(self.fc1(activations)), 0.05)
        x = self.fc2(x)
        out = torch.sigmoid(x)

        # Put the output back in correct order
        permutation_index_pairs = list(zip(
            permutation_indices.tolist(),
            list(range(len(permutation_indices))),
        ))
        reordered_indices = [
            pair[1] for pair
            in sorted(permutation_index_pairs, key=lambda pair: pair[0])
        ]

        if return_activations:
            return out[reordered_indices], x[reordered_indices]

        return out[reordered_indices]
    


def train_epoch(model, optimizer, scheduler, train_loader, criterion, curr_epoch, num_total_epochs):
    model.train()
    total_loss = total = 0
    progress_bar = tqdm(train_loader, desc='Training', leave=False)
    num_iters = 0
    for inputs, target, text in progress_bar:
        target = target.to(device)

        # Verifica se o cancelamento foi solicitado a cada batch
        with open('training_progress.json', 'r') as f:
            data = json.load(f)
            if data.get('cancel_requested', False):
                print("Training canceled during epoch:", curr_epoch)
                return total_loss / max(total, 1), True  # Retorna a perda média e o status de cancelamento

        # Clean old gradients
        optimizer.zero_grad()

        # Forwards pass
        output = model(inputs)

        # Calculate how wrong the model is
        loss = criterion(output, target)

        # Perform gradient descent, backwards pass
        loss.backward()

        # Take a step in the right direction
        optimizer.step()
        scheduler.step()

        # Record metrics
        total_loss += loss.item()
        total += len(target)
        num_iters += 1
        if num_iters % 20 == 0:
            with open('training_progress.json', 'r+') as f:
                progress = 100 * (curr_epoch + num_iters / len(train_loader)) / num_total_epochs
                data.update({
                    'training_progress': progress,
                    'training_in_progress': True
                })
                f.seek(0)
                json.dump(data, f)
                f.truncate()

    return total_loss / max(total, 1), False

def validate_epoch(model, valid_loader, criterion):
    model.eval()
    total_loss = total = 0
    with torch.no_grad():
        progress_bar = tqdm(valid_loader, desc='Validating', leave=False)
        for inputs, target, text in progress_bar:
            target = target.to(device)

            # Forwards pass
            output = model(inputs)

            # Calculate how wrong the model is
            loss = criterion(output, target)

            # Record metrics
            total_loss += loss.item()
            total += len(target)

    return total_loss / total

import os
import json
import torch
from tqdm import tqdm
from torch.utils.data import DataLoader
from sklearn.preprocessing import LabelEncoder
import joblib

def create_and_train_model(df, name, epochs=10, batch_size=32, learning_rate=0.001):
    # Configurações iniciais e preparações do modelo
    dropout_probability = 0.2
    n_rnn_layers = 1
    embedding_dimension = 128
    hidden_size = 64
    is_bidirectional = True
    max_vocab = 20000
    max_len = 200
    valid_ratio = 0.05
    test_ratio = 0.05

    # Preparação do dataset
    dataset = CustomDataset(df, max_vocab, max_len, name)
    train_dataset, valid_dataset, test_dataset = split_train_valid_test(
        dataset, valid_ratio=valid_ratio, test_ratio=test_ratio)

    # Preparação dos DataLoader
    train_loader = DataLoader(train_dataset, batch_size=batch_size, collate_fn=collate)
    valid_loader = DataLoader(valid_dataset, batch_size=batch_size, collate_fn=collate)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, collate_fn=collate)

    # Inicialização do modelo
    model = RNNClassifier(
        output_size=len(df['labels'].unique()),
        hidden_size=hidden_size,
        embedding_dimension=embedding_dimension,
        vocab_size=len(dataset.token2idx),
        padding_idx=dataset.token2idx['<PAD>'],
        dropout_probability=dropout_probability,
        bidirectional=is_bidirectional,
        n_layers=n_rnn_layers,
        device=device,
        batch_size=batch_size
    )
    model.to(device)

    # Definição da função de perda e otimizador
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, 1)

    train_losses, valid_losses = [], []
    canceled = False
    for curr_epoch in range(epochs):
        train_loss, canceled = train_epoch(model, optimizer, scheduler, train_loader, criterion, curr_epoch, epochs)
        if canceled:
            print(f"Training canceled during epoch {curr_epoch + 1}")
            break

        valid_loss = validate_epoch(model, valid_loader, criterion)
        tqdm.write(
            f'Epoch #{curr_epoch + 1:3d}\ttrain_loss: {train_loss:.2e}'
            f'\tvalid_loss: {valid_loss:.2e}'
        )

        if len(valid_losses) > 2 and all(valid_loss >= loss for loss in valid_losses[-3:]):
            print('Stopping early due to lack of improvement in validation loss.')
            break

        train_losses.append(train_loss)
        valid_losses.append(valid_loss)

    # Finalizar e salvar o modelo se não foi cancelado
    if not canceled:
        model_path = os.path.join('api', 'models', name)
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        torch.save(model.state_dict(), model_path)

        # Atualizar e salvar o estado de treinamento final
        training_progress = {
            'training_progress': 100,
            'training_in_progress': False,
            'cancel_requested': False
        }
        with open('training_progress.json', 'w') as file:
            json.dump(training_progress, file)

    print("Training complete.")