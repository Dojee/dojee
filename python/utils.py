import csv
import urllib.request
import requests

def make_filename(ticker):
    output_path = "Data/Tickers/" + ticker + ".csv"
    return output_path

# base_url = "https://query1.finance.yahoo.com/v7/finance/download/AAPL?period1=1607470781&period2=1639006781&interval=1d&events=history&includeAdjustedClose=true"
def make_url(ticker, period1, period2):
    ticker_url = "https://query1.finance.yahoo.com/v7/finance/download/" + ticker + "?period1=" + str(period1) + "&period2=" + str(period2) + "&interval=1d&events=history&includeAdjustedClose=true"
    response = requests.get(ticker_url)
    if response.status_code == 404:
        print("ERROR: could not pull data for " + ticker)
    else:
        return ticker_url

def pull_historical_data(ticker, period1, period2):
    try:
        urllib.request.urlretrieve(make_url(ticker, period1, period2), make_filename(ticker))
    except urllib.request.ContentTooShortError as e:
        outfile = open(make_filename(ticker), "w")
        outfile.write(e.content)
        outfile.close()

def print_csv(ticker):
    with open("Data/" + ticker + ".csv") as f:
        reader = csv.reader(f)
        for row in reader:
            print(row)

