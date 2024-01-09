import * as d3 from "d3";
import { useRef, useState } from "react";
import { generateLinearGradientArray } from "./utils";
import Tooltip from "./components/Tooltip";

const path = d3.path();
path.moveTo(0, 0);

const data = [
  { value: 0 },
  { value: 20000 },
  { value: 35000 },
  { value: 70000 },
  { value: 3000 },
  { value: 35000 },
  { value: 1000 },
  { value: 20000 },
  { value: 13000 },
  { value: 70000 },
  { value: 30000 },
  { value: 60000 },
];

const WIDTH = 700;
const HEIGHT = 400;

const LENGTH = data.length;

const MAX_VALUE = data.reduce(
  (acc, { value }) => (value > acc ? value : acc),
  data[0].value
);

const coordinates = data.map<[number, number]>(({ value }, index) => {
  return [
    (WIDTH / (LENGTH - 1)) * index,
    HEIGHT - (value / MAX_VALUE) * HEIGHT,
  ];
});

const reversed = data.map<[number, number]>(({ value }, index) => {
  return [
    (WIDTH / (LENGTH - 1)) * index,
    HEIGHT - (value / MAX_VALUE) * HEIGHT,
  ];
});

const ys = data.map<number>((_, index) => {
  return (HEIGHT / (LENGTH - 1)) * index;
});

console.log(JSON.stringify(coordinates));

const line = d3
  .line()
  .x((d) => d[0])
  .y((d) => d[1])
  .curve(d3.curveCatmullRom)(coordinates);

const reversedline = d3
  .line()
  .x((d) => d[0])
  .y((d) => d[1])
  .curve(d3.curveCatmullRom)(reversed);

const line2 = d3
  .line()
  .x((d) => d[0])
  .y((d) => d[1])
  .curve(d3.curveCatmullRom)(coordinates);

const gradient = generateLinearGradientArray("#FFF961", "#34D399");

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const rect = ref.current?.getBoundingClientRect();

  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [gradientIndex, setGradientIndex] = useState(0);

  return (
    <div className="flex justify-center">
      {tooltipCoords && (
        <div
          ref={ref}
          style={{
            left: tooltipCoords.x - (rect?.width ?? 0) / 2,
            top: tooltipCoords.y - 56,
          }}
          className="absolute flex flex-col items-center pointer-events-none"
        >
          <Tooltip value="40.000" />
        </div>
      )}

      <div className="w-[700px] bg-[#1b1b1b]">
        <svg
          width={WIDTH}
          height={HEIGHT}
          onMouseMove={() => {
            coords && setGradientIndex(Math.round((coords.x / WIDTH) * 100));
          }}
        >
          {coords && (
            <circle
              cx={coords.x}
              cy={coords.y}
              stroke={gradient[gradientIndex]}
              strokeWidth={2}
              r={4.5}
            ></circle>
          )}
          {coords && (
            <line
              x1={coords.x}
              y1={coords.y + 4}
              x2={coords.x}
              y2={HEIGHT}
              stroke={gradient[gradientIndex]}
              strokeWidth={2}
            ></line>
          )}

          <path
            d={line!}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth={3}
          ></path>

          <path
            d={`${line2!} L${WIDTH} ${HEIGHT} L0 ${HEIGHT}`}
            fill="#1b1b1b"
          ></path>

          <path
            d={`${line2!} L${WIDTH} ${HEIGHT} L0 ${HEIGHT}`}
            fill="url(#gradient)"
            opacity={0.3}
          ></path>

          <Grid />

          <path
            onMouseMove={({
              nativeEvent: { clientX, clientY },
              currentTarget,
            }) => {
              const rect = currentTarget.getBoundingClientRect();
              setTooltipCoords({ x: clientX, y: clientY });
              setCoords({ x: clientX - rect.left, y: clientY - rect.top });
            }}
            d={`${reversedline!} L${WIDTH} 0 L0 0`}
            stroke="url(#gradient)"
            fill="transparent"
          ></path>

          {/* {coordinates.map(([x, y]) => {
            return <circle cx={x} cy={y} r={4} fill="blue"></circle>;
          })} */}

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF961" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

const Grid = () => {
  return (
    <g>
      {coordinates.map(([x], i) => {
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={0}
            y2={HEIGHT}
            stroke="white"
            opacity={0.1}
            strokeWidth={1}
          ></line>
        );
      })}
      {ys.map((y, i) => {
        return (
          <line
            key={i}
            x1={0}
            x2={WIDTH}
            y1={y}
            y2={y}
            stroke="white"
            opacity={0.1}
            strokeWidth={1}
          ></line>
        );
      })}
    </g>
  );
};

export default App;
