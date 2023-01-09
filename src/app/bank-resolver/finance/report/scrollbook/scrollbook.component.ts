import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { m_acc_master, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { tt_scroll_book } from 'src/app/bank-resolver/Models/tt_scroll_book';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { RestService } from 'src/app/_service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

@Component({
  selector: 'app-scrollbook',
  templateUrl: './scrollbook.component.html',
  styleUrls: ['./scrollbook.component.css'],
  providers:[ExportAsService]

})
export class ScrollbookComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('CashScroll') child: WebDataRocksPivot;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatTable, {read: ElementRef} ) private matTableRef: ElementRef;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  scrollbook: tt_scroll_book[] = [];
  prp =new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate:Date;
  isLoading = false;
  counter=0
  exportAsConfig:ExportAsConfig;
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  resultLength=0
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
  maccmaster: m_acc_master[] = [];
  maccmasterRet: m_acc_master[] = [];
  cashSumPay=0
  cashSumRecp=0
  trfSumPay=0
  trfSumRecp=0
  filteredArray:any=[]
  displayedColumns: string[] = ['voucher_id', 'acc_num', 'acc_cd', 'cust_narration','cash_recp','trf_recp','cash_pay','trf_pay'];
  dataSource = new MatTableDataSource()
  constructor(private svc: RestService,private formBuilder: FormBuilder,
    private modalService: BsModalService,private _domSanitizer : DomSanitizer, private cd: ChangeDetectorRef,
    private exportAsService: ExportAsService, private comser:CommonServiceService,
    private router: Router ) { }
  ngOnInit(): void {
    this.getmAccMaster()
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
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

  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.alertMsg = "Invalid Input.";
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = "To Date cannot be greater than From Date!";
      return false;
    }
    else {
      this.cashSumPay=0
      this.cashSumRecp=0
      this.trfSumPay=0
      this.trfSumRecp=0
      this.reportData.length=0
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd": this.sys.ardbCD,
        "brn_cd": this.sys.BranchCode,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": this.todate.toISOString(),
      }
      this.svc.addUpdDel('Finance/PopulateDayScrollBook',dt).subscribe(data=>{console.log(data)
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
      this.dataSource.data=this.reportData
      // for(let i=0;i<50;i++)
      // this.dataSource.data.push(this.reportData)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultLength=this.reportData.length
      this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
      this.firstAccCD=this.reportData[0].acc_cd;
      this.lastAccCD=this.reportData[this.reportData.length-1].acc_cd  
      this.reportData.forEach(e=>{
       
      //   this.opdrSum+=e.opng_dr;
      //   this.opcrSum+=e.opng_cr;
      this.cashSumPay+=e.cash_pay
      this.cashSumRecp+=e.cash_recp
      this.trfSumPay+=e.trf_pay
      this.cashSumRecp+=e.trf_recp
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
  private getmAccMaster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
      res => {
        console.log(res);
        this.maccmasterRet = res;
        this.maccmaster = this.maccmasterRet;
        let Index = this.maccmaster.findIndex(el => el.acc_cd == 21101);
       console.log(Index);
      },
      err => { }
    );
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
    this.isLoading = false;
    this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }
  onPivotReady(DailyCashBook: WebDataRocksPivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }

  onReportComplete(): void {
    ;
    if (!this.isLoading)return ;
    this.prp.brn_cd=this.sys.BranchCode;
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.todate;
    this.prp.acc_cd=parseInt(localStorage.getItem('__cashaccountCD'));
    let fdate = new Date(this.fromdate);
    let tdate = new Date(this.todate);
    this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    this.td = (("0" + tdate.getDate()).slice(-2)) + "/" + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (("0" + this.dt.getDate()).slice(-2)) + "/" + (("0" + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    this.child.webDataRocks.off("reportcomplete");
    this.svc.addUpdDel<any>('Report/PopulateDayScrollBook',this.prp).subscribe(
      (data: tt_scroll_book[]) => this.scrollbook = data,
      error => { console.log(error); },
      () => {
          ;
         let totalCr=0;
         let totalDr=0;
         let tmp_cash_account=new tt_scroll_book();
         this.isLoading=false;
         this.child.webDataRocks.setReport({
          dataSource: {
             data:this.scrollbook
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 80
              },
              {
                idx: 1,
                width: 80
              },
              {
                idx: 2,
                width: 80
              },
              {
                idx: 3,
                width: 200
              },
              {
                idx: 4,
                width: 100
              },
              {
                idx: 5,
                width: 100
              },
              {
                idx: 6,
                width: 100
              },
              {
                idx: 7,
                width: 100
              }
            ]
          },
          "options": {
            "grid": {
                "type": "flat",
                "showTotals": "off",
                "showGrandTotals": "off"
            }
            },
            "slice": {
              "rows": [
                  {
                      "uniqueName": "trans_cd",
                      "caption": "Trans CD",
                      "sort": "unsorted"

                  },
                  {
                      "uniqueName": "voucher_id",
                      "caption": "Voucher ID",
                      "sort": "unsorted"
                  },
                  {
                      "uniqueName": "acc_num",
                      "caption": "Account Num",
                      "sort": "unsorted"
                  },
                  {
                    "uniqueName": "cust_narration",
                    "caption": "Head Of A/Cs",
                      "sort": "unsorted"
                },
                {
                    "uniqueName": "cash_pay",
                    "caption": "Pay Cash",
                      "sort": "unsorted"
                },
                {
                    "uniqueName": "trf_pay",
                    "caption": "Pay Trf",
                      "sort": "unsorted"
                },
                {
                  "uniqueName": "cash_recp",
                  "caption": "Rcpt Cash",
                    "sort": "unsorted"
              },
              {
                  "uniqueName": "trf_recp",
                  "caption": "Rcpt Trf",
                    "sort": "unsorted"
              }
              ],
              "measures": [
                {
                  uniqueName: "acc_num",
                  format: "decimal0"
                },
                {
                  uniqueName: "trans_cd",
                  format: "decimal0"
                },
                {
                  uniqueName: "voucher_id",
                  format: "decimal0"
                }],
              "flatOrder": [
                  "Trans CD",
                  "Voucher ID",
                  "Account Num"
              ]
          },

            "formats": [{
              "name": "",
              "thousandsSeparator": ",",
              "decimalSeparator": ".",
              "decimalPlaces": 2,
              "maxSymbols": 20,
              "currencySymbol": "",
              "currencySymbolAlign": "left",
              "nullValue": " ",
              "infinityValue": "Infinity",
              "divideByZeroValue": "Infinity"
          },
          {
            name: "decimal0",
            decimalPlaces: 0,
            thousandsSeparator: "",
            textAlign:"left"
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
  var options = this.child.webDataRocks.getOptions();
  this.child.webDataRocks.setOptions( {
    grid: {
      title: 'Cash Scroll For The Period ' +this.fd +'-' +this.td
    }
  }
  );
  this.child.webDataRocks.refresh();
  this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : "+localStorage.getItem('__brnName')+"<br>&nbsp</div>",filename:"ScrollBook"});
  this.child.webDataRocks.on('exportcomplete', function () {
    this.child.webDataRocks.off('exportcomplete')
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
    type: 'csv',
    // elementId: 'hiddenTab', 
    elementIdOrContent:'hiddenTab'
  }
  this.exportAsService.save(this.exportAsConfig, 'generalledger').subscribe(() => {
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
  this.getTotal()
}
getTotal(){
  this.cashSumPay=0
  this.cashSumRecp=0
  this.trfSumPay=0
  this.trfSumRecp=0
  console.log(this.dataSource.filteredData)
  this.filteredArray=this.dataSource.filteredData
  for(let i=0;i<this.filteredArray.length;i++){
    // console.log(this.filteredArray[i].dr_amt)
    this.cashSumPay+=this.filteredArray[i].cash_pay
    this.cashSumRecp+=this.filteredArray[i].cash_recp
    this.trfSumPay+=this.filteredArray[i].trf_pay
    this.trfSumRecp+=this.filteredArray[i].trf_recp
  }
}
}
