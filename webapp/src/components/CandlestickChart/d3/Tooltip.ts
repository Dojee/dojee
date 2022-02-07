import { line, Selection } from "d3";
import { ChartDatum } from ".";

export class Tooltip {
  private d3ChartData: ChartDatum[];
  private svgContainer: Selection<SVGGElement, unknown, HTMLElement, any>;

  constructor(
    svgContainer: Selection<SVGGElement, unknown, HTMLElement, any>,
    d3ChartData: ChartDatum[]
  ) {
    this.svgContainer = svgContainer;
    this.d3ChartData = d3ChartData;
  }

  public addTooltip() {}
}
