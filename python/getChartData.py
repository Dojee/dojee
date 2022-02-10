import csv
import sys
import urllib.request
import requests

# ticker = sys.argv[1]
# create an array or csv with list of tickers and use a loop to get a bunch of data
# print("Ticker = " + ticker)

def make_filename(ticker):
    output_path = "Data/Tickers/" + ticker + ".csv"
    return output_path

# base_url = "https://query1.finance.yahoo.com/v7/finance/download/AAPL?period1=1607470781&period2=1639006781&interval=1d&events=history&includeAdjustedClose=true"
def make_url(ticker):
    ticker_url = "https://query1.finance.yahoo.com/v7/finance/download/" + ticker + "?period1=1607470781&period2=1639006781&interval=1d&events=history&includeAdjustedClose=true"
    response = requests.get(ticker_url)
    if response.status_code == 404:
        print("ERROR: could not pull data for " + ticker)
    else:
        return ticker_url
# print(make_url(ticker))

def pull_historical_data(ticker):
    try:
        urllib.request.urlretrieve(make_url(ticker), make_filename(ticker))
    except urllib.request.ContentTooShortError as e:
        outfile = open(make_filename(ticker), "w")
        outfile.write(e.content)
        outfile.close()

# pull_historical_data(ticker)


def print_csv(ticker):
    with open("Data/Tickers/" + ticker + ".csv") as f:
        reader = csv.reader(f)
        for row in reader:
            print(row)

def pull_sp500():
    with open("Data/sp500.csv") as f:
        reader = csv.DictReader(f)
        tickers = list(reader)

        for i in range(1, len(tickers)):
            # print(tickers[i]['Symbol'])
            symbol = tickers[i]['Symbol']
            print(symbol)
            pull_historical_data(symbol)  #Symbols cannot contain a period "." some symbols may include for class B, I switched to "-" in sp500.csv


pull_sp500()
