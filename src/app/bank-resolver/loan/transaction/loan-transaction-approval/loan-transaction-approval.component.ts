import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranApprovalVM } from 'src/app/bank-resolver/Models/TranApprovalVM';
import {
  MessageType, mm_acc_type, mm_customer,
  ShowMessage, SystemValues,
  td_def_trans_trf, tm_deposit
} from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { Router } from '@angular/router';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { FormBuilder, FormGroup } from '@angular/forms';
import { tm_denomination_trans } from 'src/app/bank-resolver/Models/deposit/tm_denomination_trans';
import Utils from 'src/app/_utility/utils';


@Component({
  selector: 'app-loan-transaction-approval',
  templateUrl: './loan-transaction-approval.component.html',
  styleUrls: ['./loan-transaction-approval.component.css']
})
export class LoanTransactionApprovalComponent implements OnInit {
  constructor(private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router,
    private frmBldr: FormBuilder) { }

  static accType: mm_acc_type[] = [];
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  selectedAccountType: number;
  selectedTransactionMode: string;
  vm: TranApprovalVM[] = [];
  filteredVm: TranApprovalVM[] = [];
  selectedVm: TranApprovalVM;
  selectedTransactionCd: number;
  isLoading = false;
  showMsg: ShowMessage;
  disableApprove = true;
  tdDepTrans = new td_def_trans_trf();
  tdDepTransGroup: any;
  custTitle: string;
  uniqueAccTypes: mm_acc_type[] = [];
  modalRef: BsModalRef;
  sys = new SystemValues();
  transactionDtlsFrm: FormGroup;
  showDenominationDtl = false;
  tmDenominationTransLst: tm_denomination_trans[] = [];
  totalOfDenomination = 0;
  loanOpenDm: LoanOpenDM;
  showINSTNO=false;
  tranferDetails: td_def_trans_trf[] = [];
  // cust: mm_customer;
  // tdDepTransRet: td_def_trans_trf[] = [];
  frmParticulars: any;
  trfDtls:boolean=false;
  ngOnInit(): void {
    this.showINSTNO=false;
    this.transactionDtlsFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      party: [''],
      curr_prn: [''],
      ovd_prn: [''],
      curr_intt: [''],
      ovd_intt: [''],
      loan_id: [''],
      trans_type: [''],
      curr_prn_recov: [''],
      ovd_prn_recov: [''],
      curr_intt_recov: [''],
      ovd_intt_recov: [''],
      mis_advance_recov: [''],
      share_amt: [''],
      trf_type_desc: [''],
      tot_Prn: [''],
      share_holding: [''],
      audit_fees: [''],
      mis_adv: [''],
      amount: [''],
      intt_till_dt: [''],
      particulars: [''],
      activity_cd: [''],
      instrument_no: [''],
      voucher_id: [''],
      sum_assured: [''],
      audit_fees_recc: [''],
      approval_status: [''],
      acc_num: [''],
      trans_mode: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      token_num: [''],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
      approved_by: [''],
      approved_dt: [''],
      tr_acc_type_cd: [''],
      tr_acc_num: [''],
      voucher_dt: [''],
      trf_type: [''],
      tr_acc_cd: [''],
      acc_cd: [''],
      paid_amt: [''],
      remarks: [''],
      crop_cd: [''],
      curr_intt_rate: [''],
      ovd_intt_rate: [''],
      instl_no: [''],
      instl_start_dt: [''],
      periodicity: [''],
      disb_id: [''],
      comp_unit_no: [''],
      ongoing_unit_no: [''],
      audit_fees_recov: [''],
      sector_cd: [''],
      spl_prog_cd: [''],
      borrower_cr_cd: [''],
      numbert_till_dt: [''],
      acc_name: [''],
      brn_cd: [''],
      penal_intt_recov:[''],
      adv_prn_recov:['']
    });
    setTimeout(() => {
      this.getAcctTypeMaster();
    }, 150);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  public onClickRefreshList() {
    this.HandleMessage(false);
    this.msg.sendCommonTransactionInfo(null);
    this.msg.sendCommonCustInfo(null);
    this.msg.sendCommonAcctInfo(null);
    this.msg.sendCommonAccountNum(null);
    this.getAcctTypeMaster();
    this.transactionDtlsFrm.reset();
    this.showINSTNO=false;
    this.trfDtls=false;
    this.totalOfDenomination=0;

    
  }

  setTransactionDtl(): void {
    this.showDenominationDtl = false;
    this.totalOfDenomination = 0;
    if (null !== this.loanOpenDm &&
      undefined !== this.loanOpenDm && Object.keys(this.loanOpenDm).length !== 0) {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          const accType = res.filter(e => e.acc_type_cd === this.loanOpenDm.tddeftrans.acc_type_cd)[0];
          console.log(this.loanOpenDm.tddeftrans);
          this.frmParticulars = this.loanOpenDm.tddeftrans.trans_type == 'R' ? (this.loanOpenDm.tddeftrans.particulars == 'M' ? 'Manual' : this.loanOpenDm.tddeftrans.particulars == 'OTS'? 'OTS' : 'Auto') : 'S'
         
          console.log(this.transactionDtlsFrm.controls.paid_amt.value)
          // console.log(this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value)
          console.log(this.transactionDtlsFrm.controls.curr_intt_recov.value)
         console.log(this.transactionDtlsFrm.controls.curr_prn_recov.value)
         console.log(this.transactionDtlsFrm.controls.ovd_prn_recov.value)
         console.log(this.transactionDtlsFrm.controls.ovd_intt_recov.value)
         console.log(this.transactionDtlsFrm.controls.adv_prn_recov.value)
         console.log(this.transactionDtlsFrm.controls.penal_intt_recov.value)

        
        //  else{
          this.transactionDtlsFrm.patchValue({
            trans_dt: this.loanOpenDm.tddeftrans.trans_dt.toString().substr(0, 10),
            trans_cd: this.loanOpenDm.tddeftrans.trans_cd,
            acc_type_cd: accType.acc_type_desc,
            party: this.loanOpenDm.tmloanall.cust_name,
            curr_prn: this.loanOpenDm.tmloanall.curr_prn,
            ovd_prn: this.loanOpenDm.tmloanall.ovd_prn,
            curr_intt: this.loanOpenDm.tmloanall.curr_intt,
            ovd_intt: this.loanOpenDm.tmloanall.ovd_intt,
            loan_id: this.loanOpenDm.tmloanall.loan_id,
            tot_Prn: this.loanOpenDm.tmloanall.curr_prn + this.loanOpenDm.tmloanall.ovd_prn,
            share_holding: this.loanOpenDm.tmloanall.tot_share_holding,
            audit_fees: this.loanOpenDm.tddeftrans.audit_fees_recov,
            mis_adv: this.loanOpenDm.tddeftrans.mis_advance_recov,
            intt_till_dt: this.loanOpenDm.tddeftrans.intt_till_dt,
            instrument_no: this.loanOpenDm.tddeftrans.instrument_num,
            audit_fees_recc: this.loanOpenDm.tddeftrans.audit_fees_recov,
            acc_num: this.loanOpenDm.tddeftrans.acc_num,
            // trans_type: this.loanOpenDm.tddeftrans.trans_type === 'R' ? 'Recovery' :
            //   this.loanOpenDm.tddeftrans.trans_type === 'D' ? 'Disbursement' :
            //     this.loanOpenDm.tddeftrans.trans_type === 'I' ? 'Interest Payment' : null,
            trans_mode: this.loanOpenDm.tddeftrans.trans_mode === 'R' ? 'Renewal' :
              this.loanOpenDm.tddeftrans.trans_mode === 'C' ? 'Close' :
                this.loanOpenDm.tddeftrans.trans_mode === 'I' ? 'Interest Payment' :
                  this.loanOpenDm.tddeftrans.trans_mode === 'W' ? 'Withdrawal Slip' :
                    this.loanOpenDm.tddeftrans.trans_mode === 'V' ? 'Voucher' :
                      this.loanOpenDm.tddeftrans.trans_mode === 'O' ? 'Open' : 
                        this.loanOpenDm.tddeftrans.trans_mode === 'Q' ? 'Cheque' : null,
            amount: this.loanOpenDm.tddeftrans.amount,
            instrument_dt: this.loanOpenDm.tddeftrans.instrument_dt.toString() === '0001-01-01T00:00:00' ? null :
              this.loanOpenDm.tddeftrans.instrument_dt.toString().substr(0, 10),
            instrument_num: this.loanOpenDm.tddeftrans.instrument_num === 0 ? null :
              this.loanOpenDm.tddeftrans.instrument_num,
            paid_to: this.loanOpenDm.tddeftrans.paid_to,
            token_num: this.loanOpenDm.tddeftrans.token_num,
            approval_status: this.loanOpenDm.tddeftrans.approval_status === 'U' ? 'Unapproved' :
              this.loanOpenDm.tddeftrans.approval_status === 'A' ? 'Approved' : '',
            approved_by: this.loanOpenDm.tddeftrans.approved_by,
            approved_dt: this.loanOpenDm.tddeftrans.approved_dt.toString().substr(0, 10),

            particulars: this.loanOpenDm.tddeftrans.trans_type == 'R' ? (this.loanOpenDm.tddeftrans.particulars == 'M' ? 'Manual' : this.loanOpenDm.tddeftrans.particulars == 'OTS' ? 'OTS':'Auto') : 'S',
            tr_acc_type_cd: this.loanOpenDm.tddeftrans.tr_acc_type_cd,
            tr_acc_num: this.loanOpenDm.tddeftrans.tr_acc_num,
            voucher_dt: this.loanOpenDm.tddeftrans.voucher_dt.toString().substr(0, 10),
            voucher_id: this.loanOpenDm.tddeftrans.voucher_id,
            trf_type: this.loanOpenDm.tddeftrans.trf_type === 'C' ? 'Cash' :
              this.loanOpenDm.tddeftrans.trf_type === 'T' ? 'Transfer' : '',
            tr_acc_cd: this.loanOpenDm.tddeftrans.tr_acc_cd,
            acc_cd: this.loanOpenDm.tddeftrans.acc_cd,
            share_amt: this.loanOpenDm.tddeftrans.share_amt,
            sum_assured: this.loanOpenDm.tddeftrans.sum_assured,
            paid_amt: this.loanOpenDm.tddeftrans.paid_amt,
            curr_prn_recov: this.loanOpenDm.tddeftrans.curr_prn_recov,
            ovd_prn_recov: this.loanOpenDm.tddeftrans.ovd_prn_recov,
            curr_intt_recov: this.loanOpenDm.tddeftrans.curr_intt_recov,
            ovd_intt_recov: this.loanOpenDm.tddeftrans.ovd_intt_recov,
            remarks: this.loanOpenDm.tddeftrans.remarks,
            crop_cd: this.loanOpenDm.tddeftrans.crop_cd,
            activity_cd: this.loanOpenDm.tddeftrans.activity_cd,
            curr_numbert_rate: this.loanOpenDm.tddeftrans.curr_intt_rate,
            ovd_numbert_rate: this.loanOpenDm.tddeftrans.ovd_intt_rate,
            instl_no: this.loanOpenDm.tddeftrans.instl_no,
            instl_start_dt: this.loanOpenDm.tddeftrans.instl_start_dt.toString().substr(0, 10),
            periodicity: this.loanOpenDm.tddeftrans.periodicity,
            disb_id: this.loanOpenDm.tddeftrans.disb_id,
            comp_unit_no: this.loanOpenDm.tddeftrans.comp_unit_no,
            ongoing_unit_no: this.loanOpenDm.tddeftrans.ongoing_unit_no,
            mis_advance_recov: this.loanOpenDm.tddeftrans.mis_advance_recov,
            audit_fees_recov: this.loanOpenDm.tddeftrans.audit_fees_recov,
            sector_cd: this.loanOpenDm.tddeftrans.sector_cd,
            spl_prog_cd: this.loanOpenDm.tddeftrans.spl_prog_cd,
            borrower_cr_cd: this.loanOpenDm.tddeftrans.borrower_cr_cd,
            numbert_till_dt: this.loanOpenDm.tddeftrans.intt_till_dt,
            acc_name: this.loanOpenDm.tddeftrans.acc_name,
            brn_cd: this.loanOpenDm.tddeftrans.brn_cd,
            trans_type: this.loanOpenDm.tddeftrans.trans_type == 'B' ? 'Disbursement' : 'Recovery',
            penal_intt_recov: this.loanOpenDm.tddeftrans.penal_intt_recov,
            adv_prn_recov:this.loanOpenDm.tddeftrans.adv_prn_recov
          });
          
       
          this.getDenominationOrTransferDtl(this.loanOpenDm.tddeftrans);
          if(this.loanOpenDm.tddeftrans.trans_type == 'R' && this.transactionDtlsFrm.controls.paid_amt.value !=(this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value)){
            debugger;
            this.HandleMessage(true, MessageType.Error, 'Total amount '+this.transactionDtlsFrm.controls.amount.value + ' does not match with recovery amount of ' + (this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value));
                  //  return
                   this.transactionDtlsFrm.reset()
                   this.showINSTNO=false;
           }
        
        },
        err => { this.isLoading = false; }
      );
    } else { this.transactionDtlsFrm.reset();
      this.showINSTNO=false; }
    
    if(this.loanOpenDm.tddeftrans.trf_type === 'T'){
      this.trfDtls=true;
    }
    else{
      this.trfDtls=false;

    }

  }

  private getDenominationOrTransferDtl(transactionDtl: td_def_trans_trf): void {
    this.tmDenominationTransLst = [];
    this.tranferDetails = [];
    if (transactionDtl.trf_type === 'C') {
      let tmDenoTrf = new tm_denomination_trans();
      tmDenoTrf.brn_cd = this.sys.BranchCode;
      tmDenoTrf.trans_cd = transactionDtl.trans_cd;
      tmDenoTrf.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      this.svc.addUpdDel<any>('Common/GetDenominationDtls', tmDenoTrf).subscribe(
        res => {
          if (null !== res && Object.keys(res).length !== 0) {
            this.showDenominationDtl = true;
            this.tmDenominationTransLst = res;
            this.tmDenominationTransLst.forEach(element => {
              this.totalOfDenomination += element.total;
            });
          }
        },
        err => { }
      );
    } else {
      let tdDefTranTransfr = new td_def_trans_trf();
      tdDefTranTransfr.brn_cd = this.sys.BranchCode;
      tdDefTranTransfr.trans_cd = transactionDtl.trans_cd;
      tdDefTranTransfr.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      // tdDefTranTransfr.trans_type = transactionDtl.trans_type;
      this.svc.addUpdDel<any>('Common/GetDepTransTrfwithChild', tdDefTranTransfr).subscribe(
        res => {
          //debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            this.tranferDetails = res;
            // this.showTransferDtl = true;
            this.totalOfDenomination = 0;
            this.tranferDetails.forEach(e => {
              this.totalOfDenomination += (+e.amount);
            });
            // this.tmDenominationTransLst = res;
            // this.tmDenominationTransLst.forEach(element => {
            //   this.totalOfDenomination += element.total;
            // });
          }
        },
        err => { }
      );
    }
  }

  private getAcctTypeMaster(): void {
    this.isLoading = true;
    if (undefined !== LoanTransactionApprovalComponent.accType &&
      null !== LoanTransactionApprovalComponent.accType &&
      LoanTransactionApprovalComponent.accType.length > 0) {
      this.isLoading = false;
      // this.uniqueAccTypes = TransactionapprovalComponent.accType;
      this.GetUnapprovedDepTrans();
    } else {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          LoanTransactionApprovalComponent.accType = res;
          this.isLoading = false;
          // this.uniqueAccTypes = TransactionapprovalComponent.accType;
          this.GetUnapprovedDepTrans();
        },
        err => { this.isLoading = false; }
      );
    }
  }
  public selectTransaction(vm: TranApprovalVM): void {
    this.disableApprove = false;
    this.selectedVm = vm;
    this.selectedTransactionCd = vm.td_def_trans_trf.trans_cd;
    this.selectedAccountType = vm.td_def_trans_trf.acc_type_cd;
    this.selectedTransactionMode = vm.td_def_trans_trf.trans_mode;
    // this.getTranAcctInfo(vm.td_def_trans_trf.acc_num);
    this.getDepTrans(vm.td_def_trans_trf);
    this.showINSTNO=true;
  }
  private getDepTrans(depTras: td_def_trans_trf): void {
    //debugger;
    this.isLoading = true;
    const tmLoanAll = new tm_loan_all();
    let loanOpnDm = new LoanOpenDM();

    tmLoanAll.loan_id = '' + depTras.acc_num;
    tmLoanAll.brn_cd = this.sys.BranchCode;
    tmLoanAll.acc_cd = depTras.acc_type_cd;

    this.svc.addUpdDel<any>('Loan/GetLoanData', tmLoanAll).subscribe(
      res => {
        //debugger;
        
        loanOpnDm = res;
        this.selectedVm.loan = loanOpnDm;
        // this.msg.sendCommonLoanTransactionInfo(res); // show transaction details
        this.loanOpenDm = res;
        this.setTransactionDtl();
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }
  private getCustInfo(cust_cd: number): void {
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    const cust = new mm_customer(); cust.cust_cd = cust_cd;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
      res => {
        this.selectedVm.mm_customer = res[0];
        this.msg.sendCommonCustInfo(res[0]);
        this.msg.sendcustomerCodeForKyc(this.selectedVm.mm_customer.cust_cd);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }
  private getTranAcctInfo(forAcc: string): void {
    this.isLoading = false;
    let acc = new tm_deposit();
    acc.acc_num = forAcc; acc.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<tm_deposit>('Deposit/GetDepositView', acc).subscribe(
      res => {
        acc = res[0];
        this.selectedVm.tm_deposit = acc;
        ;
        this.msg.sendCommonAcctInfo(acc);
        this.msg.sendCommonAccountNum(acc.acc_num);
        this.isLoading = false;
        // this.getCustInfo(acc.cust_cd);
      },
      err => { this.isLoading = false; }
    );
  }
 /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  private GetUnapprovedDepTrans(): void {
    ;
    this.isLoading = true;
    this.tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.tdDepTrans.trans_type = 'L';
    this.tdDepTrans.ardb_cd = this.sys.ardbCD
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', this.tdDepTrans).subscribe(
      res => {
        //debugger;
        const tdDepTransRet = res as td_def_trans_trf[];
        this.vm = [];
        tdDepTransRet.forEach(element => {
          const vm = new TranApprovalVM();
          vm.mm_acc_type = LoanTransactionApprovalComponent.accType.
            filter(e => e.acc_type_cd === element.acc_type_cd && e.dep_loan_flag === 'L')[0];
          vm.td_def_trans_trf = element;
          this.vm.push(vm);
        this.isLoading = false;

          // add and check account type in unique account type list
          const isAcctTypePresent = this.uniqueAccTypes.filter(e => e.acc_type_cd === vm.mm_acc_type.acc_type_cd)[0];
          if (undefined === isAcctTypePresent) {
            this.uniqueAccTypes.push(vm.mm_acc_type);
          }
        });
        this.uniqueAccTypes = this.uniqueAccTypes.sort((a, b) => (a.acc_type_cd < b.acc_type_cd ? -1 : 1));
        this.filteredVm = this.vm;
        this.filteredVm = this.filteredVm.sort((a, b) => (a.td_def_trans_trf.trans_cd < b.td_def_trans_trf.trans_cd ? -1 : 1));
        // this.tdDepTransGroup = this.groupBy(this.tdDepTransRet, (c) => c.acc_type_cd);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }
  // public onApproveClick(): void {
  //   this.isLoading = true;
  //   debugger;
  //   console.log(this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value)
  //   debugger
  //   const param = new p_loan_param();
  //   param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
  //   param.intt_dt = this.selectedVm.loan.tddeftrans.intt_till_dt;
  //   // const dt = this.sys.CurrentDate;
  //   param.loan_id = this.selectedVm.loan.tmloanall.loan_id;
  //   param.acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
  //   // param.recov_amt = this.selectedVm.loan.tddeftrans.rec;
  //   param.curr_intt_rate = this.selectedVm.loan.tmloanall.curr_intt_rate;
  //   param.curr_prn_recov = this.selectedVm.loan.tmloanall.curr_prn;
  //   param.curr_intt_recov = this.selectedVm.loan.tmloanall.curr_intt;
  //   param.ovd_intt_recov = this.selectedVm.loan.tmloanall.ovd_intt;
  //   param.ardb_cd = this.sys.ardbCD
  //   // param.gs_user_type = this.sys.u;
  //   param.gs_user_id = this.sys.UserId;
  //   param.commit_roll_flag = 1;
  //   if (this.selectedVm.td_def_trans_trf.trans_type === 'R') {
  //     this.svc.addUpdDel<any>('Loan/CalculateLoanInterest', param).subscribe(
  //       loanRes => {
  //         this.isLoading = false;
  //         this.approveLoanAccTransaction();
  //       },
  //       loanErr => {
  //         this.isLoading = false;
  //         this.HandleMessage(true, MessageType.Error, loanErr.error.text);
  //       }
  //     );
  //   }
   
  //   else {
  //     if(this.loanOpenDm.tddeftrans.trans_type=='R'){
  //       console.log(this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value)
  //     //  debugger
  //       if(this.transactionDtlsFrm.controls.amount.value!= (this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt.value))
  //       {
  //           this.HandleMessage(true, MessageType.Error, 'Total amount '+this.transactionDtlsFrm.controls.amount.value + ' does not match with recovery amount of ' + (this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value));
  //            return
  //       }
  //     }
  //     else
  //         this.approveLoanAccTransaction();
  //   }


  //   // this.svc.addUpdDel<any>('Deposit/ApproveAccountTranaction', param).subscribe(
  //   //   res => {
  //   //     this.isLoading = false;
  //   //     if (res === 0) {
  //   //       this.selectedVm.td_def_trans_trf.approval_status = 'A';
  //   //       this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
  //   //         + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
  //   //         + ' is approved.');
  //   //       setTimeout(() => {
  //   //         this.onClickRefreshList();
  //   //       }, 3000);
  //   //     } else {
  //   //       this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
  //   //     }
  //   //   },
  //   //   err => {
  //   //     this.isLoading = false;
  //   //     this.HandleMessage(true, MessageType.Error, err.error.text);
  //   //   }
  //   // );

  // }
  public onApproveClick(): void {
    this.modalRef.hide();
    this.isLoading = true;
    debugger;
    console.log(this.transactionDtlsFrm.controls.loan_id.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value)
    debugger
    const param = new p_loan_param();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.intt_dt = this.selectedVm.loan.tddeftrans.intt_till_dt;
    // const dt = this.sys.CurrentDate;
    param.loan_id = this.selectedVm.loan.tmloanall.loan_id;
    param.acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    // param.recov_amt = this.selectedVm.loan.tddeftrans.rec;
    param.curr_intt_rate = this.selectedVm.loan.tmloanall.curr_intt_rate;
    param.curr_prn_recov = this.selectedVm.loan.tmloanall.curr_prn;
    param.curr_intt_recov = this.selectedVm.loan.tmloanall.curr_intt;
    param.ovd_intt_recov = this.selectedVm.loan.tmloanall.ovd_intt;
    param.ardb_cd = this.sys.ardbCD
    // param.gs_user_type = this.sys.u;
    param.gs_user_id = this.sys.UserId;
    param.commit_roll_flag = 1;
    if (this.selectedVm.td_def_trans_trf.trans_type === 'R') {
      this.svc.addUpdDel<any>('Loan/CalculateLoanInterest', param).subscribe(
        loanRes => {
          this.isLoading = false;
          // if(this.transactionDtlsFrm.controls.amount.value!= (this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt.value))
          //   {
          //       this.HandleMessage(true, MessageType.Error, 'Total amount '+this.transactionDtlsFrm.controls.amount.value + ' does not match with recovery amount of ' + (this.transactionDtlsFrm.controls.curr_intt_recov.value + this.transactionDtlsFrm.controls.curr_prn_recov.value + this.transactionDtlsFrm.controls.ovd_prn_recov.value + this.transactionDtlsFrm.controls.ovd_intt_recov.value + this.transactionDtlsFrm.controls.adv_prn_recov.value + this.transactionDtlsFrm.controls.penal_intt_recov.value));
          //        return
          //   }
          //   else
             this.approveLoanAccTransaction();
        },
        loanErr => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, loanErr.error.text);
        }
      );
    }
   
    else {
     
          this.approveLoanAccTransaction();
    }


    // this.svc.addUpdDel<any>('Deposit/ApproveAccountTranaction', param).subscribe(
    //   res => {
    //     this.isLoading = false;
    //     if (res === 0) {
    //       this.selectedVm.td_def_trans_trf.approval_status = 'A';
    //       this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
    //         + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
    //         + ' is approved.');
    //       setTimeout(() => {
    //         this.onClickRefreshList();
    //       }, 3000);
    //     } else {
    //       this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
    //     }
    //   },
    //   err => {
    //     this.isLoading = false;
    //     this.HandleMessage(true, MessageType.Error, err.error.text);
    //   }
    // );

  }
  private approveLoanAccTransaction(): void {
    this.isLoading = true;
    const trnParam = new p_gen_param();
    trnParam.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    trnParam.ad_trans_cd =this.transactionDtlsFrm.controls.trans_cd.value!=null? this.selectedVm.td_def_trans_trf.trans_cd:null;

    // const dt = this.sys.CurrentDate;
    trnParam.adt_trans_dt = this.sys.CurrentDate;
    // trnParam.ad_acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    // trnParam.as_acc_num = this.selectedVm.td_def_trans_trf.acc_num;
    trnParam.flag = this.selectedVm.td_def_trans_trf.trans_type === 'R' ? 'D' : 'W';
    trnParam.gs_user_id = this.sys.UserId+'/'+localStorage.getItem('getIPAddress');
    trnParam.ardb_cd = this.sys.ardbCD
    this.svc.addUpdDel<any>('Loan/ApproveLoanAccountTranaction', trnParam).subscribe(
      res => {
        debugger
        if (res === 0) {
          this.selectedVm.td_def_trans_trf.approval_status = 'A';
          this.HandleMessage(true, MessageType.Sucess,
            `Transaction with Transacation Cd ${this.selectedVm.td_def_trans_trf.trans_cd} is approved.`);
          setTimeout(() => {
            this.onClickRefreshList();
            // this.showDenominationDtl = false;
            // if (this.tranferDetails.length > 0) { this.tranferDetails = null; }
            this.isLoading = false;

          }, 3000);
        } else {
          this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        }
      },
      err => {
        debugger
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.status==400?'Select Transaction to be APPROVE!!':'Error from server side');
      
      }
    );
  }
  public onChangeAcctType(acctTypeCd: number): void {
    acctTypeCd = +acctTypeCd;
    if (acctTypeCd === -99) {
      this.filteredVm = this.vm;
    } else {
      this.filteredVm = this.vm.filter(e => e.mm_acc_type.acc_type_cd === acctTypeCd);
    }
  }
  public acctNumberAndTrnCdFilter(searchValue: string): void {
    if (null !== searchValue && '' !== searchValue) {
      this.filteredVm = this.vm.filter(e => e.td_def_trans_trf.acc_num.includes(searchValue) ||
        e.td_def_trans_trf.trans_cd.toString().includes(searchValue));
    } else {
      this.filteredVm = this.vm;
    }
  }
  public ShowOnlyRecovery(e: any): void {
    ;
    if (e.target.checked) {
      this.filteredVm = this.vm.filter(f => f.td_def_trans_trf.trans_type === 'R');
    } else {
      this.filteredVm = this.vm;
    }
  }
  onDeleteClick(): void {
    if (!(confirm('Are you sure you want to Delete Transaction with Transaction CD '
      + this.selectedVm.td_def_trans_trf.trans_cd))) {
      return;
    }
    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.selectedVm.td_def_trans_trf.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    param.acc_num = this.selectedVm.tm_deposit.acc_num;
    param.ardb_cd = this.sys.ardbCD
    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.onClickRefreshList();
          this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
            + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
            + ' is deleted.');
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

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  // groupBy(xs, f) {
  //   const gc = xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {})
  //   return Object.keys(gc).map(acc_type_cd => ({ acc_type_cd: acc_type_cd, events: gc[acc_type_cd] }));;
  // }
  // toggleSelection(i) {
  //   this.tdDepTransGroup[i].open = !this.tdDepTransGroup[i].open;
  // }
  // OnSelectTransaction(ev: any) {
  //   ;
  //   this.elementRef.nativeElement.style.setProperty('--bkcolor', 'red');
  // }

}
