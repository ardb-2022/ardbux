import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialogModule} from '@angular/material/dialog';
import { BankResolverRouting } from './bank-resolver.routing';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
// import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';
import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { LoadingComponent } from './loading';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { CustomerInfoComponent } from './Common/customer-info/customer-info.component';
import { TestComponent } from './test/test.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AccountDetailsComponent } from './Common/account-details/account-details.component';
import { TransactionDetailsComponent } from './Common/transaction-details/transaction-details.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { DwRdInstlViewComponent } from './Common/dw-rd-instl-view/dw-rd-instl-view.component';
import { DwTdInttDtlsViewComponent } from './Common/dw-td-intt-dtls-view/dw-td-intt-dtls-view.component';
import { DwRenewalViewComponent } from './Common/dw-renewal-view/dw-renewal-view.component';
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { AccountDetailsForAcctTransComponent } from './Common/account-details-for-acct-trans/account-details-for-acct-trans.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
// import {MatFormFieldModule} from '@angular/material/form-field';
import { KycComponent } from './Common/kyc/kyc.component';
import { MemberListComponent } from './UCIC/Report/member-list/member-list.component';
import { OpenLoanAccountComponent } from './loan/transaction/open-loan-account/open-loan-account.component';
import { LoanaccountTransactionComponent} from './loan/transaction/loanaccount-transaction/loanaccount-transaction.component';
import { LoanTransactionApprovalComponent } from './loan/transaction/loan-transaction-approval/loan-transaction-approval.component';
import { LoanTransactionDetailsComponent } from './Common/loan-transaction-details/loan-transaction-details.component';
import { LoanAccwiseinttcalcComponent } from './loan/transaction/loan-accwiseinttcalc/loan-accwiseinttcalc.component';
import { INRCurrencyPipe } from '../_utility/filter';
import { CurrencyPipe } from '@angular/common';
import { LienAccLockUnlockComponent } from './deposit/acc-lock-unlock/lien-acc-lock-unlock/lien-acc-lock-unlock.component';
import { NetworthStatementComponent } from './UCIC/Report/networth-statement/networth-statement.component';
import { SubCashBookComponent } from './deposit/report/sub-cash-book/sub-cash-book.component';
import { DetailListSBCAComponent } from './deposit/report/detail-list-sbca/detail-list-sbca.component';
import { DetailListRDComponent } from './deposit/report/detail-list-rd/detail-list-rd.component';
import { DetailListFDMISComponent } from './deposit/report/detail-list-fdmis/detail-list-fdmis.component';
import { AccStmtSBCAComponent } from './deposit/report/acc-stmt-sbca/acc-stmt-sbca.component';
import { AccStmtRDComponent } from './deposit/report/acc-stmt-rd/acc-stmt-rd.component';
import { AccStmtTDComponent } from './deposit/report/acc-stmt-td/acc-stmt-td.component';
import { NearMaturityReportComponent } from './deposit/report/near-maturity-report/near-maturity-report.component';
import { OpenClosingRegisterComponent } from './deposit/report/open-closing-register/open-closing-register.component';
import { LoanStatementComponent } from './loan/report/loan-statement/loan-statement.component';
import { DetailListComponent } from './loan/report/detail-list/detail-list.component';
import { LoanDisbursementRegisterComponent } from './loan/report/loan-disbursement-register/loan-disbursement-register.component';
import { RecoveryRegisterComponent } from './loan/report/recovery-register/recovery-register.component';
import { LoanSubCashBookComponent } from './loan/report/loan-sub-cash-book/loan-sub-cash-book.component';
import { AccOpeningViewComponent } from './deposit/acc-opening-view/acc-opening-view.component';
import { NeftOutwardComponent } from './deposit/neft-outward/neft-outward.component';
import { NeftInwardReportComponent } from './deposit/report/neft-inward-report/neft-inward-report.component';
import { NeftOutwardReportComponent } from './deposit/report/neft-outward-report/neft-outward-report.component';
import { PassBookPrintingComponent } from './deposit/report/pass-book-printing/pass-book-printing.component';
import { TransTransactionComponent } from './transfer/trans-transaction/trans-transaction.component';
import { TransApproveComponent } from './transfer/trans-approve/trans-approve.component';
import { SystemParameterUpdateComponent } from './system/systemparameter/system-parameter-update/system-parameter-update.component';
import { BakdatevoucherComponent } from './finance/bakdatevoucher/bakdatevoucher.component';
import { KccmemberdtlsComponent } from './loan/masters/kccmemberdtls/kccmemberdtls.component';
import { YearcloseComponent } from './system/yearclose/yearclose.component';
import { YearopenComponent } from './system/yearopen/yearopen.component';
import { BalanaceSheetComponent } from './finance/report/balanace-sheet/balanace-sheet.component';
import { ProfitLossAccComponent } from './finance/report/profit-loss-acc/profit-loss-acc.component';
import { TradingAccComponent } from './finance/report/trading-acc/trading-acc.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SubsidyEntryComponent } from './loan/transaction/subsidy-entry/subsidy-entry.component';
import { OnetimesettlementComponent } from './loan/transaction/onetimesettlement/onetimesettlement.component';
import { DdsImportComponent } from './deposit/ddsExportImport/dds-import/dds-import.component';
import { DdsExportComponent } from './deposit/ddsExportImport/dds-export/dds-export.component';
import { DdsIndividualPostingComponent } from './deposit/ddsExportImport/dds-individual-posting/dds-individual-posting.component';
import { NgxPrintModule} from 'ngx-print';
import { ExportAsModule } from 'ngx-export-as';
import { DefaulterListComponent } from './loan/report/defaulter-list/defaulter-list.component';
import { DemandListComponent } from './loan/report/demand-list/demand-list.component';
import { RecovListComponent } from './loan/report/recov-list/recov-list.component';
import { ActwiseLstComponent } from './loan/report/demand-list/actwise-lst/actwise-lst.component';
import { BlockwiseLstComponent } from './loan/report/demand-list/blockwise-lst/blockwise-lst.component';
import { BlockWiseColLstComponent } from './loan/report/recov-list/block-wise-col-lst/block-wise-col-lst.component';
import { ActWiseColLstComponent } from './loan/report/recov-list/act-wise-col-lst/act-wise-col-lst.component';
import { AdRecStmtComponent } from './loan/report/ad-rec-stmt/ad-rec-stmt.component';
import { IntRecStmtComponent } from './loan/report/int-rec-stmt/int-rec-stmt.component';
import { LoanDisburseNormalComponent } from './loan/report/loan-disbursement-register/loan-disburse-normal/loan-disburse-normal.component';
import { RecovNormalComponent } from './loan/report/recovery-register/recov-normal/recov-normal.component';
import { OpenCloseregComponent } from './loan/report/open-closereg/open-closereg.component';
import { DetailDDSComponent } from './deposit/report/detail-dds/detail-dds.component';
import { DdsAccStmtComponent } from './deposit/report/dds-acc-stmt/dds-acc-stmt.component';
import { NpaComponent } from './loan/report/npa/npa.component';
import { AmountToWordPipe } from '../amount-to-word.pipe';
import { YearlyadjustmentvoucherComponent } from './finance/yearlyadjustmentvoucher/yearlyadjustmentvoucher.component';
import { BlockMasterComponent } from './loan/masters/block-master/block-master.component';
import { VillageMasterComponent } from './loan/masters/village-master/village-master.component';
import { ServiceareamasterComponent } from './loan/masters/serviceareamaster/serviceareamaster.component';
// import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {A11yModule} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { UserLoginStatusComponent } from './system/user-login-status/user-login-status.component';
import { DemandNoticeComponent } from './loan/report/demand-notice/demand-notice.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import { OverdueNoticeComponent } from './loan/report/overdue-notice/overdue-notice.component';
import { OverdueTransferComponent } from './loan/report/overdue-transfer/overdue-transfer.component';
import { CommonServiceService } from './common-service.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import { RecovFundComponent } from './loan/report/recovery-register/recov-fund/recov-fund.component';
import { ConsolidatedCashAccComponent } from './finance/report/consolidated-cash-acc/consolidated-cash-acc.component';
import { ConsolidatedDayBookComponent } from './finance/report/consolidated-day-book/consolidated-day-book.component';
import { ConsolidatedCashCumTrialComponent } from './finance/report/consolidated-cash-cum-trial/consolidated-cash-cum-trial.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ConsolidatedTrialBalanceComponent } from './finance/report/consolidated-trial-balance/consolidated-trial-balance.component';
import { StandingInsActiveSIListComponent } from './deposit/report/standing-ins-active-silist/standing-ins-active-silist.component';
import { StandingInsTodaySIExecutedComponent } from './deposit/report/standing-ins-today-siexecuted/standing-ins-today-siexecuted.component';
import { WeeklyReturnComponent } from './finance/report/weekly-return/weekly-return.component';
import { RecovInterestComponent } from './loan/report/recovery-register/recov-interest/recov-interest.component';
import { BankEntryComponent } from 'src/app/bank-resolver/investment/master/bank-entry/bank-entry/bank-entry.component';
import { BranchEntryComponent } from './investment/master/branc-entry/branch-entry/branch-entry.component';
import { OpenInvestComponent } from './investment/transaction/open-invest/open-invest.component';
import { VewInvestmentDtlsComponent } from './investment/transaction/vew-investment-dtls/vew-investment-dtls.component';
import { InvTransactionApprovalComponent } from './investment/transaction/inv-transaction-approval/inv-transaction-approval.component';
import { InvestmentTransactionsComponent } from './investment/transaction/investment-transactions/investment-transactions.component';
import { FdTransComponent } from './investment/transaction/investment-transactions/fd-trans/fd-trans.component';
import { CcTransComponent } from './investment/transaction/investment-transactions/cc-trans/cc-trans.component';
import { MisTransComponent } from './investment/transaction/investment-transactions/mis-trans/mis-trans.component';
import { RdTransComponent } from './investment/transaction/investment-transactions/rd-trans/rd-trans.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { CreateGLHeadComponent } from './finance/create-glhead/create-glhead.component';
import { DetailListFdmisConstWiseComponent } from './deposit/report/detail-list-fdmis-const-wise/detail-list-fdmis-const-wise.component';
import { INearMaturityComponent } from './investment/report/near-maturity/near-maturity.component';
import { IDetailListComponent } from './investment/report/detail-list/detail-list.component';
import { AllGLDetailsComponent } from './finance/report/all-gldetails/all-gldetails.component';
import { UpdatePassbookComponent } from './deposit/report/update-passbook/update-passbook.component';
import { BMLoanStatementComponent } from './loan/report/bmloan-statement/bmloan-statement.component';
import { SlabwiseDepositComponent } from './deposit/report/slabwise-deposit/slabwise-deposit.component';
import { PassBookFastPageComponent } from './deposit/report/pass-book-printing/pass-book-fast-page/pass-book-fast-page.component';
import { DetaillistAllComponent } from './loan/report/detaillist-all/detaillist-all.component';
import { SavingIntPostComponent } from './deposit/saving-int-post/saving-int-post.component';
import { AgentCommissionComponent } from './deposit/agent-commission/agent-commission.component';
import { LoanUpdatePassbookComponent } from './loan/report/update-passbook/update-passbook.component';
import { LoanPassBookFastPageComponent } from './loan/report/pass-book-printing/pass-book-fast-page/pass-book-fast-page.component';
import { LoanPassBookPrintingComponent } from './loan/report/pass-book-printing/pass-book-printing.component';
import { PrintCertificateComponent } from './deposit/report/print-certificate/print-certificate.component';
import { NpaALLComponent } from './loan/report/npa-all/npa-all.component';
import { PrintServiceService } from './loan/report/pass-book-printing/print-service.service';
import { RecovBlockComponent } from './loan/report/recovery-register/recov-block/recov-block.component';
import { InterestCertificateComponent } from './deposit/report/interest-certificate/interest-certificate.component';
import { SmsChargeDeductionComponent } from './deposit/sms-charge-deduction/sms-charge-deduction.component';
import { ConsoGLTrnsComponent } from './finance/report/conso-gltrns/conso-gltrns.component';
import { ConsoCCTrialComponent } from './finance/report/conso-cctrial/conso-cctrial.component';
import { InterestSubsidyComponent } from './loan/report/interest-subsidy/interest-subsidy.component';
import { ConsoProfitLossComponent } from './finance/report/conso-profit-loss/conso-profit-loss.component';
import { UserPermissionComponent } from './system/user-permission/user-permission.component';
import { KeyoffDirective } from '../_utility/KeyoffDirective';
import {MatListModule} from '@angular/material/list';
import { UserTransferComponent } from './system/user-transfer/user-transfer.component';
import { ConsoBalSheetComponent } from './finance/report/conso-bal-sheet/conso-bal-sheet.component';
import { ConsoCashAccNewComponent } from './finance/report/conso-cash-acc-new/conso-cash-acc-new.component';
import { LoanDisbCertificateComponent } from './loan/report/loan-disb-certificate/loan-disb-certificate.component';
import { CloseAccDtlsComponent } from './deposit/close-acc-dtls/close-acc-dtls.component';
import { GMloanDCComponent } from './loan/report/gmloan-dc/gmloan-dc.component';
import { RecovVillageComponent } from './loan/report/recovery-register/recov-village/recov-village.component';
import { UserWiseTransactionComponent } from './deposit/report/user-wise-transaction/user-wise-transaction.component';
import { UserWiseTransactionLoanComponent } from './loan/report/user-wise-transaction-loan/user-wise-transaction-loan.component';
import { GmLoanSubsidyComponent } from './loan/report/gm-loan-subsidy/gm-loan-subsidy.component';
import { LoanDisburseActWiseComponent } from './loan/report/loan-disbursement-register/loan-disburse-act-wise/loan-disburse-act-wise.component';
import { YearendDemandRecoveryComponent } from './loan/transaction/yearend-demand-recovery/yearend-demand-recovery.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DemandNoticeBlockWiseComponent } from './loan/report/demand-notice-block-wise/demand-notice-block-wise.component';
import { RecovAdvPrnComponent } from './loan/report/recovery-register/recov-adv-prn/recov-adv-prn.component';
import { RecovAdvPrnVillComponent } from './loan/report/recovery-register/recov-adv-prn-vill/recov-adv-prn-vill.component';
import { InterestSubsidySummaryComponent } from './loan/report/interest-subsidy-summary/interest-subsidy-summary.component';
import { DcbrPrintComponent } from './loan/report/dcbr-print/dcbr-print.component';
import { NpaSummaryComponent } from './loan/report/npa-summary/npa-summary.component';
import {MatRadioModule} from '@angular/material/radio';
import { LockerComponent } from './locker/locker.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { DetailListSbcaConstWiseComponent } from './deposit/report/detail-list-sbca-const-wise/detail-list-sbca-const-wise.component';
import { FortnightlyReturnComponent } from './loan/report/fortnightly-return/fortnightly-return.component';
import { ConsoFortnightlyReturnComponent } from './loan/report/conso-fortnightly-return/conso-fortnightly-return.component';
import { BorrowingComponent } from './borrowing/borrowing.component';
import { DcbrVillWiseComponent } from './loan/report/dcbr-vill-wise/dcbr-vill-wise.component';
import { ContaiUCICprofileComponent } from './UCIC/contai-ucicprofile/contai-ucicprofile.component';
import { GoldTestAndValuationReportComponent } from './loan/transaction/gold-test-and-valuation-report/gold-test-and-valuation-report.component';
import { DemandNoticeContaiComponent } from './loan/report/demand-notice-contai/demand-notice-contai.component';
import { UcicMergeComponent } from './UCIC/ucic-merge/ucic-merge.component';
import { CTloanDCComponent } from './loan/report/ctloan-dc/ctloan-dc.component';
import { RecoveryExportComponent } from './loan/transaction/recoveryExportImport/recovery-export/recovery-export.component';
import { RecoveryImportComponent } from './loan/transaction/recoveryExportImport/recovery-import/recovery-import.component';
import { RecoveryIndiPostComponent } from './loan/transaction/recoveryExportImport/recovery-indi-post/recovery-indi-post.component';
import { ContaiComponent } from './deposit/report/passbook-print/contai/contai.component';
import { ContaiFastPageComponent } from './deposit/report/passbook-print/contai/contai-fast-page/fast-page.component';
import { GhatalComponent } from './deposit/report/passbook-print/ghatal/ghatal.component';
import { GhatalFastPageComponent } from './deposit/report/passbook-print/ghatal/ghatal-fast-page/ghatal-fast-page.component';
import { GoldLoanReportComponent } from './loan/report/gold-loan-report/gold-loan-report.component';
import { GoldLoanAsOnDateComponent } from './loan/report/gold-loan-as-on-date/gold-loan-as-on-date.component';
import { GoldLoanCurrDateComponent } from './loan/report/gold-loan-curr-date/gold-loan-curr-date.component';
import { GroupWiseComponent } from './loan/report/recovery-register/group-wise/group-wise.component';
import { NpaAllWithGroupComponent } from './loan/report/npa-all-with-group/npa-all-with-group.component';
import { DcbrGroupWiseComponent } from './loan/report/dcbr-group-wise/dcbr-group-wise.component';
import { TamlukComponent } from './deposit/report/passbook-print/tamluk/tamluk.component';
import { TamlukFastPageComponent } from './deposit/report/passbook-print/tamluk/tamluk-fast-page/tamluk-fast-page.component';
import { VillMasterContaiComponent } from './loan/masters/vill-master-contai/vill-master-contai.component';
import { RecovSummaryComponent } from './loan/report/recovery-register/recov-summary/recov-summary.component';
import { RiskFundComponent } from './loan/report/risk-fund/risk-fund.component';
import { BankuraComponent } from './deposit/report/passbook-print/bankura/bankura.component';
import { BankuraFastPageComponent } from './deposit/report/passbook-print/bankura/bankura-fast-page/bankura-fast-page.component';
import { SendSmsFromDemandComponent } from './loan/report/send-sms-from-demand/send-sms-from-demand.component';
import { UpdatedDemandListComponent } from './loan/report/demand-list/updated-demand-list/updated-demand-list.component';
import { CtFortnightNewComponent } from './loan/report/ct-fortnight-new/ct-fortnight-new.component';
import { CtFortnightNewConsoComponent } from './loan/report/ct-fortnight-new-conso/ct-fortnight-new-conso.component';
import { RoundPipe } from '../round.pipe';
import { LoanDisburseSummaryComponent } from './loan/report/loan-disbursement-register/loan-disburse-summary/loan-disburse-summary.component';
import { DdsAgentTransReportComponent } from './deposit/ddsExportImport/dds-agent-trans-report/dds-agent-trans-report.component';
import { InterestMasterComponent } from './deposit/masters/interest-master/interest-master.component';
import { UppercaseDirective } from '../_utility/uppercase.directive';
import { MatchAccountNumbersDirective } from '../_utility/match-account-numbers.directive';
import { NumericOnlyDirective } from '../_utility/numeric-only.directive';
import { WeeklyReturnNewComponent } from './finance/report/weekly-return-new/weekly-return-new.component';
import { WeeklyReturnNewConsoComponent } from './finance/report/weekly-return-new-conso/weekly-return-new-conso.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { GlWiseVoucherDtlsComponent } from './finance/report/gl-wise-voucher-dtls/gl-wise-voucher-dtls.component';
import { ConsoLoanDCComponent } from './loan/report/conso-loan-dc/conso-loan-dc.component';
import { LoanDisburseConsoComponent } from './loan/report/loan-disbursement-register/loan-disburse-conso/loan-disburse-conso.component';
import { LoanRecoveryConsoComponent } from './loan/report/recovery-register/loan-recovery-conso/loan-recovery-conso.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecovRegAccTypeWiseComponent } from './loan/report/recovery-register/recov-reg-acc-type-wise/recov-reg-acc-type-wise.component';
import { ConsoLoanDcSHGComponent } from './loan/report/conso-loan-dc-shg/conso-loan-dc-shg.component';
import { ConsoLoanDcRHComponent } from './loan/report/conso-loan-dc-rh/conso-loan-dc-rh.component';
import { ConsoGenLedgerComponent } from './finance/report/conso-gen-ledger/conso-gen-ledger.component';
import { InterestSubsidySHGComponent } from './loan/report/interest-subsidy-shg/interest-subsidy-shg.component';
import { ConsoDtlListSbcaComponent } from './deposit/report/conso-dtl-list-sbca/conso-dtl-list-sbca.component';
import { ConsoDtlListFdMisComponent } from './deposit/report/conso-dtl-list-fd-mis/conso-dtl-list-fd-mis.component';
import { ConsoDtlListRdComponent } from './deposit/report/conso-dtl-list-rd/conso-dtl-list-rd.component';
import { DetailListConsolidatedComponent } from './loan/report/detail-list-consolidated/detail-list-consolidated.component';
import { FlexiSmallSavingPostingComponent } from './deposit/ddsExportImport/flexi-small-saving-posting/flexi-small-saving-posting.component';
import {flexiAgentWiseReportComponent} from './deposit/ddsExportImport/flexi-small-agent-wise-report/flexi-small-agent-wise-report.component'
import { DetailListFssDepositComponent } from './deposit/report/detail-list-fss-deposit/detail-list-fss-deposit.component';
import { DetailFlexiSmallSavingComponent } from './deposit/report/detail-flexi-small-saving/detail-flexi-small-saving.component';
import { AllAgentDetailsComponent } from './deposit/ddsExportImport/all-agent-details/all-agent-details.component';
import { AgentCommitionFSSComponent } from './deposit/agent-commition-fss/agent-commition-fss.component';
import { DeletedTransDtlsComponent } from './finance/report/deleted-trans-dtls/deleted-trans-dtls.component';
import { GovRepComponent } from './finance/report/GOV_Rep/gov_rep.component';
import { ActivityDetailMasterComponent } from './loan/masters/activity-detail-master/activity-detail-master.component';
import { HowrahComponent } from './deposit/report/passbook-print/howrah/howrah.component';
import { HowrahFastPageComponent } from './deposit/report/passbook-print/howrah/howrah-fast-page/howrah-fast-page.component';
import { BorrowerInsuranceReportComponent } from './loan/report/borrower-insurance_report/borrower-insurance_report.component';
import { ConsoLoanDCNonfarmComponent } from './loan/report/conso-loan-dc-nonfarm/conso-loan-dc-nonfarm.component';
import { DcNonfarmComponent } from './loan/report/dc-nonfarm/dc-nonfarm.component';
@NgModule({
  declarations: [
    RoundPipe ,UppercaseDirective, MatchAccountNumbersDirective, NumericOnlyDirective,
    AmountToWordPipe,UserLoginStatusComponent,OpenInvestComponent,KeyoffDirective,
    BankResolverComponent, LoginComponent, HeaderComponent, LandingComponent, LoadingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent, CashaccountComponent,
    TrialbalanceComponent, CashcumtrialComponent, GenLedgerComponent,
    VoucherprintComponent, AccountDetailsComponent, TransactionDetailsComponent,
    GenLedger2Component, TransactionapprovalComponent, AccOpeningComponent,
    CustomerInfoComponent, VoucherComponent, TestComponent,
    ScrollbookComponent, DwRdInstlViewComponent, DwTdInttDtlsViewComponent,
    DwRenewalViewComponent, AccounTransactionsComponent, AccountDetailsForAcctTransComponent,
    VoucherapprovalComponent, DayinitializationComponent, DaycomplitionComponent,
    AdduserComponent, KycComponent, MemberListComponent, OpenLoanAccountComponent,
    LoanaccountTransactionComponent, LoanTransactionApprovalComponent, INRCurrencyPipe,
    LoanTransactionDetailsComponent, LoanAccwiseinttcalcComponent, LienAccLockUnlockComponent,
    NetworthStatementComponent, SubCashBookComponent, DetailListSBCAComponent, DetailListRDComponent,
    DetailListFDMISComponent, AccStmtSBCAComponent, AccStmtRDComponent, AccStmtTDComponent,
    NearMaturityReportComponent, OpenClosingRegisterComponent,
    LoanStatementComponent, DetailListComponent,DeletedTransDtlsComponent,
    LoanDisbursementRegisterComponent, RecoveryRegisterComponent,
    LoanSubCashBookComponent, AccOpeningViewComponent, NeftOutwardComponent,
    NeftInwardReportComponent, NeftOutwardReportComponent, PassBookPrintingComponent,
    TransTransactionComponent, TransApproveComponent, SystemParameterUpdateComponent,
    BakdatevoucherComponent, KccmemberdtlsComponent, YearcloseComponent,
    YearopenComponent, BalanaceSheetComponent, ProfitLossAccComponent, TradingAccComponent,
    SubsidyEntryComponent, OnetimesettlementComponent, DdsImportComponent, DdsExportComponent,
     DdsIndividualPostingComponent, DefaulterListComponent, DemandListComponent, RecovListComponent,
      ActwiseLstComponent, BlockwiseLstComponent, BlockWiseColLstComponent, ActWiseColLstComponent,
      AdRecStmtComponent, IntRecStmtComponent, LoanDisburseNormalComponent, RecovNormalComponent,
      OpenCloseregComponent, DetailDDSComponent, DdsAccStmtComponent, NpaComponent,
      YearlyadjustmentvoucherComponent, BlockMasterComponent, VillageMasterComponent,
      ServiceareamasterComponent, DemandNoticeComponent, OverdueNoticeComponent, OverdueTransferComponent,
      RecovFundComponent, ConsolidatedCashAccComponent, ConsolidatedDayBookComponent,
      ConsolidatedCashCumTrialComponent, ConsolidatedTrialBalanceComponent,
      StandingInsActiveSIListComponent, StandingInsTodaySIExecutedComponent, WeeklyReturnComponent,
      RecovInterestComponent, BankEntryComponent, BranchEntryComponent, VewInvestmentDtlsComponent,
      InvTransactionApprovalComponent, InvestmentTransactionsComponent, FdTransComponent, CcTransComponent, MisTransComponent,
       RdTransComponent, CreateGLHeadComponent, DetailListFdmisConstWiseComponent, INearMaturityComponent,
       IDetailListComponent, AllGLDetailsComponent, UpdatePassbookComponent, BMLoanStatementComponent, SlabwiseDepositComponent,
       PassBookFastPageComponent, DetaillistAllComponent, SavingIntPostComponent, AgentCommissionComponent,
       LoanUpdatePassbookComponent,LoanPassBookFastPageComponent,LoanPassBookPrintingComponent, PrintCertificateComponent, NpaALLComponent,
        RecovBlockComponent, InterestCertificateComponent, SmsChargeDeductionComponent, ConsoGLTrnsComponent, ConsoCCTrialComponent,
         InterestSubsidyComponent, ConsoProfitLossComponent, UserPermissionComponent, UserTransferComponent, ConsoBalSheetComponent,
          ConsoCashAccNewComponent, LoanDisbCertificateComponent, CloseAccDtlsComponent, GMloanDCComponent, RecovVillageComponent,
           UserWiseTransactionComponent, UserWiseTransactionLoanComponent, GmLoanSubsidyComponent, LoanDisburseActWiseComponent,
            YearendDemandRecoveryComponent, DemandNoticeBlockWiseComponent, RecovAdvPrnComponent, RecovAdvPrnVillComponent,
            InterestSubsidySummaryComponent, DcbrPrintComponent, NpaSummaryComponent,LockerComponent, MenuItemComponent,
            DetailListSbcaConstWiseComponent, FortnightlyReturnComponent, ConsoFortnightlyReturnComponent, BorrowingComponent, DcbrVillWiseComponent,
            ContaiUCICprofileComponent, GoldTestAndValuationReportComponent, DemandNoticeContaiComponent, UcicMergeComponent, CTloanDCComponent,
            RecoveryExportComponent, RecoveryImportComponent, RecoveryIndiPostComponent, ContaiComponent, ContaiFastPageComponent, GhatalComponent,
            GhatalFastPageComponent, GoldLoanReportComponent, GoldLoanAsOnDateComponent, GoldLoanCurrDateComponent, GroupWiseComponent, NpaAllWithGroupComponent,
            DcbrGroupWiseComponent, TamlukComponent, TamlukFastPageComponent, VillMasterContaiComponent, RecovSummaryComponent, RiskFundComponent, BankuraComponent,
            BankuraFastPageComponent, SendSmsFromDemandComponent, UpdatedDemandListComponent, CtFortnightNewComponent, CtFortnightNewConsoComponent, LoanDisburseSummaryComponent,
            DdsAgentTransReportComponent, InterestMasterComponent, WeeklyReturnNewComponent, WeeklyReturnNewConsoComponent, GlWiseVoucherDtlsComponent, ConsoLoanDCComponent,
             LoanDisburseConsoComponent, LoanRecoveryConsoComponent, DashboardComponent, RecovRegAccTypeWiseComponent, ConsoLoanDcSHGComponent, ConsoLoanDcRHComponent,
             ConsoGenLedgerComponent, InterestSubsidySHGComponent, ConsoDtlListSbcaComponent, ConsoDtlListFdMisComponent, ConsoDtlListRdComponent, DetailListConsolidatedComponent,
             FlexiSmallSavingPostingComponent,flexiAgentWiseReportComponent,DetailListFssDepositComponent,DetailFlexiSmallSavingComponent, AllAgentDetailsComponent, AgentCommitionFSSComponent,
             GovRepComponent,ActivityDetailMasterComponent,HowrahComponent,HowrahFastPageComponent,BorrowerInsuranceReportComponent,DcNonfarmComponent,ConsoLoanDCNonfarmComponent
  ],
  imports: [
    MatAutocompleteModule,MatProgressBarModule,
    NgxPrintModule, MatTableModule, MatFormFieldModule,  MatInputModule, MatSlideToggleModule,MatButtonModule,
    CommonModule, PaginationModule, MatPaginatorModule, MatSortModule, MatMenuModule,MatIconModule,MatCardModule,
    BankResolverRouting, DragDropModule,ScrollingModule,CdkTableModule,CdkTreeModule,A11yModule,MatDialogModule,
    ReactiveFormsModule, FormsModule, AutocompleteLibModule, MatExpansionModule, MatSelectModule,MatListModule,
    BsDatepickerModule.forRoot(), AccordionModule.forRoot(), MatSnackBarModule, MatTooltipModule,
    TypeaheadModule.forRoot(),HttpClientJsonpModule,
    ExportAsModule,HttpClientModule,MatRadioModule
  ],
  providers: [
    PaginationConfig,
    CommonServiceService,
    CurrencyPipe,DecimalPipe,PrintServiceService,
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true  }
  ],
  schemas:[NO_ERRORS_SCHEMA],
  exports:[LoadingComponent]
})

export class BankResolverModule {
  constructor(){
    console.log('Bankresolver loaded')

  }
}
