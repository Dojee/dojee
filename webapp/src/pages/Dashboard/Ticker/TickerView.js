import { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import CandlestickChart from "../../../components/CandlestickChart/CandlestickChart";
import {
  fetchChartData,
  formatDateToReadableString,
  isLatestChartData,
} from "../../../services/tickerService";

import styles from "./TickerView.module.scss";
import { fetchPatterns } from "../../../services/patternService";
import PatternTable from "../../../components/PatternTable/PatternTable";

function TickerView({ match }) {
  const { ticker } = match.params;
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [latestCandle, setLatestCandle] = useState(undefined);

  const [patternsLoading, setPatternsLoading] = useState(false);
  const [patternsData, setPatternsData] = useState([]);
  const [patternsError, setPatternsError] = useState("");

  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    // Fetch chart data
    setChartLoading(true);
    setPatternsLoading(true);

    fetchChartData(ticker)
      .then((data) => {
        const isLatest = isLatestChartData(data);
        if (isLatest) {
          setStatusText("Stock data is up-to-date.");
        } else {
          setStatusText("Stock data is not up-to-date");
        }
        setChartData(data);
        setLatestCandle(data[data.length - 1])
      })
      .catch((err) => {
        console.error(err);
        setStatusText("There was an unexpected error fetching the stock data.");
      })
      .finally(() => {
        setChartLoading(false);
      });

    // Fetch patterns data
    fetchPatterns(ticker)
      .then((data) => {
        setPatternsData(data);
      })
      .catch((err) => {
        console.error(err);
        setPatternsError("There was an unexpected error fetching the patterns");
      })
      .finally(() => {
        setPatternsLoading(false);
      })
  }, [ticker]);

  async function refreshData() {
    const todayDate = new Date();
    const sixMonthsBack = new Date();
    sixMonthsBack.setMonth(sixMonthsBack.getMonth() - 6);
    const period2 = Math.floor(todayDate.getTime() / 1000);
    const period1 = Math.floor(sixMonthsBack.getTime() / 1000);

    // Refresh chart data
    setChartLoading(true);
    setPatternsLoading(true);
    setPatternsError("");
    try {
      const latestChartData = await fetchChartData(ticker, true, period1, period2);
      const isLatest = isLatestChartData(latestChartData);
      if (isLatest) {
        setStatusText("Stock data is up-to-date.");
      } else {
        setStatusText("Stock data is not up-to-date");
      }
      setChartData(latestChartData);
      setLatestCandle(latestChartData[latestChartData.length - 1])
    } catch (err) {
      console.error(err);
      setStatusText("There was an unexpected error fetching the stock data.");
    } finally {
      setChartLoading(false);
    }

    // Refresh patterns data
    try {
      const latestPatternsData = await fetchPatterns(ticker, period1, period2);
      setPatternsData(latestPatternsData);
    } catch (err) {
      console.error(err);
      setPatternsError("There was an unexpected error fetching the patterns");
    } finally {
      setPatternsLoading(false);
    }
  }

  function renderChart() {
    if (chartLoading) {
      return (
        <div className={styles.progress}>
          <CircularProgress />
        </div>
      );
    } else if (!chartLoading && chartData && chartData.length) {
      return <CandlestickChart chartData={chartData} />;
    } else {
      return <div />;
    }
  }

  function renderPatternTable() {
    if (patternsLoading) {
      return (
        <div className={styles.progress}>
          <CircularProgress />
        </div>
      );
    } else if (!patternsLoading && patternsData && patternsData.length) {
      return <PatternTable patternsData={patternsData}/>
    } else if (patternsError) {
      return <div>
        {patternsError}
      </div>
    } else {
      return <div />;
    }
  }

  function renderLatestCandleInfo() {
    if (chartLoading) {
      return (
        <div className={styles.progress}>
          <CircularProgress />
        </div>
      );
    }

    if (!latestCandle) {
      return <div className={styles.candleInfo}>Unable to retrieve the company information.</div>      
    }

    return (
      <div className={styles.candleInfo}>
        <div>Latest Trading Date: {formatDateToReadableString(latestCandle.date)}</div>
        <div>Price: {latestCandle.close.toFixed(2)} USD</div>
        <div>Volume: {latestCandle.volume}</div>
      </div>
    )
  }

  return (
      <div className={styles.tickerContainer}>
        <div className={styles.chartLayout}>
          <h2 className={styles.tickerViewHeader}>Chart</h2>
          <div>{renderChart()}</div>
          <Divider orientation="horizontal"/>
          <h2 className={styles.tickerViewHeader}>Patterns</h2>
          <div className={styles.patternTable}>{renderPatternTable()}</div>
        </div>

        <div className={styles.infoSidebar}>
          <Divider orientation="vertical"/>
          <div>
            <h2 className={styles.tickerViewHeader}>{ticker}</h2>
            {renderLatestCandleInfo()}
            <Divider orientation="horizontal"/>
            <div className={styles.refreshInfo}>
              <div className={styles.statusText}>{statusText}</div>
              <Button className={styles.refreshButton} variant="outlined" onClick={refreshData}>
                Refresh Data
              </Button>
            </div>
            <Divider className={styles.refreshDivider} orientation="horizontal"/>
          </div>
        </div>
      </div>
  );
}

export default TickerView;
