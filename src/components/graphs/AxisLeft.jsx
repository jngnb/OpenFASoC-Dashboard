import { useMemo } from "react";
import { ScaleLinear } from "d3";

type AxisLeftProps = {
  yScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  width: number;
  height: number;
  xAxis: String;
};

const TICK_LENGTH = 10;

export const AxisLeft = ({ 
  yScale, 
  pixelsPerTick, 
  width, 
  height,
  xAxis
}: AxisLeftProps) => {
  const range = yScale.range();

  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale]);

  return (
    <>
      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line
            x1={-TICK_LENGTH}
            x2={width + TICK_LENGTH}
            stroke="#D2D7D3"
            strokeWidth={1}
            shapeRendering={"crispEdges"}
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-30px) translateY(2.5px)",
              fill: "#D2D7D3",
            }}
          >
            {value < 0.01 ? value.toExponential(1) : value}
          </text>
        </g>
      ))}
      {/* Axis label */}
      <text
        x={width / 2}
        y={height + 45}
        style={{
          fontSize: "15px",
          textAnchor: "middle",
          fill: "#D2D7D3",
        }}
      >
        {xAxis}
      </text>
    </>
  );
};
