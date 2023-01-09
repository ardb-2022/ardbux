import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { MessageType, m_acc_master, ShowMessage, SystemValues } from '../../Models';

@Component({
  selector: 'app-yearopen',
  templateUrl: './yearopen.component.html',
  styleUrls: ['./yearopen.component.css']
})
export class YearopenComponent implements OnInit {

  constructor(private router: Router,private formBuilder: FormBuilder,private modalService: BsModalService,private svc: RestService) { }
  isLoading = false;
  alertMsg = '';
  closingdate: Date;
  openingdata: FormGroup;
  showMsg: ShowMessage;
  isOpenFromDp = false;
  sys = new SystemValues();
  selectedPlList: m_acc_master[]=[];  
  plcd=''
  pldesc=''
  ngOnInit(): void {
    this.closingdate=this.sys.CurrentDate;
    this.openingdata = this.formBuilder.group({
      fromyear: [null, Validators.required],
      toyear: [null, Validators.required],
      enddate: [null, Validators.required],
      plcd: [null, null],
      pldesc:[null,null]
    });
    this.openingdata.patchValue({
      fromyear: this.getfinyear(this.sys.CurrentDate),
      toyear :  (+this.getfinyear(this.sys.CurrentDate) + 1).toString(),
      enddate :  this.convertDate('31/03/'+this.getfinyear(this.sys.CurrentDate))
    })

  }

  backScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
setPL(cd:any)
{

}
SaveData()
{

}
private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}
private getfinyear(adtdate:Date) : string
{
   let currDate=adtdate; 
   if (currDate.getMonth()>3)
   return currDate.getFullYear().toString();
   else
   return (currDate.getFullYear()+1).toString();
}


private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}


}
