import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/_service';
import { T_VOUCHER_DTLS, m_acc_master, SystemValues, MessageType, ShowMessage } from '../../Models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  tvd = new T_VOUCHER_DTLS();
  tvdRet: T_VOUCHER_DTLS[] = [];
  tvn = new T_VOUCHER_DTLS();
  tvnRet: T_VOUCHER_DTLS[] = [];
  tvnRetFilter: T_VOUCHER_DTLS[] = [];
  maccmaster: m_acc_master[] = [];
  maccmaster1: m_acc_master[] = [];

  maccmasterRet: m_acc_master[] = [];
  keyword = 'acc_name';
  tvdGroupRes: any;
  reportcriteria: FormGroup;
  closeResult = '';
  //alertMsg = '';
  // showAlert = false;
  showMsg: ShowMessage;
  onVoucherCreation: FormGroup;
  VoucherF: FormArray;
  _voucherId: any;
  _voucherDt: any;
  _voucherTyp: any;
  _voucherTypeName:any;
  _approvalSts: any;
  _totalCr: number = 0;
  _totalDr: number = 0;
  _voucherNarration: string = '';
  insertMode = false;
  app_flg: any;
  isDel = true;
  isAddNew = true;
  isRetrieve = true;
  isRetrieveBatch = true;
  isNew = true;
  isRemove = true;
  isSave = false;
  isApprove = true;
  isClear = false;
  isLoading = false;
  fromdate: Date;
  drInput = false;
  crInput = false;
  tableId:any

  sys = new SystemValues();
  constructor(private svc: RestService, private formBuilder: FormBuilder, 
    private modalService: BsModalService,
    private router: Router) { }
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      voucherNo: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]
    });

    this.onVoucherCreation = this.formBuilder.group({
      'VoucherF': this.formBuilder.array([
        // this.addVoucherFromGroup()
      ])
    });
    ;
   
    this.getmAccMaster();
    this.Clear()
    this.New();
    this.isNew = false;
    this.isRetrieve = false;
    this.isRetrieveBatch = false;
    // this.Clear()
  
    console.log(this.onVoucherCreation.get('VoucherF'))

  }
  Initialize() {
    ;
    this.maccmaster = this.maccmasterRet;
    this.insertMode = false;
    this._voucherId = null;
    this._voucherDt = null;
    this._voucherTyp = null;
    this._voucherTypeName=null;
    this._approvalSts = null;
    this._totalCr = 0;
    this._totalDr = 0;
    this._voucherNarration = '';
    try {
      let VoucherFCnt = this.VoucherF.value.length;
      console.log(VoucherFCnt)
      for (var i = 0; i < VoucherFCnt; i++) {
        this.RemoveItem(0);
      }
    }
    catch (exception) { let x = 0; }

    //this.Add();

    // this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
    // this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd,this.tvdRet[x].debit_credit_flag,this.tvdRet[x].cr_amount,this.tvdRet[x].dr_amount));
  }
  InitializeListOnly() {
    try {
      let VoucherFCnt = this.VoucherF.value.length;

      console.log(VoucherFCnt);
      

      for (var i = 0; i < VoucherFCnt; i++) {
        this.RemoveItem(0);
      }
    }
    catch (exception) { let x = 0; }
  }

  Retrieve() {
    this.Initialize();
    this.modalRef = this.modalService.show(this.content, this.config);
    // this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    // },
    //   (reason) => {
    //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
    //   });
  }
  RetrieveBatch() {
    this.app_flg = 'U';
    this.Initialize();
    this.isLoading = true;
    this.getVoucherNarration();
    this.modalRef = this.modalService.show(this.contentbatch, this.config);
    this.isRemove = false;
    this.isSave = false;
  }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  AddNew() {
    this.Add();
  }
  New() {
    ;
    
    this.isDel = false;
    this.isAddNew = false;
    this.isRetrieve = true;
    this.isRetrieveBatch = true;
    this.isNew = true;
    this.isRemove = true;
    this.isSave = true;
    this.isApprove = true;
    this.isClear = false;
    this.Initialize();
    this._voucherDt = this.sys.CurrentDate;// this.convertDate(localStorage.getItem('__currentDate'));//TBD
    //Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate());
    this._voucherTyp = null;
    this.insertMode = true;
  this.onVoucherCreation.reset();
  this.tvdRet = [];

    ;
  }
  Remove() {
    if (this._voucherId > 0)
      if (this._approvalSts == "Unapproved")
        this.DeleteVoucher();
      else
        this.HandleMessage(true, MessageType.Error, 'Voucher already Approved can not be Deleted !');
  }
  Approve() {
    this.UpdateVoucher();

  }
  Submit() {
    ;
    if (this.reportcriteria.invalid) {
      this.HandleMessage(true, MessageType.Error, 'Invalid Input.');
      return false;
    }
    else {
      this.isLoading = true;
      this.getVoucher(this.reportcriteria.value['fromDate'], this.reportcriteria.value['voucherNo']);
      this.isRemove = false;
      this.isSave = false;
    }
  }

  Clear() {
    this.Initialize();
    this.isDel = true;
    this.isAddNew = true;
    this.isRetrieve = false;
    this.isRetrieveBatch = false;
    this.isNew = false;
    this.isRemove = true;
    this.isSave = true;
    this.isApprove = true;
    this.isClear = false;
    this.onVoucherCreation.reset();
    this.tvdRet = [];
  }
  Save() {
    ;
    
    let isAccCDBlank = false;
    if (this._voucherNarration == null || this._voucherNarration == '') {
      this.HandleMessage(true, MessageType.Error, 'Narration can not be blank !');
      return;
    }
    if (this._voucherNarration.includes("'")||this._voucherNarration.includes('"')) {
      this.HandleMessage(true, MessageType.Error, 'Narration can\'t have special characters!');
      return;
    }
    if (this._voucherTyp == 'T') {
      if (this.getTotalDr() == 0) {
        console.log("error")
        this.HandleMessage(true, MessageType.Error, 'Debit Amount Can not be Zero !');
        return;
      }
      else if (this.getTotalCr() == 0) {
        console.log("error")
        this.HandleMessage(true, MessageType.Error, 'Credit Amount Can not be Zero !');
        return;
      }
      else if (this.getTotalCr() != this.getTotalDr()) {
        console.log("error")
        this.HandleMessage(true, MessageType.Error, 'Debit and Credit Amount must be equal !');
        return;
      }
    }
    else {
      for (let x = 0; x < this.VoucherF.length; x++) {
        if (this.voucherData.value[x].acc_cd == null || this.voucherData.value[x].acc_cd == '') {
          isAccCDBlank = true;
          break;
        }
      }
    }
    if (isAccCDBlank) {
        //this.showAlert = true;
        //this.alertMsg = "Account Code Can not be Blank !"
        this.HandleMessage(true, MessageType.Error, 'Account Code Can not be Blank !');

     }
    else {
        // debugger;
        if (this._voucherId > 0)
          if (this._approvalSts == "Unapproved") {
            this.DeleteInsertVoucher();
          }
          else
            this.HandleMessage(true, MessageType.Error, 'Voucher already Approved can not Modify !');
        else
          this.InsertVoucher();
      }
    }
  
  OpenVoucher(item) {
    ;
    this.Initialize();
    this.getVoucherDtl(this.sys.BranchCode, item.voucher_dt, item.voucher_id, item.narrationdtl)
  }
  closeAlert() {
    //this.showAlert = false;
  }
  get voucherData() { return <FormArray>this.onVoucherCreation.get('VoucherF'); }

  addVoucherFromGroup(): FormGroup {
    console.log({"VoucherType": this._voucherTyp})
    return this.formBuilder.group({
      'dr_cr': [null, Validators.compose([Validators.required])],
      'acc_cd': [null, Validators.compose([Validators.required])],
      'desc': [null, null],
      'cr_amt': [{value : null,disabled: this._voucherTyp == 'CR' || this._voucherTyp == 'T' || this._voucherTyp == '' || this._voucherTyp == undefined ? false : true}],
      'dr_amt': [{value : null,disabled: this._voucherTyp == 'CP' || this._voucherTyp == 'T' || this._voucherTyp == '' || this._voucherTyp == undefined ? false : true}]
    });
  }

  editVoucherFromGroup(acc_cd: number, dr_cr: string, cr_amount: number, dr_amount: number): FormGroup {
    console.log(this.maccmaster)
    let accNames = this.maccmaster.filter(function (el) { return (el.acc_cd === acc_cd); }).map(function (el) { return el.acc_name; }).sort().toString();
    console.log(accNames);
    let Index = this.maccmaster.findIndex(el => el.acc_cd == acc_cd);
    console.log(Index)
    return this.formBuilder.group({
      'dr_cr': [dr_cr, Validators.compose([Validators.required])],
      'acc_cd': [acc_cd, Validators.compose([Validators.required])],
      'desc': [{value:accNames, disabled: acc_cd == 21101 ? true : false}],
      'cr_amt': [{value : cr_amount, disabled :  dr_amount > 0 || acc_cd == 21101 ? true : false}],
      'dr_amt': [{value : dr_amount, disabled :  cr_amount > 0 || acc_cd == 21101 ? true : false}]
    });
  }

  Add() {
    this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
    this.VoucherF.push(this.addVoucherFromGroup());
    console.log(this.VoucherF);
    
  }
  RemoveItem(deleteindex: number): void {
    ;
    this.maccmaster = this.maccmasterRet;
    this.subsctractValue('dr_amt','cr_amt',deleteindex);
    (<FormArray>this.onVoucherCreation.get('VoucherF')).removeAt(deleteindex);    
  }

  selectEvent(item, i) {
    // do something with selected item
    if(item.impl_flag=='N'){
      this.HandleMessage(true, MessageType.Error, '('+item.acc_cd+' - '+ item.acc_name+')'+'  Can not be use in Voucher Head');
      this.VoucherF.controls[i].get('acc_cd').setValue('')
      this.VoucherF.controls[i].get('desc').setValue('')
      this.maccmaster1.length=0
    }
    else{
      try {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[i].get('acc_cd').setValue(item.acc_cd);
      }
      catch (exception) { let x = 0; }
    }
    
  }

  onChangeSearch(search, i) {
    // do something with selected item
  }
  onChange(event) {
    ;
    this._voucherTyp = event;
    if (this._voucherTyp == 'T') {
      console.log("TRANSFER")
      this.InitializeListOnly();
      this.maccmaster = this.maccmasterRet.filter(x => x.acc_cd != this.sys.CashAccCode);
    }
    else if (this._voucherTyp == 'CR' || this._voucherTyp == 'CP') {
      this.InitializeListOnly();
      this.Add();
      this.maccmaster = this.maccmasterRet.filter(x => x.acc_cd != this.sys.CashAccCode);
      this.VoucherF.controls[0].get('acc_cd').setValue(this.sys.CashAccCode);
      this.VoucherF.controls[0].get('desc').setValue(this.maccmasterRet.find(x => x.acc_cd === this.sys.CashAccCode).acc_name);
      this.VoucherF.controls[0].get('dr_amt').untouched;
      this.VoucherF.controls[0].get('cr_amt').untouched;
      this.VoucherF.controls[0].get('desc').disable();
      this.VoucherF.controls[0].get('dr_amt').disable();
      this.VoucherF.controls[0].get('cr_amt').disable();
      console.log({"onVoucher" : this.onVoucherCreation ,"voucherF" : this.VoucherF});
    }
    else {
      this.InitializeListOnly();
      this.maccmaster = this.maccmasterRet;
    }
  }
  codeChange(e:any,i:any){
    console.log(e)

   //  console.log(this.maccmaster.filter(x=>x.acc_cd.toString().includes(e)))
    if(e.target.value){
     this.maccmaster1=this.maccmaster.filter(x=>x.acc_cd.toString().includes(e.target.value))
    for(let p=0;p<this.VoucherF.controls.length;p++){
     if(p==i){
       this.tableId=document.getElementById("tab"+i);
       this.tableId.style.display='block'
     }
     else{
       this.tableId=document.getElementById("tab"+p);
       this.tableId.style.display='none'
     }
   
    }
    }
    else{
      this.maccmaster1.length=0
    }
    
    

    
 }
 putValue(entry:any,i:any){
  if(entry.impl_flag=='N'){
    this.HandleMessage(true, MessageType.Error, '('+entry.acc_cd+' - '+ entry.acc_name+')'+'  Can not be use in Voucher Head');
    this.VoucherF.controls[i].get('acc_cd').setValue('')
    this.maccmaster1.length=0
  }
  else{this.VoucherF.controls[i].get('desc').setValue(entry.acc_name)
  this.VoucherF.controls[i].get('acc_cd').setValue(entry.acc_cd)
  this.maccmaster1.length=0}
    
 
 }
  changeAppFlg() {
    ;
    this.tvnRetFilter = [];
    this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg).sort((a, b) => (a.voucher_id < b.voucher_id ? -1 : 1));;
  }

  onFocused(e) {
    // do something
    this.getmAccMaster()
  }

  private getVoucher(vDt: any, vID: any): void {
    this.tvd = new T_VOUCHER_DTLS();
    this.tvd.brn_cd = this.sys.BranchCode//localStorage.getItem('__brnCd');
    this.tvd.voucher_dt = vDt;
    this.tvd.ardb_cd=this.sys.ardbCD;
    //this.tvd.voucher_dt = new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
    //this.tvd.voucher_dt = new Date(Date.UTC(vDt.getFullYear(), vDt.getMonth(),vDt.getDate(),vDt.getHours(), vDt.getMinutes()));
    this.tvd.voucher_id = Number(vID);
    this.tvdRet = [];
    ;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtls', this.tvd).subscribe(
      res => {
        console.log(res)
        ;
        if(res.length==0){
           this.HandleMessage(true, MessageType.Error, 'This voucher has either been deleted or does not exist !')
        }
        
        this.isLoading = false;
        this.tvdRet = res;
        this.tvdGroupRes = this.groupBy(this.tvdRet, function (item) {
          return [item.transaction_type, item.voucher_id, item.voucher_dt, item.approval_status];
        });
        
        for (let x = 0; x < this.tvdRet.length; x++) {
          this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
          this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd, this.tvdRet[x].debit_credit_flag == 'D' ? 'Debit' : 'Credit', this.tvdRet[x].cr_amount, this.tvdRet[x].dr_amount));
        }
        if (this.VoucherF.value.length > 0)
          if (this.VoucherF.value[0].acc_cd == null)
            this.RemoveItem(0);
        this._voucherId = this.tvdRet[0].voucher_id;
        this._voucherDt = this.convertDate(this.tvdRet[0].voucher_dt.toString());
        this._voucherTypeName = this.tvdRet[0].transaction_type == "C" ? (this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].cr_amount > 0 && this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].dr_amount == 0  ?  "Cash Payment":"Cash Receipt" ) : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        this._approvalSts = this.tvdRet[0].approval_status == "A" ? "Approved" : "Unapproved";
        this._totalCr = 0;
        this._totalDr = 0;
        if (this.tvdRet[0].approval_status == 'U')
          this.isApprove = false;
        this._voucherNarration = this.tvdRet[0].narrationdtl;//this.tvdRet[0].narration+
        // this.modalService.dismissAll(this.content);
        this.modalRef.hide();
      },
      err => {
        this.isLoading = false;
        this.modalRef.hide();
      }
    );
  }
  private getVoucherDtl(brncd: any, voudt: any, vouid: any, narr: any): void {
    this.tvd = new T_VOUCHER_DTLS();
    this.tvd.brn_cd = brncd;
    this.tvd.voucher_dt = voudt;
    this.tvd.ardb_cd=this.sys.ardbCD
    //this.tvd.voucher_dt = new Date(Date.UTC(voudt.getFullYear(), voudt.getMonth(), voudt.getDate()));
    this.tvd.voucher_id = vouid;
    this.tvdRet = [];
    ;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtls', this.tvd).subscribe(
      res => {
        ;
        this.tvdRet = res;
        console.log(res)
        for (let x = 0; x < this.tvdRet.length; x++) {
          this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
          this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd, this.tvdRet[x].debit_credit_flag == 'D' ? 'Debit' : 'Credit', this.tvdRet[x].cr_amount, this.tvdRet[x].dr_amount));
        }

        if (this.VoucherF.value.length > 0)
          if (this.VoucherF.value[0].acc_cd == null)
            this.RemoveItem(0);
        this._voucherId = this.tvdRet[0].voucher_id;
        this._voucherDt = this.convertDate(this.tvdRet[0].voucher_dt.toString());
        this._voucherTypeName = this.tvdRet[0].transaction_type == "C" ? (this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].cr_amount > 0 && this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].dr_amount == 0  ?  "Cash Payment":"Cash Receipt" ) : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        this._voucherTyp  =  this.tvdRet[0].transaction_type;
        // this._voucherTypeName = this.tvdRet[0].transaction_type == "C" ? "Cash" : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        console.log({"voucherName":this._voucherTypeName,"transaction_type":this.tvdRet[0].transaction_type});
       
        this._approvalSts = this.tvdRet[0].approval_status == "A" ? "Approved" : "Unapproved";
        this._totalCr = 0;
        this._totalDr = 0;
        this._voucherNarration = narr;
        if (this.tvdRet[0].approval_status == 'U')
          this.isApprove = false;
        this.modalRef.hide();
        // this.modalService.dismissAll(this.content);
      },
      err => { this.modalRef.hide(); }
    );
  }
  private getVoucherNarration(): void {
    this.tvn.brn_cd = this.sys.BranchCode;
    this.tvn.ardb_cd=this.sys.ardbCD
    //this.tvn.voucher_dt = new Date(localStorage.getItem('__currentDate'));
    this.tvn.voucher_dt = this.sys.CurrentDate;// this.convertDate(localStorage.getItem('__currentDate'));
    //tvdSave.voucher_dt = new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
    //this.tvn.voucher_dt = this.tvn.voucher_dt;//new Date(Date.UTC(this.tvn.voucher_dt.getFullYear(), this.tvn.voucher_dt.getMonth(), this.tvn.voucher_dt.getDate()));
    ;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherNarration', this.tvn).subscribe(
      res => {
        ;
        this.tvnRet = res;
        this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg).sort((a, b) => (a.voucher_id < b.voucher_id ? -1 : 1));
        this.isLoading = false;
        // this.modalService.open(this.contentbatch, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static' }).result.then((result) => {
        // },
        //   (reason) => {
        //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
        //   });
      },
      err => { this.isLoading = false; }
    );
  }

  private InsertVoucher(): void {

    try {
      this.isLoading = true;
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'U';
        tvdSave.brn_cd = this.sys.BranchCode;
        // console.log(this.voucherData.value[x].dr_am+" "+this.voucherData.value[x].cr_amt)
        tvdSave.cr_amount = this.voucherData.value[x].cr_amt == null ? this.voucherData.value[x].dr_amt : this.voucherData.value[x].cr_amt;
        tvdSave.dr_amount = this.voucherData.value[x].dr_amt == null ? this.voucherData.value[x].cr_amt : this.voucherData.value[x].dr_amt;
        tvdSave.debit_credit_flag = this.voucherData.value[x].dr_cr == 'Debit' ? 'D' : 'C';
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSave.transaction_type = this._voucherTyp == 'CR' || this._voucherTyp == 'CP' ? 'C' : 'T';
        tvdSave.voucher_dt = this._voucherDt;//new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
        //tvdSave.voucher_dt = this._voucherDt;
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        // tvdSave.amount = tvdSave.cr_amount == 0 ? this.getTotalDr() : this.getTotalCr();
        if (tvdSave.transaction_type == 'C') {
          if (this.voucherData.value[x].acc_cd == 21101)
            tvdSave.amount = this.getTotalCr() == 0 ? this.getTotalDr() : this.getTotalCr();
          else {
            tvdSave.amount = tvdSave.cr_amount;
          }
        }
        else {
          tvdSave.amount = Number(tvdSave.cr_amount == 0 ? tvdSave.dr_amount : tvdSave.cr_amount);

        }
        tvdSave.ardb_cd = this.sys.ardbCD;
        tvdSave.created_by=this.sys.UserId+'/'+localStorage.getItem('getIPAddress')

        tvdSaveAll.push(tvdSave);
      }
      console.log(tvdSaveAll)
        ;
      this.svc.addUpdDel<any>('Voucher/InsertTVoucherDtls', tvdSaveAll).subscribe(
        res => {
          ;
       
          this._voucherId = res;
          this._approvalSts = "Unapproved";
          this._voucherTypeName = this._voucherTyp == "CR" ?  "Cash Receipt" : this._voucherTyp == "CP" ? "Cash Payment" : this._voucherTyp == "L" ? "Clearing" : "Transfer";
          this.insertMode = false;
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = false;
          this.isApprove = true;
          this.isClear = false;
          this.isLoading = false;
          this.HandleMessage(true,MessageType.Sucess,"Voucher saved successfully!")
        },
        err => { this.isLoading = false; 
          this.HandleMessage(true, MessageType.Error, 'Field can not be blank !')
        }
      );
    }
    catch (exception) { let x = 0; }
  }

  private DeleteInsertVoucher(): void {
    console.log({"voucher_name":this._voucherTypeName});
    try {
      this.isLoading = true;
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'U';
        tvdSave.brn_cd = this.sys.BranchCode;
        // this._voucherTyp = this._voucherTypeName == "Cash Payment" || this._voucherTypeName == "Cash Receipt" ? "C" : this._voucherTypeName == "Clearing" ? "L" : "T";

        // tvdSave.cr_amount = Number(this.voucherData.value[x].cr_amt == null ? this.voucherData.value[x].dr_amt : this.voucherData.value[x].cr_amt);
        // tvdSave.dr_amount = Number(this.voucherData.value[x].dr_amt == null ? this.voucherData.value[x].cr_amt : this.voucherData.value[x].dr_amt);
        tvdSave.cr_amount = this.voucherData.value[x].cr_amt==0 || this.voucherData.value[x].cr_amt==null ? this.voucherData.value[x].dr_amt : this.voucherData.value[x].cr_amt;
        tvdSave.dr_amount = this.voucherData.value[x].dr_amt==0 || this.voucherData.value[x].dr_amt==null ? this.voucherData.value[x].cr_amt : this.voucherData.value[x].dr_amt;
        tvdSave.debit_credit_flag = this.voucherData.value[x].dr_cr == 'Debit' ? 'D' : 'C';
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSave.transaction_type = this._voucherTypeName == "Cash Receipt" ||  this._voucherTypeName == "Cash Payment"? "C" : this._voucherTypeName == "Clearing" ? "L" : "T";
        this._voucherTyp = this._voucherTypeName == "Cash Receipt" ? "CR" : this._voucherTypeName == "Cash Payment" ? "CP" : this._voucherTypeName == "Clearing" ? "L" : "T";
        tvdSave.voucher_dt = this._voucherDt;//new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
        //tvdSave.voucher_dt = this._voucherDt;
        tvdSave.created_by=this.sys.UserId+'/'+localStorage.getItem('getIPAddress')
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        // tvdSave.amount = Number(tvdSave.cr_amount == 0 ? tvdSave.dr_amount : tvdSave.cr_amount);
        if (tvdSave.transaction_type == 'C') {
          if (this.voucherData.value[x].acc_cd == 21101)
            tvdSave.amount = this.getTotalCr() == 0 ? this.getTotalDr() : this.getTotalCr();
          else {
            tvdSave.amount = tvdSave.cr_amount;
          }
        }
        else {
          tvdSave.amount = Number(tvdSave.cr_amount == 0 ? tvdSave.dr_amount : tvdSave.cr_amount);

        }
        tvdSave.voucher_id = this._voucherId;
        tvdSave.ardb_cd = this.sys.ardbCD
        tvdSaveAll.push(tvdSave);
      }
      ;
      console.log(tvdSaveAll)
      this.svc.addUpdDel<any>('Voucher/DeleteInsertVoucherDtls', tvdSaveAll).subscribe(
        res => {
          ;
          console.log(this._voucherTyp)
          this._voucherId = this._voucherId;
          this._approvalSts = "Unapproved";
          this._voucherTypeName = this._voucherTyp == "CR"  ? "Cash Receipt" : this._voucherTyp == "CP" ? "Cash Payment"  : (this._voucherTyp == "L" ? "Clearing" : "Transfer");
          console.log(this._voucherTypeName)
          // debugger;
          this.insertMode = false;
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = false;
          this.isApprove = true;
          this.isClear = false;
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Voucher Updated Successfully !');
        },
        err => { this.isLoading = false; this.HandleMessage(true, MessageType.Error, 'Update Failed !'); }
      );
    }
    catch (exception) { let x = 0; }
  }

  private DeleteVoucher(): void {
    try {
      this.isLoading = true;
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'U';
        tvdSave.brn_cd = this.sys.BranchCode;
        this._voucherTyp = this._voucherTypeName == "Cash Receipt" || this._voucherTypeName == "Cash Payment" ? "C" : this._voucherTypeName == "Clearing" ? "L" : "T";

         // tvdSave.cr_amount = Number(this.voucherData.value[x].cr_amt == null ? this.voucherData.value[x].dr_amt : this.voucherData.value[x].cr_amt);
        // tvdSave.dr_amount = Number(this.voucherData.value[x].dr_amt == null ? this.voucherData.value[x].cr_amt : this.voucherData.value[x].dr_amt);
        tvdSave.cr_amount = this.voucherData.value[x].cr_amt==0 || this.voucherData.value[x].cr_amt==null ? this.voucherData.value[x].dr_amt : this.voucherData.value[x].cr_amt;
        tvdSave.dr_amount = this.voucherData.value[x].dr_amt==0 || this.voucherData.value[x].dr_amt==null ? this.voucherData.value[x].cr_amt : this.voucherData.value[x].dr_amt;
        tvdSave.debit_credit_flag = this.voucherData.value[x].dr_cr == 'Debit' ? 'D' : 'C';
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSave.ardb_cd=this.sys.ardbCD
        tvdSave.transaction_type = this._voucherTypeName == "Cash Receipt" || this._voucherTypeName == "Cash Payment" ? "C" : this._voucherTypeName == "Clearing" ? "L" : "T";
        tvdSave.voucher_dt = this._voucherDt;//new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
        //tvdSave.voucher_dt = this._voucherDt;
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        if (tvdSave.transaction_type == 'C') {
          if (x == 1)
            tvdSave.amount = this.getTotalCr() == 0 ? this.getTotalDr() : this.getTotalCr();
          else {
            tvdSave.amount = tvdSave.cr_amount;
          }
        }
        else {
          tvdSave.amount = Number(tvdSave.cr_amount == 0 ? tvdSave.dr_amount : tvdSave.cr_amount);

        }
        tvdSave.voucher_id = this._voucherId;
        tvdSaveAll.push(tvdSave);
      }
      // debugger;
      this.svc.addUpdDel<any>('Voucher/DeleteVoucherDtls', tvdSaveAll).subscribe(
        res => {
          // debugger;
          console.log(res.length)
          this.insertMode = false;
          this.Initialize();
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = false;
          this.isApprove = true;
          this.isClear = false;
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Voucher Deleted Successfully !');
        },
        err => { this.isLoading = false; this.HandleMessage(true, MessageType.Error, 'Delete Failed !'); }
      );
    }
    catch (exception) { let x = 0; }
  }


  private UpdateVoucher(): void {
    try {
      this.isLoading = true;
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'A';
        tvdSave.brn_cd = this.sys.BranchCode;
        tvdSave.approved_by = 'ADMIN'
        tvdSave.ardb_cd=this.sys.ardbCD;
        tvdSave.approved_dt = new Date();
        //tvdSave.voucher_dt = this._voucherDt;
        tvdSave.voucher_dt = this._voucherDt;//new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
        tvdSave.voucher_id = this._voucherId;//Merge
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSaveAll.push(tvdSave);
      }
      ;
      this.svc.addUpdDel<any>('Voucher/UpdateTVoucherDtls', tvdSaveAll).subscribe(
        res => {
          ;
          let x = res;
          //this._voucherDt = this._voucherDt
          this._voucherTyp = "C";
          this._approvalSts = "Approved";
          this.insertMode = true;
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = false;
          this.isApprove = true;
          this.isClear = false;
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }
    catch (exception) { let x = 0; }
  }
  public getTotalCr() {
    let total = 0;
    ;
    try {
      for (var i = 0; i < this.VoucherF.value.length; i++) {
        if (this.VoucherF.value[i].cr_amt > 0) {
          total = total + Number(this.VoucherF.value[i].cr_amt);
          this._totalCr = total;
        }
      }
    }
    catch (exception) { return 0; }
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }
  public getTotalDr() {
    let total = 0;
    try {    
      for (var i = 0; i < this.VoucherF.value.length; i++) {     
        if (this.VoucherF.value[i].dr_amt > 0) {
          total = total + Number(this.VoucherF.value[i].dr_amt);
        }
      }
    }
    catch (exception) {
      return 0;
    }
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }

  public drAmountInput(row, event) {
    console.log({"TOTAL DEBIT":this.getTotalDr(),"TOTAL CREDIT":this.getTotalCr()});

    this._totalCr = 0;
    this._totalDr = 0
    console.log(this.drInput + " " + this.crInput)

    if (this.voucherData.value[row].acc_cd == null || this.voucherData.value[row].acc_cd == '') {
      this.VoucherF.controls[row].get('dr_amt').setValue(null);
      this.VoucherF.controls[row].get('cr_amt').setValue(null);
      this.HandleMessage(true, MessageType.Error, 'Account Code Can not be Blank !');
      return;
    }
    try {
      ;console.log("asd");
      if (this.VoucherF.controls[row].get('dr_amt').value > 0 || this.VoucherF.controls[row].get('dr_amt').value == null) {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[row].get('dr_cr').setValue("Debit");
        this.VoucherF.controls[row].get('cr_amt').setValue(null);
        if (this._voucherTyp == 'CR' || this._voucherTyp == 'CP') {
          // this.checkFlag('dr_amt','C');
          console.log("asd");
          this.VoucherF.controls[0].get('dr_amt').setValue(null);
          this.VoucherF.controls[0].get('dr_cr').setValue("Credit");
          // this.makeInputFieldDisabled('cr_amt');
          this.VoucherF.controls[0].get('cr_amt').setValue(this.getTotalDr());
        }
      }

    }
    catch (exception) { let x = 0; }
  }
  public crAmountInput(row, event) {
    console.log({"TOTAL DEBIT":this.getTotalDr(),"TOTAL CREDIT":this.getTotalCr()});
    this._totalCr = 0;
    this._totalDr = 0
    console.log(this.drInput + " " + this.crInput)

    //this.showAlert = false;
    if (this.voucherData.value[row].acc_cd == null || this.voucherData.value[row].acc_cd == '') {
      //this.showAlert = true;
      this.VoucherF.controls[row].get('dr_amt').setValue(null);
      this.VoucherF.controls[row].get('cr_amt').setValue(null);
      this.HandleMessage(true, MessageType.Error, 'Account Code Can not be Blank !');
      // this.alertMsg = "Account Code Can not be Blank !"
      return;
    }
    try {
      ;
      if (this.VoucherF.controls[row].get('cr_amt').value > 0 || this.VoucherF.controls[row].get('cr_amt').value == null) {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[row].get('dr_cr').setValue("Credit");
        this.VoucherF.controls[row].get('dr_amt').setValue(null);
        if ((this._voucherTyp == 'CR' || this._voucherTyp == 'CP')) {
          // this.checkFlag('cr_amt','C');
          this.VoucherF.controls[0].get('cr_amt').setValue(null);
          this.VoucherF.controls[0].get('dr_cr').setValue("Debit");
          // this.makeInputFieldDisabled('dr_amt');
          this.VoucherF.controls[0].get('dr_amt').setValue(this.getTotalCr());
          // this.VoucherF.controls[0].get('cr_amt').setValue(this.getTotalCr());
          console.log(this.VoucherF.controls[0].get('dr_amt'))

        }
      }
    }
    catch (exception) { let x = 0; }
  }
  public groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      f.transaction_type, f.voucher_dt, f.voucher_id, f.approval_status
      return groups[group];
    })
  }

  private getmAccMaster(): void {
    ;
    var dt = {
      "ardb_cd": this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
      res => {
        console.log(res)
          ;
        this.maccmasterRet = res;
        this.maccmaster = this.maccmasterRet; 
        this.maccmaster.sort((a, b)=>{return a.acc_cd - b.acc_cd})
        let Index = this.maccmaster.findIndex(el => el.acc_cd == 21101);
       console.log(Index);
       
      },
      err => { }
    );
  }
  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  private convertDate(datestring: string): Date {
    var parts = datestring.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    //return new Date(year, month, day);
  }
  private convertStringToDt(str: string): Date {
    const dateParts = str.substring(0, 10).split('/');
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  checkFlag(_flag:any,_voucher_type:any){
    this.drInput = _flag == 'dr_amt' && _voucher_type == 'C' ? true : false;
    this.crInput =_flag == 'cr_amt' && _voucher_type == 'C' ? true : false;
   }
   makeInputFieldDisabled(_formControlName:any){
    this.VoucherF.controls[(this.VoucherF.controls.length-1)].get(_formControlName).disable();
   }

   subsctractValue(_debit_flag:any,_credit_flag:any,deleteindex:any){
    var total = 0;
    
    if(this._voucherTyp == 'CP'){
      total = Number(this.VoucherF.controls[0].get(_credit_flag).value) - Number(this.VoucherF.controls[deleteindex].get(_debit_flag).value)
      this.VoucherF.controls[0].get(_credit_flag).setValue(total > 0 ? total : '');
    }
    else if(this._voucherTyp == 'CR'){
      total = Number(this.VoucherF.controls[0].get(_debit_flag).value) - Number(this.VoucherF.controls[deleteindex].get(_credit_flag).value)
      this.VoucherF.controls[0].get(_debit_flag).setValue(total > 0 ? total : '');
    }
   }
  //  public getBranchIp(e: any) {
  //   // this.loginForm.disable();
  //   return new Promise((resolve, reject) => {
  //     this.http.get<{ ip: string }>('https://jsonip.com').subscribe(
  //       data => {
  //         this.ipAddress = data;
  //         this.isLoading = false;
  //         let ipMatched = false;
  //         // if (e.ip_address.indexOf(this.ipAddress.ip) !== -1) { ipMatched = true; }
  //         // if (!ipMatched) {
  //         //   this.showAlert = true;
  //         //   this.alertMsg = 'IP not allowed to access, contact support.';
  //         //   this.loginForm.disable();
  //         //   resolve(false);
  //         // } else {
  //         //   // this.loginForm.enable();
  //         //   resolve(true);
  //         // }
  //       },
  //       ipErr => {
  //         // this.isLoading = false;
  //         // this.alertMsg = 'Unable to get IP, contact support.';
  //         resolve(false);
  //       }
  //     );

  //   })

  // }
}
