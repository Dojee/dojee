import axios from "axios";
import last from "lodash/last";

export async function fetchTickers() {
  try {
    return await (
      await axios.get("http://127.0.0.1:5000/api/v1/tickers")
    ).data;
  } catch (err) {
    throw err;
  }
}

export async function fetchChartData(
  ticker,
  refresh = false,
  period1,
  period2
) {
  try {
    let url = `http://127.0.0.1:5000/api/v1/chartdata?ticker=${ticker}&refresh=${refresh}`;
    if (period1 && period2) {
      url += `&period1=${period1}&period2=${period2}`;
    }

    const chartData = await (await axios.get(url)).data;
    chartData.forEach((data) => {
      data.adj_close = parseFloat(data.adj_close);
      data.close = parseFloat(data.close);
      data.high = parseFloat(data.high);
      data.low = parseFloat(data.low);
      data.open = parseFloat(data.open);
      data.volume = parseFloat(data.volume);
    });

    return chartData;
  } catch (err) {
    throw err;
  }
}

export function isLatestChartData(chartData) {
  const lastStockData = last(chartData);
  if (!lastStockData) {
    return false;
  }

  const dateSplit = lastStockData.date.split("-");
  const dataYear = dateSplit[0];
  const dataMonth = dateSplit[1];
  const dataDay = dateSplit[2];

  const todayDate = new Date();
  const todayYear = todayDate.getFullYear().toString();
  let todayMonth = todayDate.getMonth() + 1;
  if (todayMonth < 10) {
    todayMonth = `0${todayMonth}`;
  } else {
    todayMonth = todayMonth.toString();
  }
  let today = todayDate.getDate();
  if (today < 10) {
    today = `0${today}`;
  } else {
    today = today.toString();
  }

  return (
    todayYear === dataYear && todayMonth === dataMonth && today === dataDay
  );
}

function getTickersFromStorage() {
  const tickers = localStorage.getItem("tickers");
  if (!tickers) {
    return [];
  }

  return JSON.parse(tickers);
}

export function fetchWatchedTickers() {
  const tickers = getTickersFromStorage();

  return tickers.sort((a, b) => {
    const lowercasedA = a.symbol.toLowerCase();
    const lowercasedB = b.symbol.toLowerCase();

    if (lowercasedA < lowercasedB) {
      return -1;
    }

    if (lowercasedA > lowercasedB) {
      return 1;
    }

    return 0;
  });
}

export function addTicker(newTicker) {
  const tickers = getTickersFromStorage();

  for (const ticker of tickers) {
    if (ticker.symbol === newTicker) {
      return false;
    }
  }

  tickers.push({
    symbol: newTicker,
    path: "/" + newTicker,
  });

  localStorage.setItem("tickers", JSON.stringify(tickers));
  return true;
}
