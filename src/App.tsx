import * as d3 from "d3";
import { generateLinearGradientArray } from "./utils";
import Tooltip from "./components/Tooltip";
import { format, subDays } from "date-fns";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";

const data = [10, 30, 45, 40, 40, 40, 60, 58, 56, 65, 85, 100].map<
  [number, number]
>((v, i) => [i, v]);

const margin = {
  top: 40,
  right: 20,
  bottom: 40,
  left: 75,
};

const gradient = generateLinearGradientArray("#FFF961", "#34D399");

type Coordinates = {
  x: number;
  y: number;
};

const tooptipCircleRadius = 4;

function App() {
  const [ref, { width, height, left, top }] = useMeasure();

  const [tooltipRef, tooltipBounce] = useMeasure();
  const [transparentGraphRef, transparentGraphBounce] = useMeasure();

  const [gradientIndex, setGradientIndex] = useState(0);

  const [mouseCoordinates, setMouseCoordinates] = useState<Coordinates | null>(
    null
  );

  const xDomain = d3.extent(data.map((d) => d[0])) as [number, number];
  const yDomain = d3.extent(data.map((d) => d[1])) as [number, number];

  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([height - margin.top, margin.bottom]);

  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveCatmullRom)(data);

  return (
    <div
      ref={ref}
      className="h-full w-full"
      onMouseLeave={() => setMouseCoordinates(null)}
    >
      {mouseCoordinates && (
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none"
          style={{
            left: mouseCoordinates.x - tooltipBounce.width / 2,
            top: mouseCoordinates.y - tooltipBounce.height,
          }}
        >
          <Tooltip
            value={data[Math.floor(gradientIndex / 10)]?.[1]?.toFixed(3)}
          />
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`}>
        {/* Transparent graph opposed to the gradient one */}
        <path
          ref={transparentGraphRef}
          d={`${line} L${width - margin.right} 0 L${margin.left} 0 L${
            margin.left
          } ${height - margin.bottom}`}
          fill="transparent"
          strokeWidth={2}
          onMouseMove={({ clientX: x, clientY: y }) => {
            setMouseCoordinates({ x, y });

            const newGradientIndex = Math.floor(
              ((x - transparentGraphBounce.left) /
                transparentGraphBounce.width) *
                100
            );

            setGradientIndex(
              newGradientIndex < 0
                ? 0
                : newGradientIndex > 100
                ? 100
                : newGradientIndex
            );
          }}
        />

        {/* Vertical line with a circle on the top */}
        <g className="pointer-events-none">
          {mouseCoordinates && (
            <g>
              <circle
                r={tooptipCircleRadius}
                cx={mouseCoordinates.x - left}
                cy={mouseCoordinates.y - top + tooptipCircleRadius}
                stroke={gradient[gradientIndex]}
                strokeWidth={2}
              />
              <line
                x1={mouseCoordinates.x - left}
                y1={mouseCoordinates.y - top + tooptipCircleRadius * 2}
                x2={mouseCoordinates.x - left}
                y2={height - margin.bottom - 1}
                stroke={gradient[gradientIndex]}
                strokeWidth={2}
              />
            </g>
          )}
        </g>

        <path
          d={`${line} L${width - margin.right} ${height - margin.bottom} L${
            margin.left
          } ${height - margin.bottom}`}
          fill="#1b1b1b"
        ></path>

        {/* Ticks */}
        <g className="pointer-events-none text-white/5">
          {yScale.ticks(8).map((max) => (
            <g key={max} transform={`translate(0,${yScale(max)})`}>
              <line
                x1={0}
                x2={width - margin.right + 6}
                stroke="currentColor"
              />
              <text
                alignmentBaseline="before-edge"
                className="text-[8px] font-normal leading-[8px]"
                fill="#c3c3c3"
              >
                {max.toFixed(8)}
              </text>
            </g>
          ))}

          {xScale.ticks().map((max, index, arr) => (
            <g key={max}>
              <g transform={`translate(${xScale(max)},${height - 22})`}>
                <text
                  textAnchor="middle"
                  className="text-[8px] font-normal leading-[8px]"
                  fill="#c3c3c3"
                >
                  {format(subDays(new Date(), arr.length - 1 - index), "d MMM")}
                </text>
              </g>
              <g transform={`translate(${xScale(max)},${margin.top})`}>
                <line
                  y1={0}
                  y2={height - margin.top - margin.bottom + 8}
                  stroke="currentColor"
                />
              </g>
            </g>
          ))}
        </g>

        {/* Graph line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, type: "spring" }}
          d={`${line}`}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={2}
        />

        {/* Gradient fill */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, type: "spring" }}
          d={`${line} L${width - margin.right} ${height - margin.bottom} L${
            margin.left
          } ${height - margin.bottom}`}
          fill="url(#gradient)"
          opacity={0.2}
          stroke="url(#gradient)"
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF961" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default App;
