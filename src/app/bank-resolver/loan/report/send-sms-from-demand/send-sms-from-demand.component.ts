import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer, ShowMessage, MessageType } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-send-sms-from-demand',
  templateUrl: './send-sms-from-demand.component.html',
  styleUrls: ['./send-sms-from-demand.component.css'],
  providers:[DatePipe]
})
export class SendSmsFromDemandComponent {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
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
  inputEl:any;
  fromdate: Date;
  toDate: Date;
  percentage: number;
  suggestedCustomer: mm_customer[];
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  showMsg: ShowMessage;

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
  smsCount=0;
  bName=''
  selectedValue=''
  selectedValue1=''
  displayedColumns: string[] = ['acc_name','block_name','vill_name','loan_id','party_name','phone','sms','disb_dt','outstanding_prn','curr_prn','ovd_prn','curr_intt','ovd_intt','penal_intt','total'];
  displayedColumns1: string[] = ['acc_cd', 'dr','cr'];
  dataSource = new MatTableDataSource()
  resultLength=0;
  smsArray:any=[]
  filteredArray:any=[]
  filteredArray1:any=[]
  totOutstanding=0
  dummytotOutstanding=0
      dummyovdInttSum=0
          dummycurrInttSum=0
          dummycurrPrnSum=0
          dummyovdPrnSum=0
          dummypenalInttSum=0
          dummytotalSum=0
  selectItems=[
    {
      value:'Block',
      name:'Block'
    },
    {
      value:'Account Type',
      name:'Account Type'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Village',
      name:'Village'
    },
    {
      value:'Party Name',
      name:'Party Name',

    },
    {
      value:'Loan ID',
      name:'Loan ID'
    }
  ]
  selectItems1=[
    {
      value:'Account Type',
      name:'Account Type'
    },
    {
      value:'Block',
      name:'Block'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Village',
      name:'Village'
    },
    {
      value:'Party Name',
      name:'Party Name',

    },
    {
      value:'Loan ID',
      name:'Loan ID'
    }
  ]
  searchfilter= new MatTableDataSource()
  firstGroup:any=[]
  secondGroup:any=[]
  bName1=''
  notvalidate:boolean=false;
  date_msg:any;
  private baseUrl: string = 'http://sms.digilexa.in/http-api.php';
  // private HbaseUrl: string = 'https://bulksms.sssplsales.in/api/api_http.php';

  private username: string = 'HowrahARD';
  private password: string = 'rt6@HCARDB';
  private senderid: string = 'HCARDB';
  private route: string = '7';
  private adt_to_dt: string;
  urls: string[] = [];
  responses: any[] = [];
  checkedAllSMSFlag:boolean=false;
  diff:any;
  constructor(private datePipe:DatePipe,private comSer:CommonServiceService, private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer, private comser:CommonServiceService,
    private router: Router,private http: HttpClient) { }
  ngOnInit(): void {
    if(this.sys.ardbCD=='23'){
        this.baseUrl='http://sms.digilexa.in/http-api.php';
        this.username='HowrahARD';
        this.password='rt6@HCARDB';
        this.senderid='HCARDB';
        this.route='7';
    }
    else if(this.sys.ardbCD=='26'){
        this.baseUrl='https://bulksms.sssplsales.in/api/api_http.php';
        this.username='BCARDB';
        this.password='BC527ARDB';
        this.senderid='BCARDB';
        this.route='7';
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      fundType:[null,Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  // getDay(){
    
  //   var date1=new Date(this.datePipe.transform(this.reportcriteria.controls.fromDate.value, 'yyyy-MM-dd'))
  //   var date2=new Date(this.datePipe.transform(this.reportcriteria.controls.toDate.value, 'yyyy-MM-dd'))
  //   this.diff = this.dateDiffInDays(date1,date2); 
  //   console.log(this.diff)
  //   if(this.diff>0){
  //     this.notvalidate=false
     
  //   }
  //   if(this.diff<0){
  //     this.notvalidate=true
      
  //   }
  //   return this.diff
  // }
  // dateDiffInDays(a, b) {
  //   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  //   const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  //   const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  //   return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  // }
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
  showFirstGroup(){
    this.dataSource.data=this.reportData
    this.bName=''
    this.bName1=''
    this.selectedValue=''
    this.firstGroup.length=0
    switch(this.selectedValue1){
      case "Account Type": 
      
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].acc_name
     }
       
      break;
      case "Block": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].block_name
     }
      //  console.log(this.blockNames)
     
        break;
      case "Activity": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].activity_cd
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Village":
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].vill_name
     }
      // this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].loan_id
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.firstGroup=Array.from(new Set(this.firstGroup))
    this.firstGroup=this.firstGroup.sort()
  }
  searchFirstGroup(){
    
    this.isLoading=true
    // this.bName=''
    this.bName1=''
    this.selectedValue=''
    setTimeout(()=>{this.isLoading=false},500)
    switch(this.selectedValue1){
      case "Account Type": 
      
      this.filteredArray=this.reportData.filter(e=>e.acc_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
       
      break;
      case "Block": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
     break;
     case "Village":
      this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
       break;
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(this.bName.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    this.filteredArray1=this.filteredArray
    this.getTotal()
  }
  showSecondGroup(){
    this.dataSource.data=this.filteredArray1
    this.bName1=''
    this.secondGroup.length=0;
    switch(this.selectedValue){
      case "Account Type": 
      
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].acc_name
     }
       
      break;
      case "Block": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].block_name
     }
      //  console.log(this.blockNames)
     
        break;
      case "Activity": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].activity_cd
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Village":
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].vill_name
     }
      // this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].loan_id
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.secondGroup=Array.from(new Set(this.secondGroup))
    this.secondGroup=this.secondGroup.sort()
    this.getTotal()
  }
  searchSecondGroup(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    console.log(this.filteredArray1)

    switch(this.selectedValue){
      case "Account Type": 
      // 
      this.filteredArray=this.filteredArray1.filter(e=>e.acc_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      //  
      break;
      case "Block": 
      this.filteredArray=this.filteredArray1.filter(e=>e.block_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.filteredArray1.filter(e=>e.activity_cd?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
     break;
     case "Village":
      this.filteredArray=this.filteredArray1.filter(e=>e.vill_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
       break;
       case "Loan ID":
        this.filteredArray=this.filteredArray1.filter(e=>e.loan_id?.toLowerCase().includes(this.bName1.toLowerCase())==true)
         break;

    }
    ;
    console.log(this.filteredArray1)
    this.dataSource.data=this.filteredArray
    this.getTotal()
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }
  generateUrl(loan: any): string {
    let ls_name = loan.party_name;
    const ls_acc_num1 = loan.loan_id;
    const ls_phone = loan.phone;
    // const ls_phone = 9083537178;
    const ld_prn_demand = loan.curr_prn + loan.ovd_prn;
    const ld_intt_demand = loan.curr_intt + loan.ovd_intt + loan.penal_intt;
    const ld_tot_demand = ld_prn_demand + ld_intt_demand;
    var url='';
    if (ls_name.length > 30) {
      ls_name = ls_name.substring(0, 30);
    }
    this.adt_to_dt = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    
    console.log(this.toDate.toString());
    console.log(this.adt_to_dt);
    
    const message = `NAME ${ls_name} LOAN_ID ${ls_acc_num1} REPAY YOUR DEMAND UPTO ${this.adt_to_dt} `
      + `PRINCIPAL ${ld_prn_demand.toFixed(2)} INTEREST ${ld_intt_demand.toFixed(2)} TOTAL ${ld_tot_demand.toFixed(2)}. -${this.senderid}`;
      
    const message2 = `Dear Member, Demand for your Loan A/c ${ls_acc_num1} is Rs. ${ld_tot_demand.toFixed(2)} as on ${this.adt_to_dt}. Please pay on time to avoid the penalty. -Burdwan CARD Bank&route=Informative&type=text`;
    if(this.sys.ardbCD=='26'){
      url = `${this.baseUrl}?username=${this.username}&password=${this.password}&senderid=${this.senderid}&to=${encodeURIComponent(ls_phone)}&text=${message2}`;
    }
    else if(this.sys.ardbCD=='21'){
      url=`http://sms.synergicapi.in/api.php?username=RAMPURHATARDB&apikey=SHgopMrPOYcL&senderid=RCARDB&route=OTP&mobile=${encodeURIComponent(ls_phone)}&text=
     Dear Member, Demand for your Loan A/c ${ls_acc_num1} is Rs. ${ld_tot_demand.toFixed(2)} as on ${this.adt_to_dt}. Please pay on time to avoid the penalty. -Rampurhat ARDB Ltd.`
      }
    // ${this.username}
    else{
      url = `${this.baseUrl}?username=${this.username}&password=${this.password}&senderid=${this.senderid}&route=${this.route}&number=${encodeURIComponent(ls_phone)}&message=${encodeURIComponent(message)}`;
    }
      //const url = `${this.baseUrl}?username=${this.username}&password=${this.password}&senderid=${this.senderid}&route=${this.route}&number=${encodeURIComponent(ls_phone)}&message=${encodeURIComponent(message)}`;
     // const url2 = `${this.baseUrl}?username=${this.username}&password=${this.password}&senderid=${this.senderid}&to=${encodeURIComponent(ls_phone)}&message=${encodeURIComponent(message2)}`;
    // ls_arg := 'http://bulksms.sssplsales.in/api/api_http.php?username=BCARDB'||'&'||'password=BC527ARDB'||'&'||'senderid=BCARDB'||'&'||'to='||ls_phone||'&'||'text='|| 'Your%20'||ls_acc_type||'Account Number:'||ls_acc_num1||'%20is%20'||LS_DESCRIPTION||'%20by%20Rs.'||ld_amt||'.Balance%20is%20Rs.'||ld_clr_bal||'.'||'&'||'route=Informative'||'&'||'type=text';	
    //https://bulksms.sssplsales.in/api/api_http.php?username=BCARDB&password=BC527ARDB&senderid=BCARDB&to=9831007506
    //&text=Dear%20Member,%20Demand%20for%20your%20Loan%20A/c%2012345%20is%20Rs.%20101%20as%20on%2001/08/2024.%20Please%20pay%20on%20time%20to%20avoid%20the%20penalty.%20-Burdwan%20CARD%20Bank&route=Informative&type=text
    // ${encodeURIComponent(ls_phone)}
    console.log(encodeURIComponent(ls_phone));
    
    return url;
  }
  convertToPercentage(value: any): number {
    const numericValue = parseFloat(value); // Convert string to a number
    const maxValue = 100; // Assuming the value should be within the range of 0 to 100
    const percentage = (numericValue / maxValue) * 100;

    // Ensure the percentage is capped between 0 and 100
    return Math.min(Math.max(percentage, 0), 100);
  }
  generateAndSendUrls() {
    this.smsCount=0;
    this.isLoading=true;
    this.dataSource.data.forEach((e:any)=>{
      if(e.fund_type=="Y") {
        this.smsCount+=1;
        const smsURL = this.generateUrl(e);
        this.sendAllSms(smsURL);
        
        setTimeout(() => {
          this.isLoading = false;

        }, 3000);
      }
     })
    // this.urls = this.smsArray.map(loan => this.generateUrl(loan));
    // const requests = this.urls.map(url => this.sendAllSms(url));

    
  }
  sendAllSms(url: string)  {  
    this.http.get(url).subscribe(
      (response) => {
        console.log('SMS sent successfully:', response);
        this.HandleMessage(true, MessageType.Sucess,
          this.smsCount+'Demand SMS Send Successfully...');
      },
      (error) => {
        console.error('Error sending SMS:', error);
        this.HandleMessage(true, MessageType.Sucess,
          this.smsCount+'Demand SMS Send Successfully...');
      }
    );
    console.log(url);
    // return;
  }
  setUnique( row, event) {
    row.fund_type = event.target.checked ? 'Y' : 'N';
    
     }
     checkIfExists(array: any[], key: string, value: any): boolean {
      return array.some(item => item[key] == value);
    }
     sendSMS(){
      // if(this.checkIfExists(this.dataSource.data,"fund_type","Y")){
        this.generateAndSendUrls()
      // }else{
      //   this.HandleMessage(true, MessageType.Error,
      //     'Please ckecked at least one SEND SMS CheckBox');
      //  }
     
     }
     selectAll(){
      this.checkedAllSMSFlag=!this.checkedAllSMSFlag;
      this.dataSource.data.forEach((e:any)=>{
        if(e.phone && e.phone!='0000000000'){
          if(this.checkedAllSMSFlag){
            e.fund_type="Y"          
          }
          else{
            e.fund_type="N"          
          }
        }
       })
     }

  public SubmitReport() {
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if(this.comSer.diff<0){
      this.date_msg=this.comSer.date_msg;
      this.notvalidate=true;
      
    }
    else {
      
      this.totOutstanding=0
      this.ovdInttSum=0
          this.currInttSum=0
          this.currPrnSum=0
          this.ovdPrnSum=0
          this.penalInttSum=0
          this.totalSum=0
          this.dummytotOutstanding=0
          this.dummyovdInttSum=0
              this.dummycurrInttSum=0
              this.dummycurrPrnSum=0
              this.dummyovdPrnSum=0
              this.dummypenalInttSum=0
              this.dummytotalSum=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      // this.isLoading=true;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        "fund_type":this.reportcriteria.controls.fundType.value
      }
      this.isLoading=true
      this.showAlert = false;
      
      this.svc.addUpdDel('Loan/GetDemandListUpdated',dt).subscribe(data=>{console.log(data)
        // this.svc.addUpdDel('Loan/GetDemandListMemberwise',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        for(let i=0;i<this.reportData.length;i++){
          this.reportData[i].fund_type ='N'
          if(this.reportData[i].disb_dt.substr(0,10)=='01/01/0001'){
            this.reportData[i].disb_dt='';
          }
          else{
            this.reportData[i].disb_dt=this.comser.getFormatedDate(this.reportData[i].disb_dt);
          }
        }
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        this.dataSource.data=this.reportData
        // for(let i=0;i<50;i++)
        // this.dataSource.data.push(this.reportData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        // if(this.reportData.length<50){
        //   this.pagedItems=this.reportData
        // }
        // this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        // this.modalRef.hide();
        this.reportData.forEach(e => {
          this.totOutstanding+=e.outstanding_prn
          this.ovdInttSum+=e.ovd_intt
          this.currInttSum+=e.curr_intt
          this.currPrnSum+=e.curr_prn
          this.ovdPrnSum+=e.ovd_prn
          this.penalInttSum+=e.penal_intt
          this.totalSum+=e.ovd_intt+e.curr_intt+e.curr_prn+e.ovd_prn+e.penal_intt
          this.dummytotOutstanding+=e.outstanding_prn
          this.dummyovdInttSum+=e.ovd_intt
          this.dummycurrInttSum+=e.curr_intt
          this.dummycurrPrnSum+=e.curr_prn
          this.dummyovdPrnSum+=e.ovd_prn
          this.dummypenalInttSum+=e.penal_intt
          this.dummytotalSum+=e.ovd_intt+e.curr_intt+e.curr_prn+e.ovd_prn+e.penal_intt
        });
        // this.reportData.forEach(e=>{
        //   this.lastLoanID=e.loan_id
        // })
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
      )
    
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
  applyFilter0(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchfilter.data=this.dataSource.filteredData
    console.log(this.dataSource)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  // applyFilter1(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.searchfilter.filter = filterValue.trim().toLowerCase();
  //   this.dataSource.data=this.searchfilter.filteredData
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   this.getTotal()
  // }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.bName=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    console.log(filterValue)
    console.log(
      this.filteredArray.filter(e=>e.acc_name)

    )
    switch(this.selectedValue1){
      case "Account Type": 
      
      this.filteredArray=this.reportData.filter(e=>e.acc_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       
      break;
      case "Block": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Village":
      this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    this.getTotal()
    // this.filteredArray.forEach(e=>
    //   {
    //    if(e.block_name.includes(filterValue))
    // this.dataSource.data=this.filteredArray
    // console.log(this.dataSource.data)

      
    //   })
  }
  applyFilter1(event:Event){
    const filterValue1=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    this.filteredArray1=this.dataSource.filteredData
    console.log(this.filteredArray)
    switch(this.selectedValue){
      case "Account Type": 
      this.filteredArray=this.filteredArray1.filter(e=>e.acc_name?.toLowerCase().includes(filterValue1.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.filteredArray1.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue1.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(filterValue1.toLowerCase())==true)
     break;
     case "Village":
      this.filteredArray=this.filteredArray1.filter(e=>e.vill_name?.toLowerCase().includes(filterValue1.toLowerCase())==true)
       break;
       case "Loan ID":
        this.filteredArray=this.filteredArray1.filter(e=>e.loan_id?.toLowerCase().includes(filterValue1.toLowerCase())==true)
         break;
      
    }
    this.dataSource.data=this.filteredArray
    this.getTotal()

  }
  getTotal(){
    this.totOutstanding=0
    this.ovdInttSum=0
    this.currInttSum=0
    this.currPrnSum=0
    this.ovdPrnSum=0
    this.penalInttSum=0
    this.totalSum=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.totOutstanding+=this.filteredArray[i].outstanding_prn
      this.ovdInttSum+=this.filteredArray[i].ovd_intt
      this.currInttSum+=this.filteredArray[i].curr_intt
      this.currPrnSum+=this.filteredArray[i].curr_prn
      this.ovdPrnSum+=this.filteredArray[i].ovd_prn
      this.penalInttSum+=this.filteredArray[i].penal_intt
      this.totalSum+=this.filteredArray[i].ovd_intt+this.filteredArray[i].curr_intt+this.filteredArray[i].curr_prn+this.filteredArray[i].ovd_prn+this.filteredArray[i].penal_intt
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'DemandListMember').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  resetList(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    this.dataSource.data=this.reportData;
    // this.SubmitReport()
    // this.inputEl=document.getElementById('myInput2');
    // this.inputEl.value=''
    this.inputEl=document.getElementById('myInput');
    this.inputEl.value=''
    this.totOutstanding=this.dummytotOutstanding
    this.ovdInttSum=this.dummyovdInttSum
    this.currInttSum=this.dummycurrInttSum
    this.currPrnSum=this.dummycurrPrnSum
    this.ovdPrnSum=this.dummyovdPrnSum
    this.penalInttSum=this.dummypenalInttSum
    this.totalSum=this.dummytotalSum
    this.selectedValue=''
    this.bName=''
    this.selectedValue1=''
    this.bName1=''
    
    
  }
}
