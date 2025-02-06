import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

import type { DataLong } from "../../hooks/useDataLong";
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

const bookYieldItems: DebugItem[] = [
  "BookYield_TXN_public_ig",
  "BookYield_TXN_private_ig",
  "BookYield_TXN_cml_ig",
  "BookYield_TXN_clo_ig",
  "BookYield_TXN_publicclo_ig",
  "BookYield_TXN_cmbssr_ig",
  "BookYield_TXN_cmbsam_ig",
  "BookYield_TXN_cmbs_ig",
  "BookYield_TXN_agencyrmbs_ig",
  "BookYield_TXN_nonagencyrmbs_ig",
  "BookYield_TXN_temuni_ig",
  "BookYield_TXN_txmuni_ig",
  "BookYield_TXN_abs_ig",
  "BookYield_TXN_emd_ig",
  "BookYield_TXN_mml_ig",
  "BookYield_TXN_rml_ig",
  "BookYield_TXN_cmldebt_ig",
  "BookYield_TXN_privatecredit_ig",
  "BookYield_TXN_bankloan_ig",
  "BookYield_TXN_equity_ig",
  "BookYield_TXN_swap_ig",
  "BookYield_TXN_public_big",
  "BookYield_TXN_private_big",
  "BookYield_TXN_cml_big",
  "BookYield_TXN_clo_big",
  "BookYield_TXN_publicclo_big",
  "BookYield_TXN_cmbssr_big",
  "BookYield_TXN_cmbsam_big",
  "BookYield_TXN_cmbs_big",
  "BookYield_TXN_agencyrmbs_big",
  "BookYield_TXN_nonagencyrmbs_big",
  "BookYield_TXN_temuni_big",
  "BookYield_TXN_txmuni_big",
  "BookYield_TXN_abs_big",
  "BookYield_TXN_emd_big",
  "BookYield_TXN_mml_big",
  "BookYield_TXN_rml_big",
  "BookYield_TXN_cmldebt_big",
  "BookYield_TXN_privatecredit_big",
  "BookYield_TXN_bankloan_big",
  "BookYield_TXN_equity_big",
  "BookYield_TXN_swap_big",
];

export const BookYield: React.FC<{
  dataLong: DataLong[];
  size: "sm" | "lg";
}> = ({ dataLong, size }) => {
  // want to only show items that have atleast one month that is > 0
  const filteredItems = bookYieldItems.filter((itemName) => {
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

  // slicing the first month since all first values are 0 and makes the graph look ugly
  const chartData = new Array(DATA_LENGTH)
    .fill(0)
    .map((_, i) => {
      const row: Record<string, number> = {};
      filteredItems.forEach((x) => {
        const value = dataLong.find((y) => y.name === x)?.values[i];
        row["month"] = i;
        row[x] = value ? parseFloat(value) * 100 : 0;
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
    <div>
      <div className="w-full flex flex-col">
        <h1 className="font-semibold">Book Yield by Class and Quality</h1>
        <p className="text-sm/6 text-gray-400">%</p>
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
              <Line
                key={x}
                dataKey={x}
                type="linear"
                stroke={chartConfig[x].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
            {size === "lg" && (
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 5 }} />
            )}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};
