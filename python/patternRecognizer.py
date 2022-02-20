# import yfinance as yf
import sys
import csv

print("Hello")

# probably should add a check for valid ticker
# to run: python patternRecognizer.py [ticker]
# ticker = sys.argv[1]

try:
    ticker = sys.argv[1]
    print("Ticker = " + ticker)
except:
    print("ERROR: Enter a ticker after 'python patternRecognizer.py [tickerhere]'")


print("Ticker = " + ticker)

def print_csv(ticker):
    with open("Data/Tickers/" + ticker + ".csv") as f:
        reader = csv.reader(f)
        for row in reader:
            print(row)

# Hammer, indicates lots of selling but also a lot of buyback to push closing price up
def is_hammer(candle):
    body = candle['Open'] - candle['Close']
    wick = candle['High'] - candle['Low']
    if (body > 0 and candle['Open'] == candle['Low'] and candle['Close'] == candle['High']):
        ratio = body/wick
        if (ratio <= 0.2):
            return True

# Bearish is a red candlestick, price went down
def is_bearish_candlestick(candle):
    return candle['Close'] < candle['Open']

# Bullish is a green candlestick, price went up
def is_bullish_candlestick(candle):
    return candle['Close'] > candle['Open']

def is_bullish_engulfing(candles, index):
    current_day = candles[index]
    previous_day = candles[index - 1]
    
    if is_bearish_candlestick(previous_day) \
        and current_day['Close'] > previous_day['Open'] \
        and current_day['Open'] < previous_day['Close']:    # the \ backslash allows you to continue the logical line in the next line
        return True

# doji function works but might need to set a doji range
# doji's are not always perfect 
# maybe a +/- 0.5% range can be considered a doji
# 10000 <= number <= 30000

# ...wait percentage doesnt work too well
# each chart has their own relative scale
def is_doji(candles, index):
    current_day = candles[index]
    previous_day = candles[index - 1]
    
#     if current_day['Close'] == current_day['Open']:
    if (float(current_day['Open']) * 0.995) <= float(current_day['Close']) <= (float(current_day['Open']) * 1.005):
        return True

def is_three_line_strike(candles, index):
    current_day = candles[index]
    previous_day = candles[index - 1]
    previous_day2 = candles[index - 2]
    previous_day3 = candles[index - 3]
    for i in range(1, 4):
        if current_day['Open'] < previous_day['Close'] \
            and is_bearish_candlestick(previous_day) \
            and is_bearish_candlestick(previous_day2) \
            and is_bearish_candlestick(previous_day3):
            return True
    


def find_patterns(ticker):
    with open("Data/Tickers/" + ticker + ".csv") as f:
        reader = csv.DictReader(f)
        candles = list(reader)
        
        for i in range(1, len(candles)):
            # print(candles[i])
            
            if is_bullish_engulfing(candles, i):
                print("{} Bullish engulfing".format(candles[i]['Date']))
                
            elif is_doji(candles, i):
                print("{} Doji".format(candles[i]['Date']))
            
            elif is_three_line_strike(candles, i):
                print("{} Three Line Strike".format(candles[i]['Date']))

find_patterns(ticker)

# with open('APPL.csv') as f:
#     reader = csv.DictReader(f)
#     candles = list(reader)
    
# for i in range(1, len(candles)):
#     print(candles[i])
    
#     if is_bullish_engulfing(candles, i):
#         print("{} Bullish engulfing".format(candles[i]['Date']))
        
#     elif is_doji(candles, i):
#         print("{} Doji".format(candles[i]['Date']))