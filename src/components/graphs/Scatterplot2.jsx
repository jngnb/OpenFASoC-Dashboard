import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { useState } from "react";
import { Tooltip } from  "./Tooltip";
import { useTheme } from "@mui/material";

const MARGIN = { top: 30, right: 60, bottom: 60, left: 80 };

type ScatterplotProps = {
  width: number;
  height: number;
  xAxis: String;
  yAxis: String;
  groupBy: string;
};

const Scatterplot = ({ width, height, data, xAxis, yAxis, groupBy}) => 
{

  console.log(data)
  const theme = useTheme();

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState(null);
  console.log(hovered)

  // Scales
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => Number(d.header)), d3.max(data, d => Number(d.header))])
    .range([boundsHeight, 0]);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => Number(d.inverter)), d3.max(data, d => Number(d.inverter))])
    .range([0, boundsWidth]);

  const group = [...new Set(data.map(d => d.maximum_error_1))]

  const colorScale = d3
  .scaleSequential()
  .domain(d3.extent(data, d => Math.pow(Math.log2(Math.abs(d.maximum_error_1) + 1), 1.2)))
  .interpolator(d3.interpolateRdYlGn);


  const maxError = data.reduce((max, obj) => obj.maximum_error_1 > max ? obj.maximum_error_1 : max, 0);

  const maxRadius = 30;
  const minRadius = 5;
  const logScale = d3.scaleLog().domain([1, maxError]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={Math.pow(Math.log2(Math.abs(d.maximum_error_1) + 1), 1.2) * 8}
        cx={xScale(d.inverter)}
        cy={yScale(d.header)}
        stroke={colorScale(Math.abs(d.maximum_error_1))}
        fill={colorScale(Math.abs(d.maximum_error_1))}
        fillOpacity={0.7}
        onMouseEnter={() =>
          setHovered({
            xPos: Number(xScale(d.inverter)),
            yPos: Number(yScale(d.header)),
            name: `Error: ${Number(d.maximum_error_1).toFixed(4)}`
          })
        }
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {/* Y axis */}
          <AxisLeft 
            yScale={yScale} 
            pixelsPerTick={40} 
            width={boundsWidth} 
            height={boundsHeight}
            xAxis={xAxis} 
          />

          {/* X axis, use an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              pixelsPerTick={40}
              height={boundsHeight}
              width = {boundsWidth}
              yAxis = {yAxis}
            />
          </g>
          {/* Circles */}
          {allShapes}
        </g>
      </svg>

      {/* Tooltip */}
      <div
        style={{
          width: boundsWidth,
          height: boundsHeight,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          marginLeft: MARGIN.left,
          marginTop: MARGIN.top,
        }}
      >
        <Tooltip interactionData={hovered} />
      </div>
    </div>
  );
};

export default Scatterplot;
