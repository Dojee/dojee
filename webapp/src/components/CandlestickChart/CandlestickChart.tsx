import { useEffect, useRef } from "react";

import { Chart } from "./d3/Chart";
import styles from "./CandlestickChart.module.scss";

export default function CandlestickChart({ chartData }) {
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    const svgElement = document.getElementById("container");
    if (!svgElement) {
      return;
    }

    const svgRect = svgElement.getBoundingClientRect();
    chart.current = new Chart({
      chartData,
      height: svgRect.height / 1.5,
      width: svgRect.width / 1.1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return <svg id="container" className={styles.container} />;
}
