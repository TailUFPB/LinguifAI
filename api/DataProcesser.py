import pandas as pd
from io import BytesIO
#mais imports

class DataProcesser():

    def set_current_file(self, file):
        bytes_io = BytesIO(file)
        df = pd.read_csv(bytes_io)
        self.df = df

    ##TODO métodos com o processamento de classificação