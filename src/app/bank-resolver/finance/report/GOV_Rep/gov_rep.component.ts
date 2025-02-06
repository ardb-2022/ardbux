import { SystemValues } from '../../../Models/SystemValues';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef ,AfterViewInit, ElementRef} from '@angular/core';
import { RestService } from 'src/app/_service';
 
import { tt_cash_account, p_report_param } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
@Component({
  selector: 'app-gov_rep',
  templateUrl: './gov_rep.component.html',
  styleUrls: ['./gov_rep.component.css'],
  providers:[ExportAsService]
})
export class GovRepComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  
  @ViewChild('mattable') mattable: ElementRef;
  kycData = [];
  transData = [];
  kycColumns = ['ardb_name', 'no_of_dep_acc', 'no_of_kyc_dep_acc', 'no_of_non_kyc_dep_acc', 'no_of_dormant_acc', 'bal_of_dormant_acc'];
  transColumns = ['ardb_name', 'date_range', 'no_of_dep_acc', 'trans_amt', 'no_of_kyc_dep_acc', 'no_of_non_kyc_dep_acc'];

  displayedColumns: string[] = ['dr_acc_cd', 'dr_particulars', 'dr_amt', 'dr_amt_tr','cr_acc_cd', 'cr_particulars', 'cr_amt', 'cr_amt_tr'];
  dataSource=new MatTableDataSource();
  @ViewChild('myTable') myTable: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //ReportUrl :SafeResourceUrl;
  //UrlString:string ="http://localhost:63011/"
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  //UrlString = 'http://36.255.3.143/Report/DayBookViewer?';
  //UrlString = 'http://36.255.3.143/Report/DayBookViewer?brn_cd=101&from_dt=20/01/2019&to_dt=31/03/2021&acc_cd=28101';
  // Modal configuration
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  
  items = [{ title: 'first' }, { title: 'second' }] // Content of the pages
 
  length: number
  pdf: jspdf
  itemsPerPage = 25;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  bsInlineValue = new Date();
  maxDate = new Date();
  dailyCash: tt_cash_account[] = [];
  prp = new p_report_param();
  sys = new SystemValues();
  exportAsConfig:ExportAsConfig;
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  isLoading = false;
  counter=0;
  pageChange: any;
  crSum=0;
  drSum=0;
  crSumTr=0;
  drSumTr=0;
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName

  lastcrAccCD:any;
  lastdrAccCD:any;
  today:any
  LandingCall:boolean;

  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService,private _domSanitizer : DomSanitizer, private cd: ChangeDetectorRef,
    // private modalService: NgbModal,
    private exportAsService: ExportAsService, private comser:CommonServiceService,

    private router: Router) {  }
  ngOnInit(): void {
    this.SubmitReport();
    // this.modalRef.hide();
    
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  onLoadScreen(content) {
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    // },
    //   (reason) => {
    //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
    //   });
    this.modalRef = this.modalService.show(content, this.config);
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

  public SubmitReport() {
    // this.modalRef.hide();

      this.reportData.length=0;
      this.pagedItems.length=0
      this.showAlert = false;
      this.isLoading=true
      this.crSum=0;
      this.drSum=0;
      this.crSumTr=0;
      this.drSumTr=0;
      this.fromdate = this.sys.CurrentDate;
      this.todate = this.sys.CurrentDate;
      this.isLoading=true;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        // "adt_dt":this.fromdate.toISOString(),"2024-12-30T18:30:00.000Z"
        "adt_dt":"2024-12-30T18:30:00.000Z"
      }
      this.svc.addUpdDel('Deposit/GovtKycData',dt).subscribe(data=>{console.log(data)
        if (data) {
          // this.modalRef.hide();
          this.kycData = data[0].tt_govt_kyc_data_rep;
          this.transData = data[0].tt_govt_trans_data_rep;
           this.isLoading=false

        }
        else{
          this.comser.SnackBar_Nodata()
          this.isLoading=false

        }
      
      
      this.crSum=0;
      this.drSum=0
        
    },
    err => {
       this.isLoading = false;
       this.comser.SnackBar_Error(); 
      })


    
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0
    }
    else{
      this.isLoading=true;
    }
    
    // this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }

convDate(dateStr){
  const dateObj = new Date(dateStr);

const day = String(dateObj.getDate()).padStart(2, '0');
const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const year = dateObj.getFullYear();

const formattedDate = `${day}/${month}/${year}`;
console.log(formattedDate); // Output: 07/01/2025
return formattedDate
}
  onReportComplete(): void {
    ;
    if (!this.isLoading) return;
    this.prp.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.prp.from_dt = this.fromdate;
    this.prp.to_dt = this.todate;
    this.prp.acc_cd = parseInt(localStorage.getItem('__cashaccountCD'));
    //this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
    // let fdate = new Date(this.fromdate);
    // let tdate = new Date(this.todate);
    // this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    // this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    // this.dt = new Date();
    // this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    // this.child.webDataRocks.off('reportcomplete');
    // this.svc.addUpdDel<any>('Report/PopulateDailyCashBook', this.prp).subscribe(
    //   (data: tt_cash_account[]) => this.dailyCash = data,
    //   error => { console.log(error); },
    //   () => {
    //     ;
    //     let totalCr = 0;
    //     let totalDr = 0;
    //     let tmp_cash_account = new tt_cash_account();
    //     this.dailyCash.forEach(x => totalCr += x.cr_amt);
    //     this.dailyCash.forEach(x => totalDr += x.dr_amt);
    //     this.dailyCash.forEach(x => x.cr_acc_cd = (x.cr_acc_cd == '0' ? '' : '' + x.cr_acc_cd.toString()));
    //     this.dailyCash.forEach(x => x.dr_acc_cd = (x.dr_acc_cd == '0' ? '' : '' + x.dr_acc_cd.toString()));
    //     this.dailyCash.forEach(x => x.dr_amt = (x.dr_amt == 0.00 ? null : x.dr_amt));
    //     this.dailyCash.forEach(x => x.cr_amt = (x.cr_amt == 0.00 ? null : x.cr_amt));
    //     this.dailyCash.forEach(x => x.dr_particulars = (x.dr_particulars == null ? ' ' : x.dr_particulars));
    //     this.dailyCash.forEach(x => x.cr_particulars = (x.cr_particulars == null ? ' ' : x.cr_particulars));
    //     tmp_cash_account.cr_amt = totalCr;
    //     tmp_cash_account.dr_amt = totalDr;
    //     tmp_cash_account.dr_particulars = 'Total Debit: ';
    //     tmp_cash_account.cr_particulars = 'Total Credit: ';
    //     this.dailyCash.push(tmp_cash_account);
    //     this.isLoading = false;
    //     this.child.webDataRocks.setReport({
    //       dataSource: {
    //         data: this.dailyCash
    //       },
    //       tableSizes: {
    //         columns: [
    //           {
    //             idx: 0,
    //             width: 75
    //           },
    //           {
    //             idx: 1,
    //             width: 200
    //           },
    //           {
    //             idx: 2,
    //             width: 100
    //           },
    //           {
    //             idx: 3,
    //             width: 75
    //           },
    //           {
    //             idx: 4,
    //             width: 200
    //           },
    //           {
    //             idx: 5,
    //             width: 100
    //           }
    //         ]
    //       },
    //       "options": {
    //         "grid": {
    //           "type": "flat",
    //           "showTotals": "off",
    //           "showGrandTotals": "off"
    //         }
    //       },
    //       "slice": {
    //         "rows": [
    //           {
    //             "uniqueName": "dr_acc_cd",
    //             "caption": "Debit",
    //             "sort": "unsorted"

    //           },
    //           {
    //             "uniqueName": "dr_particulars",
    //             "caption": "Dr Description",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "dr_amt",
    //             "caption": "Dr Amount",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "cr_acc_cd",
    //             "caption": "Credit",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "cr_particulars",
    //             "caption": "Cr Description",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "cr_amt",
    //             "caption": "Cr Amount",
    //             "sort": "unsorted"
    //           }
    //         ],
    //         "measures": [
    //           {
    //             uniqueName: "dr_acc_cd",
    //             format: "decimal0"
    //           },
    //           {
    //             uniqueName: "cr_acc_cd",
    //             format: "decimal0"
    //           }],
    //         "flatOrder": [
    //           "Debit",
    //           "Dr Description",
    //           "Dr Amount",
    //           "Credit",
    //           "Cr Description",
    //           "Cr Amount",
    //         ]
    //       },

    //       "formats": [{
    //         "name": "",
    //         "thousandsSeparator": ",",
    //         "decimalSeparator": ".",
    //         "decimalPlaces": 2,
    //         "maxSymbols": 20,
    //         "currencySymbol": "",
    //         "currencySymbolAlign": "left",
    //         "nullValue": " ",
    //         "infinityValue": "Infinity",
    //         "divideByZeroValue": "Infinity"
    //       },
    //       {
    //         name: "decimal0",
    //         decimalPlaces: 0,
    //         thousandsSeparator: "",
    //         textAlign: "left"
    //       }
    //       ]
    //     });
    //     // close the modal
    //     this.modalRef.hide();
    //   }
    // );
  }

  closeScreen() {
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
    this.exportAsService.save(this.exportAsConfig, 'GOV_REP').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  

  // async exportToPDF() {
  //   const table = document.getElementById('myTable')
  //   html2canvas(table, { scrollY: -window.scrollY }).then(canvas => {
  //     const pdf = new jspdf('p', 'mm', 'a4');
  //     const contentWidth = canvas.width / 6; // Adjust this as needed
  //     const contentHeight = canvas.height / 6; // Adjust this as needed
  //     const totalPages = Math.ceil(contentHeight / pdf.internal.pageSize.getHeight());

  //     let yPosition = 0;
  //     let pageHeight = pdf.internal.pageSize.getHeight();

  //     for (let i = 0; i < totalPages; i++) {
  //       if (i > 0) {
  //         pdf.addPage();
  //         pageHeight = pdf.internal.pageSize.getHeight();
  //       }

  //       let canvasOffset = -(i * pageHeight);
        
  //       if (canvasOffset < -contentHeight) {
  //         canvasOffset = -contentHeight;
  //       }

  //       pdf.addImage(canvas, 'PNG', 0, yPosition, contentWidth, contentHeight);
  //       yPosition -= pageHeight;
  //     }

  //     pdf.save('table.pdf');
  //   });
  // }




// exportAsPDF() {
//   const elementToPrint = document.getElementById('mattable'); // replace 'mattable' with the ID of your HTML div
//   html2canvas(elementToPrint).then((canvas) => {
//     const contentDataURL = canvas.toDataURL('image/png');
//     const pdf = new jspdf('landscape', 'px', 'a4');
//     const imgWidth = 610;
//     const pageHeight = 300;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;
//     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//     let pageCount = 1;
//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight-210;
//       pdf.addPage();
//       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight; // add the gap height to the page height
//       pageCount++;
//     }
//     pdf.save('cashcumtrial.pdf'); // replace 'cashcumtrial' with the desired filename
//   });
// }
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

applyFilter(event: Event) {
  console.log(event)
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
console.log(this.dataSource.filteredData)
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
}
