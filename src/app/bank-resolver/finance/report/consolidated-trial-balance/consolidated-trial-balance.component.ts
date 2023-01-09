import { Component, OnInit, ViewChild, TemplateRef,ChangeDetectorRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
// import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-consolidated-trial-balance',
  templateUrl: './consolidated-trial-balance.component.html',
  styleUrls: ['./consolidated-trial-balance.component.css'],
  providers:[ExportAsService]
})
export class ConsolidatedTrialBalanceComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('TrialBalance') child: WebDataRocksPivot;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  liAccCd:any
  page=1;
  pageSize=10
  exportAsConfig:ExportAsConfig;
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
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
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  called = 0;
  counter=0;
  reportData:any=[]
  pageChange:any;
  liNum=0;
  asNum=0;
  revNum=0;
  exNum=0
  liCrSum=0;
  liDrSum=0;
  asDrSum=0;
  asCrSum=0;
  revCrSum=0;
  revDrSum=0;
  exDrSum=0;
  exCrSum=0;
  // items = [1, 2, 3, 4, 5, 6, 7, 8];
  pagedItems = [];

  itemsPerPage = 50;
  currentPage = 1;
  asAccCd: any;
  revAccCd: any;
  exAccCd: any;
  today:any
  // displayedColumns: string[] = ['acc_type', 'acc_name', 'acc_cd', 'dr','cr'];
  // displayedColumns: string[] = ['acc_name', 'acc_cd', 'dr','cr'];
  displayedColumns: string[] = ['acc_cd'];
  // displayedColumns1: string[] = ['acc_cd', 'dr','cr'];
  dataSource = new MatTableDataSource()
  // dataSource1 = new MatTableDataSource()
  resultLength=0;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,
              private router: Router,private cd: ChangeDetectorRef, private exportAsService: ExportAsService,private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [''],
      toDate: [null, null]
    });
    this.reportcriteria.controls.fromDate.setValue(this.sys.CurrentDate)
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
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      this.reportData.length=0
      this.pagedItems.length=0
      this.isLoading = true;
      this.modalRef.hide()
      this.liNum=0;
  this.asNum=0;
  this.revNum=0;
  this.exNum=0
  this.liCrSum=0;
  this.liDrSum=0;
  this.asDrSum=0;
  this.asCrSum=0;
  this.revCrSum=0;
  this.revDrSum=0;
  this.exDrSum=0;
  this.exCrSum=0;
      console.log(this.reportcriteria.controls.fromDate.value)
      console.log(this.sys.CurrentDate)
    
      this.fromdate = this.reportcriteria.value.fromDate;
      this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Fin/trialbalance?'
      //   + 'ardb_cd=' + this.sys.ardbCD + '&brn_cd=' + this.sys.BranchCode + '&trial_dt='
      //   + Utils.convertDtToString(this.fromdate)
      //   + '&pl_acc_cd=13201' + '&gp_acc_cd=36101'
      //   ;
      this.liNum=0;this.revNum=0;this.asNum=0;this.exNum=0
      var dt={
        "ardb_cd":this.sys.ardbCD,
        // "brn_cd":this.sys.BranchCode,
        "trial_dt":this.reportcriteria.controls.fromDate.value.toISOString(),
        "pl_acc_cd":13201,
        "gp_acc_cd":36101
      }
      // this.svc.addUpdDel('Finance/PopulateTrialBalance',dt).subscribe(data=>{
        this.svc.addUpdDel('Finance/PopulateTrialGroupwiseConso',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        for(let i=0;i<4;i++){
          for(let j=0;j<this.reportData[i].trailbalance.length;j++){
          
          }
        }
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        }
        this.dataSource.data=this.reportData
        // for(let i=0;i<50;i++)
        // this.dataSource.data.push(this.reportData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        this.dataSource.filterPredicate = function(data:any, filter: string): boolean {
          return data.acc_type.toLowerCase().includes(filter)
        };
       
      // this.reportData.forEach(r=>{
      //   r.trailblance.forEach(e=>{
      //     switch(e.acc_cd.charAt[0]){
      //       case "1": this.liNum++; this.liCrSum+=e.cr; this.liDrSum+=e.dr; break;
      //       case "2": this.asNum++; this.asCrSum+=e.cr; this.asDrSum+=e.dr;break;
      //       case "3": this.revNum++; this.revCrSum+=e.cr; this.revDrSum+=e.dr; break;
      //       case "4": this.exNum++;  this.exCrSum+=e.cr; this.exDrSum+=e.dr; break;
      //     }
      //   })
      // })
        for(let i=0;i<this.reportData.length;i++){
          for(let j=0;j<this.reportData[i].trailbalance.length;j++){
            switch(i){
              case 0: this.liNum++; this.liCrSum+=this.reportData[i].trailbalance[j].cr; this.liDrSum+=this.reportData[i].trailbalance[j].dr; break;
            case 1: this.asNum++; this.asCrSum+=this.reportData[i].trailbalance[j].cr; this.asDrSum+=this.reportData[i].trailbalance[j].dr;break;
            case 2: this.revNum++; this.revCrSum+=this.reportData[i].trailbalance[j].cr; this.revDrSum+=this.reportData[i].trailbalance[j].dr; break;
            case 3: this.exNum++;  this.exCrSum+=this.reportData[i].trailbalance[j].cr; this.exDrSum+=this.reportData[i].trailbalance[j].dr; break;
            }
          }
        }
        this.liAccCd=this.reportData[0].trailbalance[this.reportData[0].trailbalance.length - 1].acc_cd
        this.asAccCd=this.reportData[1].trailbalance[this.reportData[1].trailbalance.length - 1].acc_cd
        this.revAccCd=this.reportData[2].trailbalance[this.reportData[2].trailbalance.length- 1].acc_cd
        this.exAccCd=this.reportData[3].trailbalance[this.reportData[3].trailbalance.length - 1].acc_cd
        
        console.log(this.liAccCd,this.asAccCd,this.revAccCd,this.exAccCd)
        console.log(this.liNum+" "+this.asNum+" "+this.revNum+" "+this.exNum)
        // debugger
      this.isLoading = false;
      this.modalRef.hide();
      this.pageChange=document.getElementById('chngPage');
      this.pageChange.click()
      this.setPage(2);
      this.setPage(1)
       

      }
        ),
        err => {
           this.isLoading = false;
           this.comser.SnackBar_Error(); 
          }
  
        // this.UrlString = this.UrlString + 'WebForm/Fin/trialbalance?'
        // + 'ardb_cd=' + this.sys.ardbCD + '&brn_cd=' + this.sys.BranchCode + '&trial_dt='
        // +  this.reportcriteria.controls.fromDate.value.toISOString()
        // + '&pl_acc_cd=13201' + '&gp_acc_cd=36101'
        // ;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
     
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 4000);
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
  onPivotReady(TrialBalance: WebDataRocksPivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }
  onReportComplete(): void {
    if (!this.isLoading) { return; }
    this.prp.brn_cd = this.sys.BranchCode;
    this.prp.trial_dt = this.fromdate;
    this.prp.pl_acc_cd = parseInt(localStorage.getItem('__cashaccountCD'));
    this.prp.gp_acc_cd = parseInt(localStorage.getItem('__cashaccountCD'));
    const fdate = new Date(this.fromdate);
    const tdate = new Date(this.todate);
    this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
    this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
    this.child.webDataRocks.off('reportcomplete');
    this.svc.addUpdDel<any>('Report/PopulateTrialBalance', this.prp).subscribe(
      (data: tt_trial_balance[]) => this.trailbalance = data,
      error => { console.log(error); },
      () => {

        // this.showReport = true;
        // this.generatePdf();
        const totalCr = 0;
        const totalDr = 0;
        this.isLoading = false;
        this.child.webDataRocks.setReport({
          dataSource: {
            data: this.trailbalance
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 75
              },
              {
                idx: 1,
                width: 400
              },
              {
                idx: 2,
                width: 100
              },
              {
                idx: 3,
                width: 100
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
                uniqueName: 'acc_name',
                caption: 'Account Name',
                sort: 'unsorted'
              },
              {
                uniqueName: 'dr',
                caption: 'Debit',
                sort: 'unsorted'
              },
              {
                uniqueName: 'cr',
                caption: 'Credit',
                sort: 'unsorted'
              }
            ],
            measures: [
              {
                uniqueName: 'acc_cd',
                format: 'decimal0'
              }],
            flatOrder: [
              'Debit',
              'Dr Description',
              'Dr Amount',
              'Credit',
              'Cr Description',
              'Cr Amount',
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

    this.child.webDataRocks.refresh();
  }

  exportPDFTitle() {
    const options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'Trial Balance as on ' + this.fd
      }
    }
    );
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation: 'potrait', header: '<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : ' + localStorage.getItem('__brnName') + '<br>&nbsp</div>', filename: 'TrialBalance' });
    this.child.webDataRocks.on('exportcomplete', function() {
      this.child.webDataRocks.off('exportcomplete');
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
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
      type: 'pdf',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'trialbalance').subscribe(() => {
      // save started
      console.log("hello")
    });
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
