import { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import DeleteIcon from '@mui/icons-material/Delete';

import CandlestickChart from "../../../components/CandlestickChart/CandlestickChart";
import {
  fetchChartData,
  formatDateToReadableString,
  isLatestChartData,
  isStorage,
  numberWithCommas
} from "../../../services/tickerService";

import styles from "./TickerView.module.scss";
import { fetchPatterns } from "../../../services/patternService";
import PatternTable from "../../../components/PatternTable/PatternTable";

function TickerView({ match, deleteTicker }) {
  const { ticker } = match.params;
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartError, setChartError] = useState("");
  const [latestCandle, setLatestCandle] = useState(undefined);

  const [patternsLoading, setPatternsLoading] = useState(false);
  const [patternsData, setPatternsData] = useState([]);
  const [patternsError, setPatternsError] = useState("");

  const [statusText, setStatusText] = useState("");

  const fetchData = async (ticker, refresh = false, period1, period2) => {
    setChartLoading(true);
    setPatternsLoading(true);
    setChartError("");
    setPatternsError("");
    setStatusText("");
    setLatestCandle(undefined);
    setChartData([]);
    setPatternsData([]);

    // Fetch chart data
    try {
      const latestChartData = await fetchChartData(ticker, refresh, period1, period2);
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
      setChartError("There was an unexpected error fetching the stock data.");
    } finally {
      setChartLoading(false);
    }

    // Fetch patterns data
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

  const refreshData = () => {
    const todayDate = new Date();
    const sixMonthsBack = new Date();
    sixMonthsBack.setMonth(sixMonthsBack.getMonth() - 6);
    const period2 = Math.floor(todayDate.getTime() / 1000);
    const period1 = Math.floor(sixMonthsBack.getTime() / 1000);

    return fetchData(ticker, true, period1, period2);
  }

  useEffect(() => {
    fetchData(ticker);
  }, [ticker]);

  const renderChart = () => {
    if (chartLoading) {
      return (
        <div className={styles.progress}>
          <CircularProgress />
        </div>
      );
    } else if (!chartLoading && chartData && chartData.length) {
      return <CandlestickChart chartData={chartData} />;
    } else if (chartError) {
      return <div className={styles.tickerViewError}>
        {chartError}
      </div>
    } else {
      return <Fragment />;
    }
  }

  const renderPatternTable = () => {
    if (patternsLoading) {
      return (
        <div className={styles.progress}>
          <CircularProgress />
        </div>
      );
    } else if (!patternsLoading && patternsData && patternsData.length) {
      return <PatternTable patternsData={patternsData}/>
    } else if (patternsError) {
      return <div className={styles.tickerViewError}>
        {patternsError}
      </div>
    } else {
      return <Fragment />;
    }
  }

  const renderLatestCandleInfo = () => {
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
        <div>Volume: {numberWithCommas(latestCandle.volume)}</div>
      </div>
    )
  }

  const deleteIcon = isStorage(ticker) ? <DeleteIcon className={styles.deleteIcon} onClick={() => deleteTicker(ticker)}/> : undefined;

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
            <h2 className={styles.infoSidebarHeader}>{ticker} {deleteIcon} </h2>
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
