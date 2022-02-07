import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import CandlestickChart from "../../../components/CandlestickChart/CandlestickChart";
import {
  fetchChartData,
  isLatestChartData,
} from "../../../services/tickerService";

import styles from "./TickerView.module.scss";

function TickerView({ match }) {
  const { ticker } = match.params;
  // const [isLatest, setIsLatest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchChartData(ticker)
      .then((data) => {
        const isLatest = isLatestChartData(data);
        if (isLatest) {
          setStatusText("Stock data is up-to-date.");
        } else {
          setStatusText("Stock data is not up-to-date");
        }
        // setIsLatest(isLatest);
        setChartData(data);
      })
      .catch((err) => {
        console.error(err);
        setStatusText("There was an unexpected error fetching the stock data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ticker]);

  function refreshData() {
    const todayDate = new Date();
    const sixMonthsBack = new Date();
    sixMonthsBack.setMonth(sixMonthsBack.getMonth() - 6);
    const period2 = Math.floor(todayDate.getTime() / 1000);
    const period1 = Math.floor(sixMonthsBack.getTime() / 1000);

    setLoading(true);
    fetchChartData(ticker, true, period1, period2)
      .then((data) => {
        const isLatest = isLatestChartData(data);
        if (isLatest) {
          setStatusText("Stock data is up-to-date.");
        } else {
          setStatusText("Stock data is not up-to-date");
        }
        // setIsLatest(isLatest);
        setChartData(data);
      })
      .catch((err) => {
        console.error(err);
        setStatusText("There was an unexpected error fetching the stock data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderChart() {
    if (loading) {
      return (
        <div className={styles.progress}>
          <CircularProgress />
        </div>
      );
    } else if (!loading && chartData && chartData.length) {
      return <CandlestickChart chartData={chartData} />;
    } else {
      return <div />;
    }
  }

  return (
    <div>
      <h1>Ticker page for {ticker}</h1>
      <Button variant="outlined" onClick={refreshData}>
        Refresh Data
      </Button>
      <span className={styles.latestText}>{statusText}</span>
      <div>
        <div>{renderChart()}</div>
        {/* <div>Table goes here</div> */}
      </div>
    </div>
  );
}

export default TickerView;
