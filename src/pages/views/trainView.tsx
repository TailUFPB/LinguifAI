import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import SelectFileCard from "../../components/selectFileCard/selectFileCard";
import { ReactApexChartsDefaultOptions } from "../../Shared/apexChartsOptions";

export default function TrainView() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [data, setData] = useState<any[][]>([]);
    const [header, setHeader] = useState<string[]>([]);

    const [selectedColumn, setSelectedColumn] = useState<number>(0);
    const [selectedLabel, setSelectedLabel] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(false);
    const [hasTrained, setHasTrained] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleChangeSelectedColumn = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColumn(Number(event.target.value));
    };

    const handleChangeSelectedLabel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLabel(Number(event.target.value));
    };

    const handleCancelTraining = async () => {
        setIsCancelling(true);
        try {
            await axios.post('http://localhost:5000/cancel-training');
            alert('Treinamento cancelado com sucesso!');
        } catch (error) {
            console.error('Erro ao cancelar o treinamento:', error);
            alert('Falha ao cancelar o treinamento.');
        }
        setIsCancelling(false);
    };

    const handleRnnSubmit = async () => {
        setIsLoading(true);
        setHasTrained(true);
        setLoadingProgress(0);
        setTrainLosses([]);
        setValidLosses([]);

        let selectedData = data.map((row) => ({
            value: row[selectedColumn],
            label: row[selectedLabel],
        }));

        let selectedLabels = data.map((row) => row[selectedLabel]);
        let selectedValues = data.map((row) => row[selectedColumn]);

        const sendData = {
            data: selectedValues,
            label: selectedLabels,
            batch_size: batchSize || 16,
            epochs: epochs || 50,
            learning_rate: learningRate || 0.001,
            name: modelName || "trained-model",
        };

        console.log(sendData);

        const url = "http://localhost:5000/neural-network-rnn";

        await axios.post(url, sendData).catch(async (error) => {
            await axios.post(url, sendData).catch(async (error) => {
                await axios.post(url, sendData).catch(async (error) => {
                    await axios.post(url, sendData).catch((error) => {
                        throw new Error(error);
                    });
                });
            });
        });

        setIsLoading(false);
    };

    const handleNbSubmit = async () => {
        setIsLoading(true);
        setLoadingProgress(0);

        let selectedData = data.map((row) => ({
            value: row[selectedColumn],
            label: row[selectedLabel],
        }));

        let selectedLabels = data.map((row) => row[selectedLabel]);
        let selectedValues = data.map((row) => row[selectedColumn]);

        const sendData = {
            data: selectedValues,
            label: selectedLabels,
            batch_size: batchSize || 16,
            epochs: epochs || 50,
            learning_rate: learningRate || 0.001,
            name: modelName || "trained-model",
        };

        console.log(sendData);

        const url = "http://localhost:5000/neural-network-nb";

        await axios.post(url, sendData).catch(async (error) => {
            await axios.post(url, sendData).catch(async (error) => {
                await axios.post(url, sendData).catch(async (error) => {
                    await axios.post(url, sendData).catch((error) => {
                        throw new Error(error);
                    });
                });
            });
        });

        setIsLoading(false);
    };

    const [batchSize, setBatchSize] = useState<number>(16);
    const [epochs, setEpochs] = useState<number>(50);
    const [learningRate, setLearningRate] = useState<number>(0.001);
    const [modelName, setModelName] = useState<string>("");

    const handleBatchSizeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value);
        setBatchSize(value);
    };

    const handleEpochsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setEpochs(value);
    };

    const handleLearningRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseFloat(event.target.value);
        setLearningRate(value);
    };

    const handleModelNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setModelName(value);
    };

    const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);

    const toggleAdvancedOptions = () => {
        setAdvancedOptionsVisible(!advancedOptionsVisible);
    };

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [train_losses, setTrainLosses] = useState<number[]>([]);
    const [valid_losses, setValidLosses] = useState<number[]>([]);
    const prevLoadingProgressRef = useRef<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/training-status"
                );
                const { training_progress, training_in_progress, train_losses, valid_losses } = response.data;
                const newProgress: number =
                    training_in_progress || training_progress === 100
                        ? training_progress
                        : 0; // Explicitly type newProgress
                updateLoadingProgress(newProgress);

                setTrainLosses(train_losses);
                setValidLosses(valid_losses);
            } catch (error) {
                console.error("Error fetching progress:", error);
            }
        };

        const updateLoadingProgress = (newProgress: number) => {
            // Explicitly type newProgress parameter
            const duration = 1000;
            const startTime = Date.now();
            const startProgress = prevLoadingProgressRef.current;

            const updateProgress = () => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(1, elapsedTime / duration);
                const interpolatedProgress =
                    startProgress + (newProgress - startProgress) * progress;
                setLoadingProgress(interpolatedProgress);

                if (progress < 1) {
                    requestAnimationFrame(updateProgress);
                } else {
                    prevLoadingProgressRef.current = newProgress;
                }
            };

            updateProgress();
        };

        const interval = setInterval(fetchData, 1050);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 text-center">
            <SelectFileCard
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setData={setData}
                data={data}
                setHeader={setHeader}
                header={header}
            />

            {selectedFile && (
                <>
                    <div className="w-1/2 relative mx-auto mt-10">
                        <label htmlFor="modelName" className="block mb-2">
                            Nome do modelo
                        </label>
                        <input
                            id="modelName"
                            placeholder="Insira o nome do modelo..."
                            type="text"
                            className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                            onChange={handleModelNameChange}
                        />
                    </div>

                    <div className="w-1/2 relative mx-auto mt-10">
                        <label htmlFor="selectedColumn" className="block mb-2">
                            Coluna de entrada
                        </label>
                        <select
                            id="selectedColumn"
                            className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                            onChange={handleChangeSelectedColumn}
                        >
                            <option value="" disabled selected className="placeholder-gray-300">
                                Selecione a coluna de entrada
                            </option>
                            {header.length > 0 &&
                                header.map((column: string, index: number) => (
                                    <option key={index} value={index}>{column}</option>
                                ))}
                        </select>
                    </div>

                    <div className="w-1/2 relative mx-auto mt-10">
                        <label htmlFor="selectedLabel" className="block mb-2">
                            Coluna de label
                        </label>
                        <select
                            id="selectedLabel"
                            className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                            onChange={handleChangeSelectedLabel}
                        >
                            <option value="" disabled selected className="placeholder-gray-300">
                                Selecione a coluna de label
                            </option>
                            {header.length > 0 &&
                                header.map((column: string, index: number) => (
                                    <option key={index} value={index}>{column}</option>
                                ))}
                        </select>
                    </div>


                    <div className="w-1/2  mx-auto flex mt-10 justify-between">
                        <div className="w-1/3 mr-4">
                            <label htmlFor="batchSize" className="block mb-2">
                                Batch Size
                            </label>
                            <input
                                type="number"
                                id="batchSize"
                                className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                                placeholder="Enter Batch Size..."
                                value={batchSize}
                                onChange={handleBatchSizeChange}
                            />
                        </div>

                        <div className="w-1/3 mr-4">
                            <label htmlFor="epochs" className="block mb-2">
                                Epochs
                            </label>
                            <input
                                type="number"
                                className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                                placeholder="Enter Epochs..."
                                value={epochs}
                                onChange={handleEpochsChange}
                            />
                        </div>

                        <div className="w-1/3">
                            <label htmlFor="learningRate" className="block mb-2">
                                Learning Rate
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                                placeholder="Enter Learning Rate..."
                                value={learningRate}
                                onChange={handleLearningRateChange}
                            />
                        </div>
                    </div>


                    <div className="w-1/2 relative mx-auto mt-10">
                        <div className="relative w-full">
                            {isLoading && (
                                <div className="w-full">
                                    <div className="bg-blue-500 flex rounded-lg h-10 top-0 left-0 w-full text-white"></div>
                                    <div
                                        className="bg-main-lighter h-10 rounded-lg absolute top-0 left-0 w-full transition-width duration-500"
                                        style={{ width: `${loadingProgress.toFixed(2)}%` }}
                                    ></div>
                                    <div className="flex items-center justify-center h-10 absolute top-0 left-0 w-full text-white">
                                        {`Treinamento em ${loadingProgress.toFixed(2)}%`}
                                    </div>
                                </div>
                            )}

                            {!isLoading && <button
                                className={`w-2/4 bg-blue-400 text-white py-2 px-4 hover:bg-blue-500 focus:outline-none border-2 border-blue-500 rounded-xl h-14`}
                                onClick={handleNbSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? "Carregando..." : "Treinar NB"}
                            </button>}

                            {!isLoading && <button
                                className={`w-2/4 bg-blue-400 text-white py-2 px-4 hover:bg-blue-500 focus:outline-none border-2 border-blue-500 rounded-xl h-14`}
                                onClick={handleRnnSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? "Carregando..." : "Treinar RNN"}
                            </button>}

                            {hasTrained && train_losses.length > 0 && (
                                <div className="bg-gray-50 rounded-lg pt-4 my-4 text-black">
                                    <ReactApexChart options={ReactApexChartsDefaultOptions} series={
                                        [
                                            {
                                                name: "Treino",
                                                data: train_losses
                                            },
                                            {
                                                name: "Validação",
                                                data: valid_losses
                                            }
                                        ]
                                    } type="line" height={350} />
                                </div>
                            )}

                            {isLoading && (
                                <button
                                    className="mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl"
                                    onClick={handleCancelTraining}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? 'Cancelando...' : 'Cancelar Treinamento'}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

