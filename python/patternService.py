from tickerService import TickerService

class Pattern:
    def __init__(self, date, close, volume):
        self.date = date
        self.close = close
        self.volume = volume
        self.is_bullish_engulfing = False
        self.is_doji = False
        self.is_three_line_strike = False

class PatternService:
    def __init__(self, file_name):
        self.file_name = file_name
        self.ticker_service = TickerService(file_name)

    # Hammer, indicates lots of selling but also a lot of buyback to push closing price up
    def is_hammer(self, candle):
        body = candle['Open'] - candle['Close']
        wick = candle['High'] - candle['Low']
        if (body > 0 and candle['Open'] == candle['Low'] and candle['Close'] == candle['High']):
            ratio = body/wick
            if (ratio <= 0.2):
                return True

    # Bearish is a red candlestick, price went down
    def is_bearish_candlestick(self, candle):
        return candle['Close'] < candle['Open']

    # Bullish is a green candlestick, price went up
    def is_bullish_candlestick(self, candle):
        return candle['Close'] > candle['Open']

    def is_bullish_engulfing(self, candles, index):
        current_day = candles[index]
        previous_day = candles[index - 1]
        
        if self.is_bearish_candlestick(previous_day) \
            and current_day['Close'] > previous_day['Open'] \
            and current_day['Open'] < previous_day['Close']:    # the \ backslash allows you to continue the logical line in the next line
            return True

    # doji function works but might need to set a doji range
    # doji's are not always perfect 
    # maybe a +/- 0.5% range can be considered a doji
    # 10000 <= number <= 30000

    # ...wait percentage doesnt work too well
    # each chart has their own relative scale
    def is_doji(self, candles, index):
        current_day = candles[index]
        previous_day = candles[index - 1]
        
    #     if current_day['Close'] == current_day['Open']:
        if (float(current_day['Open']) * 0.995) <= float(current_day['Close']) <= (float(current_day['Open']) * 1.005):
            return True

    def is_three_line_strike(self, candles, index):
        current_day = candles[index]
        previous_day = candles[index - 1]
        previous_day2 = candles[index - 2]
        previous_day3 = candles[index - 3]
        for i in range(1, 4):
            if current_day['Open'] < previous_day['Close'] \
                and self.is_bearish_candlestick(previous_day) \
                and self.is_bearish_candlestick(previous_day2) \
                and self.is_bearish_candlestick(previous_day3):
                return True

    def get_patterns(self, ticker, period1, period2):
        chart_data = self.ticker_service.get_chart_data(ticker, False, period1, period2)
        
        pattern_array = []
        for i in range(1, len(chart_data)):
            pattern_found = False
            pattern = Pattern(chart_data[i]['Date'], chart_data[i]['Close'], chart_data[i]['Volume'])

            if self.is_bullish_engulfing(chart_data, i):
                pattern_found = True
                pattern.is_bullish_engulfing = True
                
            if self.is_doji(chart_data, i):
                pattern_found = True
                pattern.is_doji = True
            
            if self.is_three_line_strike(chart_data, i):
                pattern_found = True
                pattern.is_three_line_strike = True

            if pattern_found:
                pattern_array.append(pattern)
        
        return pattern_array
