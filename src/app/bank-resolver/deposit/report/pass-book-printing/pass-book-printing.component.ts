import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
@Component({
  selector: 'app-pass-book-printing',
  templateUrl: './pass-book-printing.component.html',
  styleUrls: ['./pass-book-printing.component.css'],
  providers:[ExportAsService]
})
export class PassBookPrintingComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('nextpage', { static: true }) nextpage: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  counter=0;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[];
  passBookData:any=[];
  printData:any=[];
  afterPrint:any=[];
  systemParam: sm_parameter[] = [];
  lastRowNo:any;
  ardbName=localStorage.getItem('ardb_name');
  branchName=this.sys.BranchName;
  shoFastPage:boolean=false;
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  showWait=false
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    this.getSMParameter();
    // this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [{ value: '', disabled: true }, Validators.required],
      acc_type_cd: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  FastpageScreen() {
    this.shoFastPage=true;
  }
  
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public onAccountTypeChange(): void {
    this.reportcriteria.controls.acct_num.setValue('');
    this.suggestedCustomer = null;
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.reportcriteria.controls.acct_num.enable();
    }
  }
  onChangeNull(){
    this.suggestedCustomer = null

    if (this.reportcriteria.controls.acct_num.value.length > 0) 
      this.disabledOnNull=false
    else 
      this.disabledOnNull=true
  }
  public suggestCustomer(): void {
    this.showWait=true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = (+this.reportcriteria.controls.acc_type_cd.value);
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 10);
          } else {
            this.suggestedCustomer = [];
          }
          this.showWait=false
        },
        

        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }

  public SelectCustomer(cust: any): void {
    this.cName=cust.cust_name
    this.cAddress=cust.present_address
    this.cAcc=cust.acc_num
    this.reportcriteria.controls.acct_num.setValue(cust.acc_num);
    this.fromdate = Utils.convertStringToDt(cust.opening_dt);
    this.toDate = this.sys.CurrentDate;
    this.suggestedCustomer = null;
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.modalRef.hide();
      this.reportData.length=0
      this.pagedItems.length=0;
      this.isLoading=true
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "acc_num":this.reportcriteria.controls.acct_num.value,
        "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PassBookPrint',dt).subscribe(data=>{
        console.log(data);
        this.reportData=data
        
        debugger;
        let prTrans = [];
        prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
        this.passBookData = [];
        let tot1 = data[0].balance_amt;
        let tot = data[0].balance_amt;

        console.log(tot);
         prTrans[prTrans.length-1].balance=tot1
        console.log( prTrans);
        debugger
        for (let i = prTrans.length-1; i >= 0; i--) {
          if (i > 0) {
            if(i==prTrans.length-1){
              prTrans[i].balance = tot1
             this.passBookData.push(prTrans[i]);
            }
            else{
               if (prTrans[i+1].trans_type === 'D') { // deposit
                tot -= Number(prTrans[i+1].amount);
              } else {
                tot += Number(prTrans[i+1].amount);
              }
            }
            
             prTrans[i].balance = tot
             this.passBookData.push(prTrans[i]);
          }
          else{
            if (prTrans[i].trans_type === 'D') { // deposit
              tot -= Number(prTrans[i+1].amount);
            } else {
              tot += Number(prTrans[i+1].amount);
            }
             prTrans[i].balance = tot;
             this.passBookData.push(prTrans[i]);
          }
        }
        
        //  this.passBookData.splice(0,this.passBookData.length-1)
         console.log(this.passBookData);
         this.passBookData.reverse();
         this.passBookData.pop();
         this.passBookData.filter(element => {
          return element !== null && element !== undefined;
        });
        this.passBookPrint();
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
      })
      this.showAlert = false;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/passbookprint?'
      //   + 'ardb_cd='+this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&acc_type_cd=' + (+this.reportcriteria.controls.acc_type_cd.value)
      //   + '&acc_num=' + this.reportcriteria.controls.acct_num.value
      //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
      //   + '&to_dt=' + Utils.convertDtToString(this.toDate);
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  getSMParameter(){
    this.svc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {console.log(sysRes);
        this.systemParam = sysRes;})
  }
  passBookPrint(){
    var o = {
      trans_dt  : null,
      particulars   : null,
      balance : null,
      amount : null,
      trans_type : null,
      instrument_num : null,
  }
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "acc_num":this.reportcriteria.controls.acct_num.value,
      "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
     }
    this.svc.addUpdDel('Deposit/GetPassbookline',dt).subscribe(lastRowNo=>{
      this.lastRowNo = lastRowNo;
      this.printData=this.passBookData.slice();
      for (let index = 0; index <= this.lastRowNo-1; index++) {
        this.printData.unshift(o);
      } 
      console.log( this.printData);
      if(this.printData.length>16){
        this.printData.splice(14, 0, o);
        this.printData.splice(15, 0, o);
        this.printData.splice(16, 0, o);
        console.log( this.printData);
      }
      for(let i = 0; i< this.printData.length ; i ++) 
      {
        if(i >32) {
          this.afterPrint.push(this.printData[i]);
          }
      }
      
        if(this.printData.length>32) {
        this.printData.splice(33,this.printData.length-33);
        }
      
      console.log(this.printData);
      
      
    })
  }
  printCall(){
    if(this.printData.length>32){
      this.isLoading=true;
      setTimeout(() => {
      this.modalRef = this.modalService.show(this.nextpage, this.config);
      this.isLoading = false;
      }, 3000);
    }
  }
  PrintNext(){
    this.printData=[]
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    else{
      this.isLoading=true;
    }
    // this.isLoading = false;
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    console.log(this.pagedItems)
  
    this.cd.detectChanges();
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'csv',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'cashcumtrial').subscribe(() => {
      // save started
      console.log("hello")
    });
  }


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
