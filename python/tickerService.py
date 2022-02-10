import csv
import math
from os.path import exists
import time
import datetime

from utils import pull_historical_data

class TickerService:
    def __init__(self, file_name):
        self.file_name = file_name

    def get_tickers(self):
        with open(self.file_name) as f:
            reader = csv.DictReader(f)
            tickers = list(reader)
            return tickers

    def get_chart_data(self, ticker, refresh: bool, period1, period2):
        if refresh:
            print("Refreshing chart data for " + ticker)
            pull_historical_data(ticker, period1, period2)
        elif not exists(self.file_name):
            print("Chart data does not exist for ticker " + ticker)
            today_date = time.time()
            today_date = datetime.datetime.now()
            six_months_back = today_date - datetime.timedelta(days=183)
            
            period1 = math.floor(six_months_back.timestamp())
            period2 = math.ceil(today_date.timestamp())
            print(period1)
            print(period2)
            pull_historical_data(ticker, period1, period2)

        with open(self.file_name) as f:
            reader = csv.DictReader(f)
            chart_data = list(reader)
            return chart_data
