import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import type { DataLong } from "../../hooks/useDataLong";
import { sumColumns, cumulativeSum } from "../../utils/roll-forward";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { DebugItem } from "../../types/roll-forward.types";

export const ChangeInSurplus: React.FC<{
  dataLong: DataLong[];
  size: "sm" | "lg";
}> = ({ dataLong, size }) => {
  const injection = -100000000; // 100m

  // must change negative dividends to positive
  const dividendValues = dataLong
    .find((x) => x.name === "Dividends")
    ?.values.map((value) => (value.includes("-") ? value.replace("-", "") : `-${value}`));

  // must change positive dividends_neg to negative
  const dividendNegValues = dataLong
    .find((x) => x.name === "Dividends_neg")
    ?.values.map((value) => (value.includes("-") ? value.replace("-", "") : `-${value}`));

  if (!dividendValues || !dividendNegValues) {
    return (
      <div className="w-full h-full flex justify-center items-center">loading...</div>
    );
  }

  // add the dividends, make it cumulative, add the injection LAST
  const data = cumulativeSum(sumColumns([dividendValues, dividendNegValues])).map(
    (x) => x + injection
  );
  console.log(data);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">loading...</div>
    );
  }

  const chartData = data
    .map((value, i) => ({
      month: i,
      Amount: value / 100000000,
    }))
    .slice(1, 240);

  const chartConfig = {
    main: {
      label: "Amount",
      color: "#37C6F4",
    },
  } satisfies ChartConfig;

  const step = size === "lg" ? 12 : 24;
  const tickArray = Array.from(
    { length: Math.floor(240 / step) + 1 },
    (_, i) => i * step
  );

  return (
    <div>
      <div className="w-full flex flex-col">
        <h1 className="font-semibold">Change in Surplus</h1>
        <p className="text-sm/6 text-gray-400">$100 millions per month</p>
      </div>
      <div className="mt-4">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
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
              // label={f}
            >
              {size === "lg" && <Label value="Months" position="insideBottom" />}
            </XAxis>
            {size === "lg" && (
              <YAxis
                // angle={-45}
                padding={{}}
                textAnchor="end"
                width={10}
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
            <Line
              dataKey="Amount"
              type="linear"
              stroke={chartConfig.main.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};
