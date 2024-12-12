import { useState, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  CellContext,
} from "@tanstack/react-table";

import type { DebugItem, Tag, RollForwardItem } from "../types/roll-forward.types";

const OUTPUT_PATH =
  "C:/Users/mattberhe/pALM/pALM2.1_Sidecar_GDN_Assets/pALMLiability/pALMLauncher/data_GDNBMA_03312024_output/GDNSidecar_3.31_BaseCombined_Tax_wSwap/DebugInfo_Scenario_Sen_0001_0.csv";

type DataLong = {
  name: DebugItem;
  tag: Tag;
  values: string[];
};

const targetNames: Set<DebugItem> = new Set([
  "MarketValue_MTM_0_NoChange",
  "MarketValue_MTM_1_Credit",
  "MarketValue_MTM_2_Time",
  "MarketValue_MTM_3_MoveAlongCurve",
  "MarketValue_MTM_4_MaturityAmort",
  "mv_mtm_gain_loss",
  "MVafterMTM",
  "EquityPositionPreReturn",
  "equity_MTM_due_return",
  "MVpostEquityGain",
  "LiabilityCF_combined",
  "swapcashflow",
  "public_maturity_pmt",
  "private_maturity_pmt",
  "cml_maturity_pmt",
  "clo_maturity_pmt",
  "cmbs_maturity_pmt",
  "publicclo_maturity_pmt",
  "equity_maturity_pmt",
  "public_interest_pmt",
  "private_interest_pmt",
  "cml_interest_pmt",
  "cmbs_interest_pmt",
  "publicclo_interest_pmt",
  "clo_interest_pmt",
  "equity_interest_pmt",
  "public_mort_pmt",
  "private_mort_pmt",
  "cml_mort_pmt",
  "clo_mort_pmt",
  "cmbs_mort_pmt",
  "publicclo_mort_pmt",
  "equity_mort_pmt",
  "total_default_expense",
  "total_investment_expense",
  "other_investmentexpense",
  "otherexpense",
  "loc_cost",
  "investableEquityLimitSales",
  "Sell_Reinvest",
  "Normal_Activity_Class_Buy_Public",
  "Normal_Activity_Class_Buy_Private",
  "Normal_Activity_Class_Buy_CML",
  "Normal_Activity_Class_Buy_CLO",
  "Normal_Activity_Class_Buy_PublicCLO",
  "Normal_Activity_Class_Buy_CMBS",
  "Normal_Activity_Class_Buy_Equity",
  "Normal_Activity_Class_Sell_Public",
  "Normal_Activity_Class_Sell_Private",
  "Normal_Activity_Class_Sell_CML",
  "Normal_Activity_Class_Sell_CLO",
  "Normal_Activity_Class_Sell_PublicCLO",
  "Normal_Activity_Class_Sell_CMBS",
  "Normal_Activity_Class_Sell_Equity",
  "transaction_cost_reinvest_sell",
  "transaction_cost_reinvest_buy",
  "MVafterReinvestSell_new",
  "Rebalancing_Activity_Class_Buy_Public",
  "Rebalancing_Activity_Class_Buy_Private",
  "Rebalancing_Activity_Class_Buy_CML",
  "Rebalancing_Activity_Class_Buy_CLO",
  "Rebalancing_Activity_Class_Buy_PublicClo",
  "Rebalancing_Activity_Class_Buy_CMBS",
  "Rebalancing_Activity_Class_Buy_Equity",
  "Rebalancing_Activity_Class_Sell_Public",
  "Rebalancing_Activity_Class_Sell_Private",
  "Rebalancing_Activity_Class_Sell_CML",
  "Rebalancing_Activity_Class_Sell_CLO",
  "Rebalancing_Activity_Class_Sell_PublicClo",
  "Rebalancing_Activity_Class_Sell_CMBS",
  "Rebalancing_Activity_Class_Sell_Equity",
  "transaction_cost_rebalance_sell",
  "transaction_cost_rebalance_buy",
  "MVafterRebalance",
  "BSCR_CAL",
  "BVbeforeDividend",
  "surplus",
  "targetBSCRlevel",
  "fm_us_stat",
  "BSCR_RiskMargin",
  "tax",
  "Dividends_neg",
  "Dividends",
  "mv_mtm_pre_period",
  "BVEndOfPeriod",
  "npv_bel_asset_run_noequity",
]);

const rollForwardTargetNames: Set<RollForwardItem> = new Set([
  "Assets BOP",
  "MTM Gain Loss from Credit Grading",
  "MTM Gain Loss from Passage of Time",
  "MTM Gain Loss from Interest Rates",
  "MTM Temp Drop from Maturity and Amort",
  "MTM Total Gain Loss",
  "Equity Returns",
  "Swap Cash Flow",
  "Maturities",
  "Coupon Payments",
  "Amortization",
  "Defaults",
  "Investment Expense",
  "Fixed Overhead",
  "AUM Expense",
  "Liability Cash Flow",
  "Forced Sales",
  "Total to Reinvest/Sell",
  "Normal Purchases",
  "Normal Sales",
  "Reinvest/Sell Transaction Costs",
  "Assets Post Reinvestment",
  "Rebalancing Purchases",
  "Rebalancing Sales",
  "Rebalancing Transaction Costs",
  "Assets Post Rebalance",
  "Dividends",
  "Taxes",
  "Assets EOP",
]);

const tagMapping: Record<DebugItem, Tag> = {
  MarketValue_MTM_0_NoChange: "Assets BOP",
  MarketValue_MTM_1_Credit: "MV Post Credit Spread Change",
  MarketValue_MTM_2_Time: "MV Passage of Time",
  MarketValue_MTM_3_MoveAlongCurve: "MV Advancing on the Curve",
  MarketValue_MTM_4_MaturityAmort: "MV Temp Loss from Maturity and Amort",
  mv_mtm_gain_loss: "MTM Total Gain Loss",
  MVafterMTM: "Assets Post MTM",
  EquityPositionPreReturn: "Equity Position Pre Return",
  equity_MTM_due_return: "Equity Returns",
  MVpostEquityGain: "Assets Post Equity Return",
  LiabilityCF_combined: "Liability Cash Flow",
  swapcashflow: "Swap Cash Flow",
  public_maturity_pmt: "Maturities",
  private_maturity_pmt: "Maturities",
  cml_maturity_pmt: "Maturities",
  clo_maturity_pmt: "Maturities",
  cmbs_maturity_pmt: "Maturities",
  publicclo_maturity_pmt: "Maturities",
  equity_maturity_pmt: "Maturities",
  public_interest_pmt: "Coupon Payments",
  private_interest_pmt: "Coupon Payments",
  cml_interest_pmt: "Coupon Payments",
  cmbs_interest_pmt: "Coupon Payments",
  publicclo_interest_pmt: "Coupon Payments",
  clo_interest_pmt: "Coupon Payments",
  equity_interest_pmt: "Coupon Payments",
  public_mort_pmt: "Amortization",
  private_mort_pmt: "Amortization",
  cml_mort_pmt: "Amortization",
  clo_mort_pmt: "Amortization",
  cmbs_mort_pmt: "Amortization",
  publicclo_mort_pmt: "Amortization",
  equity_mort_pmt: "Amortization",
  total_default_expense: "Defaults",
  total_investment_expense: "Investment Expense",
  other_investmentexpense: "Fixed Overhead",
  otherexpense: "AUM Expense",
  loc_cost: "LOC Cost",
  investableEquityLimitSales: "Forced Sales",
  Sell_Reinvest: "Total to Reinvest/Sell",
  Normal_Activity_Class_Buy_Public: "Normal Purchases",
  Normal_Activity_Class_Buy_Private: "Normal Purchases",
  Normal_Activity_Class_Buy_CML: "Normal Purchases",
  Normal_Activity_Class_Buy_CLO: "Normal Purchases",
  Normal_Activity_Class_Buy_PublicCLO: "Normal Purchases",
  Normal_Activity_Class_Buy_CMBS: "Normal Purchases",
  Normal_Activity_Class_Buy_Equity: "Normal Purchases",
  Normal_Activity_Class_Sell_Public: "Normal Sales",
  Normal_Activity_Class_Sell_Private: "Normal Sales",
  Normal_Activity_Class_Sell_CML: "Normal Sales",
  Normal_Activity_Class_Sell_CLO: "Normal Sales",
  Normal_Activity_Class_Sell_PublicCLO: "Normal Sales",
  Normal_Activity_Class_Sell_CMBS: "Normal Sales",
  Normal_Activity_Class_Sell_Equity: "Normal Sales",
  transaction_cost_reinvest_sell: "Reinvest/Sell Transaction Costs",
  transaction_cost_reinvest_buy: "Reinvest/Sell Transaction Costs",
  MVafterReinvestSell_new: "Assets Post Reinvestment",
  Rebalancing_Activity_Class_Buy_Public: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Buy_Private: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Buy_CML: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Buy_CLO: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Buy_PublicClo: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Buy_CMBS: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Buy_Equity: "Rebalancing Purchases",
  Rebalancing_Activity_Class_Sell_Public: "Rebalancing Sales",
  Rebalancing_Activity_Class_Sell_Private: "Rebalancing Sales",
  Rebalancing_Activity_Class_Sell_CML: "Rebalancing Sales",
  Rebalancing_Activity_Class_Sell_CLO: "Rebalancing Sales",
  Rebalancing_Activity_Class_Sell_PublicClo: "Rebalancing Sales",
  Rebalancing_Activity_Class_Sell_CMBS: "Rebalancing Sales",
  Rebalancing_Activity_Class_Sell_Equity: "Rebalancing Sales",
  transaction_cost_rebalance_sell: "Rebalancing Transaction Costs",
  transaction_cost_rebalance_buy: "Rebalancing Transaction Costs",
  MVafterRebalance: "Assets Post Rebalance",
  BSCR_CAL: "BSCR",
  BVbeforeDividend: "BV Before Dividend",
  surplus: "Surplus BOP",
  // surplus: "Surplus EOP Post Dividend",  two surplus??
  targetBSCRlevel: "BSCR Target",
  fm_us_stat: "US Stat",
  BSCR_RiskMargin: "Risk Margin",
  tax: "Taxes",
  Dividends_neg: "Dividends",
  Dividends: "Dividends",
  mv_mtm_pre_period: "Assets EOP",
  BVEndOfPeriod: "BV EOP",
  npv_bel_asset_run_noequity: "BEL No Equity",
};

const sumColumns = (data: string[][]): number[] => {
  if (data.length === 0) return [];

  return data[0].map((_, colIndex) =>
    data.reduce(
      (sum, row) => sum + (isNaN(Number(row[colIndex])) ? 0 : Number(row[colIndex])),
      0
    )
  );
};

const subtractRows = (row1: string[], row2: string[]): number[] => {
  // Ensure both rows have the same length
  if (row1.length !== row2.length) {
    throw new Error("Rows must have the same length");
  }

  return row1.map((value, index) => {
    const num1 = Number(value);
    const num2 = Number(row2[index]);
    // Return the subtraction result, assuming valid numeric conversion
    return isNaN(num1) || isNaN(num2) ? 0 : num1 - num2;
  });
};

const formulas: Record<
  RollForwardItem,
  (data: DataLong[]) => { name: RollForwardItem; values: number[] }
> = {
  "Assets BOP": (dataLong: DataLong[]) => ({
    name: "Assets BOP",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Assets BOP").map((x) => x.values)
    ),
  }),
  "MTM Gain Loss from Credit Grading": (dataLong: DataLong[]) => {
    const row1 =
      dataLong.find((x) => x.name === "MarketValue_MTM_1_Credit")?.values || [];
    const row2 =
      dataLong.find((x) => x.name === "MarketValue_MTM_0_NoChange")?.values || [];

    return {
      name: "MTM Gain Loss from Credit Grading",
      values: subtractRows(row1, row2),
    };
  },
  "MTM Gain Loss from Passage of Time": (dataLong: DataLong[]) => {
    const row1 = dataLong.find((x) => x.name === "MarketValue_MTM_2_Time")?.values || [];
    const row2 =
      dataLong.find((x) => x.name === "MarketValue_MTM_1_Credit")?.values || [];

    return {
      name: "MTM Gain Loss from Passage of Time",
      values: subtractRows(row1, row2),
    };
  },
  "MTM Gain Loss from Interest Rates": (dataLong: DataLong[]) => {
    const row1 =
      dataLong.find((x) => x.name === "MarketValue_MTM_3_MoveAlongCurve")?.values || [];
    const row2 = dataLong.find((x) => x.name === "MarketValue_MTM_2_Time")?.values || [];

    return {
      name: "MTM Gain Loss from Interest Rates",
      values: subtractRows(row1, row2),
    };
  },
  "MTM Temp Drop from Maturity and Amort": (dataLong: DataLong[]) => ({
    name: "MTM Temp Drop from Maturity and Amort",
    values:
      dataLong
        .find((x) => x.name === "MarketValue_MTM_4_MaturityAmort")
        ?.values.map((x) => Number(x) * -1) || [],
  }),
  "MTM Total Gain Loss": (dataLong: DataLong[]) => ({
    name: "MTM Total Gain Loss",
    values:
      dataLong.find((x) => x.name === "mv_mtm_gain_loss")?.values.map((x) => Number(x)) ||
      [],
  }),
};

const RollForward: React.FC = () => {
  const [dataLong, setDataLong] = useState<DataLong[]>([]);
  const [rollForwardData, setRollForwardData] = useState<
    {
      name: RollForwardItem;
      values: number[];
    }[]
  >();

  // load raw palm data file and create data long
  useEffect(() => {
    const loadOutput = async () => {
      const data = await invoke<Record<DebugItem, string[]>>("load_csv_file", {
        path: OUTPUT_PATH,
      });

      // creating Data Long
      const dataLong = Object.entries(data)
        .filter(([name]) => targetNames.has(name))
        .map(([name, values]) => ({
          name,
          tag: tagMapping[name] || "Uncategorized",
          values,
        }));
      // console.log(dataLong);
      setDataLong(dataLong);
    };

    loadOutput();
  }, []);

  // if data long, create roll forward summary data
  useEffect(() => {
    const createRollForwardSummaryData = (dataLong: DataLong[]) => {
      // console.log("dataLong:", dataLong);
      const dataRows = Array.from(rollForwardTargetNames)
        .filter((item) => formulas[item])
        .map((item) => formulas[item](dataLong));

      return dataRows;
    };

    if (dataLong) {
      const summaryData = createRollForwardSummaryData(dataLong);
      setRollForwardData(summaryData);
      console.log(summaryData);
    }
  }, [dataLong]);

  const columns = useMemo(() => {
    if (!rollForwardData || rollForwardData.length === 0) return [];

    const numberOfColumns = rollForwardData[0].values.length;
    const dynamicColumns = Array.from({ length: numberOfColumns }, (_, i) => ({
      accessorKey: `${i + 1}`, // This is where we are skipping one
      header: `${i + 1}`,
      cell: (x: CellContext<any, string | number>) => (
        <p className="w-[220px] text-center">{x.getValue()}</p>
      ),
    }));

    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: (x: CellContext<any, string | number>) => (
          <p className="w-[300px] text-left">{x.getValue()}</p>
        ),
      },
      ...dynamicColumns,
    ];
  }, [rollForwardData]);

  const transformedData = useMemo(() => {
    return rollForwardData?.map((item) => {
      const row: Record<string, number | string> = { name: item.name };
      item.values.forEach((value, index) => {
        row[`${index}`] = value;
      });
      return row;
    });
  }, [rollForwardData]);

  const table = useReactTable({
    data: transformedData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col w-full">
        <table className="">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ width: 200 }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RollForward;
