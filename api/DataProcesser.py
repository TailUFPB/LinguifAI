import pandas as pd
import NbNewsModel
from io import BytesIO
#mais imports

class DataProcesser():

    def set_current_file(self, file):
        bytes_io = BytesIO(file)
        df = pd.read_csv(bytes_io)
        self.df = df

    def nb_news_application(self):
        nb_model = NbNewsModel(self.df)
        df_result = nb_model.filter_and_classify()
        return df_result
        

    ##TODO métodos com o processamento de classificação