import { useEffect, useRef } from "react";

import { Chart } from "./d3/Chart";
import styles from "./CandlestickChart.module.scss";

export default function CandlestickChart({ chartData }) {
  const chart = useRef<Chart | null>(null);

  const setDimensions = () => {
    const svgElement = document.getElementById("container");
    if (!svgElement || !chart.current) {
      return;
    }

    const svgRect = svgElement.getBoundingClientRect();
    chart.current.height = svgRect.height / 1.1;
    chart.current.width = svgRect.width / 1.1;
    
    chart.current.cleanupChart();
    chart.current.drawChart();
  }

  useEffect(() => {
    window.addEventListener('resize', setDimensions);

    return () => window.removeEventListener('resize', setDimensions);
  }, []);

  useEffect(() => {
    const svgElement = document.getElementById("container");
    if (!svgElement) {
      return;
    }

    const svgRect = svgElement.getBoundingClientRect();
    chart.current = new Chart({
      chartData,
      height: svgRect.height / 1.1,
      width: svgRect.width / 1.1,
    });

    return () => chart.current?.cleanupChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return <svg id="container" className={styles.container} />;
}
