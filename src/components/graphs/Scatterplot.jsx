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

  const theme = useTheme();

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState(null);
  console.log(hovered)

  // Scales
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => Number(d.ambient_power_1)), d3.max(data, d => Number(d.ambient_power_1))])
    .range([boundsHeight, 0]);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => Number(d.ambient_frequency_1)), d3.max(data, d => Number(d.ambient_frequency_1))])
    .range([0, boundsWidth]);

  const group = [...new Set(data.map(d => d[groupBy]))]

  const colorScale = d3
    .scaleOrdinal()
    .domain(group)
    .range(d3.schemeAccent)
  // Build the shapes
  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={8}
        cx={xScale(d.ambient_frequency_1)}
        cy={yScale(d.ambient_power_1)}
        stroke={colorScale(d[groupBy])}
        fill={colorScale(d[groupBy])}
        fillOpacity={0.7}
        onMouseEnter={() =>
          setHovered({
            xPos: Number(xScale(d.ambient_frequency_1)),
            yPos: Number(yScale(d.ambient_power_1)),
            name: `inverter: ${d.inverter}\n` + 
                  `header: ${d.header}`,
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
