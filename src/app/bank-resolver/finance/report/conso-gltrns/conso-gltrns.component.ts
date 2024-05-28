import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
 
import { p_report_param, SystemValues, tt_cash_cum_trial, tt_gl_trans } from 'src/app/bank-resolver/Models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-conso-gltrns',
  templateUrl: './conso-gltrns.component.html',
  styleUrls: ['./conso-gltrns.component.css'],
  providers:[ExportAsService]
})
export class ConsoGLTrnsComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
   
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  genLdgerTrans: tt_gl_trans[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  isLoading = false;
  showAlert = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  urlToCall: '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  counter=0;
  filteredArray:any=[]
  exportAsConfig:ExportAsConfig;
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  displayedColumns: string[] = ['branch','acc_cd', 'voucher_dt', 'voucher_id', 'narration','voucher_type','dr_amt','cr_amt','cum_bal','cum_bal_type'];
  dataSource = new MatTableDataSource()
  firstAccCD:any
  lastAccCD:any;
  crSum=0;
  drSum=0;
  itemsPerPage = 2;
  currentPage = 1;
  pageChange: any;
  pagedItems = [];
  reportData:any=[];
  brnDtls: any = [];
  today:any;
  opng_bal:any;
  resultLength=0;
  LandingCall:boolean;
  bName:any;
  constructor(private svc: RestService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _domSanitizer : DomSanitizer, private cd: ChangeDetectorRef,
    private exportAsService: ExportAsService, private comser:CommonServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
    this.GetBranchMaster();
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      fromAcc: [null, Validators.required],
      toAcc: [null, Validators.required],
    });
    if(this.comser.openGlTrns){
      this.SubmitReport()
      this.LandingCall=this.comser.openGlTrns
    }
    else{
    this.onLoadScreen(this.content);
    }
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }

  get r() { return this.reportcriteria.controls; }

 onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }

  private GetBranchMaster() {
    // this.isLoading = true;
    var dt = { "ardb_cd": this.sys.ardbCD };
    console.log(dt)
    this.svc.addUpdDel('Mst/GetBranchMaster', dt).subscribe(
      res => {
        console.log(res)
        // this.isLoading = false;
        this.brnDtls = res;
      },
      err => { 
        // this.isLoading = false;
       }
    );
  }

  public SubmitReport() {
    
      if (this.reportcriteria.invalid) {
        this.showAlert = true;
        this.alertMsg = 'Invalid Input.';
        return false;
      }
      else if (new Date(this.r.fromDate.value) > new Date(this.r.toDate.value)) {
        this.showAlert = true;
        this.alertMsg = 'To Date cannot be greater than From Date!';
        return false;
      }
      else {
        this.crSum=0;
        this.drSum=0;
        this.modalRef.hide()
        this.showAlert = false;
        this.reportData.length=0;
        this.pagedItems.length=0;
        this.fromdate=this.reportcriteria.value['fromDate'];
        this.todate=this.reportcriteria.value['toDate'];
        //this.isLoading=true;
        //this.onReportComplete();
        // this.modalService.dismissAll(this.content);
        var data={
          "ardb_cd": this.sys.ardbCD,
          // "brn_cd": this.sys.BranchCode,
          "from_dt": this.fromdate.toISOString(),
          "to_dt": this.todate.toISOString(),
          "ad_from_acc_cd": this.reportcriteria.controls.fromAcc.value,
          "ad_to_acc_cd": this.reportcriteria.controls.toAcc.value
        }
        this.svc.addUpdDel('Finance/GetGLTransDtlsConso',data).subscribe(data=>{console.log(data)
        this.reportData=data
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        } 
        console.log(this.reportData)
        this.isLoading=false
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.firstAccCD=this.reportData[0].acc_cd;
        this.lastAccCD=this.reportData[this.reportData.length-1].acc_cd  
        this.opng_bal=this.reportData[0].opng_bal
         for(let j=0;j<this.reportData.length;j++){
        for(let i=0;i<this.brnDtls.length;i++){
          if(this.reportData[j].brn_cd==this.brnDtls[i].brn_cd){
            this.reportData[j].acc_cd_desc=this.brnDtls[i].brn_name
          }
          console.log(this.reportData[j].brn_cd==this.brnDtls[i].brn_cd);
          
          // this.reportData[j].acc_cd_desc=this.reportData[j].filter(e=>e.brn_cd==this.brnDtls[i].brn_cd)[0].brn_name
          // this.reportData.forEach(e=>{e.brn_cd==this.brnDtls[i].brn_cd?this.reportData[e].acc_cd_desc.push(this.brnDtls[i].brn_name)})
        }
        }
        // console.log(this.reportData.forEach(e=>e.brn_cd==this.brnDtls.filter(m=>m.brn_cd)));

        debugger
        this.dataSource.data=this.reportData
        debugger
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.dataSource.sort(function (a, b) {
        //   return (a.brn_cd < b.brn_cd ? -1 : (a.brn_cd > b.brn_cd ? 1 : 0));
        // });
        this.resultLength=this.reportData.length
        this.reportData.forEach(e=>{
         
        //   this.opdrSum+=e.opng_dr;
        //   this.opcrSum+=e.opng_cr;
          this.crSum+=e.cr_amt;
          this.drSum+=e.dr_amt;
        //   this.clsdrSum+=e.clos_dr;
        //   this.clscrSum+=e.clos_cr;
        })
        // this.lastAccCD=this.reportData[this.reportData.length-1].acc_cd
        },
        err => {
           this.isLoading = false;
           this.comser.SnackBar_Error(); 
          }
  )
        
        // this.UrlString=this.svc.getReportUrl()
        // this.UrlString=this.UrlString+"WebForm/Fin/cashcumtrail?" + 'ardb_cd=' + this.sys.ardbCD+"&brn_cd="+this.sys.BranchCode+"&from_dt="+Utils.convertDtToString(this.fromdate)+"&to_dt="+Utils.convertDtToString(this.todate)
        ;
       
        this.isLoading = true;
        this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
        // setTimeout(() => {
        //   this.isLoading = false;
        // }, 10000);
    }
    
    
  }

  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading = false;
      this.counter=0
    }
    else{
      this.isLoading=true;
    }
    this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }
  // private pdfmake : pdfMake;
 


 
  closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
pageChanged(event: PageChangedEvent): void {
  const startItem = (event.page - 1) * event.itemsPerPage;
  const endItem = event.page * event.itemsPerPage;
  this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
  this.cd.detectChanges();
}
downloadexcel(){
  this.exportAsConfig = {
    type: 'xlsx',
    // elementId: 'hiddenTab', 
    elementIdOrContent:'mattable'
  }
  this.exportAsService.save(this.exportAsConfig, 'ConsoGLTrans').subscribe(() => {
    // save started
    console.log("hello")
  });
}

applyFilter(event: Event) {
  console.log(event)
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  console.log(this.dataSource)
  this.getTotalCr();
  this.getTotalDr();
}
getTotalCr() {
  this.crSum=0;
  
  console.log(this.dataSource.filteredData)
  this.filteredArray=this.dataSource.filteredData
  for(let i=0;i<this.filteredArray.length;i++){
    console.log(this.filteredArray[i].cr_amt)
    this.crSum+=this.filteredArray[i].cr_amt
  }
  // for(let i=0;i<this.dataSource.filteredData.length;i++){
  //   console.log(this.dataSource.filteredData)
  // }
 
}
getTotalDr(){
  this.drSum=0;
  
  console.log(this.dataSource.filteredData)
  this.filteredArray=this.dataSource.filteredData
  for(let i=0;i<this.filteredArray.length;i++){
    console.log(this.filteredArray[i].dr_amt)
    this.drSum+=this.filteredArray[i].dr_amt
  }
}

}
