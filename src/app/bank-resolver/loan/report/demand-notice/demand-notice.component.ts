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
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';

@Component({
  selector: 'app-demand-notice',
  templateUrl: './demand-notice.component.html',
  styleUrls: ['./demand-notice.component.css'],
  providers:[DatePipe]
})
export class DemandNoticeComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  systemParam: sm_parameter[] = [];

  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  counter=0;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  ardbcd=localStorage.getItem('__ardb_cd')
  branchName=this.sys.BranchName

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
  lastAccNum:any
  currInttSum=0
  ovdInttSum=0
  ovdPrnSum=0
  currPrnSum=0
  totPrn=0;
  penalInttSum=0;
  loanNm:any;
  lastLoanID:any
  totalSum=0;
  displayedColumns: string[] = ['acc_cd'];
  displayedColumns1: string[] = ['acc_cd', 'dr','cr'];
  dataSource = new MatTableDataSource()
  resultLength=0;
  translatedData:any
  numData:any
  intt=3425
  calc=''
  convertDt:any;
  converDttoDt=''
  getArdb:any=[]
  disabledOnNull = true;
  loanId: any;
  custNm:any;
  addr:any;
  accCD:any;
  gName:any
  showWait=false
  notvalidate:boolean=false;
  date_msg:any;
  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer, private rstSvc:RestService, private datePipe:DatePipe,
    private router: Router, private comser: CommonServiceService) { }
  ngOnInit(): void {
    var dt={"ardb_cd":this.sys.ardbCD}
    this.rstSvc.getlbr(environment.ardbBanglaUrl,null).subscribe(res=>{
      console.log(res)
      this.getArdb=res
      this.getArdb=this.getArdb.filter(e=>e.ardB_CD==this.sys.ardbCD)[0].trans
      console.log(this.getArdb)
    }
    )
    this.rstSvc.getlbr(environment.numUrl,null).subscribe(data=>{
      this.numData=data;
     console.log(this.numData)
        for(let j=0;j<this.intt.toString().length;j++){
          this.calc+=this.numData[(+this.intt.toString().charAt(j))]
  
      }
      console.log(this.calc)
      
    })
    this.rstSvc.getlbr(environment.transUrl,null).subscribe(data=>{
      // console.log(data)
      console.log(data)
      this.translatedData=data
      // this.menuConfigs=data;
    })
   
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }

  cancelOnNull() {
    this.suggestedCustomer = null;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true
    }
  }
  public suggestCustomer(): void {
    // debugger;
    this.showWait=true
    this.isLoading = true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      prm.ardb_cd = this.sys.ardbCD
      this.svc.addUpdDel<any>('Loan/GetLoanDtls1', prm).subscribe(
        res => {
          this.isLoading = false
          console.log(res)
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.isLoading = false
            this.suggestedCustomer = [];
          }
          this.showWait=false;
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.isLoading = false;
      this.suggestedCustomer = null;
    }
    
    
  }

  public SelectCustomer(cust: any): void {
    console.log(cust)
    // this.fromdate=cust.disb_dt
    // this.toDate=this.sys.CurrentDate
    this.gName=cust.guardian_name
    this.accCD=cust.acc_cd
    this.loanId=cust.loan_id
    this.custNm=cust.cust_name
    this.addr=cust.present_address
    this.reportcriteria.controls.acct_num.setValue(cust.loan_id);
    this.suggestedCustomer = null;
    const currFYear = localStorage.getItem('__curFinyr');
    debugger
    this.reportcriteria.controls.fromDate.setValue('01/04/'+currFYear)
    debugger
  }
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    // console.log(this.pagedItems)
  
    this.cd.detectChanges();
  }
  public SubmitReport() {
    this.comser.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    this.converDttoDt=''
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
  else if(this.comser.diff<0){
    this.date_msg=this.comser.date_msg;

    this.notvalidate=true
    // alert('hello')
  }
    else {
      this.ovdInttSum=0
          this.currInttSum=0
          this.currPrnSum=0
          this.ovdPrnSum=0
          this.penalInttSum=0
          this.totalSum=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      // this.isLoading=true;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      console.log(this.datePipe.transform(this. toDate, 'dd/MM/yyyy'))
      this.convertDt=this.datePipe.transform(this. toDate, 'dd/MM/yyyy')
      for(let j=0;j<this.convertDt.toString().length;j++){
        if(this.convertDt.toString().charAt(j)!='/')
        this.converDttoDt+=this.numData[(+this.convertDt.toString().charAt(j))]
        else
        this.converDttoDt+='/'

    }
    const str = this.reportcriteria.controls.fromDate.value;
    const darr = str.split("/");    // ["29", "1", "2016"]
    const dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    console.log(dobj.toISOString());
    // console.log(this.reportcriteria.controls.fromDate.value.toISOString(),this.reportcriteria.controls.toDate.value.toISOString())
    console.log(this.calc)
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "from_dt":dobj.toISOString(),
        // "from_dt":this.reportcriteria.controls.fromDate.value,
        "to_dt":this.reportcriteria.controls.toDate.value.toISOString(),
        // "to_dt":this.reportcriteria.controls.toDate.value,
        "loan_id":this.reportcriteria.controls.acct_num.value
      }
      this.isLoading=true
      this.showAlert = false;
      
      // this.svc.addUpdDel('Loan/GetDemandList',dt).subscribe(data=>{console.log(data)
        this.svc.addUpdDel('Loan/GetDemandNotice',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        this.isLoading=false;
        if(this.reportData?.length==0||this.reportData==null){
          this.comser.SnackBar_Nodata()
        } 
        // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        // this.isLoading=false
        // this.dataSource.data=this.reportData
        // for(let i=0;i<50;i++)
        // this.dataSource.data.push(this.reportData)
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        // this.resultLength=this.reportData.length
        // if(this.reportData.length<50){
        //   this.pagedItems=this.reportData
        // }
        // this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        // this.modalRef.hide();
        // this.reportData.forEach(e => {
        //   this.ovdInttSum+=e.ovd_intt
        //   this.currInttSum+=e.curr_intt
        //   this.currPrnSum+=e.curr_prn
        //   this.ovdPrnSum+=e.ovd_prn
        //   this.penalInttSum+=e.penal_intt
        //   this.totalSum+=e.ovd_intt+e.curr_intt+e.curr_prn+e.ovd_prn
        // });
        // this.reportData.forEach(e=>{
        //   this.lastLoanID=e.loan_id
        // })
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        })
    
    }
  }
  public oniframeLoad(): void {
    this.counter++
    if(this.counter==2){
      this.isLoading = false;
      this.counter=0
    }
    else{
      this.isLoading=true
    }
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  applyFilter(event: Event) {
    // console.log(event)
    // const filterValue = (event.target as HTMLInputElement).value;
   
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      var input, filter, table, tr, td, i, txtValue;

  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("trialbalance");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
    }
  }
}

