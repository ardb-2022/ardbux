import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { BankResolverRouting } from './bank-resolver.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
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
import { NgxPrintModule } from 'ngx-print';
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
import { InvTranServService } from './investment/transaction/investment-transactions/inv-tran-serv.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateGLHeadComponent } from './finance/create-glhead/create-glhead.component';
import { DetailListFdmisConstWiseComponent } from './deposit/report/detail-list-fdmis-const-wise/detail-list-fdmis-const-wise.component';
import { INearMaturityComponent } from './investment/report/near-maturity/near-maturity.component';
import { IDetailListComponent } from './investment/report/detail-list/detail-list.component';


@NgModule({
  declarations: [
    AmountToWordPipe,UserLoginStatusComponent,OpenInvestComponent,
    BankResolverComponent, LoginComponent, HeaderComponent, LandingComponent, LoadingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent, CashaccountComponent,
    WebDataRocksPivot, TrialbalanceComponent, CashcumtrialComponent, GenLedgerComponent,
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
    LoanStatementComponent, DetailListComponent,
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
       RdTransComponent, CreateGLHeadComponent, DetailListFdmisConstWiseComponent, INearMaturityComponent,IDetailListComponent
  ],
  imports: [
    NgxPrintModule, MatTableModule, MatFormFieldModule,  MatInputModule, MatSlideToggleModule,MatButtonModule,
    CommonModule, PaginationModule, MatPaginatorModule, MatSortModule, MatMenuModule,MatIconModule,MatCardModule,
    BankResolverRouting, DragDropModule,ScrollingModule,CdkTableModule,CdkTreeModule,A11yModule,MatDialogModule,
    ReactiveFormsModule, FormsModule, AutocompleteLibModule, MatExpansionModule, MatSelectModule,
    BsDatepickerModule.forRoot(), AccordionModule.forRoot(), MatSnackBarModule, MatTooltipModule,
    TypeaheadModule.forRoot(),
    ExportAsModule,HttpClientModule
  ],
  providers: [
    PaginationConfig,
    CommonServiceService,
    
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true  }
  ],
})

export class BankResolverModule { 
  constructor(){
    console.log('Bankresolver loaded')

  }
}
