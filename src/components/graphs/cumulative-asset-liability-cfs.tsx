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
import { div } from "motion/react-client";

export const CumulativeAssetLiabilityCFs: React.FC<{
  dataLong: DataLong[];
  size: "sm" | "lg";
}> = ({ dataLong, size }) => {
  const netAssetCFRows: DebugItem[] = [
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

  const netAssetCF = sumColumns(
    dataLong.filter((x) => netAssetCFRows.includes(x.name)).map((x) => x.values)
  );
  const netLiabilityCF = sumColumns(
    dataLong.filter((x) => x.name === "LiabilityCF_combined").map((x) => x.values)
  );

  const cumulativeAssetCF = netAssetCF.reduce((acc, value, index) => {
    const cumulativeValue = (acc[index - 1] || 0) + value;
    acc.push(cumulativeValue);
    return acc;
  }, [] as number[]);
  // console.log(cumulativeAssetCF);

  const cumulativeLiabilityCF = netLiabilityCF.reduce((acc, value, index) => {
    const cumulativeValue = (acc[index - 1] || 0) + value;
    acc.push(cumulativeValue);
    return acc;
  }, [] as number[]);

  if (!cumulativeAssetCF || !cumulativeLiabilityCF) {
    return (
      <div className="w-full h-full flex justify-center items-center">loading...</div>
    );
  }

  const chartData = cumulativeAssetCF
    .map((value, i) => ({
      month: i,
      asset: value / 1000000000,
      liability: cumulativeLiabilityCF[i] / 1000000000,
    }))
    .slice(1, 240);

  const chartConfig = {
    asset: {
      label: "asset",
      color: "#37C6F4",
    },
    liability: {
      label: "liability",
      color: "#4169B2",
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
        <h1 className="font-semibold">Cumulative Asset and Liability CFs</h1>
        <p className="text-sm/6 text-gray-400">Billions per month</p>
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
              dataKey="asset"
              type="linear"
              stroke={chartConfig.asset.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="liability"
              type="linear"
              stroke={chartConfig.liability.color}
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
