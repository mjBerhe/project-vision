import {
  CartesianGrid,
  AreaChart,
  Area,
  XAxis,
  Label,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";

import type { DataLong } from "../../hooks/useDataLong";
import { sumColumns } from "../../utils/roll-forward";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { DebugItem } from "../../types/roll-forward.types";

const DATA_LENGTH = 240;

const darkModeGraphColors: string[] = [
  "#4CAF50", // Bright Green
  "#FF9800", // Vivid Orange
  "#2196F3", // Bright Blue
  "#F44336", // Bright Red
  "#9C27B0", // Vibrant Purple
  "#FFC107", // Golden Yellow
  "#00BCD4", // Cyan
  "#8BC34A", // Light Green
  "#FFEB3B", // Yellow
  "#FF5722", // Deep Orange
  "#673AB7", // Deep Purple
  "#03A9F4", // Light Blue
  "#E91E63", // Pink
  "#CDDC39", // Lime
  "#607D8B", // Cool Grey
];

const items: DebugItem[] = [
  "MarketValue_Rating_AAA",
  "MarketValue_Rating_AA",
  "MarketValue_Rating_A",
  "MarketValue_Rating_BBB",
  "MarketValue_Rating_BB",
  "MarketValue_Rating_B",
  "MarketValue_Rating_CCC",
  "MarketValue_Rating_D",
  // "MVafterMTM",
];

export const EOPPortfolioRatings: React.FC<{
  dataLong: DataLong[];
  size: "sm" | "lg";
}> = ({ dataLong, size }) => {
  // want to only show items that have atleast one month that is > 0
  const filteredItems = items.filter((itemName) => {
    const data = dataLong.find((x) => x.name === itemName)?.values;
    if (data) {
      const hasPositiveValue = data.some((value) => parseFloat(value) > 0);
      return hasPositiveValue;
    }
    return false;
  });

  if (!filteredItems || filteredItems.length === 0) {
    return <div>loading...</div>;
  }

  const chartData = new Array(DATA_LENGTH)
    .fill(0)
    .map((_, i) => {
      const row: Record<string, number> = {};
      filteredItems.forEach((x) => {
        const value = dataLong.find((y) => y.name === x)?.values[i];
        row["month"] = i;
        row[x] = value ? parseFloat(value) : 0;
      });
      return row;
    })
    .slice(1);

  const chartConfig = filteredItems.reduce((acc, item, i) => {
    acc[item] = {
      label: item,
      color: darkModeGraphColors[i],
    };
    return acc;
  }, {} as ChartConfig);

  const step = size === "lg" ? 12 : 24;
  const tickArray = Array.from(
    { length: Math.floor(240 / step) + 1 },
    (_, i) => i * step
  );

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-full flex flex-col">
        <h1 className="font-semibold">EOP Asset Proportions by Rating</h1>
        <p className="text-sm/6 text-gray-400">%</p>
      </div>
      <div className="mt-4">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            stackOffset="expand"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={size === "lg" ? 55 : 30}
              minTickGap={1}
              ticks={[...tickArray]}
            >
              {size === "lg" && <Label value="Months" position="insideBottom" />}
            </XAxis>

            {size === "lg" && (
              <YAxis
                // angle={-45}
                textAnchor="end"
                width={25}
                axisLine={false}
                tickLine={false}
              >
                {/* <Label value="$100 millions" angle={-90} position={"insideLeft"} /> */}
              </YAxis>
            )}

            <ReferenceLine y={0} />
            {size === "lg" && (
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            )}

            {filteredItems.map((x) => (
              <Area
                key={x}
                dataKey={x}
                type="natural"
                stroke={chartConfig[x].color}
                fill={chartConfig[x].color}
                // strokeWidth={2}
                stackId={"a"}
                // dot={false}
              />
            ))}

            {/* <Area
              dataKey="other"
              type="natural"
              fill="var(--color-other)"
              fillOpacity={0.1}
              stroke="var(--color-other)"
              stackId="a"
            /> */}

            {size === "lg" && (
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 5 }} />
            )}
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};
