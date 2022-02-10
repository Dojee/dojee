# Welcome to Doji

Place for me to store my algorithms for detecting stock patterns

open anaconda prompt
activate doji for python 3.8

# Data Collection

Requires requests to check if urls are good: `pip install requests`

Add a folder named "Tickers" inside Data/

To get recent chart data, run this in your terminal:
- python getChartData.py
- this will get all S&P 500 companies chart data
- there is an existing function in the file to specify a single ticker symbol but you will have to call that function if  you want to use it
- Maybe I'll code it so if you enter a Ticker it'll just do that one. too lazy now

# Patterns

How to get patterns from data, run this in your terminal:
`python patternRecognizer.py [TICKER]`

# Server

Make sure you have pipenv: `pip install pipenv`.

Need Flask too: `pip install flask`.

To activate this project's virtualenv, run `pipenv shell`.

Inside of the shell, run `python server.py`.

# TODOS:

- Add more candlestick patterns to recognizer
  - Add opposite of hammer
- Create REST API endpoints. Should be returned in JSON format
  - _GET_ stock data for a ticker.
  - _GET_ run pattern for a ticker.
