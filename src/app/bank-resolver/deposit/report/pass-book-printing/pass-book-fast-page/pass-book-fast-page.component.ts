import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { AccOpenDM } from 'src/app/bank-resolver/Models/deposit/AccOpenDM';
import { mm_oprational_intr } from 'src/app/bank-resolver/Models/deposit/mm_oprational_intr';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-pass-book-fast-page',
  templateUrl: './pass-book-fast-page.component.html',
  styleUrls: ['./pass-book-fast-page.component.css']
})
export class PassBookFastPageComponent implements OnInit {
  @ViewChild('content2', { static: true }) content2: TemplateRef<any>;
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
  @Input() accNum: string;
  @Input() accType: string;
  operationalInstrList: mm_oprational_intr[] = [];
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
  suggestedCustomer:any=new mm_customer();
  disabledOnNull=true
  counter=0
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  masterModel: any;
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
  joinHold:any;
  cstName:any;
  gdName:any;
  phNo:any;
  pAdds:any;
  custDtls:any;
  custCD:any;
  oprn_instr_desc:any;
  curDay:any
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService,public datepipe: DatePipe, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    // this.branchName = localStorage.getItem('__bName');
    this.reportcriteria = this.formBuilder.group({
      yes: [''],
      no: ['']
    });
    this.getOperationalInstr();
    this.onLoadScreen(this.content2);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time;
       this.curDay=this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy") 
       debugger
  }
  getOperationalInstr() {

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {

        this.operationalInstrList = res;
        this.operationalInstrList = this.operationalInstrList.sort((a, b) => (a.oprn_cd > b.oprn_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }
  loadFastPageData(){
    this.joinHold=[];
    this.masterModel = new AccOpenDM();
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "acc_num":this.accNum,
      "acc_type_cd":this.accType,
      
    }
    this.svc.addUpdDel('Deposit/getAccountOpeningData',dt).subscribe(data=>{
      console.log(data);
      this.masterModel = data;
      this.custCD=this.masterModel.tmdeposit.cust_cd
      debugger
      this.getCustomer()
     
        this.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === this.masterModel.tmdeposit.oprn_instr_cd.toString())[0].oprn_desc;
      
        for (let i = 0; i <=  this.masterModel.tdaccholder.length; i++) {
          console.log( this.masterModel);
          
        this.joinHold+=( this.masterModel.tdaccholder.length==0?'': this.masterModel.tdaccholder[i].acc_holder+',')
        console.log(this.joinHold);
        }
        
    })
    this.suggestedCustomer=[]
    var dc={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "as_cust_name":this.accNum,
      "ad_acc_type_cd":this.accType,
      
    }
    this.svc.addUpdDel('Deposit/GetAccDtls',dc).subscribe(res=>{
      console.log(res);
      this.suggestedCustomer=res;
      console.log(this.suggestedCustomer);
      
    })
    
    
  }
  getCustomer(){
    debugger
    const prm = new p_gen_param();
        prm.as_cust_name = this.custCD;
        prm.ardb_cd = this.sys.ardbCD;
        debugger
        this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
          res => {
            console.log(res)
            this.custDtls=res[0]
            debugger
          })
  }
  onLoadScreen(content2) {
    this.loadFastPageData();
    this.modalRef = this.modalService.show(content2, this.config);
    
  }
  public closeAlert() {
    this.showAlert = false;
  }
  showFastPage(){
    
    this.modalRef.hide();
  }
}
