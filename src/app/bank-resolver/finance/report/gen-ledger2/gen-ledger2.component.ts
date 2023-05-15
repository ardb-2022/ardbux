import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
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
  selector: 'app-gen-ledger2',
  templateUrl: './gen-ledger2.component.html',
  styleUrls: ['./gen-ledger2.component.css'],
  providers:[ExportAsService]

})
export class GenLedger2Component implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('GenLedgerDtl') child: WebDataRocksPivot;
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
  displayedColumns: string[] = ['acc_cd', 'voucher_dt', 'voucher_id', 'narration','voucher_type','dr_amt','cr_amt','cum_bal','cum_bal_type'];
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
  today:any
  opng_bal:any;
  resultLength=0;
  LandingCall:boolean;
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



  public SubmitReport() {
    if(this.comser.openGlTrns){
      this.isLoading=true;
      this.crSum=0;
      this.drSum=0;
      this.showAlert = false;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.fromdate=this.sys.CurrentDate;
      this.todate=this.sys.CurrentDate;
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd": this.sys.ardbCD,
        "brn_cd": this.sys.BranchCode,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": this.todate.toISOString(),
        "ad_from_acc_cd": '21101',
        "ad_to_acc_cd": '21101'
      }
      this.svc.addUpdDel('Finance/GetGLTransDtls',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      } 
      console.log(this.reportData)
      this.isLoading=false
      
      this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
      this.firstAccCD=this.reportData[0].acc_cd;
      this.lastAccCD=this.reportData[this.reportData.length-1].acc_cd  
      this.opng_bal=this.reportData[0].opng_bal
      this.dataSource.data=this.reportData
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
      
    }
    else{
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
          "brn_cd": this.sys.BranchCode,
          "from_dt": this.fromdate.toISOString(),
          "to_dt": this.todate.toISOString(),
          "ad_from_acc_cd": this.reportcriteria.controls.fromAcc.value,
          "ad_to_acc_cd": this.reportcriteria.controls.toAcc.value
        }
        this.svc.addUpdDel('Finance/GetGLTransDtls',data).subscribe(data=>{console.log(data)
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
        this.dataSource.data=this.reportData
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  onPivotReady(GenLedgerDtl: WebDataRocksPivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }


  onReportComplete(): void {
    ;
    if (!this.isLoading)return ;
    this.prp.brn_cd = this.sys.BranchCode;
    this.prp.from_dt = this.fromdate;
    this.prp.to_dt = this.todate;
    this.prp.ad_from_acc_cd = parseInt(this.r.fromAcc.value);
    this.prp.ad_to_acc_Cd = parseInt(this.r.toAcc.value);
    const fdate = new Date(this.fromdate);
    const tdate = new Date(this.todate);
    this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
    this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
    this.child.webDataRocks.off('reportcomplete');
    // Api call to get data
    this.svc.addUpdDel<any>('Report/GLTD2', this.prp).subscribe(
      (data: tt_gl_trans[]) => {
        this.genLdgerTrans = data;
        ;
      },
      error => { console.log(error); },
      () => {
        this.isLoading = false;
        ;
        this.child.webDataRocks.setReport({
          dataSource: {
            data: this.genLdgerTrans
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 105
              },
              {
                idx: 1,
                width: 105
              },
              {
                idx: 2,
                width: 105
              },
              {
                idx: 3,
                width: 105
              },
              {
                idx: 4,
                width: 105
              },
              {
                idx: 5,
                width: 105
              },
              {
                idx: 6,
                width: 105
              }
            ]
          },
          options: {
            grid: {
              type: 'flat',
              showTotals: 'off',
              showGrandTotals: 'off'
            }
          },
          slice: {
            rows: [
              {
                uniqueName: 'acc_cd',
                caption: 'Account Code',
                sort: 'unsorted'

              },
              {
                uniqueName: 'voucher_dt',
                caption: 'Voucher Date',
                sort: 'unsorted'
              },
              {
                uniqueName: 'dr_amt',
                caption: 'Debit Amount',
                sort: 'unsorted'
              },
              {
                uniqueName: 'cr_amt',
                caption: 'Credit Amount',
                sort: 'unsorted'
              },
              {
                uniqueName: 'trans_month',
                caption: 'Month of Transaction',
                sort: 'unsorted'
              },
              {
                uniqueName: 'trans_year',
                caption: 'Year of Transaction',
                sort: 'unsorted'
              },
              {
                uniqueName: 'opng_bal',
                caption: 'Opening Balance',
                sort: 'unsorted'
              }
            ],
            measures: [
              {
                uniqueName: 'acc_cd'
              }],
            flatOrder: [
              'Account Code',
              'Voucher Dt',
              'Debit Amount',
              'Credit Amount',
              'Month of Transaction',
              'Year of Transaction',
              'Opening Balance'
            ]
          },

          formats: [{
            name: '',
            thousandsSeparator: ',',
            decimalSeparator: '.',
            decimalPlaces: 2,
            maxSymbols: 20,
            currencySymbol: '',
            currencySymbolAlign: 'left',
            nullValue: ' ',
            infinityValue: 'Infinity',
            divideByZeroValue: 'Infinity'
          },
          {
            name: 'decimal0',
            decimalPlaces: 0,
            thousandsSeparator: '',
            textAlign: 'left'
          }
          ]
        });
        this.modalRef.hide();
      }
    );
  }

  setOption(option, value) {
    this.child.webDataRocks.setOptions({
      grid: {
        [option]: value
      }
    });
    ;
    this.child.webDataRocks.refresh();
  }

  exportPDFTitle() {
    const options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'Cash Cum Trial Balance For The Period ' + this.fd + '-' + this.td
      }
    }
    );
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : "+localStorage.getItem('__brnName')+"<br>&nbsp</div>",filename:"GeneralLedgerTransactions"});
    this.child.webDataRocks.on('exportcomplete', function () {
      this.child.webDataRocks.off('exportcomplete');
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
  }
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
  this.exportAsService.save(this.exportAsConfig, 'GenLeagerTrans').subscribe(() => {
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
