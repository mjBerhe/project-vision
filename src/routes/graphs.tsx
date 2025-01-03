import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { useDataLong, type DataLong } from "../hooks/useDataLong";
import { sumColumns } from "../utils/roll-forward";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "../components/ui/morphing-dialog";
import { cn } from "../utils/global";
import { DebugItem } from "../types/roll-forward.types";

const Graphs: React.FC = () => {
  const { dataLong } = useDataLong();

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col w-full overflow-x-auto overflow-y-auto">
        <div>
          <h3 className="text-xl font-semibold">Graphs</h3>
        </div>
        <div className="mt-8 flex flex-wrap">
          <MorphingDialog
            transition={{
              type: "spring",
              bounce: 0.05,
              duration: 0.25,
            }}
          >
            <MorphingDialogTrigger
              className={cn(
                "flex w-[500px] h-[360px] flex-col overflow-hidden border p-4 border-dark-700 rounded-lg bg-dark-900/70 hover:bg-dark-900 shadow-lg"
              )}
            >
              <NetSellReinvestChart dataLong={dataLong} size="sm" />
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
              <MorphingDialogContent className="pointer-events-auto relative flex flex-col overflow-hidden w-[900px] bg-dark-900 py-6 px-8 rounded-lg shadow-lg">
                <NetSellReinvestChart dataLong={dataLong} size="lg" />
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>
        </div>
      </div>
    </main>
  );
};

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
  // dataLong.find((x) => x.name === "Sell_Reinvest"),
  // dataLong.find((x) => x.name === "LiabilityCF_combined")?.map((x) => x.values)

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
  console.log(tickArray);

  return (
    <div>
      <div className="w-full flex flex-col">
        <h1 className="font-semibold">
          Net Sell / Reinvest from Normal Asset and Liability Activity
        </h1>
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
            {/* <YAxis
              // angle={-45}
              padding={{}}
              textAnchor="end"
              width={45}
              axisLine={false}
              tickLine={false}
            >
              <Label value="$100 millions" angle={-90} position={"insideLeft"} />
            </YAxis> */}
            <ReferenceLine y={0} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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

export default Graphs;
