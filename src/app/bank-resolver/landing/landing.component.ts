import { InAppMessageService } from './../../_service/in-app-message.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { mm_dashboard } from '../Models/mm_dashboard';
import { p_gen_param } from '../Models/p_gen_param';
import { mm_customer, SystemValues } from '../Models';
import { RestService } from 'src/app/_service';
import {trigger, style, animate, transition} from '@angular/animations';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(1000, style({opacity: 1}))
      ]) 
    ])
  ]
  
})
export class LandingComponent implements OnInit {

  constructor( private cms:CommonServiceService,private router: Router, private modalService:BsModalService,private msg: InAppMessageService,private svc: RestService, private comsv:CommonServiceService) { 
    this.randomNumberColor = this.getRandomColor();
  }
  backgroundColor: string = 'rgb(250, 250, 250)'; 
  sys = new SystemValues();
  dashboardItem = new mm_dashboard();
  isLoading = false;
  modalRef?:BsModalRef;
  currUser:any;
  ardbName:any;
  brnName:any;
  marqueeText:any;
  randomNumberColor: string;
  private intervalId: any;
  L2L:any=localStorage.getItem('L2L')
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  ngOnInit(): void {
    // setInterval(() => {
    //   this.backgroundColor = this.getRandomLightColor();
    // }, 2000);
    this.ardbName=localStorage.getItem('ardb_name');
    this.brnName=localStorage.getItem('__brnName');
    this.marqueeText = `${this.ardbName}`;
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    // when ever landing is loaded screen title should be hidden
    this.msg.sendhideTitleOnHeader(true);
    // this.getDashboardItem();
    this.cms.getLocalStorageDataAsJsonArray();
    // if(this.L2L=='true'){
    //   this.openModal(this.template)
    // }
    // this.getCustomerList()
    this.intervalId = setInterval(() => {
      this.randomNumberColor = this.getRandomColor();
    }, 400); // 1000 milliseconds = 1 second
}
    openModal(template: TemplateRef<any>) {
      this.currUser=localStorage.getItem('__userId');
      this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
    }
    closeL2L(){
    localStorage.removeItem('L2L');
    this.modalRef?.hide()
    }
    getRandomLightColor(): string {
      const r = Math.floor(Math.random() * 56) + 200; // Ranges between 200-255
      const g = Math.floor(Math.random() * 56) + 200; // Ranges between 200-255
      const b = Math.floor(Math.random() * 56) + 200; // Ranges between 200-255
      return `rgb(${r}, ${g}, ${b})`;
    }
    getRandomColor(): string {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  getDashboardItem() {
    const param = new p_gen_param();
    param.brn_cd = this.sys.BranchCode;
    param.ardb_cd=localStorage.getItem('__ardb_cd')
    //console.log(param)
    this.svc.addUpdDel<any>('Common/GetDashBoardInfo', param).subscribe(
        res => {
          this.dashboardItem = res;
        },
        err => {
        }
      );
    }
       getCustomerList() {

    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.sys.BranchCode;

    if (this.comsv.customerList === undefined || this.comsv.customerList === null || this.comsv.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          //console.log(res)
          this.isLoading = false;
          this.comsv.customerList = res;
        },
        err => {
          this.isLoading = false;

        }
      );
    }
    else { this.isLoading = false; }
  }
  accClose(){
    this.comsv.accOpen=false
    this.comsv.accClose=true
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/DR_OpenCloseReg']);

  }
  accOpen(){
    this.comsv.accOpen=true
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/DR_OpenCloseReg']);

  }
  loanDis(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=true
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/LR_DisNorm']);

  }
  loanRec(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=true
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/LR_RecRegNorm']);

  }
  gov_rep(){
    this.router.navigate([this.sys.BankName + '/GOV_REP']);
  }
  openDayBook(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=true
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/FR_DayBook']);

  }
  openGlTrns(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=true
    this.router.navigate([this.sys.BankName + '/FR_GLTD']);

  }
 
  applyRandomColors(): void {
    const marqueeTextElement = document.getElementById('marqueeText');

    if (marqueeTextElement) {
      const text = this.marqueeText;
      marqueeTextElement.innerHTML = ''; // Clear existing content

      // Split text into individual letters and wrap them in spans
      text.split('').forEach((letter) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.classList.add('colorful'); // Add class for color change
        marqueeTextElement.appendChild(span);
      });
    }
  } 
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  }

