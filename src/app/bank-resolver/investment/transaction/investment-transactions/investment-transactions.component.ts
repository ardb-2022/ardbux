import { Router } from '@angular/router';
import { AccOpenDM } from '../../../Models/deposit/AccOpenDM';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../../Models';
import { tm_denomination_trans } from '../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../../Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../../Models/deposit/mm_oprational_intr';
import { LoanOpenDM } from '../../../Models/loan/LoanOpenDM';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { InvTranServService } from './inv-tran-serv.service';
import { CcTransComponent } from './cc-trans/cc-trans.component';
@Component({
  selector: 'app-investment-transactions',
  templateUrl: './investment-transactions.component.html',
  styleUrls: ['./investment-transactions.component.css'],
  providers: [DatePipe]
})
export class InvestmentTransactionsComponent implements OnInit {

  constructor(private invComServ:InvTranServService ,private svc: RestService, private msg: InAppMessageService,private comservice:InvTranServService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
    private modalService: BsModalService) { }
  get f() { return this.accTransFrm.controls; }
  
  get td() { return this.tdDefTransFrm.controls; }
  static existingCustomers: mm_customer[] = [];
  static constitutionList: mm_constitution[] = [];
  static operationalInstrList: mm_oprational_intr[] = [];
  public static operations: mm_operation[] = [];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  @ViewChild('saveBtn', { static: true }) saveBtn: ElementRef;
  @ViewChild('unappconfirm', { static: true }) unappconfirm: TemplateRef<any>;
  @ViewChild('preClose', { static: true }) preClose: TemplateRef<any>;
  @ViewChild('preCloseDbs', { static: true }) preCloseDbs: TemplateRef<any>;
  @ViewChild('interestMsg', { static: true }) interestMsg: TemplateRef<any>;
  @ViewChild('effint', { static: true }) effint: ElementRef;
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  unApprovedTransactionLstOfAcc: td_def_trans_trf[] = [];
  selectedUnapprovedTransactionToEdit: td_def_trans_trf;
  disableOperation = true;
  AcctTypes: mm_operation[];
  // transType: DynamicSelect;
  isLoading: boolean;
  resetClicked = false;
  closeInt: any;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  showTransMode = false;
  showTransModeForR = false;
  hideOnClose = false;
  showAmtDrpDn = false;
  disableSave = true;
  TrfTotAmt = 0;
  showInterestDtls = false;
  showRdInstalment = false;
  showMisInstalment = false;
  accDtlsFrm: FormGroup;
  ShadowBalance: number;
  showBalance = false;
  showTransfrTyp = true;
  masterModel = new AccOpenDM();
  suggestedCustomer: mm_customer[];
  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  tm_deposit = new tm_deposit();
  selectedCust: any;
  accNoEnteredForTransaction: tm_depositall;
  rdInstallemntsForSelectedAcc: td_rd_installment[] = [];
  misInstallemntsForSelectedAcc: td_intt_dtls[] = [];
  preTransactionDtlForSelectedAcc: td_def_trans_trf[] = [];
  rdInstallamentOption: any[] = [];
  showOnRenewal = false;
  showOnClose = false;
  mat_val = 0;
  isMat: any;
  lastInst: any;
  prevTransForDsp: any
  showtransmodeforC = false
  // showTranferType = true;
  showMsg: ShowMessage;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  denominationGrandTotal = 0;
  modalRef: BsModalRef;
  modalRefClose: BsModalRef;
  diff: any;
  editDeleteMode = false;
  showCloseInterest = false;
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;
  deftransfrmData: any;
  resBrnCd: any;
  resBrnCatgCd: any;
  deptransData: any;
  showtransdetails = false;
  effInt: any;
  closeRt: any;
  constCd: any;
  selOprn: any;
  counter = 0;
  counter1 = 0;
  prematurePrnForMis: any;
  matureIntForMis: any;
  res_rt: any;
  tddefAccTypCd: any;
  rdInClose: any;
  editdelcontainer: any;
  trftype = '';
  resbrnCD1: any
  trans: any;
  remarks: any;
  disabledOnNull = true;
  shownoresult = false
  disabledTrfOnNull = true
  accountType: any;
  misSum=0;
  fdSum=0
  hidegl:boolean=true;
  glHead:any;
  interestPeriod=0
  intt=0
  inttMsg=''
  joinHold:any=[];
  joinHolddtls:any;
  opnTyp:boolean=true;
  sel_cc:boolean=false;
  sel_mis:boolean=false;
  sel_fd:boolean=false;
  sel_rd:boolean=false;
  showTransactionDtlR:boolean=false;
  showTransactionDtlC:boolean=false;
  resetClick:boolean=false
  ngOnInit(): void {
    this.resetClick=false
    this.isLoading = false;
    setTimeout(() => {
      this.getOperationMaster();
      this.getAccountTypeList();
      this.getCustomerList();
      this.getDenominationList();
      this.getConstitutionList();
      this.getOperationalInstr();
      // this.getAllCustomer();
    }, 150);
    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
    })
  }
  callSaveFunction(){    
    this.invComServ.SaveButtonClick();    
  } 
  onOperationTypeChange(){
    this.accNoEnteredForTransaction=this.masterModel.tmdepositInv;
    console.log(typeof(Number(this.f.oprn_cd.value)));
    console.log(Number(this.f.oprn_cd.value));
    this.onUpapprovedConfirm(this.unApprovedTransactionLstOfAcc[0])
    //for renewal
    if(Number(this.f.oprn_cd.value)===38){
      const m = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString());
      const c = this.sys.CurrentDate;
      const diffDays = Math.ceil((m.getTime() - c.getTime()) / (1000 * 3600 * 24)); 
     
      console.log(c);
      console.log(m);
      console.log(diffDays);
      if(diffDays>0){
        this.HandleMessage(true, MessageType.Error, 'Pre-Mature Renewal is not possible');
        this.showTransactionDtlC = false;
        this.showTransactionDtlR = false;
       }
      else{
        this.showTransactionDtlC = false;
        this.showTransactionDtlR = true;
      }
      
        

    }
    //for close
    if(Number(this.f.oprn_cd.value)===39){
      this.showTransactionDtlR = false;
      this.showTransactionDtlC = true;
  
      }
  }
  
  /** method fires on account type change */
  public onAcctTypeChange(): void {
    
    this.suggestedCustomer=[]
    console.log(this.f.acc_type_cd.value)
    this.tm_denominationList = [];
    this.accNoEnteredForTransaction = undefined;
    this.resetTransfer();
    this.f.acct_num.reset(); this.f.oprn_cd.reset();
     
    
    // this.tdDefTransFrm.reset();
    this.HandleMessage(false);
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = InvestmentTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
      console.log(this.tdDefTransFrm);
      
    // this.tdDefTransFrm.patchValue({
    //   acc_type_desc: acctTypeDesription,
    //   acc_type_cd: acctTypCdTofilter
    // });
    this.operations = InvestmentTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter);
    // this.f.oprn_cd.enable();
    // this.f.acct_num.enable();
    // this.f.oprn_cd.disable();
    // this.refresh = false;
    // this.msg.sendCommonTmDepositAll(null);
    // this.refresh = true;
  }


  loadInvData(){
    if (this.f.acct_num.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true;
    }
    console.log(this.f.acc_type_cd)
    if (this.f.acc_type_cd === null || this.f.acc_type_cd === undefined) {
      // this.showAlertMsg('WARNING', 'Please select Account Type');
      this.HandleMessage(true, MessageType.Warning, 'Please select Account Type');
      this.f.acct_num = null;
      return;
    }
    console.log(this.f.acct_num.value);
      
      this.tm_deposit.acc_num=this.f.acct_num.value
      this.tm_deposit.ardb_cd=this.sys.ardbCD
      this.isLoading = true;
      this.svc.addUpdDel<any>('INVESTMENT/GetInvOpeningData', this.tm_deposit).subscribe(
        res => {
          console.log(res);
          this.invComServ.masterModel=res;
          this.masterModel = res;
          this.opnTyp=false;
  
          if (this.masterModel === undefined || this.masterModel === null) {
            // this.showAlertMsg('WARNING', 'No record found!!');
            this.HandleMessage(true, MessageType.Warning, 'No record found!!');
         
          }
          else if(this.masterModel.tmdepositInv.approval_status=='U'){
            this.HandleMessage(true, MessageType.Warning, 'Account still not approved!');
            this.f.acct_num = null;
           return;}
          else if(this.masterModel.tddeftrans.approval_status=='U'){
            this.getUnapprovedDepTransAskViewEditOption()
            
          } if (this.masterModel.tmdepositInv.acc_num !== null) {

            this.invComServ.getBankName();
            this.invComServ.getBranchName(this.masterModel.tmdepositInv.bank_cd);
            this.invComServ.getConstitutionList();
            this.invComServ.getOperationalInstr();
            this.isLoading = false;
          }
          },
        err => {
          this.isLoading = false;
          // this.showAlertMsg('ERROR', 'Unable to find record!!');
          this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!');
        }
  
      );
  }
  getAccountOpeningTempData() {

    this.resetClick=false
    console.log(this.invComServ.bankName,this.invComServ.branchName,this.invComServ.constitutionDes,this.invComServ.operInsDESC);
    
      console.log(this.f.acct_num.value);
      
            if (this.masterModel.tmdepositInv.acc_num !== null) {
              if(this.f.acc_type_cd.value==23){
                debugger
                this.sel_cc=true;
                this.sel_fd=false;
                this.sel_mis=false;
                this.sel_rd=false;
                }
              else if(this.f.acc_type_cd.value==22){
                  this.sel_fd=true;
                  this.sel_cc=false;
                  this.sel_mis=false;
                  this.sel_rd=false;
                  }
              else if(this.f.acc_type_cd.value==24){
                    this.sel_mis=true;
                    this.sel_fd=false;
                    this.sel_cc=false;
                    this.sel_rd=false;
          
                    }
              else if(this.f.acc_type_cd.value==25){
                      this.sel_rd=true;
                      this.sel_mis=false;
                      this.sel_fd=false;
                      this.sel_cc=false;
                      }
              // this.invComServ.setAccDtlsFrmForm();
              // this.operationType = 'Q';
              
  
            }
           
    
    
    
  }
  clearSuggestedCust() {
    this.suggestedCustomer = null;
    this.shownoresult = false;
    if (this.f.acct_num.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true;
    }


  }
  public onAccountNumTabOff(): void {
    this.tm_denominationList = [];
    this.resetTransfer();
    this.tdDefTransFrm.reset(); 
    // this.invComServ.showTransactionDtl = true;
    this.f.oprn_cd.disable(); this.f.oprn_cd.reset();
    this.disableOperation = true;
    // this.showTranferType = true;
    // console.log('onAccountNumTabOff -' + this.f.acct_num.value);
    this.isLoading = true;
    this.showMsg = null;
    let acc = new tm_depositall();
    acc.acc_num = '' + this.f.acct_num.value;
    acc.acc_type_cd = +this.f.acc_type_cd.value;
    acc.brn_cd = this.sys.BranchCode;

    acc.ardb_cd = this.sys.ardbCD;

    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', acc).subscribe(
      res => {
        debugger
        console.log(res, this.rdInstallamentOption)
        this.resBrnCd = res;
        this.resbrnCD1 = res;
        this.resBrnCatgCd = res;
        this.constCd = this.resBrnCd[0].constitution_cd
        this.resBrnCatgCd = this.resBrnCd[0].catg_cd;
        console.log(this.resBrnCatgCd)
        this.resBrnCd = this.resBrnCd[0].brn_cd
        console.log(this.resBrnCd)
        //////////////debugger;
        this.isLoading = false;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          res.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              acc = element;
              // if (this.validationOnAcctTabOff(acc)) {
              //   this.disableOperation = false;
              //   this.accNoEnteredForTransaction = acc;
              //   this.setAccDtlsFrmForm();
              //   if (this.accTransFrm.controls.acc_type_cd.value != 11)
              //     this.getPreviousTransactionDtl(acc);
              //   else {
              //     this.getPreviousTransactionDtl_dsp(acc);
              //   }
              //   this.tdDefTransFrm.patchValue({
              //     acc_num: acc.acc_num,
              //   });
              //   this.f.oprn_cd.enable();
              // }
            }
          });
          // if (!foundOneUnclosed) {
          //   this.HandleMessage(true, MessageType.Error,
          //     'Account number ' + this.f.acct_num.value + ' is closed.');
          //   this.onResetClick();
          //   return;
          // }
        } 
        // else {
        //   this.HandleMessage(true, MessageType.Error,
        //     'Account number does not exists.');
        //   this.onResetClick();
        //   return;
        // }
      },
      err => {
        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        // this.resetAccDtlsFrmFormData();
      }
    );
    this.svc.addUpdDel<any>('Deposit/getAccountOpeningData', acc).subscribe(
      res => {
        this.joinHold=[];
        for (let i = 0; i <= res.tdaccholder.length; i++) {
        this.joinHold+=(res.tdaccholder[i].acc_holder+',')
        console.log(this.joinHold);
        }
       
      },
      err => { this.isLoading = false; }
    );

  }

  private getOperationMaster(): void {
    console.log(InvestmentTransactionsComponent.operations);

    this.isLoading = true;
    if (undefined !== InvestmentTransactionsComponent.operations &&
      null !== InvestmentTransactionsComponent.operations &&
      InvestmentTransactionsComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = InvestmentTransactionsComponent.operations.filter(e => e.module_type === 'INVESTMENT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          InvestmentTransactionsComponent.operations = res;
          this.invComServ.operations=res;
          this.isLoading = false;
          this.AcctTypes = InvestmentTransactionsComponent.operations.filter(e => e.module_type === 'INVESTMENT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    }
    console.log(this.AcctTypes);

  }
  getAccountTypeList() {
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'I');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      });
  }
  getCustomerList() {
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.sys.BranchCode;

    // cust.ardb_cd = this.sys.ardbCD;
    if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          this.isLoading = false;
          this.customerList = res;
        },
        err => {
          this.isLoading = false;

        }
      );
    }
    else { this.isLoading = false; }
  }
  private getDenominationList(): void {
    let denoList: tt_denomination[] = [];
    this.svc.addUpdDel<any>('Common/GetDenomination', null).subscribe(
      res => {
        denoList = res;
        this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
      },
      err => { // ;
      }
    );
  }
  getConstitutionList() {
    if (InvestmentTransactionsComponent.constitutionList.length > 0) {
      return;
    }

    InvestmentTransactionsComponent.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        console.log(res)
        // //////////////debugger;
        InvestmentTransactionsComponent.constitutionList = res;
      },
      err => { // ;
      }
    );
    console.log(InvestmentTransactionsComponent.constitutionList)
  }
  getOperationalInstr() {
    // //////////////debugger;
    if (InvestmentTransactionsComponent.operationalInstrList.length > 0) {
      return;
    }

    InvestmentTransactionsComponent.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        InvestmentTransactionsComponent.operationalInstrList = res;
      },
      err => { }
    );
  }

  private resetTransfer() {
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }
  
  mappTddefTransAndTransFrFromFrm(): td_def_trans_trf {
    //debugger;
    console.log(this.f.oprn_cd.value + " " + this.f.trans_type + " " + this.remarks)
    // debugger;
    // if(!this.editDeleteMode){
    // selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    // selectedOperation=selectedOperation.oprn_cd
    // }
    // else{
    // const selectedOperation =this.f.trans_type;

    // }
    let k = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0]
    const selectedOperation = this.editDeleteMode ? this.remarks : k.oprn_desc;
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
    // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
    // console.log(toReturn.home_brn_cd+" "+toReturn.intra_branch_trn)
    toReturn.acc_num = this.td.acc_num.value;
    //////////debugger;
    // toReturn.trans_mode = this.td.trans_mode.value;
    toReturn.paid_to = this.td.paid_to.value;
    toReturn.token_num = this.td.token_num.value;
    toReturn.trf_type = this.td.trf_type.value;

    // toReturn.home_brn_cd=this.resBrnCd!=this.sys.BranchCode? this.resBrnCd:this.sys.BranchCode;
    // toReturn.intra_branch_trn=this.resBrnCd!=this.sys.BranchCode? 'Y':'N'
    /*Logic to populate transation type of td_def_trans_Trf */
    if (toReturn.acc_type_cd == 1 || toReturn.acc_type_cd == 8) {
      if (selectedOperation.toLocaleLowerCase() === 'close') {
        toReturn.particulars = this.td.particulars.value;
        console.log(toReturn.particulars)
        // debugger;
      }

    }
    // switch (selectedOperation.oprn_desc.toLocaleLowerCase()) {
    switch (selectedOperation.toLocaleLowerCase()) {
      case 'close':
      case 'withdraw':
        toReturn.trans_type = 'D';
        break;
      case 'renewal':
      case 'deposit':
        toReturn.trans_type = 'W';
        break;
    }

    if (selectedOperation.toLocaleLowerCase() === 'close'
      // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close'
      && (accTypeCd === 2
        || accTypeCd === 3
        || accTypeCd === 4
        || accTypeCd === 5
        || accTypeCd === 6)) {
      toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
    } else {
      // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      if (selectedOperation.toLocaleLowerCase() === 'renewal') {
        debugger
        console.log(toReturn.amount + " " + toReturn.curr_intt_recov)
        debugger
        toReturn.amount = +this.td.interest.value;
        if (toReturn.acc_type_cd == 4 && this.editDeleteMode && this.td.trf_type.value == 'T') {
          toReturn.trans_type = 'D'  //marker (while renewal send deposit trans type)
        } else if (toReturn.acc_type_cd == 5 && this.editDeleteMode && this.td.trf_type.value == 'T' && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw') {
          toReturn.trans_type = 'D'  //marker (while renewal send deposit trans type)

        }
      } else {
        toReturn.amount = +this.td.amount.value;
      }
    }
    toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    if (this.td.particulars.value === null ||
      this.td.particulars.value === '') {
      if (selectedOperation.toLocaleLowerCase() !== 'close') {
        // if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
        if (accTypeCd === 2
          || accTypeCd === 3
          || accTypeCd === 4
          || accTypeCd === 5
          || accTypeCd === 11
          ) {
          toReturn.particulars = this.td.particulars.value;
        } else {
          // if (this.td.trf_type.value === 'T') {
          //   toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
          // } else if (this.td.trf_type.value === 'C') {
          //   toReturn.particulars = 'BY CASH';
          // }
          if (this.td.trf_type.value === 'C') {
            if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
              // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
              // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
            if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
              // console.log()
              console.log('3102')
              toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
              // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
            }
          }
        }
      } else {
        //debugger;
        // if (this.td.trf_type.value === 'T') {
        //   toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
        // } else if (this.td.trf_type.value === 'C') {
        //   toReturn.particulars = 'BY CASH';
        // }
        if (this.td.trf_type.value === 'C') {
          // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
            //debugger;
            toReturn.particulars = 'TO CASH ';
            // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY CASH ';
          }

        } else {
          // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
            console.log(this.td.trans_mode.value)
            console.log('3131')
            toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
          }
        }
      }
    } else {
      // console.log("2706")
      //debugger;
      console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)
      //debugger;
      //  if(selectedOperation.toLocaleLowerCase()=='close' && toReturn.trf_type=='T'){
      //   toReturn.particulars='To Closing'
      //  }
      //  else
      //     { console.log('3148')
      if (!this.editDeleteMode && this.td.trans_mode.value != 'C')
        toReturn.particulars = this.td.particulars.value.split(' ')[0] === "BY" ? this.td.particulars.value.replace("BY", "TO") : this.td.particulars.value.replace("TO", "BY");
    }
    // toReturn.particulars = this.td.particulars.value.split(' ')[1]==="BY"?  this.td.particulars.value.replace("BY","TO"):this.td.particulars.value.replace("TO","BY");
    console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)

    //  }

    if (selectedOperation.toLocaleLowerCase() === 'renewal' && this.td.trf_type.value === '') {
      toReturn.trans_type = 'T';
    }
    toReturn.approval_status = 'U';
    toReturn.brn_cd = this.sys.BranchCode;

    if (this.td.trf_type.value === 'T') {
      toReturn.tr_acc_cd = 10000;
    } else if (this.td.trf_type.value === 'C') {
      toReturn.tr_acc_cd = 21101;
    }
    // if ((+this.f.acc_type_cd.value) === 2) {
    //   toReturn.acc_cd = 14301;
    // }
    // if ((+this.f.acc_type_cd.value) === 6) {
    //   toReturn.acc_cd = 14302;
    // }
    if (selectedOperation.toLocaleLowerCase() === 'renewal') {
      debugger;

      toReturn.curr_prn_recov = ((+this.td.amount.value) + (+this.td.interest.value));
      toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
      toReturn.ovd_intt_recov = 0;
    }
    if (selectedOperation.toLocaleLowerCase() === 'interest payment') {
      const desc = accTypeCd == 5 ? ' MIS ' : ' Savings ' //marker
      toReturn.particulars = toReturn.particulars + desc + "A/C: " + this.td.acc_num.value //marker
      // toReturn.acc_cd=InvestmentTransactionsComponent.constitutionList.filter((x)=>{
      //   x.acc_type_cd==accTypeCd
      // })[0].intt_acc_cd //marker
      for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
        if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
          toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].intt_acc_cd
          console.log(toReturn.acc_cd)
        }
      }
      // if(selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment')
    }
    // console.log(toReturn.acc_num)
    // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3)
    // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
    else {
      toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      //to be removed in case the other acc type cd gets interchanged
      // for(let i=0;i<InvestmentTransactionsComponent.constitutionList.length;i++){
      //   if(InvestmentTransactionsComponent.constitutionList[i].constitution_cd==this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd==6)
      //  { toReturn.acc_cd=InvestmentTransactionsComponent.constitutionList[i].intt_acc_cd
      //   console.log(toReturn.acc_cd)
      // }
      // }
    } //marker
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('getIPAddress');
    // console.log( {"toReturn.particulars":toReturn.particulars," this.td.particulars.value": this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
  }
  mapRenewData(): tm_deposit {

    const toReturn = new tm_deposit();
    // Year=0;Month=0;Day=313
    const depPrd = 'Year=' + (this.td.dep_period_y.value === '' ? '0' : this.td.dep_period_y.value) +
      ';Month=' + (this.td.dep_period_m.value === '' ? '0' : this.td.dep_period_m.value) +
      ';Day=' + (this.td.dep_period_d.value === '' ? '0' : this.td.dep_period_d.value);
    if (this.editDeleteMode) {
      toReturn.trans_cd = this.td.trans_cd.value
    }
    toReturn.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    toReturn.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    toReturn.acc_num = this.accNoEnteredForTransaction.acc_num;
    toReturn.renew_id = this.accNoEnteredForTransaction.renew_id + 1;
    toReturn.cust_cd = this.accNoEnteredForTransaction.cust_cd;
    toReturn.intt_trf_type = this.td.intt_trf_type.value;
    toReturn.constitution_cd = (+this.td.constitution_cd.value);
    toReturn.oprn_instr_cd = this.accNoEnteredForTransaction.oprn_instr_cd;
    toReturn.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
    // toReturn.prn_amt = (+this.td.amount.value);
    toReturn.prn_amt = (+this.td.amount.value) + (+this.td.curr_intt_recov.value); 
    toReturn.intt_amt = (+this.td.interest.value);
    toReturn.dep_period = depPrd;
    toReturn.instl_amt = this.accNoEnteredForTransaction.instl_amt;
    toReturn.instl_no = this.accNoEnteredForTransaction.instl_no;
    toReturn.mat_dt = Utils.convertStringToDt(this.td.mat_dt.value);
    toReturn.intt_rt = (+this.td.intt_rate.value);
    toReturn.tds_applicable = this.accNoEnteredForTransaction.tds_applicable;
    toReturn.last_intt_calc_dt = this.accNoEnteredForTransaction.last_intt_calc_dt;
    // toReturn.acc_close_dt = this.accNoEnteredForTransaction.acc_close_dt;
    // toReturn.closing_prn_amt = this.accNoEnteredForTransaction.closing_prn_amt;
    // toReturn.closing_intt_amt = this.accNoEnteredForTransaction.closing_intt_amt;
    // toReturn.penal_amt = this.accNoEnteredForTransaction.penal_amt;
    // toReturn.ext_instl_tot = this.accNoEnteredForTransaction.ext_instl_tot;
    // toReturn.mat_status = this.accNoEnteredForTransaction.mat_status;
    // toReturn.acc_status = this.accNoEnteredForTransaction.acc_status;
    // toReturn.curr_bal = this.accNoEnteredForTransaction.curr_bal;
    // toReturn.clr_bal = this.accNoEnteredForTransaction.clr_bal;
    toReturn.standing_instr_flag = this.accNoEnteredForTransaction.standing_instr_flag;
    toReturn.cheque_facility_flag = this.accNoEnteredForTransaction.cheque_facility_flag;
    toReturn.approval_status = 'A';
    // toReturn.approval_status = this.accNoEnteredForTransaction.approval_status;
    // toReturn.approved_by = this.accNoEnteredForTransaction.approved_by;
    toReturn.approved_by = this.sys.UserId+'/'+localStorage.getItem('getIPAddress');
    // toReturn.approved_dt = this.accNoEnteredForTransaction.approved_dt;
    toReturn.approved_dt = this.sys.CurrentDate;
    toReturn.user_acc_num = this.accNoEnteredForTransaction.user_acc_num;
    // toReturn.lock_mode = this.accNoEnteredForTransaction.lock_mode;
    // toReturn.loan_id = this.accNoEnteredForTransaction.loan_id;
    // toReturn.cert_no = this.td.cert_no.value;
    // toReturn.bonus_amt = this.accNoEnteredForTransaction.bonus_amt;
    // toReturn.penal_intt_rt = this.accNoEnteredForTransaction.penal_intt_rt;
    // toReturn.bonus_intt_rt = this.accNoEnteredForTransaction.bonus_intt_rt;
    // toReturn.transfer_flag = this.accNoEnteredForTransaction.transfer_flag;
    // toReturn.transfer_dt = this.accNoEnteredForTransaction.transfer_dt;
    toReturn.agent_cd = this.accNoEnteredForTransaction.agent_cd;
    toReturn.cust_name = this.accNoEnteredForTransaction.cust_name;
    toReturn.cust_type = this.accNoEnteredForTransaction.cust_type;
    toReturn.sex = this.accNoEnteredForTransaction.sex;
    toReturn.phone = this.accNoEnteredForTransaction.phone;
    toReturn.occupation = this.accNoEnteredForTransaction.occupation;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('getIPAddress');
    toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('getIPAddress');
    toReturn.constitution_desc = this.accNoEnteredForTransaction.constitution_desc;
    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;


    return toReturn;
  }
  mappTddefTransFromFrm(): td_def_trans_trf {
    // //////////////debugger;
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;

    if (!this.editDeleteMode) {
      const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
      console.log(selectedOperation.oprn_desc)
      //  debugger
      const accTypeCd = +this.f.acc_type_cd.value;
      // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
      toReturn.trans_dt = this.sys.CurrentDate;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      toReturn.paid_to = this.td.paid_to.value;
      toReturn.token_num = this.td.token_num.value;
      toReturn.trf_type = this.td.trf_type.value;
      toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
      toReturn.remarks = selectedOperation.oprn_desc.toLocaleLowerCase()
      toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' && (accTypeCd === 2 || accTypeCd === 3 || accTypeCd === 4 || accTypeCd === 5 || accTypeCd === 6 || accTypeCd === 11)) {
//marker
        toReturn.amount = accTypeCd !== 6 ? this.accNoEnteredForTransaction.prn_amt : this.tdDefTransFrm.controls.amount.value-this.tdDefTransFrm.controls.ovd_intt_recov.value+this.tdDefTransFrm.controls.curr_prn_recov.value;
       if(accTypeCd==6)
       toReturn.amount=this.tdDefTransFrm.controls.amount.value   //marker
       
        toReturn.curr_intt_recov = +this.td.curr_intt_recov.value;
        toReturn.ovd_intt_recov = (accTypeCd === 5) ? 0 : +this.td.ovd_intt_recov.value;
        toReturn.curr_prn_recov = +this.td.curr_prn_recov.value;
      } else {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
          // toReturn.amount=+this.td.interest.value
          // console.log(toReturn.trf_type)
          console.log(this.constCd + " " + this.td.trans_type.value)
          console.log(InvestmentTransactionsComponent.constitutionList)
          // debugger;
          for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
            if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == 5 && (this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')) {
              toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].intt_acc_cd
              console.log(toReturn.acc_cd)
              // debugger;
            }
            if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == 5 && (this.td.trans_type.value.toLocaleLowerCase() == 'deposit')) {
              toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].acc_cd
              console.log(toReturn.acc_cd)
              //  debugger;
            }
          } //marker
          const desc = accTypeCd == 2 ? 'FD ' : (accTypeCd === 3 ? 'DBS' : (accTypeCd == 4 ? 'Cash Certificate ' : (accTypeCd == 5 ? 'MIS ' : (accTypeCd == 6 ? 'RD ' : (accTypeCd == 7 ? 'Share ' : (accTypeCd == 8 ? 'Flexi ' : 'DSP'))))))
          toReturn.particulars = toReturn.trf_type == 'T' ? 'By Transfer ' + desc + ' A/C No: ' + this.td.acc_num.value : ''
          console.log(toReturn.particulars)
          toReturn.trf_type = toReturn.trf_type == null && this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value ? 'T' : toReturn.trf_type;
          // console.log(toReturn.trf_type)
          toReturn.amount = this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value ? this.accDtlsFrm.controls.intt_amt.value : 0
          // console.log(toReturn.amount)
          // toReturn.amount = this.tdDefTransFrm.controls.balance.value>0?;
        } else {
          toReturn.amount = +this.td.amount.value;
        }
      }

      toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
      toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
      if (this.td.particulars.value === null ||
        this.td.particulars.value === '') {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
          if (accTypeCd === 2
            || accTypeCd === 3
            || accTypeCd === 4
            || accTypeCd === 5
          ) {
            toReturn.particulars = this.td.particulars.value;
          } else {
            if (this.td.trf_type.value === 'C') {
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
                toReturn.particulars = 'TO CASH ';
              } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
                toReturn.particulars = 'BY CASH ';
              }

            } else {
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
                ////////////debugger;
                // console.log('2813')
                toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
              } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
                ////////////debugger;
                toReturn.particulars = 'BY TRANSFER :' + this.td.acc_num.value;
              }
            }
          }
        } else {
          if (this.td.trf_type.value === 'C') {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              // console.log('2831')
              toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
              toReturn.particulars = 'BY TRANSFER :' + this.td.acc_num.value;
            }
          }
        }
      } else {
        toReturn.particulars = this.td.particulars.value;
        console.log(this.td.particulars.value)

        //   if(accTypeCd==5) //marker
        // toReturn.particulars = this.td.particulars.value.split(' ')[0]==="BY"?  this.td.particulars.value.replace("BY","TO"):this.td.particulars.value.replace("TO","BY");
        ////////////debugger;
        console.log({ "toReturn.remarks": toReturn.remarks, " this.td.particulars.value": this.td.particulars.value })
        debugger
      }

      // if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close' &&
      //   accTypeCd === 1) {
      //   toReturn.particulars = 'To Closing';
      //   toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      // }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' &&
        (accTypeCd === 1 || accTypeCd === 8)) {
        toReturn.particulars = 'To Closing';
        // debugger
        this.tdDefTransFrm.patchValue({
          particulars: 'By closing of A/C No:' + this.td.acc_num.value
        })
        toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      }
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' && (accTypeCd === 11)) {
      toReturn.particulars = this.tdDefTransFrm.controls.trf_type.value=='C'?'To Cash':'To Transfer';
      // debugger
      this.tdDefTransFrm.patchValue({
        particulars: this.tdDefTransFrm.controls.trf_type.value=='C'?'To Cash':'To Transfer'
      })
      toReturn.curr_intt_recov = +this.td.closeIntrest.value;
    }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'
        && this.td.trf_type.value === '') {
        toReturn.trans_type = 'T';
      }
      toReturn.approval_status = 'U';
      toReturn.brn_cd = this.sys.BranchCode;

      if (this.td.trf_type.value === 'T') {
        toReturn.tr_acc_cd = 10000;
      } else if (this.td.trf_type.value === 'C') {
        toReturn.tr_acc_cd = 21101;
      }
      // if ((+this.f.acc_type_cd.value) === 2) {
      //   toReturn.acc_cd = 14301;
      // }
      if (accTypeCd != 5 && this.td.trans_type.value.toLocaleLowerCase() != 'withdraw')  //might have to change
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd;

      console.log(this.resbrnCD1[0].acc_cd)
      if ((+this.f.acc_type_cd.value) === 6) {
        // toReturn.acc_cd = 14302;
        // debugger;
        for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
          if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
            toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].acc_cd
            console.log(toReturn.acc_cd)
          }
        }
      }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
        // debugger
        for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
          if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
            toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].intt_acc_cd
            console.log(toReturn.acc_cd)
            // debugger;
          }
        } //marker

        //   else {
        // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      } //marker
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
        if (accTypeCd == 5) {
          // debugger;
          for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
            if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
              toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].acc_cd
              console.log(toReturn.acc_cd)
              // debugger;
            }
          } //marker
        }
        //   else {
        // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      }
      ///here else if is made a marker for making intt cd 
      else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        debugger
        console.log(toReturn)
        toReturn.curr_prn_recov = accTypeCd === 5 ? this.td.amount.value : ((+this.td.amount.value) + (+this.td.interest.value));
        toReturn.ovd_prn_recov = (accTypeCd === 5) ? this.td.amount.value : this.accNoEnteredForTransaction.prn_amt;
        toReturn.curr_intt_recov = accTypeCd === 5 ? this.td.td_def_mat_amt.value - this.td.amount.value : this.accNoEnteredForTransaction.intt_amt;
        toReturn.ovd_intt_recov = 0;
        if(accTypeCd==2)
        console.log(this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase())
        debugger;
        if(accTypeCd==2 && (this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase()=='half yearly' || this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase()=='quarterly')){
           
          console.log(this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase())
          
          debugger;
          
          toReturn.curr_prn_recov = this.td.td_def_mat_amt.value+this.td.interest.value
          toReturn.curr_intt_recov = this.td.curr_intt_recov.value
          toReturn.ovd_prn_recov= this.td.amount.value
          toReturn.amount=this.td.curr_intt_recov.value

        
        }
      }
      debugger;
      console.log(toReturn)
      debugger;
    } else {
      console.log(this.td.particulars.value)
      debugger;
      toReturn.trans_dt = this.td.trans_dt.value;
      toReturn.trans_cd = this.td.trans_cd.value;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      if (this.td.trans_mode.value && this.td.trans_mode.value.toLocaleLowerCase() == 'r') {
        if (this.td.acc_type_cd.value != 5)
          toReturn.amount = this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value ? this.accDtlsFrm.controls.intt_amt.value : 0
        if (this.td.acc_type_cd.value == 5)
          toReturn.amount = 0
        //  debugger;
      }
      else
        toReturn.amount = this.td.amount.value;
      // debugger;
      toReturn.instrument_dt = this.td.instrument_dt.value;
      toReturn.instrument_num = this.td.instrument_num.value;
      toReturn.paid_to = this.td.paid_to.value;
      toReturn.token_num = this.td.token_num.value;
      toReturn.approval_status = this.td.approval_status.value;
      toReturn.approved_by = this.td.approved_by.value;
      toReturn.approved_dt = this.td.approved_dt.value;
      console.log(this.td.particulars.value)
      // if(this.td.trans_mode.value=='C'){  //marker

      // if(this.td.trf_type.value=='T'){
      //   toReturn.particulars='To Closing'
      // }

      //      }
      toReturn.particulars = this.td.particulars.value;
      // toReturn.particulars = this.td.particulars.value; //marker
      // //debugger;
      console.log(this.td.acc_cd.value)
      // //debugger;
      console.log(toReturn.particulars)
      toReturn.tr_acc_type_cd = this.td.tr_acc_type_cd.value;
      toReturn.tr_acc_num = this.td.tr_acc_num.value;
      toReturn.voucher_dt = this.td.voucher_dt.value;
      toReturn.voucher_id = this.td.voucher_id.value;
      toReturn.trf_type = this.td.trf_type.value;
      toReturn.tr_acc_cd = this.td.tr_acc_cd.value;
      for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
        if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == 5 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw') {
          if (this.td.trans_mode.value.toLocaleLowerCase() == 'r')
            toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].intt_acc_cd
          else if (this.td.trans_mode.value.toLocaleLowerCase() == 'c')
            toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].acc_cd
          console.log(toReturn.acc_cd)
          // debugger;
        }
      }
      for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
        if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == 5 && this.td.trans_type.value.toLocaleLowerCase() == 'deposit') {
          toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].acc_cd
          console.log(toReturn.acc_cd)
          // debugger;
        }
      }
      if (this.td.tr_acc_type_cd.value != 5 && this.td.trans_type.value.toLocaleLowerCase() != 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
      debugger;
      if (this.td.acc_type_cd.value == 6 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
        if (this.td.acc_type_cd.value == 1 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
        if (this.td.acc_type_cd.value == 8 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
        if (this.td.acc_type_cd.value == 11 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        {toReturn.acc_cd = this.resbrnCD1[0].acc_cd; 
          
          toReturn.particulars=this.tdDefTransFrm.controls.trf_type.value=='T'?"To Transfer":"To Cash"} //marker
      debugger
      console.log(toReturn.acc_cd + " " + this.resbrnCD1[0].acc_cd + " " + this.td.tr_acc_type_cd.value + " " + this.td.trans_type.value.toLocaleLowerCase())
      debugger;
      toReturn.share_amt = this.td.share_amt.value;
      toReturn.sum_assured = this.td.sum_assured.value;
      toReturn.paid_amt = this.td.paid_amt.value;
      // toReturn.curr_prn_recov = this.td.acc_type_cd.value!=5? this.td.curr_prn_recov.value : this.td.amount.value;
      toReturn.curr_prn_recov = this.td.acc_type_cd.value != 5 ? this.td.curr_prn_recov.value : 0; //marker
      toReturn.ovd_prn_recov = this.td.ovd_prn_recov.value;
      toReturn.curr_intt_recov = this.td.curr_intt_recov.value;
      toReturn.ovd_intt_recov = this.td.ovd_intt_recov.value;
      // toReturn.remarks = this.td.remarks.value;
      toReturn.remarks = this.td.remarks.value;
      // console.log()
      toReturn.crop_cd = this.td.crop_cd.value;
      toReturn.activity_cd = this.td.activity_cd.value;
      toReturn.curr_intt_rate = this.td.curr_intt_rate.value;
      toReturn.ovd_intt_rate = this.td.ovd_intt_rate.value;
      toReturn.instl_no = this.td.instl_no.value;
      toReturn.instl_start_dt = this.td.instl_start_dt.value;
      toReturn.periodicity = this.td.periodicity.value;
      toReturn.disb_id = this.td.disb_id.value;
      toReturn.comp_unit_no = this.td.comp_unit_no.value;
      toReturn.ongoing_unit_no = this.td.ongoing_unit_no.value;
      toReturn.mis_advance_recov = this.td.mis_advance_recov.value;
      toReturn.audit_fees_recov = this.td.audit_fees_recov.value;
      toReturn.sector_cd = this.td.sector_cd.value;
      toReturn.spl_prog_cd = this.td.spl_prog_cd.value;
      toReturn.borrower_cr_cd = this.td.borrower_cr_cd.value;
      toReturn.intt_till_dt = this.td.intt_till_dt.value;
      toReturn.acc_name = this.td.acc_name.value;
      toReturn.brn_cd = this.td.brn_cd.value;
      toReturn.trf_type_desc = this.td.trf_type_desc.value;
      if (this.td.trans_mode.value && this.td.trans_mode.value.toLocaleLowerCase() === 'i') {
        for (let i = 0; i < InvestmentTransactionsComponent.constitutionList.length; i++) {
          if (InvestmentTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
            toReturn.acc_cd = InvestmentTransactionsComponent.constitutionList[i].intt_acc_cd
            console.log(toReturn.acc_cd)
          }
        }
      } //marker
      //  else if(!this.td.trans_mode.value && this.td.acc_type_cd.value==6){
      //   for(let i=0;i<InvestmentTransactionsComponent.constitutionList.length;i++){
      //     if(InvestmentTransactionsComponent.constitutionList[i].constitution_cd==this.constCd && InvestmentTransactionsComponent.constitutionList[i].acc_type_cd==accTypeCd)
      //    { toReturn.acc_cd=InvestmentTransactionsComponent.constitutionList[i].acc_cd
      //     console.log(toReturn.acc_cd)}
      //    } //marker
      //  }
      console.log(toReturn.trans_type);
      this.trans = toReturn.trans_type

      // //debugger
      // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd //marker was kept outside in marker1 not working for update
    }
    // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment')
    ; //marker1

    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('getIPAddress');
    toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
    toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
    ////////////debugger;
    // console.log({"ss":toReturn.particulars,"sss":this.td.particulars.value.split(' ')[0],"replace":this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
    // return;
  }
  private getShadowBalance(): void {
    const tmDep = new tm_deposit();
    this.ShadowBalance = 0;
    tmDep.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    // tmDep.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    tmDep.acc_num = this.accNoEnteredForTransaction.acc_num;
    tmDep.ardb_cd = this.sys.ardbCD;
    this.svc.addUpdDel<any>('Deposit/GetShadowBalance', tmDep).subscribe(
      res => {
        if (undefined !== res && null !== res && !isNaN(+res)) {
          this.ShadowBalance = res;
          this.accDtlsFrm.patchValue({
            shadow_bal: res
          });
        }
      },
      err => { this.isLoading = false; console.log(err); }
    );
  }
  onDeleteClick(): void {
    if (!(confirm('Are you sure you want to Delete Transaction of Acc '
      + this.accNoEnteredForTransaction.acc_num
      + ' with Transancation Cd ' + this.selectedUnapprovedTransactionToEdit.trans_cd))) {
      return;
    }

    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.selectedUnapprovedTransactionToEdit.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = (+this.f.acc_type_cd.value);
    param.acc_num = this.accNoEnteredForTransaction.acc_num;

    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, this.accNoEnteredForTransaction.acc_num
            + '\'s Transaction with Transacation Cd ' + this.selectedUnapprovedTransactionToEdit.trans_cd
            + ' is deleted.');
          this.onResetClick();
        } else {
          this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
  }
  onResetClick(): void {
      this.resetClick=true



    // this.HandleMessage(false);
    this.suggestedCustomerCr = null
    this.disabledTrfOnNull = true
    this.suggestedCustomer = [];
    this.showtransdetails = false;
    this.resetClicked = true;
    this.disabledOnNull = true
    this.shownoresult = false;

    this.trftype = ''
    // console.log(this.f.acct_num.value.length)
    // this.f.acct_num.value.length=0
    this.editDeleteMode = false;
    this.showBalance = false
    this.accTransFrm.reset();
    this.tdDefTransFrm.reset();
     this.showTransactionDtlR = false;
     this.showTransactionDtlC = false;
    // this.getOperationMaster();
    this.f.oprn_cd.disable();
    this.f.acct_num.disable();
    this.accNoEnteredForTransaction = undefined;
    // this.msg.sendCommonTmDepositAll(null);
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];
    this.mat_val = 0
    this.showCloseInterest = false;  //marker
  }
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  private getUnapprovedDepTransAskViewEditOption(): void {
    console.log('getUnapprovedDepTransAskViewEditOption')
    this.isLoading = true;
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.trans_type='I'
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        console.log(res)
        //////////////debugger;
        this.isLoading = false;
        if (res.length > 0) {
          this.unApprovedTransactionLst = res;
          this.unApprovedTransactionLstOfAcc = this.unApprovedTransactionLst.filter(e => e.acc_num
            === this.f.acct_num.value.toString());
          if (undefined !== this.unApprovedTransactionLstOfAcc &&
            null !== this.unApprovedTransactionLstOfAcc &&
            this.unApprovedTransactionLstOfAcc.length > 0) {
            this.modalRef = this.modalService.show(this.unappconfirm,
              { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: false });
          }
        }
      },
      err => { this.isLoading = false; }
    );
  }
  public onUpapprovedConfirm(selectedTransactionToEdit: td_def_trans_trf): void {
    console.log(selectedTransactionToEdit)
    this.remarks = selectedTransactionToEdit.remarks
    this.disableOperation = true;
    this.editDeleteMode = true;
    this.selectedUnapprovedTransactionToEdit = selectedTransactionToEdit;
    this.modalRef.hide();
    // this.showTransactionDtlR = true;
    this.getDepTrans(selectedTransactionToEdit);
    // this.getDenominationOrTransferDtl(selectedTransactionToEdit);
  }

  private getDepTrans(depTras: td_def_trans_trf): void {
    this.isLoading = true;

    // this.showCust = false; // this is done to forcibly rebind the screen
    // const defTransaction = new td_def_trans_trf();
    // defTransaction.trans_cd = this.selectedTransactionCd;
    // defTransaction.brn_cd = localStorage.getItem('__brnCd');
    console.log(depTras)
    this.svc.addUpdDel<td_def_trans_trf>('Common/GetDepTrans', depTras).subscribe(
      res => {
        console.log('deptrans', res)
        // this.deptransData=res[0]
        // console.log(this.deptransData.trans_mode)
        // this.selectedVm.td_def_trans_trf = res[0];
        // this.msg.sendCommonTransactionInfo(res[0]); // show transaction details
        // this.setTransactionDtl(res[0]);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
    // console.log(this.deptransData)

  }
  public onUpapprovedCancel(): void {
    console.log("close modal")
    this.editDeleteMode = false;
    this.selectedUnapprovedTransactionToEdit = null;
    this.modalRef.hide();
    // this.showTransactionDtlR = false;
    // this.showTransactionDtlC = false;
  }
}
