export type ConfigJson = {
  dbl_other_expense: number; // AUM
  dblMainExpense: number; // Fixed Expense
  dblInflationRate: number; // Inflation
  AlternativeReturn: number[]; // equity gain
  dblTaxRate: number; // tax rate
  dbl_transactioncostAsk: number; // transaction cost ask
  dbl_transactioncostBid: number; // transaction cost bid
  rebalance_time_schedual: number[]; // rebalance max month
  irebalancefreq: number; // rebalance frequency (12 = Annual)
  dblMaxEquityExposure: number; // max equity position
  dblBeginningAssetsVM21: number; // starting assets
};
