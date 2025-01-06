import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
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

export const NetSellReinvestChart: React.FC<{
  dataLong: DataLong[];
  size: "sm" | "lg";
}> = ({ dataLong, size }) => {
  const filteredRows: DebugItem[] = [
    "LiabilityCF_combined",
    "swapcashflow",
    "public_interest_pmt",
    "private_interest_pmt",
    "cml_interest_pmt",
    "cmbs_interest_pmt",
    "publicclo_interest_pmt",
    "clo_interest_pmt",
    "equity_interest_pmt",
    "total_default_expense",
    "total_investment_expense",
    "other_investmentexpense",
    "otherexpense",
    "loc_cost",
  ];

  const data = sumColumns(
    dataLong.filter((x) => filteredRows.includes(x.name)).map((x) => x.values)
  );

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
        <h1 className="font-semibold">Net Sell / Reinvest from Normal Activity</h1>
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
            {/* <Tooltip cursor={false} /> */}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};
