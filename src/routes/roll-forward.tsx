import { useState, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { sum } from "lodash";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  CellContext,
} from "@tanstack/react-table";

import type {
  DebugItem,
  Tag,
  RollForwardItem,
  BalanceReconciliationItem,
} from "../types/roll-forward.types";
import { cn } from "../utils/global";
import { useDataLong } from "../hooks/useDataLong";

type DataLong = {
  name: DebugItem;
  tag: Tag;
  values: string[];
};

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

const balanceReconciliationTargetNames: Set<BalanceReconciliationItem> = new Set([
  "Start",
  "Change",
  "End",
  "Unaccounted For",
  // "Total Unaccounted For",
]);

const sumColumns = (data: (string[] | number[])[]): number[] => {
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

const rollForwardFormulas: Record<
  RollForwardItem,
  (data: DataLong[]) => {
    name: RollForwardItem;
    values: number[];
  }
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
  "Equity Returns": (dataLong: DataLong[]) => ({
    name: "Equity Returns",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Equity Returns").map((x) => x.values)
    ),
  }),
  "Swap Cash Flow": (dataLong: DataLong[]) => ({
    name: "Swap Cash Flow",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Swap Cash Flow").map((x) => x.values)
    ),
  }),
  Maturities: (dataLong: DataLong[]) => ({
    name: "Maturities",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Maturities").map((x) => x.values)
    ),
  }),
  "Coupon Payments": (dataLong: DataLong[]) => ({
    name: "Coupon Payments",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Coupon Payments").map((x) => x.values)
    ),
  }),
  Amortization: (dataLong: DataLong[]) => ({
    name: "Amortization",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Amortization").map((x) => x.values)
    ),
  }),
  Defaults: (dataLong: DataLong[]) => ({
    name: "Defaults",
    values: sumColumns(dataLong.filter((x) => x.tag === "Defaults").map((x) => x.values)),
  }),
  "Investment Expense": (dataLong: DataLong[]) => ({
    name: "Investment Expense",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Investment Expense").map((x) => x.values)
    ),
  }),
  "Fixed Overhead": (dataLong: DataLong[]) => ({
    name: "Fixed Overhead",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Fixed Overhead").map((x) => x.values)
    ),
  }),
  "AUM Expense": (dataLong: DataLong[]) => ({
    name: "AUM Expense",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "AUM Expense").map((x) => x.values)
    ),
  }),
  "Liability Cash Flow": (dataLong: DataLong[]) => ({
    name: "Liability Cash Flow",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Liability Cash Flow").map((x) => x.values)
    ),
  }),
  "Forced Sales": (dataLong: DataLong[]) => ({
    name: "Forced Sales",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Forced Sales").map((x) => x.values)
    ),
  }),
  "Total to Reinvest/Sell": (dataLong: DataLong[]) => ({
    name: "Total to Reinvest/Sell",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Total to Reinvest/Sell").map((x) => x.values)
    ),
  }),
  "Normal Purchases": (dataLong: DataLong[]) => ({
    name: "Normal Purchases",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Normal Purchases").map((x) => x.values)
    ),
  }),
  "Normal Sales": (dataLong: DataLong[]) => ({
    name: "Normal Sales",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Normal Sales").map((x) => x.values)
    ),
  }),
  "Reinvest/Sell Transaction Costs": (dataLong: DataLong[]) => ({
    name: "Reinvest/Sell Transaction Costs",
    values: sumColumns(
      dataLong
        .filter((x) => x.tag === "Reinvest/Sell Transaction Costs")
        .map((x) => x.values)
    ),
  }),
  "Assets Post Reinvestment": (dataLong: DataLong[]) => ({
    name: "Assets Post Reinvestment",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Assets Post Reinvestment").map((x) => x.values)
    ),
  }),
  "Rebalancing Purchases": (dataLong: DataLong[]) => ({
    name: "Rebalancing Purchases",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Rebalancing Purchases").map((x) => x.values)
    ),
  }),
  "Rebalancing Sales": (dataLong: DataLong[]) => ({
    name: "Rebalancing Sales",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Rebalancing Sales").map((x) => x.values)
    ),
  }),
  "Rebalancing Transaction Costs": (dataLong: DataLong[]) => ({
    name: "Rebalancing Transaction Costs",
    values: sumColumns(
      dataLong
        .filter((x) => x.tag === "Rebalancing Transaction Costs")
        .map((x) => x.values)
    ),
  }),
  "Assets Post Rebalance": (dataLong: DataLong[]) => ({
    name: "Assets Post Rebalance",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Assets Post Rebalance").map((x) => x.values)
    ),
  }),
  Dividends: (dataLong: DataLong[]) => ({
    name: "Dividends",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Dividends").map((x) => x.values)
    ),
  }),
  Taxes: (dataLong: DataLong[]) => ({
    name: "Taxes",
    values: sumColumns(dataLong.filter((x) => x.tag === "Taxes").map((x) => x.values)),
  }),
  "Assets EOP": (dataLong: DataLong[]) => ({
    name: "Assets EOP",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Assets EOP").map((x) => x.values)
    ),
  }),
};

const balanceReconFormulas: Record<
  BalanceReconciliationItem,
  (data: DataLong[]) => { name: BalanceReconciliationItem; values: number[] }
> = {
  Start: (dataLong: DataLong[]) => ({
    name: "Start",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Assets BOP").map((x) => x.values)
    ),
  }),
  // Change is summing all these columns in dataLong
  Change: (dataLong: DataLong[]) => ({
    name: "Change",
    values: sumColumns([
      rollForwardFormulas["MTM Gain Loss from Credit Grading"](dataLong).values,
      rollForwardFormulas["MTM Gain Loss from Passage of Time"](dataLong).values,
      rollForwardFormulas["MTM Gain Loss from Interest Rates"](dataLong).values,
      ...dataLong
        .filter((x) =>
          [
            "Equity Returns",
            "Swap Cash Flow",
            "Coupon Payments",
            "Defaults",
            "Investment Expense",
            "Fixed Overhead",
            "AUM Expense",
            "Liability Cash Flow",
            "Reinvest/Sell Transaction Costs",
            "Rebalancing Transaction Costs",
            "Dividends",
            "Taxes",
          ].includes(x.tag)
        )
        .map((x) => x.values),
    ]),
  }),
  End: (dataLong: DataLong[]) => ({
    name: "End",
    values: sumColumns(
      dataLong.filter((x) => x.tag === "Assets EOP").map((x) => x.values)
    ),
  }),
  // TODO: need to work out why some arrays start with 0 and some dont
  "Unaccounted For": (dataLong: DataLong[]) => ({
    name: "Unaccounted For",
    values: sumColumns([
      balanceReconFormulas["Start"](dataLong).values,
      balanceReconFormulas["Change"](dataLong).values,
      balanceReconFormulas["End"](dataLong).values.map((value) => -value),
    ]),
  }),
  // "Total Unaccounted For": (dataLong: DataLong[]) => ({
  //   name: "Total Unaccounted For",
  //   values: sumColumns([])
  // })
};

const RollForward: React.FC = () => {
  const [rollForwardData, setRollForwardData] = useState<
    {
      name: RollForwardItem;
      values: number[];
    }[]
  >();

  const { dataLong } = useDataLong();

  // if data long, create roll forward summary data
  useEffect(() => {
    const createRollForwardSummaryData = (dataLong: DataLong[]) => {
      // console.log("dataLong:", dataLong);
      const dataRows = Array.from(rollForwardTargetNames)
        .filter((item) => rollForwardFormulas[item])
        .map((item) => rollForwardFormulas[item](dataLong));

      return dataRows;
    };

    const createBalanceReconiliationData = (dataLong: DataLong[]) => {
      const dataRows = Array.from(balanceReconciliationTargetNames)
        .filter((item) => balanceReconFormulas[item])
        .map((item) => balanceReconFormulas[item](dataLong));
      return dataRows;
    };

    if (dataLong) {
      const summaryData = createRollForwardSummaryData(dataLong);
      setRollForwardData(summaryData);
      // console.log(summaryData);

      const balanceData = createBalanceReconiliationData(dataLong);
      console.log(balanceData);
    }
  }, [dataLong]);

  const columns = useMemo(() => {
    if (!rollForwardData || rollForwardData.length === 0) return [];

    const numberOfColumns = rollForwardData[0].values.length;
    const dynamicColumns = Array.from({ length: numberOfColumns }, (_, i) => ({
      accessorKey: `${i + 1}`, // This is where we are skipping one
      header: `${i + 1}`,
      cell: (x: CellContext<any, number>) => (
        <td className="w-[115px] flex justify-between">
          <span>$</span>
          <span>
            {x.getValue() === 0
              ? "-"
              : Math.round(x.getValue()) === 0
              ? 0
              : x.getValue() < 0
              ? `(${Math.abs(Math.round(x.getValue())).toLocaleString()})`
              : Math.round(x.getValue()).toLocaleString()}
          </span>
        </td>
      ),
    }));

    return [
      {
        accessorKey: "month",
        header: "Months",
        cell: (x: CellContext<any, string | number>) => (
          <p className="w-[265px] text-left">{x.getValue()}</p>
        ),
      },
      ...dynamicColumns,
    ];
  }, [rollForwardData]);

  const transformedData = useMemo(() => {
    return rollForwardData?.map((item) => {
      const row: Record<string, number | string> = { month: item.name };
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

  const totalUnaccountedFor = (dataLong: DataLong[]) => {
    const unAccountedForValues = balanceReconFormulas["Unaccounted For"](
      dataLong
    ).values.slice(1, 240);
    console.log(sum(unAccountedForValues));
  };

  // totalUnaccountedFor(dataLong);

  const isHighlighted = (columnId: string): boolean => {
    return [
      "Assets BOP",
      "MTM Total Gain Loss",
      "Equity Returns",
      "Total to Reinvest/Sell",
      "Assets Post Reinvestment",
      "Assets Post Rebalance",
      "Assets EOP",
    ].includes(columnId)
      ? true
      : false;
  };

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col w-full overflow-x-auto overflow-y-auto">
        <div>
          <h3 className="text-xl font-semibold">Rollforward Summary</h3>
        </div>

        <table className="mt-4 min-w-full border border-dark-600 border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="divide-x divide-dark-600">
                {headerGroup.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={cn(
                      "bg-dark-800 sticky top-0 px-4 py-2 text-right text-sm font-medium text-gray-300",
                      i === 0 && "text-left"
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="">
            {table.getRowModel().rows.map((row, i) => {
              return (
                <tr
                  key={row.id}
                  className={cn(
                    isHighlighted(row.renderValue("month"))
                      ? "border-y border-white divide-x divide-dark-600"
                      : "divide-x divide-dark-600"
                  )}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-2 whitespace-nowrap bg-dark-700 text-right text-sm text-gray-100",
                        !isHighlighted(row.renderValue("month")) && i === 0 ? "pl-8" : ""
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RollForward;
