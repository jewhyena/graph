import * as d3 from "d3";
import { generateLinearGradientArray } from "./utils";
import Tooltip from "./components/Tooltip";
import { format, subDays } from "date-fns";
import { useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";

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

function App({ data }: { data: [number, number][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = ref.current?.getBoundingClientRect();

  const width = bounds?.width ?? 0;
  const height = bounds?.height ?? 0;
  const left = bounds?.left ?? 0;
  const top = bounds?.top ?? 0;

  const [tooltipRef, tooltipBounce] = useMeasure();
  const [transparentGraphRef, transparentGraphBounce] = useMeasure();

  const [dataIndex, setDataIndex] = useState(0);
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
            left: mouseCoordinates.x + window.scrollX - tooltipBounce.width / 2,
            top: mouseCoordinates.y + window.scrollY - tooltipBounce.height,
          }}
        >
          <Tooltip value={data[dataIndex]?.[1]?.toFixed(3)} />
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`}>
        {/* Vertical line with a circle on the top */}
        {mouseCoordinates && (
          <g className="pointer-events-none">
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
          </g>
        )}

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

            const trueX = Math.round(x - transparentGraphBounce.left);

            const cellWidth = transparentGraphBounce.width / (data.length - 1);

            const newDataIndex = Math.floor(trueX / cellWidth) + 1;

            setDataIndex(
              newDataIndex <= 0
                ? 0
                : newDataIndex >= data.length - 1
                ? data.length - 1
                : newDataIndex
            );
          }}
        />

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

        <defs xmlns="http://www.w3.org/2000/svg">
          <filter
            id="filter0_b_20558_46513"
            x="-40"
            y="-40"
            width="189"
            height="112"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="20" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_20558_46513"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_20558_46513"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default App;
