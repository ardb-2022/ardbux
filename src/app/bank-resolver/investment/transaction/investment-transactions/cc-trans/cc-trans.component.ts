import { Router } from '@angular/router';
import { AccOpenDM } from '../../../../Models/deposit/AccOpenDM';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../../../Models';
import { tm_denomination_trans } from '../../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../../../Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../../../Models/deposit/mm_oprational_intr';
import { LoanOpenDM } from '../../../../Models/loan/LoanOpenDM';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { InvTranServService } from '../inv-tran-serv.service';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-cc-trans',
  templateUrl: './cc-trans.component.html',
  styleUrls: ['./cc-trans.component.css']
})
export class CcTransComponent implements OnInit {
  isLoading: boolean;
  showIns:boolean=true;
  showPTrns:boolean=true;
  accDtlsFrm: FormGroup;
  tdDefTransFrm:FormGroup;
  td_deftranstrfList: td_def_trans_trf[] = [];
  constitutionList: mm_constitution[] = [];
  static operationalInstrList: mm_oprational_intr[] = [];
  interestPeriod=0
  sys = new SystemValues();
  bankData=[]
  branch:any=[];
  branch1:any=[];
  masterModel = new AccOpenDM();
  tm_deposit = new tm_deposit();
  @Input() showTranDtlRe:boolean;
  @Input() showTranDtlCl:boolean;
  // @Input() showOnClose:boolean;
  get td() { return this.tdDefTransFrm.controls; }
  suggestedCustomerCr: mm_customer[];
  disabledTrfOnNull = true
  indxsuggestedCustomerCr = 0;
  selectedCust: any;
  TrfTotAmt = 0;
  diff: any;
  effInt:any;
  showtransdetails:boolean=false;
  tddefAccTypCd: any;
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  hidegl:boolean=true;
  glHead:any;
  public accNoEnteredForTransaction:any=this.invComServ.masterModel.tmdepositInv;
  showTransModeForR:boolean
  showMsg: ShowMessage;
  mat_val = 0;
  counter = 0;
  rdInClose: any;

  constructor(private invComServ:InvTranServService ,private svc: RestService, private msg: InAppMessageService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
    private modalService: BsModalService, private http:HttpClientModule) {
      
     }

  ngOnInit(): void {
    // this.showTranDtlRe=this.invComServ.showTransactionDtlR;
    // this.showTranDtlCl=this.invComServ.showTransactionDtlR;
    console.log(this.showTranDtlRe,this.showTranDtlCl);
    
    this.accDtlsFrm = this.frmBldr.group({
      opening_dt: [''],
      constitution_cd: [''],
      constitution_cd_desc:[''],
      oprn_instr_cd: [''],
      oprn_instr_desc:[''],
      intt_trf_type: [''],
      intt_rt: [''],
      prn_amt: [''],
      intt_amt: [''],
      dep_period: [''],
      dep_period_y:[''],
      dep_period_m:[''],
      dep_period_d:[''],
      mat_dt: [''],
      mat_amt: [''],
      bank_nm: [''],
      branch_nm: ['']

    })
    this.tdDefTransFrm = this.frmBldr.group({
      acc_type_cd:[''],
      acc_type_desc:[''],
      acc_num:[''],
      trans_type:[''],
      trans_mode1:[''],
      trans_type_key:[''],
      trf_type:[''],
      rpamount:[''],
      cpamount:[''],
      opening_dt: [''],
      constitution_cd: [''],
      constitution_cd_desc:[''],
      oprn_instr_cd: [''],
      oprn_instr_desc:[''],
      intt_trf_type: [''],
      intt_rate: [''],
      interest:[''],
      prn_amt: [''],
      intt_amt: [''],
      dep_period: [''],
      dep_period_y:[''],
      dep_period_m:[''],
      dep_period_d:[''],
      mat_dt: [''],
      mat_amt: [''],
      interest_c:[''],
      ovd_intt_recov:[''],
      curr_prn_recov:['']

      // bank_nm: [''],
      // branch_nm: ['']

    })
    this.showMsg = null;
     
    this.setAccDtlsFrmForm();
    this.setTrnsDtlsFrmForm();
   }
 
    
    public setAccDtlsFrmForm() {
      this.isLoading = false;
    
    console.log(this.invComServ.bankName,this.invComServ.branchName,this.invComServ.constitutionDes);
    
    debugger;

    if (undefined !== this.accNoEnteredForTransaction && Object.keys(this.accNoEnteredForTransaction).length !== 0) {
      // this.resetAccDtlsFrmFormData();
      // if (this.accNoEnteredForTransaction.acc_type_cd === 2
      //   || this.accNoEnteredForTransaction.acc_type_cd === 3
      //   || this.accNoEnteredForTransaction.acc_type_cd === 4) {
      //   this.showInterestDtls = true;
      //   this.accNoEnteredForTransaction.ShowClose = true;
      // }
      if (this.accNoEnteredForTransaction.acc_type_cd === 23) {
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      const OprnInstrDesc = CcTransComponent.operationalInstrList.filter(e => e.oprn_cd
        === this.accNoEnteredForTransaction.oprn_instr_cd)[0];

      let intrestType = '';
      this.interestPeriod=0
      if (this.accNoEnteredForTransaction.intt_trf_type === 'O') {
        intrestType = 'On Maturity';
        
      } else if (this.accNoEnteredForTransaction.intt_trf_type === 'H') {
        intrestType = 'Half Yearly'; this.interestPeriod=2
      } else if (this.accNoEnteredForTransaction.intt_trf_type === 'Q') {
        intrestType = 'Quarterly'; this.interestPeriod=4
      } else if (this.accNoEnteredForTransaction.intt_trf_type === 'M') {
        intrestType = 'Monthly'; this.interestPeriod=12
      }
      // console.log(this.td.rpamount.value)
      // console.log(this.accNoEnteredForTransaction.intt_trf_type=='H' || this.accNoEnteredForTransaction.intt_trf_type=='Q'? this.td.rpamount.value :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt)
      
      console.log(this.accDtlsFrm);
      console.log(this.accNoEnteredForTransaction);
      console.log(this.invComServ.bankName, this.invComServ.branchName);
      debugger
      this.accDtlsFrm.patchValue({
        
        // brn_cd: this.accNoEnteredForTransaction.brn_cd,
        // acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
        // acc_num: this.accNoEnteredForTransaction.acc_num,
        // renew_id: this.accNoEnteredForTransaction.renew_id,
        // cust_cd: this.accNoEnteredForTransaction.cust_cd,
        // cust_name: this.accNoEnteredForTransaction.cust_name,
        intt_trf_type: intrestType,
        // constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
        // constitution_cd_desc: (undefined !== constitution && null !== constitution
        //   && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
        //   constitution.constitution_desc : null,
        // oprn_instr_cd: this.accNoEnteredForTransaction.oprn_instr_cd,
        oprn_instr_desc: this.invComServ.operInsDESC,
        oprn_instr_cd: this.invComServ.operInsCD,

        opening_dt: this.accNoEnteredForTransaction.opening_dt.toString().substr(0, 10),
        constitution_cd_desc:this.invComServ.constitutionDes,
        constitution_cd:this.invComServ.constitutionCd,

        prn_amt: this.accNoEnteredForTransaction.prn_amt,
        intt_amt: this.accNoEnteredForTransaction.intt_amt,
        // mat_amt:this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
        mat_amt: this.accNoEnteredForTransaction.intt_trf_type === 'H'  ||this.accNoEnteredForTransaction.intt_trf_type === 'Q'? this.accNoEnteredForTransaction.prn_amt + this.interestPeriod*this.accNoEnteredForTransaction.intt_amt : this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
        
        
        dep_period_y: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1]),
        dep_period_m: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1]),
        dep_period_d: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1]),
        instl_amt: this.accNoEnteredForTransaction.instl_amt,
        instl_no: this.accNoEnteredForTransaction.instl_no,
        mat_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
        intt_rt: this.accNoEnteredForTransaction.intt_rt,
        
        bank_nm:this.invComServ.bankName,
        branch_nm:this.invComServ.branchName
      });
    // this.getBranchName(this.accNoEnteredForTransaction.bank_name)

      console.log(this.accDtlsFrm.controls.mat_amt.value);
      console.log();
      

      
    } 
  }
  public setTrnsDtlsFrmForm() {
    this.isLoading = false;
    this.td_deftranstrfList = [];

  
  debugger;

  if (undefined !== this.accNoEnteredForTransaction && Object.keys(this.accNoEnteredForTransaction).length !== 0) {
    
    if (this.accNoEnteredForTransaction.acc_type_cd === 23) {
      this.accNoEnteredForTransaction.ShowClose = true;
    }
    const OprnInstrDesc = CcTransComponent.operationalInstrList.filter(e => e.oprn_cd
      === this.accNoEnteredForTransaction.oprn_instr_cd)[0];

    let intrestType = '';
    this.interestPeriod=0
    if (this.accNoEnteredForTransaction.intt_trf_type === 'O') {
      intrestType = 'On Maturity';
      
    } else if (this.accNoEnteredForTransaction.intt_trf_type === 'H') {
      intrestType = 'Half Yearly'; this.interestPeriod=2
    } else if (this.accNoEnteredForTransaction.intt_trf_type === 'Q') {
      intrestType = 'Quarterly'; this.interestPeriod=4
    } else if (this.accNoEnteredForTransaction.intt_trf_type === 'M') {
      intrestType = 'Monthly'; this.interestPeriod=12
    }
    let acc_desc=''
    if (this.accNoEnteredForTransaction.acc_type_cd ==23) {
      acc_desc = 'Cash Certificate';
      
    }
    // console.log(this.td.rpamount.value)
    // console.log(this.accNoEnteredForTransaction.intt_trf_type=='H' || this.accNoEnteredForTransaction.intt_trf_type=='Q'? this.td.rpamount.value :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt)
    
    console.log(this.accDtlsFrm);
    console.log(this.accNoEnteredForTransaction);
    console.log(this.invComServ.bankName, this.invComServ.branchName);
    debugger
    this.tdDefTransFrm.patchValue({
      acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
      acc_type_desc: acc_desc,
      acc_num: this.accNoEnteredForTransaction.acc_num,
      rpamount: this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt,
      cpamount: this.accNoEnteredForTransaction.prn_amt,
      trans_type_key:'D',
      trans_type:'Deposit',
      intt_trf_type: this.accNoEnteredForTransaction.intt_trf_type,
      interest_c:this.accNoEnteredForTransaction.intt_amt,
      opening_dt:this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy"), 
      constitution_cd_desc:this.invComServ.constitutionDes,
      constitution_cd:this.invComServ.constitutionCd,
      // mat_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
      ovd_intt_recov:0,
      curr_prn_recov:0,
      mat_amt: this.accNoEnteredForTransaction.intt_trf_type === 'H'  ||this.accNoEnteredForTransaction.intt_trf_type === 'Q'? this.accNoEnteredForTransaction.prn_amt + this.interestPeriod*this.accNoEnteredForTransaction.intt_amt : this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
      dep_period_y: null === this.accNoEnteredForTransaction.dep_period ? ''
        : (this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1]),
      dep_period_m: null === this.accNoEnteredForTransaction.dep_period ? ''
        : (this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1]),
      dep_period_d: null === this.accNoEnteredForTransaction.dep_period ? ''
        : (this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1]),
      
      bank_nm:this.invComServ.bankName,
      branch_nm:this.invComServ.branchName
    });
    this.onDepositePeriodChange();
  // this.getBranchName(this.accNoEnteredForTransaction.bank_name)

    console.log(this.accDtlsFrm.controls.mat_amt.value);
    console.log();
    
    

    
  } 
}
onTransTypeChange(){
  debugger
  if(Number(this.accDtlsFrm.controls.mat_amt.value)===Number(this.tdDefTransFrm.controls.rpamount.value)){
    this.showtransdetails=false;
  }
  else{
    if(this.td.trf_type.value=='T'){
      debugger
      this.showtransdetails=true;
      this.addTransfer();
      this.onDepositePeriodChange();
     
    }
    else if(this.td.trf_type.value=='C'){
      debugger
      this.showtransdetails=false;
      this.inttCalOnClose()
    
    }
  }

}
onAmtChngDuringRenewal(): void {
  //////////////debugger;
  // const accTypeCd = +this.f.acc_type_cd.value;
  // this.showTranferType = false;
  this.HandleMessage(false);
  if ((+this.td.rpamount.value) <= 0) {
    this.HandleMessage(true, MessageType.Error, 'Amount can not be negative Or 0.');
    this.td.rpamount.setValue('');
    return;
  }
  console.log(this.td.rpamount.value, this.accDtlsFrm.controls.prn_amt.value)
  if ((this.td.rpamount.value != this.accDtlsFrm.controls.prn_amt.value) && (this.td.rpamount.value != this.accDtlsFrm.controls.mat_amt.value) &&(this.td.rpamount.value != this.accDtlsFrm.controls.intt_amt.value)) {
    this.HandleMessage(true, MessageType.Error, 'Amount should be equal to principal/interest/maturity amount');
    this.td.rpamount.setValue('');
    return;
  }
  if (this.td.trans_type_key.value === 'D' || this.td.trans_type_key.value === 'W') {
    const mat_amt = this.accNoEnteredForTransaction.prn_amt
      + this.accNoEnteredForTransaction.intt_amt;

    this.tdDefTransFrm.patchValue({
      trans_type: 'Withdraw',
      trans_type_key: 'W'
    })
   
    this.showtransdetails = this.tdDefTransFrm.controls.trans_mode.value == 'R' && this.tdDefTransFrm.controls.trf_type.value == 'T' ? true : false;
    //  this.mat_val=this.tdDefTransFrm.controls.interest.value? (this.f.prn_amt.value+this.tdDefTransFrm.controls.interest.value):'';
    //  console.log(this.mat_val)
    if ((mat_amt - (+this.td.rpamount.value)) > 0) {
      
      this.td.balance.setValue((mat_amt - (+this.td.rpamount.value)));
    } else if ((mat_amt - (+this.td.rpamount.value)) === 0) {
      
      this.td.balance.setValue((mat_amt - (+this.td.rpamount.value)));
    } else if (((+this.td.rpamount.value) - mat_amt) > 0) {
      // close transfer area
      this.HandleMessage(true, MessageType.Error, 'Amount can not be greater than maturity amount.');
      this.td.rpamount.setValue('');
      
      this.td.balance.setValue('');
      
      return;
    }
  }
  // this.td_deftranstrfList[0].amount = this.td.rpamount.value;
}
public inttCalOnClose(): void {
  if (this.accNoEnteredForTransaction.acc_type_cd === 23) {
    // debugger;
    const temp_gen_param = new p_gen_param();
    temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
    temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
    const cDt = this.sys.CurrentDate.getTime();
    const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
    // const o = Utils.convertStringToDt(this.td.opening_dt.value);
    const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
    console.log(this.accNoEnteredForTransaction.intt_rt, this.tdDefTransFrm.controls.ovd_intt_recov.value)
    // const diffDays = Math.ceil((Math.abs(cDt - opDt)) / (1000 * 3600 * 24));
    const diffDays = Math.ceil((Math.abs(matDt - opDt)) / (1000 * 3600 * 24));
    temp_gen_param.ai_period = diffDays;
    console.log(this.tdDefTransFrm.controls.eff_int.value)
    console.log(this.effInt)
    // temp_gen_param.ad_intt_rt=this.accNoEnteredForTransaction.intt_rt-this.tdDefTransFrm.controls.ovd_intt_recov.value
    temp_gen_param.ad_intt_rt = this.tdDefTransFrm.controls.eff_int.value!=null?this.tdDefTransFrm.controls.eff_int.value:this.effInt
    // this.isLoading = true;
    if (temp_gen_param.ad_intt_rt < 0) {
      console.log(temp_gen_param.ad_intt_rt)
      this.HandleMessage(true, MessageType.Error, 'Default penalty cannot be more than the actual interest rate');
      return;
    }
  
  
    this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
   //marker to change the interest on calculation 
  

  // marker to change the interest on calculation ends here
  }
  
  else {
    let param = new p_gen_param();
    param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
    param.ad_instl_amt = this.accNoEnteredForTransaction.instl_amt;
    console.log(param.ad_instl_amt)
    param.an_instl_no = this.counter;
    param.ad_intt_rt = (+this.tdDefTransFrm.controls.eff_int.value)

    param.ardb_cd = this.sys.ardbCD;
    param.ai_period = this.diff;
    // this.effInt=param.an_intt_rate
    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', param).subscribe(
      res => {
        console.log(res)
        this.rdInClose = res;
        if (undefined !== res
          && null !== res
          && res > 0) {
          this.tdDefTransFrm.patchValue({
            // eff_int:this.effInt,
            interest: res.toFixed(2),
            rpamount: param.ad_instl_amt * this.counter,
            //  interest: res,
            ovd_intt_recov: 0,
            bonus_amt: 0,
            curr_prn_recov: 0,
            td_def_mat_amt: param.ad_instl_amt * this.counter + res
          })
        }

        param = new p_gen_param();
        param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
        param.ardb_cd = this.sys.ardbCD;
       

      },
      err => { console.log(err); }
    );
  //marker for default penalty, bonus

    this.td.td_def_mat_amt.setValue((this.td.rpamount.value +
      (+this.td.interest.value) - (+this.td.ovd_intt_recov.value)
      + (+this.td.curr_prn_recov.value)).toFixed(2));
  }
  this.td.td_def_mat_amt.setValue((this.td.rpamount.value +
    (+this.td.interest.value) - (+this.td.ovd_intt_recov.value)
    + (+this.td.curr_prn_recov.value)).toFixed(2));
}
checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
  this.tddefAccTypCd = tdDefTransTrnsfr.acc_type_cd
  this.HandleMessage(false);
  if (tfrType === 'cust_acc') {
    if (tdDefTransTrnsfr.cust_acc_type === undefined
      || tdDefTransTrnsfr.cust_acc_type === null
      || tdDefTransTrnsfr.cust_acc_type === '') {
      tdDefTransTrnsfr.cust_name = null;
      tdDefTransTrnsfr.clr_bal = null;
      tdDefTransTrnsfr.cust_acc_desc = null;
      tdDefTransTrnsfr.cust_acc_number = null;
      return;
    }

    if (tdDefTransTrnsfr.gl_acc_code === undefined
      || tdDefTransTrnsfr.gl_acc_code === null
      || tdDefTransTrnsfr.gl_acc_code === '') {
      let temp_acc_type = new mm_acc_type();
      temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString()
        === tdDefTransTrnsfr.cust_acc_type.toString())[0];

      if (temp_acc_type === undefined || temp_acc_type === null) {
        tdDefTransTrnsfr.cust_acc_type = null;
        this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
        return;
      }
      else {
        tdDefTransTrnsfr.cust_acc_desc = temp_acc_type.acc_type_desc;
        tdDefTransTrnsfr.trans_type = tfrType;
      }
    }
    else {
      this.HandleMessage(true, MessageType.Error, 'GL Code in Transfer Details is not Blank');
      tdDefTransTrnsfr.cust_acc_type = null;
      return;
    }
  }
//Gl portion
  if (tfrType === 'gl_acc') {
  //   if (tdDefTransTrnsfr.gl_acc_code === undefined
  //     || tdDefTransTrnsfr.gl_acc_code === null
  //     || tdDefTransTrnsfr.gl_acc_code === '') {
  //     tdDefTransTrnsfr.gl_acc_desc = null;
  //     return;
  //   }

  // else  if (tdDefTransTrnsfr.gl_acc_code === this.sys.CashAccCode.toString()) {
  //     this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
  //       ' cash account code is not permissible.');
  //     tdDefTransTrnsfr.gl_acc_desc = null;
  //     tdDefTransTrnsfr.gl_acc_code = '';
  //     return;
  //   }

    // if (tdDefTransTrnsfr.cust_acc_type === undefined
    //   || tdDefTransTrnsfr.cust_acc_type === null
    //   || tdDefTransTrnsfr.cust_acc_type === '') {
    //   if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
        this.isLoading = true;
        let temp_acc_master:any = new m_acc_master();
        var dt={"ardb_cd":this.sys.ardbCD}
        this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
          res => {
             this.acc_master = res;
             this.acc_master1 = res;
            this.isLoading = false;
            // if(tdDefTransTrnsfr.acc_cd!=null){
              // debugger;
              console.log(res)
              this.hidegl=false;
              this.acc_master= this.acc_master1.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().toLowerCase().includes(tdDefTransTrnsfr.gl_acc_code.toString().toLowerCase())  );
            // }
            // temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code)  );
            
            // if (temp_acc_master === undefined || temp_acc_master === null) {
            //   tdDefTransTrnsfr.gl_acc_desc = null;
            //   this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
            //   return;
            // }
            // else {
              console.log( this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code)))
              tdDefTransTrnsfr.gl_acc_desc = this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code))[0].acc_name;
              // tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
              tdDefTransTrnsfr.trans_type = tfrType;
            // }
          },
          err => {

            this.isLoading = false;
          }
        );
      // }
      // else {
      //   let temp_acc_master = new m_acc_master();
      //   temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
      //   if (temp_acc_master === undefined || temp_acc_master === null) {
      //     tdDefTransTrnsfr.gl_acc_desc = null;
      //     // this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
      //     // return;
      //   }
      //   else {
      //     tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
      //     tdDefTransTrnsfr.trans_type = tfrType;
      //   }
      // }
    // }
    // else {
    //   this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details is not blank');
    //   tdDefTransTrnsfr.gl_acc_code = null;
    //   return;
    // }
  }
  // tdDefTransTrnsfr.amount = this.td.rpamount.value;
}
hidetab(e){
  if(!e.target.value.length){
    // debugger;
    this.acc_master.length=0
    this.acc_master=null
    this.glHead=document.getElementById('debit_gl_ac')
    this.glHead.value=''
    this.hidegl=true
  }
}
setGLCode(acc_cd: string, acc_name: string, indx: number, c: any){
  this.acc_master = null;
  this.hidegl=true;
  // console.log(this.suggestedCustomerCr.length)
  
  if (this.selectedCust != acc_cd) {
    this.td_deftranstrfList[indx].gl_acc_code = acc_cd;
    this.td_deftranstrfList[indx].gl_acc_desc = acc_name;
    // this.setDebitAccDtls(this.td_deftranstrfList[indx]);
  }
  
}
public removeTransfer(tdDefTransTrnsfr: td_def_trans_trf): void {
  this.td_deftranstrfList.forEach((e, i) => {
    if (undefined !== e.cust_acc_type
      && e.cust_acc_type === tdDefTransTrnsfr.cust_acc_type
      && e.cust_acc_number === tdDefTransTrnsfr.cust_acc_number) {
      this.td_deftranstrfList.splice(i, 1);
    } else if (undefined !== e.gl_acc_code
      && e.gl_acc_code === tdDefTransTrnsfr.gl_acc_code) {
      this.td_deftranstrfList.splice(i, 1);
    }
  });
  this.sumTransfer();
}
public addTransfer(): void {
  let emptyTranTranferExist = false;
  this.td_deftranstrfList.forEach(e => {
    if (undefined !== e && null !== e
      && (undefined === e.cust_acc_type && undefined === e.gl_acc_code)) {
      emptyTranTranferExist = true;
    }
  });
  if (!emptyTranTranferExist) {
    this.td_deftranstrfList.push(new td_def_trans_trf());
  }
}

  onChangeTrf(i: any) {
    this.suggestedCustomerCr = null;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      this.disabledTrfOnNull = false;
    }
    else {
      this.disabledTrfOnNull = true
    }
  }
  public suggestCustomerCr(i: number): void {
    //////////////debugger;
    this.isLoading = true;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.td_deftranstrfList[i].cust_acc_type;
      console.log(prm);
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerCr = res;
            this.indxsuggestedCustomerCr = i;
          } else {
            this.suggestedCustomerCr = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.isLoading = false;
      this.suggestedCustomerCr = null;
    }
  }
  setCustDtlsCr(acc_num: string, cust_name: string, indx: number, c: any) {
    this.suggestedCustomerCr = null;
    // console.log(this.suggestedCustomerCr.length)
    console.log(this.selectedCust)
    console.log(acc_num.substring(0, 3))
    if (this.selectedCust != acc_num) {
      this.td_deftranstrfList[indx].cust_acc_number = acc_num;
      this.td_deftranstrfList[indx].cust_name = cust_name;
      this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    }
    else {
      this.HandleMessage(true, MessageType.Error, "You cannot choose the same account!");
    }
  }

  setDebitAccDtls(tdDefTransTrnsfr: td_def_trans_trf) {
    //////////////debugger;
    console.log(tdDefTransTrnsfr)
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.cust_acc_type === undefined
      || tdDefTransTrnsfr.cust_acc_type === null
      || tdDefTransTrnsfr.cust_acc_type === '') {
      this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details can not be blank');
      tdDefTransTrnsfr.cust_acc_number = null;
      return;
    }

    if (tdDefTransTrnsfr.cust_acc_number === undefined ||
      tdDefTransTrnsfr.cust_acc_number === null ||
      tdDefTransTrnsfr.cust_acc_number === '') {
      tdDefTransTrnsfr.cust_name = null;
      tdDefTransTrnsfr.clr_bal = null;
      return;
    }
    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.sys.BranchCode;
    temp_deposit.acc_num = tdDefTransTrnsfr.cust_acc_number;
    temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);
    temp_deposit.ardb_cd = this.sys.ardbCD;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        this.isLoading = false;
        console.log(res);
        console.log(this.tdDefTransFrm.controls.rpamount.value)
        // debugger;

        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          temp_deposit_list = res;
          temp_deposit_list.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              tdDefTransTrnsfr.cust_name = element.cust_name;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
              tdDefTransTrnsfr.clr_bal = element.clr_bal;
              console.log(tdDefTransTrnsfr.particulars)
              // debugger;
            }
          });
          if (temp_deposit_list.length === 0) {
            this.HandleMessage(true, MessageType.Error, 'Invalid Account Number in Transfer Details');
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
          // if (!foundOneUnclosed) {
          //   this.HandleMessage(true, MessageType.Error,
          //     `Transfer details account number ${this.f.acct_num.value} is closed.`);
          //   tdDefTransTrnsfr.cust_acc_number = null;
          //   return;
          // }
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }
  checkDebitBalance(tdDefTransTrnsfr: td_def_trans_trf) {
   
    console.log(tdDefTransTrnsfr.amount)
    this.HandleMessage(false);
    console.log(this.td.trans_type_key)

    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
      return;
    }

    if ((+tdDefTransTrnsfr.amount) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Negative amount can not be entered.');
      tdDefTransTrnsfr.amount = 0;
      return;
    }

    if ((tdDefTransTrnsfr.cust_acc_number === undefined
      || tdDefTransTrnsfr.cust_acc_number === null
      || tdDefTransTrnsfr.cust_acc_number === '')
      && (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '')) {
      this.HandleMessage(true, MessageType.Warning, 'Please enter Account Number or GL Code');
      tdDefTransTrnsfr.amount = null;
      return;
    }


    if (tdDefTransTrnsfr.clr_bal === undefined
      || tdDefTransTrnsfr.clr_bal === null) {
      tdDefTransTrnsfr.clr_bal = 0;
    }
    
    console.log(tdDefTransTrnsfr,tdDefTransTrnsfr.gl_acc_code);
    
    if(tdDefTransTrnsfr.gl_acc_code === null || tdDefTransTrnsfr.gl_acc_code === ''|| tdDefTransTrnsfr.gl_acc_code === undefined){
      if ((+tdDefTransTrnsfr.clr_bal < (+tdDefTransTrnsfr.amount) )) {
      
      this.HandleMessage(true, MessageType.Warning, 'Insufficient Balance');
      tdDefTransTrnsfr.amount = null;
      // this.saveBtn.nativeElement.disabled=true
      return;
    }

    else {
      // this.saveBtn.nativeElement.disabled= false;
    }
  }
    this.sumTransfer();
  }
  private sumTransfer(): void {
    this.TrfTotAmt = 0;
    this.td_deftranstrfList.forEach(e => {
      this.TrfTotAmt += (+e.amount);
    });
    // console.log(this.td.rpamount.value+" "+this.TrfTotAmt)
    // if ((+this.td.rpamount.value) < this.TrfTotAmt) {
    //   this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
    //   // this.td_deftranstrfList[(this.td_deftranstrfList.length - 1)].amount = 0;
    // }
  }
  compareDate(e:any){
    // console.log(e.target.value)
    // console.log(this.accDtlsFrm.controls.mat_dt.value);
    // console.log(this.sys.CurrentDate.toDateString())
    // console.log(new Date(e.target.value)>new Date(this.accDtlsFrm.controls.mat_dt.value))
    // console.log(new Date(e.target.value)>new Date(this.sys.CurrentDate))
    // if(new Date(e.target.value)>=new Date(this.tdDefTransFrm.controls.mat_dt.value) && new Date(e.target.value)<=new Date(this.sys.CurrentDate))
    // console.log(true)
    // else
    // console.log(false)
    console.log("e>mat ", Utils.convertStringToDt(e.target.value)>Utils.convertStringToDt(this.accDtlsFrm.controls.mat_dt.value))
    console.log("e>curr", Utils.convertStringToDt(e.target.value)>this.sys.CurrentDate)
    if(Utils.convertStringToDt(e.target.value)>=Utils.convertStringToDt(this.accDtlsFrm.controls.mat_dt.value) && Utils.convertStringToDt(e.target.value)<=this.sys.CurrentDate )
    {
     this.onDepositePeriodChange()
    }
    else{
      this.HandleMessage(true, MessageType.Error,
        'Opening date should be greater than the maturity date and less than the operation date!');
     this.tdDefTransFrm.controls.opening_dt.setValue(this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy"))

    }
  
  }
  onDepositePeriodChange(): void {
    debugger
    let matDt = 0;
    this.tdDefTransFrm.patchValue({
      mat_dt: ''
    });
    const d = Utils.convertStringToDt(this.td.opening_dt.value);
    if ((+this.td.dep_period_y.value) > 0) {
      matDt = d.setFullYear(d.getFullYear() + (+this.td.dep_period_y.value));
    }
    if ((+this.td.dep_period_m.value) > 0) {
      matDt = d.setMonth(d.getMonth() + (+this.td.dep_period_m.value));
    }
    if ((+this.td.dep_period_d.value) > 0) {
      matDt = d.setDate(d.getDate() + (+this.td.dep_period_d.value));
    }
    if (matDt > 0) {
      console.log(matDt);
      
      debugger
      this.processInterest();
      this.tdDefTransFrm.patchValue({
        mat_dt: Utils.convertDtToString(new Date(matDt))
      });
    }
  }
  processInterest(): void {
    console.log(this.td);
    
    debugger
    const temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.td.acc_type_cd.value === 25) {
      // if (this.td.instl_amt.value === undefined || this.td.instl_amt.value === null ||
      //   this.td.instl_no.value === undefined || this.td.instl_no.value === null ||
      //   this.td.intt_rt.value === undefined || this.td.intt_rt.value === null)
      // // temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      // {
      //   return;
      // }

      temp_gen_param.ad_instl_amt = +this.td.instl_amt.value;
      temp_gen_param.an_instl_no = +this.td.instl_no.value;
      temp_gen_param.an_intt_rate = +this.td.intt_rt.value;
      this.calCrdIntReg(temp_gen_param);
    }
    else {

      // if (((this.tm_deposit.year === undefined || this.tm_deposit.year === null) &&
      //   (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
      //   (this.tm_deposit.day === undefined || this.tm_deposit.day === null)) ||
      //   this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
      //   this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null) {
      //   return;
      // }
      if (this.td.intt_trf_type.value === '' ||
        this.td.intt_rate.value === '') {
        return;
      }
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);
console.log(this.td.rpamount.value,this.td.interest.value);
debugger


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = 4;
      // temp_gen_param.ad_prn_amt = this.td.intt_trf_type.value!='O'? +this.td.rpamount.value:this.td.td_def_mat_amt.value;
      temp_gen_param.ad_prn_amt = this.td.rpamount.value+this.td.interest.value;
      temp_gen_param.adt_temp_dt = Utils.convertStringToDt(this.td.opening_dt?.value);
      temp_gen_param.as_intt_type = this.td.intt_trf_type.value;
      // tslint:disable-next-line: max-line-length
      // if (typeof (this.td.opening_dt) === 'string') {
      //   this.tm_deposit.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      // }

      // if (typeof (this.tm_deposit.mat_dt) === 'string') {
      //   this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      // }

      const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const m = Utils.convertStringToDt(this.td.mat_dt.value);
      const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));
      temp_gen_param.ai_period = diffDays;
      temp_gen_param.ad_intt_rt = +this.td.intt_rate.value;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }
  calCrdIntReg(tempGenParam: p_gen_param): void {
    this.isLoading = true;

    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', tempGenParam).subscribe(
      res => {
        this.tm_deposit.intt_amt = res;
        this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
        this.mat_val = this.tm_deposit.mat_val
        this.isLoading = false;
      },
      err => {
        this.tm_deposit.intt_amt = 0;
        this.isLoading = false;

      }
    );
  }

  f_calctdintt_reg(temp_gen_param: p_gen_param): void {
    debugger
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      res => {
        console.log(res);
        
        this.tdDefTransFrm.patchValue({
          interest: +res
        });
        this.mat_val =  Number(temp_gen_param.ad_prn_amt) + Number(this.tdDefTransFrm.controls.interest.value);
        console.log(this.mat_val);
        
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;

      }
    );
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
}
