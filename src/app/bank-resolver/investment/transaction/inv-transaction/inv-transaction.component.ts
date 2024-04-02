import { Router } from '@angular/router';
import { AccOpenDM } from '../../../Models/deposit/AccOpenDM';
import {  Component, ElementRef,  OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InAppMessageService, RestService} from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../../Models';
import { tm_denomination_trans } from '../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../../Models/deposit/mm_oprational_intr';
import { InvOpenDM } from 'src/app/bank-resolver/Models/deposit/InvOpenDM';
import { HttpClientModule } from '@angular/common/http';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';


@Component({
  selector: 'app-inv-transaction',
  templateUrl: './inv-transaction.component.html',
  styleUrls: ['./inv-transaction.component.css']
})
export class InvTransactionComponent implements OnInit {
  isLoading: boolean;
  showIns:boolean=true;
  showPTrns:boolean=true;
  accDtlsFrm: FormGroup;
  accTransFrm: FormGroup;
  tdDefTransFrm:FormGroup;
  tdDefTransFrmC:FormGroup;
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  constitutionList: mm_constitution[] = [];
  static operationalInstrList: mm_oprational_intr[] = [];
  interestPeriod=0
  sys = new SystemValues();
  AcctTypes: mm_operation[];
  bankData=[];
  branch:any=[];
  branch1:any=[];
  masterModel = new InvOpenDM();
  tm_deposit = new tm_deposit();
  // @Input() showOnClose:boolean;
  get td() { return this.tdDefTransFrm.controls; }
  // get tc() { return this.tdDefTransFrmC.controls; }
  @ViewChild('preClose', { static: true }) preClose: TemplateRef<any>;
  modalRefClose: BsModalRef;
  suggestedCustomerCr: mm_customer[];
  disabledTrfOnNull = true
  indxsuggestedCustomerCr = 0;
  selectedCust: any;
  TrfTotAmt = 0;
  diff: any;
  effInt:any;
  isMat: any;
  showtransdetails:boolean=false;
  tddefAccTypCd: any;
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  hidegl:boolean=true;
  glHead:any;
  showBalance:boolean=false;
  // public accNoEnteredForTransaction2:any=this.invComServ.accNoEnteredForTransaction2;......MARKAR
  public accNoEnteredForTransaction2:any;
  public accNoEnteredForTransaction:any;
  public accNoEnteredForTransaction3:any;
  showTransModeForR:boolean
  showMsg: ShowMessage;
  mat_val = 0;
  counter1 = 0;
  counter = 0;
  newIntt=0;
  public static operations: mm_operation[] = []
  operations: mm_operation[];
  resBrnCd: any;
  remarks: any;
  ShowHide:boolean=false;
  closeInt: any;
  showOnTDS:boolean=false;
  exeintt:any=0
  editDeleteMode:boolean=false;
  constructor(private svc: RestService, private msg: InAppMessageService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
    private modalService: BsModalService, private http:HttpClientModule) {
       
     }

  ngOnInit(): void {
  }}