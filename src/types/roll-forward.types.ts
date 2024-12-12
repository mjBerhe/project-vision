export type DebugItem =
  | "MarketValue_MTM_0_NoChange"
  | "MarketValue_MTM_1_Credit"
  | "MarketValue_MTM_2_Time"
  | "MarketValue_MTM_3_MoveAlongCurve"
  | "MarketValue_MTM_4_MaturityAmort"
  | "mv_mtm_gain_loss"
  | "MVafterMTM"
  | "EquityPositionPreReturn"
  | "equity_MTM_due_return"
  | "MVpostEquityGain"
  | "LiabilityCF_combined"
  | "swapcashflow"
  | "public_maturity_pmt"
  | "private_maturity_pmt"
  | "cml_maturity_pmt"
  | "clo_maturity_pmt"
  | "cmbs_maturity_pmt"
  | "publicclo_maturity_pmt"
  | "equity_maturity_pmt"
  | "public_interest_pmt"
  | "private_interest_pmt"
  | "cml_interest_pmt"
  | "cmbs_interest_pmt"
  | "publicclo_interest_pmt"
  | "clo_interest_pmt"
  | "equity_interest_pmt"
  | "public_mort_pmt"
  | "private_mort_pmt"
  | "cml_mort_pmt"
  | "clo_mort_pmt"
  | "cmbs_mort_pmt"
  | "publicclo_mort_pmt"
  | "equity_mort_pmt"
  | "total_default_expense"
  | "total_investment_expense"
  | "other_investmentexpense"
  | "otherexpense"
  | "loc_cost"
  | "investableEquityLimitSales"
  | "Sell_Reinvest"
  | "Normal_Activity_Class_Buy_Public"
  | "Normal_Activity_Class_Buy_Private"
  | "Normal_Activity_Class_Buy_CML"
  | "Normal_Activity_Class_Buy_CLO"
  | "Normal_Activity_Class_Buy_PublicCLO"
  | "Normal_Activity_Class_Buy_CMBS"
  | "Normal_Activity_Class_Buy_Equity"
  | "Normal_Activity_Class_Sell_Public"
  | "Normal_Activity_Class_Sell_Private"
  | "Normal_Activity_Class_Sell_CML"
  | "Normal_Activity_Class_Sell_CLO"
  | "Normal_Activity_Class_Sell_PublicCLO"
  | "Normal_Activity_Class_Sell_CMBS"
  | "Normal_Activity_Class_Sell_Equity"
  | "transaction_cost_reinvest_sell"
  | "transaction_cost_reinvest_buy"
  | "MVafterReinvestSell_new"
  | "Rebalancing_Activity_Class_Buy_Public"
  | "Rebalancing_Activity_Class_Buy_Private"
  | "Rebalancing_Activity_Class_Buy_CML"
  | "Rebalancing_Activity_Class_Buy_CLO"
  | "Rebalancing_Activity_Class_Buy_PublicClo"
  | "Rebalancing_Activity_Class_Buy_CMBS"
  | "Rebalancing_Activity_Class_Buy_Equity"
  | "Rebalancing_Activity_Class_Sell_Public"
  | "Rebalancing_Activity_Class_Sell_Private"
  | "Rebalancing_Activity_Class_Sell_CML"
  | "Rebalancing_Activity_Class_Sell_CLO"
  | "Rebalancing_Activity_Class_Sell_PublicClo"
  | "Rebalancing_Activity_Class_Sell_CMBS"
  | "Rebalancing_Activity_Class_Sell_Equity"
  | "transaction_cost_rebalance_sell"
  | "transaction_cost_rebalance_buy"
  | "MVafterRebalance"
  | "BSCR_CAL"
  | "BVbeforeDividend"
  | "surplus"
  | "targetBSCRlevel"
  | "fm_us_stat"
  | "BSCR_RiskMargin"
  | "tax"
  | "Dividends_neg"
  | "Dividends"
  | "mv_mtm_pre_period"
  | "BVEndOfPeriod"
  | "npv_bel_asset_run_noequity";

export type Tag =
  | "Assets BOP"
  | "MV Post Credit Spread Change"
  | "MV Passage of Time"
  | "MV Advancing on the Curve"
  | "MV Temp Loss from Maturity and Amort"
  | "MTM Total Gain Loss"
  | "Assets Post MTM"
  | "Equity Position Pre Return"
  | "Equity Returns"
  | "Assets Post Equity Return"
  | "Liability Cash Flow"
  | "Swap Cash Flow"
  | "Maturities"
  | "Coupon Payments"
  | "Amortization"
  | "Defaults"
  | "Investment Expense"
  | "Fixed Overhead"
  | "AUM Expense"
  | "LOC Cost"
  | "Forced Sales"
  | "Total to Reinvest/Sell"
  | "Normal Purchases"
  | "Normal Sales"
  | "Reinvest/Sell Transaction Costs"
  | "Assets Post Reinvestment"
  | "Rebalancing Purchases"
  | "Rebalancing Sales"
  | "Rebalancing Transaction Costs"
  | "Assets Post Rebalance"
  | "BSCR"
  | "BV Before Dividend"
  | "Surplus BOP"
  | "Surplus EOP Post Dividend"
  | "BSCR Target"
  | "US Stat"
  | "Risk Margin"
  | "Taxes"
  | "Dividends"
  | "Assets EOP"
  | "BV EOP"
  | "BEL No Equity";

export type RollForwardItem =
  | "Assets BOP"
  | "MTM Gain Loss from Credit Grading"
  | "MTM Gain Loss from Passage of Time"
  | "MTM Gain Loss from Interest Rates"
  | "MTM Temp Drop from Maturity and Amort"
  | "MTM Total Gain Loss"
  | "Equity Returns"
  | "Swap Cash Flow"
  | "Maturities"
  | "Coupon Payments"
  | "Amortization"
  | "Defaults"
  | "Investment Expense"
  | "Fixed Overhead"
  | "AUM Expense"
  | "Liability Cash Flow"
  | "Forced Sales"
  | "Total to Reinvest/Sell"
  | "Normal Purchases"
  | "Normal Sales"
  | "Reinvest/Sell Transaction Costs"
  | "Assets Post Reinvestment"
  | "Rebalancing Purchases"
  | "Rebalancing Sales"
  | "Rebalancing Transaction Costs"
  | "Assets Post Rebalance"
  | "Dividends"
  | "Taxes"
  | "Assets EOP";