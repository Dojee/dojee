from flask import Flask, jsonify, request
from flask_cors import cross_origin
from tickerService import TickerService
import json

# Initialize Flask
app = Flask(__name__)

@app.route("/hello", methods=['GET'])
def hello_world():
  return jsonify({'Hello': 'World'})

# This can be improved by getting different kinds of stock or tickers from different
# parts of the market. For now, it defaults to S&P 500
@app.route("/api/v1/tickers", methods=['GET'])
@cross_origin()
def get_tickers():
  ticker_service = TickerService('Data/sp500.csv')
  tickers = ticker_service.get_tickers()
  json_array = []

  for i in range(1, len(tickers)):
    json_array.append({
      "symbol": tickers[i]['Symbol'],
      "companyName": tickers[i]['Name'],
      "sector": tickers[i]['Sector']
    })

  return jsonify(json_array)

@app.route("/api/v1/chartdata", methods=['GET'])
@cross_origin()
def get_chart_data():
  ticker = request.args.get('ticker')
  refresh = json.loads(request.args.get('refresh').lower())
  period1 = request.args.get('period1')
  period2 = request.args.get('period2')

  if refresh and not period1 and not period2:
    return jsonify({
      "error": "Date periods are required when refreshing the chart data for ticker " + ticker 
    })

  file_name = 'Data/Tickers/' + ticker + '.csv'
  ticker_service = TickerService(file_name)
  chart_data = ticker_service.get_chart_data(ticker, refresh, period1, period2)
  json_array = []

  for i in range(1, len(chart_data)):
    json_array.append({
      "date": chart_data[i]['Date'],
      "open": chart_data[i]['Open'],
      "high": chart_data[i]['High'],
      "low": chart_data[i]['Low'],
      "close": chart_data[i]['Close'],
      "adj_close": chart_data[i]['Adj Close'],
      "volume": chart_data[i]['Volume']
    })

  return jsonify(json_array)


if __name__ == '__main__':
    app.run(debug=True)
