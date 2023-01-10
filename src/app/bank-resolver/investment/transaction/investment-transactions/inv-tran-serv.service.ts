import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccOpenDM } from '../../../Models/deposit/AccOpenDM';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { CcTransComponent } from './cc-trans/cc-trans.component';

@Injectable({
  providedIn: 'root'
})

export class InvTranServService {
  // get td() { return this.ccComp.tdDefTransFrm.controls; }
  callSave = new EventEmitter();    
  subsVar: Subscription; 
  isLoading: boolean;
  accDtlsFrm: FormGroup;
  constitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
  operations: mm_operation[];
  interestPeriod=0
  sys = new SystemValues();
  bankData=[]
  branch:any=[];
  branch1:any=[];
  masterModel = new AccOpenDM();
  tm_deposit = new tm_deposit();
  public bankName:any;
  public branchName:any;
  public constitutionDes:any;
  public constitutionCd:any;
  public operInsDESC:any;
  public operInsCD:any;
  


  // accNoEnteredForTransaction:any=this.masterModel.tmdepositInv;

  constructor(private svc: RestService, private msg: InAppMessageService,private comservice:InvTranServService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
    private modalService: BsModalService) { }
    
    SaveButtonClick() {    
      this.callSave.emit();    
    }
    public getConstitutionList() {
      debugger
      if (this.constitutionList.length > 0) {
        return;
      }
  
      this.constitutionList = [];
      var dt={
        "ardb_cd":this.sys.ardbCD
      }
      this.svc.addUpdDel<any>('Mst/GetConstitution', dt).subscribe(
        res => {
          console.log(res)
          // //////////////debugger;
          this.constitutionList = res;
          let selectedconstitution = this.constitutionList.filter(e => e.constitution_cd == this.masterModel.tmdepositInv.constitution_cd);
          this.constitutionDes=selectedconstitution[0].constitution_desc
          this.constitutionCd=selectedconstitution[0].constitution_cd
          console.log(selectedconstitution[0].constitution_desc);
  
        },
        err => { // ;
        }
      );
    }
    getOperationalInstr() {
      debugger;
      if (this.operationalInstrList.length > 0) {
        return;
      }
      var dt = {
        "ardb_cd": this.sys.ardbCD,
      }
      this.operationalInstrList = [];
      this.svc.addUpdDel<any>('Mst/GetOprationalInstr', dt).subscribe(
        res => {
          this.operationalInstrList = res;
          const getoperIns = this.operationalInstrList.filter(e => e.oprn_cd == this.masterModel.tmdepositInv.oprn_instr_cd);
          this.operInsDESC=getoperIns[0].oprn_desc
          this.operInsCD=getoperIns[0].oprn_cd
          console.log( this.operInsDESC);

        },
        err => { }
      );
    }
    public getBankName(){
      debugger
      var dt = {
        "ardb_cd": this.sys.ardbCD,
      }
      this.svc.addUpdDel<any>('Mst/GetBankInvMaster', dt).subscribe(
        res => {
          console.log(res)
          this.bankData=res
          const selectedbank = this.bankData.filter(e => e.bank_cd == this.masterModel.tmdepositInv.bank_cd);
        this.bankName=selectedbank[0].bank_name
          console.log(this.bankName);
          
        },
        err => { }
      );
     }
     public getBranchName(val: number){
      debugger
      console.log(val);
      this.branch=null
        var dt = {
          "ardb_cd": this.sys.ardbCD,
          "bank_cd":this.masterModel.tmdepositInv.bank_cd
        }
        this.svc.addUpdDel<any>('Mst/GetBranchInvMaster', dt).subscribe(
          res => {
            this.branch=res
            this.branchName=this.branch[0].branch_name
             console.log(this.branchName)
             
           })
      
      }
      
      
    
 
}
