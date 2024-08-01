import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { MessageType, mm_customer, mm_vill, ShowMessage, SystemValues } from '../../Models';
import { mm_shg } from '../../Models/mm_shg';
import { mm_shg_member } from '../../Models/mm_shg_member';
import { p_gen_param } from '../../Models/p_gen_param';
import { ShgDM } from '../../Models/ShgDM';

@Component({
  selector: 'app-utself-help',
  templateUrl: './utself-help.component.html',
  styleUrls: ['./utself-help.component.css']
})
export class UTSelfHelpComponent implements OnInit {

  constructor(private svc: RestService, private frmBldr: FormBuilder, private modalService: BsModalService,
              private router: Router) { }
  get f() { return this.shgFrm.controls; }
  shgFrm: FormGroup;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isLoading = false;
  showMsg: ShowMessage;
  mmshg = new mm_shg();
  mmshgmember: mm_shg_member[] = [];
  villageList: mm_vill[] = [];
  shgRet = new ShgDM();
  isRetrieve = true;
  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  suggestedCustomer1: mm_customer[];
  indxsuggestedCustomer1=0;
  tempcustname ='';
  ngOnInit(): void {
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.getVillageMaster();
    this.shgFrm = this.frmBldr.group({
     shg_id : [],
     brn_cd : [],
     cust_name : [],
     chairman_name : [],
     secretary_name : [],
     village : [],
     gruop_sex : [],
      monthly_subcription : [],
      min_member_limit : [],
      male_member : [],
      female_member : [],
      caste_sc : [],
      caste_st : [],
      caste_gen : [],
      caste_muslim : [],
     form_dt : [],
     sb_accno : []
    });
    this.shgFrm.controls.shg_id.disable();
  }

  public suggestCustomer(): void {
    if (this.f.cust_name.value.length > 2) {
      const prm = new p_gen_param();
      prm.ardb_cd=this.sys.ardbCD
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.f.cust_name.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          debugger;
          res=res.filter(x=>x.catg_cd===11);
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 20);
          } else {
            this.suggestedCustomer = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  public suggestCustomer1(i:number): void {
    if (this.mmshgmember[i].shg_member_name.length > 2) {
      const prm = new p_gen_param();
      prm.ardb_cd=this.sys.ardbCD
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.mmshgmember[i].shg_member_name.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer1 = res.slice(0, 20);
            this.indxsuggestedCustomer1=i;
          } else {
            this.suggestedCustomer1 = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer1 = null;
    }
  }
  
  populateCustDtls(temp_mm_cust: mm_customer,section :number,indx:number) {
    if (section==1)
    {
    this.f.shg_id.setValue(temp_mm_cust.cust_cd);  
    this.f.cust_name.setValue(temp_mm_cust.cust_name);
    this.f.village.setValue(temp_mm_cust.vill_cd);
    this.f.gruop_sex.setValue(temp_mm_cust.sex);
    this.tempcustname=temp_mm_cust.cust_name;
    }
    else
    {
      this.mmshgmember[indx].brn_cd=this.sys.BranchCode;
      this.mmshgmember[indx].shg_member_sex=temp_mm_cust.sex;
      this.mmshgmember[indx].shg_member_caste=temp_mm_cust.caste==1?"GENERAL":temp_mm_cust.caste==2?"SC":temp_mm_cust.caste==3?"ST":temp_mm_cust.caste==4?"OBC":"OTHER";
      this.mmshgmember[indx].pan=temp_mm_cust.pan;
      this.mmshgmember[indx].age=temp_mm_cust.age;
      this.mmshgmember[indx].shg_member_name=temp_mm_cust.cust_name;
      this.mmshgmember[indx].guardian_name=temp_mm_cust.guardian_name;
      this.mmshgmember[indx].mobile=+temp_mm_cust.phone;
      this.mmshgmember[indx].date_of_birth=temp_mm_cust.dt_of_birth;
      this.mmshgmember[indx].shg_member_id=temp_mm_cust.cust_cd;
    }
  }
  setCustDtls(cust_cd: number,section :number,indx:number) {
    let temp_mm_cust = new mm_customer();
    if (this.suggestedCustomer != undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
      temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.suggestedCustomer = null;
      this.populateCustDtls(temp_mm_cust,section,indx);
      this.getShgData();
    }
    else {
      debugger;
      this.isLoading = true;
      temp_mm_cust.cust_cd = cust_cd;
      temp_mm_cust.ardb_cd=this.sys.ardbCD
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
        res => {
          debugger;
          this.suggestedCustomer = res;
          if (this.suggestedCustomer != undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
            temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
            this.suggestedCustomer = null;
            this.populateCustDtls(temp_mm_cust,section,indx);
            this.getShgData();
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }    
  }
  setCustDtls1(cust_cd: number,section :number,indx:number) {
    let temp_mm_cust = new mm_customer();
    if (this.suggestedCustomer1 != undefined && this.suggestedCustomer1 != null && this.suggestedCustomer1.length > 0) {
      temp_mm_cust = this.suggestedCustomer1.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.suggestedCustomer1 = null;
      this.populateCustDtls(temp_mm_cust,section,indx);
    } 
    else {
      debugger;
      this.isLoading = true;
      temp_mm_cust.cust_cd = cust_cd;
      temp_mm_cust.ardb_cd=this.sys.ardbCD
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
        res => {
          debugger;
          this.suggestedCustomer1 = res;
          if (this.suggestedCustomer1 != undefined && this.suggestedCustomer1 != null && this.suggestedCustomer1.length > 0) {
            temp_mm_cust = this.suggestedCustomer1.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
            this.suggestedCustomer1 = null;
            this.populateCustDtls(temp_mm_cust,section,indx);
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }    
  }
  // addshgMemberFromGroup(): FormGroup
  // return this.formBuilder.group({
  //  shg_id : [null, null],
  //  shg_member_id : [null, null],
  //  shg_member_name : [null, null],
  //  guardian_name : [null, null],
  //  shg_member_sex : [null, null],
  //  shg_member_caste : [null, null],
  //  religion : [null, null],
  //  date_of_join : [null, null],
  //  education : [null, null],
  //  brn_cd : [null, null],
  //  status : [null, null],
  //  date_of_birth : [null, null],
  //  age : [null, null],
  //  widow : [null, null],
  //  toilet_flag : [null, null],
  //  mobile : [null, null],
  //  adhar_no : [null, null],
  //  pan : [null, null],
  //  disability_remarks : [null, null],
  //  training_remarks : [null, null]
  //   });
 
 
  addShgMember()
  {
    const alreadyHasEmptyDenominationItem = false;
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_mmshgmember = new mm_shg_member();
    temp_mmshgmember.brn_cd = localStorage.getItem('__brnCd');
    temp_mmshgmember.shg_id = 0;
    this.mmshgmember.push(temp_mmshgmember);
  }
  removeShgMember()
  {
    if (this.mmshgmember.length >= 1) {
      if(this.mmshgmember[this.mmshgmember.length-1].shg_member_id>0)
      {
      if (!(confirm('Are you sure you want to Delete The Transaction '))) {
        return;
      }
      }
      this.mmshgmember.pop();
    }
  }
  // retrieveData(){
  //  // this.isRetrieve = false;
  //   //this.shgFrm.reset();
  //   // this.shgFrm.controls.shg_id.disable();
  //   //this.shgFrm.disable();
  //   //this.mmshgmember= null;
  //   debugger;
  //   if (this.f.shg_id.value ===0 || this.f.shg_id.value === 'undefined' ||this.f.shg_id.value ===null) {
  //     this.HandleMessage(true, MessageType.Error, 'Please select SHG Customer name first !!!');
  //     return;
  //   }
  //  // this.getShgData();
  //  // this.shgFrm.controls.shg_id.enable();
  //   debugger;
  // }
  clearData(){
    debugger;
    this.shgFrm.reset();
    this.shgFrm.enable();
    this.shgFrm.controls.shg_id.disable();
    this.mmshgmember= [];
    // const temp_mmshgmember = new mm_shg_member();
    // temp_mmshgmember.brn_cd = localStorage.getItem('__brnCd');
    // temp_mmshgmember.shg_id = 0;
    // this.mmshgmember.push(temp_mmshgmember);
    //this.isRetrieve = true;
  }
  saveData(){
    debugger;
    if (this.f.chairman_name.value == null || this.f.chairman_name.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Chairman Name not be Blank');
      return;
    }
    else if (this.f.secretary_name.value == null || this.f.secretary_name.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Secretary Name Can not be Blank');
      return;
    }
    else if (this.f.village.value == null || this.f.village.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Village Name Can not be Blank');
      return;
    }
    else if (this.f.gruop_sex.value == null || this.f.gruop_sex.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Gender Group Can not be Blank');
      return;
    }
    else if (this.f.monthly_subcription.value == null || this.f.monthly_subcription.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Monthly Subcription Can not be 0');
      return;
    }
    else if (this.f.min_member_limit.value == null || this.f.min_member_limit.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Minimum Member limit Can not be 0');
      return;
    }
    else if ((+this.f.min_member_limit.value) < ((+this.f.male_member.value)+ (+this.f.female_member.value))) {
      this.HandleMessage(true, MessageType.Error, 'Minimum member limit can not be less');
      return;
    }
    else if (this.f.sb_accno.value == null || this.f.sb_accno.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Savings A/C Can not be Blank');
      return;
    }
    else if (this.f.form_dt.value == null || this.f.form_dt.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Date of Foundation Can not be Blank');
      return;
    }
    
    else if (this.mmshgmember.length<1)
    {
      this.HandleMessage(true, MessageType.Error, 'SHG Member can not be Blank');
      return;
    }
    else
    {
      const _shgDM = new ShgDM();
    const _mmshg = new mm_shg();
    _mmshg.shg_id=+this.f.shg_id.value;
    _mmshg.ardb_cd=this.sys.ardbCD
    _shgDM.mmshg=_mmshg;
    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/GetShgData', _shgDM).subscribe(
      res => {
        debugger;
        if (res.mmshg.shg_id===0)
        {
          this.insertSaveData(1);
        }
        else
        {
          this.insertSaveData(2);
        }        
      },
      err => { debugger; this.isLoading=false;        
      }
    );
    }
  }
  deleteData(){
    if (this.f.chairman_name.value == null || this.f.chairman_name.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Please Retrieve a group first !!!');
      return;
    }
    if (this.f.shg_id.value>0)
    {
    if (this.mmshgmember.length >= 1) {
      if(this.mmshgmember[this.mmshgmember.length-1].shg_member_id>0)
      {
      if (!(confirm('Are you sure you want to Delete Entire Group !!! '))) {
        return;
      }
      }
      }
    const _shgDM = new ShgDM();
    var _mmshg = new mm_shg();
    _mmshg.shg_id              =this.f.shg_id.value;              
    _mmshg.brn_cd              =this.sys.BranchCode; 
    _mmshg.ardb_cd=this.sys.ardbCD
    _shgDM.mmshg=_mmshg;
    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/DeleteShgData', _shgDM).subscribe(
      res => {
        debugger;
        this.clearData();
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'Transaction Deleted Successfully!!!');
      },
      err => { debugger; this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');}
    );
      }
      else{
          this.HandleMessage(true, MessageType.Error, 'Please Retrieve a group first !!!');
          return;
        }     
  }
  backScreen(){this.router.navigate([this.sys.BankName + '/la']); }
  private getVillageMaster(): void { 
    debugger;
    var dt={"ardb_cd":this.sys.ardbCD}
    this.svc.addUpdDel<any>('Mst/GetVillageMaster', dt).subscribe(
      res => {
        debugger;
        this.villageList = res;
      },
      err => { debugger; }
    );
  }
  public getShgData(): void { 
    debugger;
    const _shgDM = new ShgDM();
    const _mmshg = new mm_shg();
    _mmshg.shg_id=+this.f.shg_id.value;
    _mmshg.ardb_cd=this.sys.ardbCD
    _shgDM.mmshg=_mmshg;
    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/GetShgData', _shgDM).subscribe(
      res => {
        debugger;
        if (res.mmshg.shg_id===0)
        {
          this.isLoading=false;
          this.shgFrm.enable();
          this.shgFrm.controls.shg_id.disable();
          this.HandleMessage(true, MessageType.Warning, 'No SHG created with this customer!!!');
          return;
        }
        this.shgRet = res;
        this.shgFrm.patchValue({
          shg_id : this.shgRet.mmshg.shg_id,
          brn_cd : this.shgRet.mmshg.brn_cd,
          cust_name : this.tempcustname,
          chairman_name : this.shgRet.mmshg.chairman_name,
          secretary_name : this.shgRet.mmshg.secretary_name,
          village : this.shgRet.mmshg.village,
          gruop_sex : this.shgRet.mmshg.gruop_sex,
           monthly_subcription : this.shgRet.mmshg.monthly_subcription,
           min_member_limit : this.shgRet.mmshg.min_member_limit,
           male_member : this.shgRet.mmshg.male_member,
           female_member :this.shgRet.mmshg.female_member,
           caste_sc :this.shgRet.mmshg.caste_sc,
           caste_st : this.shgRet.mmshg.caste_st,
           caste_gen : this.shgRet.mmshg.caste_gen,
           caste_muslim : this.shgRet.mmshg.caste_muslim,
          form_dt :this.shgRet.mmshg.form_dt,
          sb_accno : this.shgRet.mmshg.sb_accno
        });
        this.mmshgmember=this.shgRet.mmshgmember;
        this.shgFrm.enable();
        //this.shgFrm.controls.shg_id.disable();
        this.isLoading=false;
      },
      err => { debugger; this.isLoading=false;
        this.shgFrm.disable();
        this.shgFrm.controls.shg_id.enable();
      }
    );
  }
  public getShgDataAfterSave(shgid:any): void { 
    debugger;
    const _shgDM = new ShgDM();
    const _mmshg = new mm_shg();
    _mmshg.shg_id=+shgid;
    _mmshg.ardb_cd=this.sys.ardbCD
    _shgDM.mmshg=_mmshg;

    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/GetShgData', _shgDM).subscribe(
      res => {
        debugger;
        this.shgRet = res;
        this.shgFrm.patchValue({
          shg_id : this.shgRet.mmshg.shg_id,
          brn_cd : this.shgRet.mmshg.brn_cd,
          cust_name : this.tempcustname,
          chairman_name : this.shgRet.mmshg.chairman_name,
          secretary_name : this.shgRet.mmshg.secretary_name,
          village : this.shgRet.mmshg.village,
          gruop_sex : this.shgRet.mmshg.gruop_sex,
           monthly_subcription : this.shgRet.mmshg.monthly_subcription,
           min_member_limit : this.shgRet.mmshg.min_member_limit,
           male_member : this.shgRet.mmshg.male_member,
           female_member :this.shgRet.mmshg.female_member,
           caste_sc :this.shgRet.mmshg.caste_sc,
           caste_st : this.shgRet.mmshg.caste_st,
           caste_gen : this.shgRet.mmshg.caste_gen,
           caste_muslim : this.shgRet.mmshg.caste_muslim,
          form_dt :this.shgRet.mmshg.form_dt,
          sb_accno : this.shgRet.mmshg.sb_accno
        });
        this.mmshgmember=this.shgRet.mmshgmember;
        this.isRetrieve = false;
        this.isLoading=false;
      },
      err => { debugger; this.isLoading=false;}
    );
  }
  public insertSaveData(mode:number)
  {
    debugger;
    const _shgDM = new ShgDM();
    var _mmshgmember = [];
    var _mmshg = new mm_shg();
    _mmshg.ardb_cd=this.sys.ardbCD
    _mmshg.shg_id              =this.f.shg_id.value;              
    _mmshg.brn_cd              =this.sys.BranchCode;              
    _mmshg.chairman_name       =this.f.chairman_name.value;       
    _mmshg.secretary_name      =this.f.secretary_name.value;      
    _mmshg.village             =this.f.village.value;             
    _mmshg.gruop_sex           =this.f.gruop_sex.value;           
    _mmshg.monthly_subcription =this.f.monthly_subcription.value; 
    _mmshg.min_member_limit    =this.f.min_member_limit.value;    
    _mmshg.male_member         =this.f.male_member.value==null?0:+this.f.male_member.value;         
    _mmshg.female_member       =this.f.female_member.value==null?0:+this.f.female_member.value;       
    _mmshg.caste_sc            =this.f.caste_sc.value==null?0:+this.f.caste_sc.value;            
    _mmshg.caste_st            =this.f.caste_st.value==null?0:+this.f.caste_st.value;            
    _mmshg.caste_gen           =this.f.caste_gen.value==null?0:+this.f.caste_gen.value;           
    _mmshg.caste_muslim        =this.f.caste_muslim.value==null?0:+this.f.caste_muslim.value;        
    _mmshg.form_dt             =this.f.form_dt.value;             
    _mmshg.sb_accno            =this.f.sb_accno.value;
    this.mmshgmember.forEach(x=>x.brn_cd=this.sys.BranchCode );
    _mmshgmember =this.mmshgmember;            
    _shgDM.mmshg=_mmshg;
    _shgDM.mmshgmember=_mmshgmember;
    this.isLoading=true;
    if (mode===2)
    {
    this.svc.addUpdDel<any>('UCIC/UpdateShgData', _shgDM).subscribe(
      res => {
        debugger;
        this.shgFrm.patchValue({
          shg_id : this.f.shg_id.value         
        });
        const shgidtmp=this.f.shg_id.value;
        this.clearData();
        this.getShgDataAfterSave(shgidtmp);
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'Transaction Updated Successfully!!!');
      },
      err => { debugger; this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Updated Failed!!!');}
    );
    }
    else
    {
      this.svc.addUpdDel<any>('UCIC/InsertShgData', _shgDM).subscribe(
        res => {
          debugger;
          this.shgFrm.patchValue({
            shg_id : res         
          });
          this.clearData();
          this.getShgDataAfterSave(res);
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,
            'Transaction Saved Successfully. Shg Code : '
            + res.toString());
        },
        err => { debugger; this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Insert Failed!!!');}
      );
    }
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  setShgMemberGroupSex(gender: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberSex(gender: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberCaste(caste: string)
  {
    debugger;
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberReligion(religion: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberEducation(education: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberWidow(widow: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberToilet(toilet: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setVillage(vilcd: any)
  {}

}
