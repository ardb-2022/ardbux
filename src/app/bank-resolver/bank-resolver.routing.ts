import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance/finance.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { BankConfigComponent } from '../bank-config/bank-config.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { BankWiseConfigComponent } from '../bank-wise-config/bank-wise-config.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { TestComponent } from '../bank-resolver/test/test.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { MemberListComponent } from './UCIC/Report/member-list/member-list.component';
import { OpenLoanAccountComponent } from './loan/transaction/open-loan-account/open-loan-account.component';
import { AuthenticationService as AuthGuard } from '../_service/authentication.service';
import { LoanTransactionApprovalComponent } from './loan/transaction/loan-transaction-approval/loan-transaction-approval.component';
import { LoanaccountTransactionComponent } from './loan/transaction/loanaccount-transaction/loanaccount-transaction.component';
import { LoanAccwiseinttcalcComponent } from './loan/transaction/loan-accwiseinttcalc/loan-accwiseinttcalc.component';
import { LienAccLockUnlockComponent } from './deposit/acc-lock-unlock/lien-acc-lock-unlock/lien-acc-lock-unlock.component';
import { NetworthStatementComponent } from './UCIC/Report/networth-statement/networth-statement.component';
import { SubCashBookComponent } from './deposit/report/sub-cash-book/sub-cash-book.component';
import { AccStmtRDComponent } from './deposit/report/acc-stmt-rd/acc-stmt-rd.component';
import { AccStmtSBCAComponent } from './deposit/report/acc-stmt-sbca/acc-stmt-sbca.component';
import { AccStmtTDComponent } from './deposit/report/acc-stmt-td/acc-stmt-td.component';
import { DetailListFDMISComponent } from './deposit/report/detail-list-fdmis/detail-list-fdmis.component';
import { DetailListRDComponent } from './deposit/report/detail-list-rd/detail-list-rd.component';
import { DetailListSBCAComponent } from './deposit/report/detail-list-sbca/detail-list-sbca.component';
import { NearMaturityReportComponent } from './deposit/report/near-maturity-report/near-maturity-report.component';
import { OpenClosingRegisterComponent } from './deposit/report/open-closing-register/open-closing-register.component';
import { LoanStatementComponent } from './loan/report/loan-statement/loan-statement.component';
import { DetailListComponent } from './loan/report/detail-list/detail-list.component';
import { LoanDisbursementRegisterComponent } from './loan/report/loan-disbursement-register/loan-disbursement-register.component';
import { RecoveryRegisterComponent } from './loan/report/recovery-register/recovery-register.component';
import { LoanSubCashBookComponent } from './loan/report/loan-sub-cash-book/loan-sub-cash-book.component';
import { AccOpeningViewComponent } from './deposit/acc-opening-view/acc-opening-view.component';
import { SystemParameterUpdateComponent } from './system/systemparameter/system-parameter-update/system-parameter-update.component';
import { NeftOutwardComponent } from './deposit/neft-outward/neft-outward.component';
import { NeftInwardReportComponent } from './deposit/report/neft-inward-report/neft-inward-report.component';
import { NeftOutwardReportComponent } from './deposit/report/neft-outward-report/neft-outward-report.component';
import { PassBookPrintingComponent } from './deposit/report/pass-book-printing/pass-book-printing.component';
import { TransTransactionComponent } from './transfer/trans-transaction/trans-transaction.component';
import { TransApproveComponent } from './transfer/trans-approve/trans-approve.component';
import { BakdatevoucherComponent } from './finance/bakdatevoucher/bakdatevoucher.component';
import { KccmemberdtlsComponent } from './loan/masters/kccmemberdtls/kccmemberdtls.component';
import { YearopenComponent } from './system/yearopen/yearopen.component';
import { YearcloseComponent } from './system/yearclose/yearclose.component';
import { BalanaceSheetComponent } from './finance/report/balanace-sheet/balanace-sheet.component';
import { ProfitLossAccComponent } from './finance/report/profit-loss-acc/profit-loss-acc.component';
import { TradingAccComponent } from './finance/report/trading-acc/trading-acc.component';
import { MasterMenuConfigComponent } from '../master-menu-config/master-menu-config.component';
import { ConfigNewBankComponent } from '../config-new-bank/config-new-bank.component';
import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { SubsidyEntryComponent } from './loan/transaction/subsidy-entry/subsidy-entry.component';
import { OnetimesettlementComponent } from './loan/transaction/onetimesettlement/onetimesettlement.component';
import { DdsExportComponent } from './deposit/ddsExportImport/dds-export/dds-export.component';
import { DdsImportComponent } from './deposit/ddsExportImport/dds-import/dds-import.component';
import { DdsIndividualPostingComponent } from './deposit/ddsExportImport/dds-individual-posting/dds-individual-posting.component';
// import { WINDOW_PROVIDERS } from './window.providers';
import { DefaulterListComponent } from './loan/report/defaulter-list/defaulter-list.component';
import { DemandListComponent } from './loan/report/demand-list/demand-list.component';
import { RecovListComponent } from './loan/report/recov-list/recov-list.component';
import { ActwiseLstComponent } from './loan/report/demand-list/actwise-lst/actwise-lst.component';
import { BlockwiseLstComponent } from './loan/report/demand-list/blockwise-lst/blockwise-lst.component';
import { ActWiseColLstComponent } from './loan/report/recov-list/act-wise-col-lst/act-wise-col-lst.component';
import { BlockWiseColLstComponent } from './loan/report/recov-list/block-wise-col-lst/block-wise-col-lst.component';
import { AdRecStmtComponent } from './loan/report/ad-rec-stmt/ad-rec-stmt.component';
import { IntRecStmtComponent } from './loan/report/int-rec-stmt/int-rec-stmt.component';
import { LoanDisburseNormalComponent } from './loan/report/loan-disbursement-register/loan-disburse-normal/loan-disburse-normal.component';
import { RecovNormalComponent } from './loan/report/recovery-register/recov-normal/recov-normal.component';
import { OpenCloseregComponent } from './loan/report/open-closereg/open-closereg.component';
import { DetailDDSComponent } from './deposit/report/detail-dds/detail-dds.component';
import { DdsAccStmtComponent } from './deposit/report/dds-acc-stmt/dds-acc-stmt.component';
import { NpaComponent } from './loan/report/npa/npa.component';
import { YearlyadjustmentvoucherComponent } from './finance/yearlyadjustmentvoucher/yearlyadjustmentvoucher.component';
import { BlockMasterComponent } from './loan/masters/block-master/block-master.component';
import { VillageMasterComponent } from './loan/masters/village-master/village-master.component';
import { ServiceareamasterComponent } from './loan/masters/serviceareamaster/serviceareamaster.component';
import { UserLoginStatusComponent } from './system/user-login-status/user-login-status.component';
import { DemandNoticeComponent } from './loan/report/demand-notice/demand-notice.component';
import { OverdueNoticeComponent } from './loan/report/overdue-notice/overdue-notice.component';
import { OverdueTransferComponent } from './loan/report/overdue-transfer/overdue-transfer.component';
import { RecovFundComponent } from './loan/report/recovery-register/recov-fund/recov-fund.component';
import { ConsolidatedDayBookComponent } from './finance/report/consolidated-day-book/consolidated-day-book.component';
import { ConsolidatedCashAccComponent } from './finance/report/consolidated-cash-acc/consolidated-cash-acc.component';
import { ConsolidatedCashCumTrialComponent } from './finance/report/consolidated-cash-cum-trial/consolidated-cash-cum-trial.component';
import { ConsolidatedTrialBalanceComponent } from './finance/report/consolidated-trial-balance/consolidated-trial-balance.component';
import { StandingInsActiveSIListComponent } from './deposit/report/standing-ins-active-silist/standing-ins-active-silist.component';
import { StandingInsTodaySIExecutedComponent } from './deposit/report/standing-ins-today-siexecuted/standing-ins-today-siexecuted.component';
import { WeeklyReturnComponent } from './finance/report/weekly-return/weekly-return.component';
import { RecovInterestComponent } from './loan/report/recovery-register/recov-interest/recov-interest.component';
import { BankEntryComponent } from './investment/master/bank-entry/bank-entry/bank-entry.component';
import { BranchEntryComponent } from './investment/master/branc-entry/branch-entry/branch-entry.component';
import { OpenInvestComponent } from './investment/transaction/open-invest/open-invest.component';
import { VewInvestmentDtlsComponent } from './investment/transaction/vew-investment-dtls/vew-investment-dtls.component';
import { InvTransactionApprovalComponent } from './investment/transaction/inv-transaction-approval/inv-transaction-approval.component';
import { InvestmentTransactionsComponent } from './investment/transaction/investment-transactions/investment-transactions.component';
import { CreateGLHeadComponent } from './finance/create-glhead/create-glhead.component';
import { DetailListFdmisConstWiseComponent } from './deposit/report/detail-list-fdmis-const-wise/detail-list-fdmis-const-wise.component';
import { IDetailListComponent } from './investment/report/detail-list/detail-list.component';
import { INearMaturityComponent } from './investment/report/near-maturity/near-maturity.component';
import { AllGLDetailsComponent } from './finance/report/all-gldetails/all-gldetails.component';
import { UpdatePassbookComponent } from './deposit/report/update-passbook/update-passbook.component';
import { BMLoanStatementComponent } from './loan/report/bmloan-statement/bmloan-statement.component';
import { SlabwiseDepositComponent } from './deposit/report/slabwise-deposit/slabwise-deposit.component';
import { PassBookFastPageComponent } from './deposit/report/pass-book-printing/pass-book-fast-page/pass-book-fast-page.component';
import { DetaillistAllComponent } from './loan/report/detaillist-all/detaillist-all.component';
import { SavingIntPostComponent } from './deposit/saving-int-post/saving-int-post.component';
import { AgentCommissionComponent } from './deposit/agent-commission/agent-commission.component';
import { LoanPassBookFastPageComponent } from './loan/report/pass-book-printing/pass-book-fast-page/pass-book-fast-page.component';
import { LoanPassBookPrintingComponent } from './loan/report/pass-book-printing/pass-book-printing.component';
import { LoanUpdatePassbookComponent } from './loan/report/update-passbook/update-passbook.component';
import { PrintCertificateComponent } from './deposit/report/print-certificate/print-certificate.component';
import { NpaALLComponent } from './loan/report/npa-all/npa-all.component';
import { RecovBlockComponent } from './loan/report/recovery-register/recov-block/recov-block.component';
import { InterestCertificateComponent } from './deposit/report/interest-certificate/interest-certificate.component';
import { SmsChargeDeductionComponent } from './deposit/sms-charge-deduction/sms-charge-deduction.component';
const routes: Routes = [
  { path: 'Admin', component: AdminPanelComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'AdmLogin', component: AdminLoginComponent },
  { path: 'Loan', component: OpenLoanAccountComponent },
  { path: 'te-st3', component: TransTransactionComponent },
  { path: 'te-st1', component: TransactionapprovalComponent },
  { path: 'te-st2', component: AccounTransactionsComponent },
  { path: 'te-st4', component: LoanTransactionApprovalComponent },
  { path: 'te-st5', component: LoanaccountTransactionComponent },
  { path: 'te-st', component: UTCustomerProfileComponent },
  { path: 't6', component: AccOpeningComponent },
  { path: 't7', component: AccOpeningViewComponent },
  { path: 't8', component: SystemParameterUpdateComponent },
  { path: 'BankConfig', component: BankConfigComponent },
  { path: 'BankWiseConfig', component: BankWiseConfigComponent },
  { path: 'MasterMenuConfig', component: MasterMenuConfigComponent },
  { path: 'ConfigNewBank', component: ConfigNewBankComponent },
  { path: 'test', component: TestComponent },

  {
    path: ':bankName', component: BankResolverComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'la', component: LandingComponent, canActivate: [AuthGuard] },
      { path: 'UT_CustomerProfile', component: UTCustomerProfileComponent, canActivate: [AuthGuard] },
      { path: 'UT_SelfHelp', component: UTSelfHelpComponent, canActivate: [AuthGuard] },
      { path: 'UR_MemberList', component: MemberListComponent, canActivate: [AuthGuard] },
      { path: 'FT_Voucher', component: VoucherComponent, canActivate: [AuthGuard] },
      { path: 'FT_ApproveTrns', component: VoucherapprovalComponent, canActivate: [AuthGuard] },
      { path: 'FT_PrintVoucher', component: VoucherprintComponent, canActivate: [AuthGuard] },
      { path: 'FT_YearlyVoucher', component:YearlyadjustmentvoucherComponent, canActivate: [AuthGuard] },
      { path: 'FT_BackdateVoucher', component: BakdatevoucherComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayBook', component: DailybookComponent, canActivate: [AuthGuard] },
      { path: 'FT_CreateGlHead', component: CreateGLHeadComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashAccount', component: CashaccountComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdDayBook', component: ConsolidatedDayBookComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdCashAccount', component: ConsolidatedCashAccComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdTrialBalance', component: ConsolidatedTrialBalanceComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdCashCumTrial', component: ConsolidatedCashCumTrialComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashCumTrial', component: CashcumtrialComponent, canActivate: [AuthGuard] },
      { path: 'FR_TrialBalance', component: TrialbalanceComponent, canActivate: [AuthGuard] },
      { path: 'FR_GeneralLadger', component: GenLedgerComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayScrollBook', component: ScrollbookComponent, canActivate: [AuthGuard] },
      { path: 'FR_allGLHead', component: AllGLDetailsComponent, canActivate: [AuthGuard] },

      
      { path: 'FR_GLTD', component: GenLedger2Component, canActivate: [AuthGuard] },
      { path: 'DT_ApproveTran', component: TransactionapprovalComponent, canActivate: [AuthGuard] },
      { path: 'DT_AccTrans', component: AccounTransactionsComponent, canActivate: [AuthGuard] },
      { path: 'DT_OpenAcc', component: AccOpeningComponent, canActivate: [AuthGuard] },
      { path: 'DA_DayInit', component: DayinitializationComponent, canActivate: [AuthGuard] },
      { path: 'DA_DayCmpl', component: DaycomplitionComponent, canActivate: [AuthGuard] },
      { path: 'UM_AddUsr', component: AdduserComponent, canActivate: [AuthGuard] },
      { path: 'UM_UpLogStatus', component: UserLoginStatusComponent, canActivate: [AuthGuard] },

      { path: 'LT_OpenLoanAcc', component: OpenLoanAccountComponent, canActivate: [AuthGuard] },
      { path: 'LT_LoanTrans', component: LoanaccountTransactionComponent, canActivate: [AuthGuard] },
      { path: 'LT_CalcIntt', component: LoanAccwiseinttcalcComponent, canActivate: [AuthGuard] },
      { path: 'LT_Subsidy', component: SubsidyEntryComponent, canActivate: [AuthGuard] },
      { path: 'LT_OTS', component: OnetimesettlementComponent, canActivate: [AuthGuard] },
      { path: 'LT_LoanAprv', component: LoanTransactionApprovalComponent, canActivate: [AuthGuard] },
      { path: 'LM_Kccmember', component: KccmemberdtlsComponent, canActivate: [AuthGuard] },
      { path: 'DT_AccLockUnlock', component: LienAccLockUnlockComponent, canActivate: [AuthGuard] },
      { path: 'UR_Networth', component: NetworthStatementComponent, canActivate: [AuthGuard] },
      { path: 'DR_SubCashBook', component: SubCashBookComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLS', component: DetailListSBCAComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLR', component: DetailListRDComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLF', component: DetailListFDMISComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLF_CONST', component: DetailListFdmisConstWiseComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASS', component: AccStmtSBCAComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASR', component: AccStmtRDComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASF', component: AccStmtTDComponent, canActivate: [AuthGuard] },
      { path: 'DR_NearMatReport', component: NearMaturityReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_OpenCloseReg', component: OpenClosingRegisterComponent, canActivate: [AuthGuard] },
      { path: 'DR_ACCSTMTDDS', component: DdsAccStmtComponent, canActivate: [AuthGuard] },
      { path: 'LR_BMLoanStmt', component: BMLoanStatementComponent, canActivate: [AuthGuard] },
      { path: 'LR_LoanStmt', component: LoanStatementComponent, canActivate: [AuthGuard] },
      { path: 'LR_DtlLst', component: DetailListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DlistAll', component: DetaillistAllComponent, canActivate: [AuthGuard] },
      { path: 'LR_DflLst', component: DefaulterListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DMLst', component: DemandListComponent, canActivate: [AuthGuard] },
      { path: 'LR_AMLst', component: ActwiseLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_BMLst', component: BlockwiseLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_RELst', component: RecovListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisReg', component: LoanDisbursementRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisNorm', component: LoanDisburseNormalComponent, canActivate: [AuthGuard] },
      { path: 'LR_AWISECol', component: ActWiseColLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_BWISECol', component: BlockWiseColLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_AdvRec', component: AdRecStmtComponent, canActivate: [AuthGuard] },
      { path: 'LR_intRec', component: IntRecStmtComponent, canActivate: [AuthGuard] },
      { path: 'LM_Blkentry', component: BlockMasterComponent, canActivate: [AuthGuard] },
      { path: 'Service_Area', component: ServiceareamasterComponent, canActivate: [AuthGuard] },
      { path: 'LM_Villentry', component: VillageMasterComponent, canActivate: [AuthGuard] },
      { path: 'LR_NPA', component: NpaComponent, canActivate: [AuthGuard] },
      { path: 'LR_NPA_ALL', component: NpaALLComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecReg', component: RecoveryRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegFund', component: RecovFundComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegBlock', component: RecovBlockComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegNorm', component: RecovNormalComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecInterest', component: RecovInterestComponent, canActivate: [AuthGuard] },
      { path: 'LR_openClose', component: OpenCloseregComponent, canActivate: [AuthGuard] },
      { path: 'LR_SubCashBk', component: LoanSubCashBookComponent, canActivate: [AuthGuard] },
      { path: 'DT_OpenAccView', component: AccOpeningViewComponent, canActivate: [AuthGuard] },
      { path: 'DT_NEFTPayment', component: NeftOutwardComponent, canActivate: [AuthGuard] },
      { path: 'DT_DDEXPORT', component: DdsExportComponent, canActivate: [AuthGuard] },
      { path: 'DT_DDIMPORT', component: DdsImportComponent, canActivate: [AuthGuard] },
      { path: 'DT_DDINDPOST', component: DdsIndividualPostingComponent, canActivate: [AuthGuard] },
      { path: 'DT_SavingInttPost', component: SavingIntPostComponent, canActivate: [AuthGuard] },
      { path: 'DT_SMSchargeDed', component: SmsChargeDeductionComponent, canActivate: [AuthGuard] },
      { path: 'DT_AgentComPost', component: AgentCommissionComponent, canActivate: [AuthGuard] },
      { path: 'DR_NeftIn', component: NeftInwardReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_NeftOut', component: NeftOutwardReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_PCertificate', component: PrintCertificateComponent, canActivate: [AuthGuard] },
      { path: 'DR_InttCertificate', component: InterestCertificateComponent, canActivate: [AuthGuard] },
      { path: 'DR_PbkPrn', component: PassBookPrintingComponent,
      children: [
      { path: 'DR_PassBookFastPage', component: PassBookFastPageComponent},
        ], canActivate: [AuthGuard] },
      { path: 'DR_UpbkPrnSts', component: UpdatePassbookComponent, canActivate: [AuthGuard]},


      { path: 'DR_LoanPbkPrn', component: LoanPassBookPrintingComponent,
      children: [
      { path: 'DR_LoanPassBookFastPage', component: LoanPassBookFastPageComponent},], canActivate: [AuthGuard] },

      { path: 'DR_LoanUpbkPrnSts', component: LoanUpdatePassbookComponent, canActivate: [AuthGuard]},

      { path: 'DR_Act_SI_List', component: StandingInsActiveSIListComponent, canActivate: [AuthGuard] },
      { path: 'DR_Today_SI_Exec', component: StandingInsTodaySIExecutedComponent, canActivate: [AuthGuard] },
      { path: 'DR_DDS', component: DetailDDSComponent, canActivate: [AuthGuard] },
      { path: 'DR_SlbWisDeposit', component: SlabwiseDepositComponent, canActivate: [AuthGuard] },
      { path: 'SP_Update', component: SystemParameterUpdateComponent, canActivate: [AuthGuard] },
      { path: 'DA_YearOpn', component: YearopenComponent, canActivate: [AuthGuard] },
      { path: 'DA_YearCls', component: YearcloseComponent, canActivate: [AuthGuard] },
      { path: 'TT_TransEntry', component: TransTransactionComponent, canActivate: [AuthGuard] },
      { path: 'TT_TransApprove', component: TransApproveComponent, canActivate: [AuthGuard] },
      { path: 'FR_BalanceSheet', component: BalanaceSheetComponent, canActivate: [AuthGuard] },
      { path: 'LR_DemandNotice', component: DemandNoticeComponent, canActivate: [AuthGuard] },
      { path: 'LR_OverdueNotice', component: OverdueNoticeComponent, canActivate: [AuthGuard] },
      { path: 'LR_OverdueTransfer', component: OverdueTransferComponent, canActivate: [AuthGuard] },
      { path: 'FR_ProfitLoss', component: ProfitLossAccComponent, canActivate: [AuthGuard] },
      { path: 'FR_Trading', component: TradingAccComponent, canActivate: [AuthGuard] },
      { path: 'FR_WeeklyReturn', component: WeeklyReturnComponent, canActivate: [AuthGuard] },
      { path: 'I_BankEntry', component: BankEntryComponent, canActivate: [AuthGuard] },
      { path: 'I_BranchEntry', component: BranchEntryComponent, canActivate: [AuthGuard] },
      { path: 'I_Open', component: OpenInvestComponent, canActivate: [AuthGuard] },
      { path: 'I_ViewDtls', component: VewInvestmentDtlsComponent, canActivate: [AuthGuard] },
      { path: 'I_TrnsApprov', component: InvTransactionApprovalComponent, canActivate: [AuthGuard] },
      { path: 'I_Trns', component: InvestmentTransactionsComponent, canActivate: [AuthGuard] },
      { path: 'IR_Detail_list', component: IDetailListComponent, canActivate: [AuthGuard] },
      { path: 'IR_Near_maturity', component: INearMaturityComponent, canActivate: [AuthGuard] },
      
      {
        path: 'finance', component: FinanceComponent,
        children: [
          { path: 'voucher', component: VoucherComponent },
          // { path: 'voucherNew', component: VoucherNewComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  // providers:[WINDOW_PROVIDERS]
})

export class BankResolverRouting { }
