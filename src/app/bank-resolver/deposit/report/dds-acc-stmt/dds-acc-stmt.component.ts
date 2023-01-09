import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-dds-acc-stmt',
  templateUrl: './dds-acc-stmt.component.html',
  styleUrls: ['./dds-acc-stmt.component.css'],
  providers:[ExportAsService]
})
export class DdsAccStmtComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['paid_dt','paid_amt'];

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
  reportcriteria: FormGroup;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  filteredArray:any=[]
  total_bal:any;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  agentCD:any
  opening_bal:any
  showWait=false
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef, private router: Router, private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [null, Validators.required],
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
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
    this.isLoading=true;
    this.showWait=true
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = 11;
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          this.isLoading=false
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.suggestedCustomer = [];
          }
          this.showWait=false
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.isLoading=false
      this.suggestedCustomer = null;
    }
  }
  public SelectCustomer(cust: any): void {
    console.log(cust)
    this.cName = cust.cust_name
    this.cAddress = cust.present_address
    this.cAcc = cust.acc_num
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
      this.opcrSum=0
      this.opdrSum=0
      this.total_bal=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      console.log(this.fromdate.toDateString()+" "+this.toDate.toDateString())
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "acc_num":this.reportcriteria.controls.acct_num.value,
        "acc_type_cd":11,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateASDds',dt).subscribe(data=>{console.log(data)
      this.reportData=data;
      console.log(this.reportData[0].clr_bal);
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      } 
      this.total_bal=this.reportData[0].clr_bal
      this.dataSource.data=this.reportData
      this.agentCD=this.reportData[0].agent_cd;
      this.opening_bal=this.reportData[0].opng_bal;
      // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
      this.isLoading=false
      // if(this.reportData.length<50){
      //   this.pagedItems=this.reportData
      // }
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.setPage(2);
      // this.setPage(1);
      this.modalRef.hide();
      this.reportData.forEach(e=>{
        this.opcrSum+=e.paid_amt
        this.opdrSum+=e.dr_amt
      })
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        }
)
      this.showAlert = false;
   }
  }
  public closeAlert() {
    this.showAlert = false;
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); 
    console.log(this.pagedItems)
    this.cd.detectChanges();
  }
 closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  getTotal(){
    this.opcrSum=0
    this.opdrSum=0
    this.total_bal=0
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
    
      this.total_bal+=this.filteredArray[i].paid_amt
        this.opdrSum+=this.filteredArray[i].dr_amt
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
  
}
