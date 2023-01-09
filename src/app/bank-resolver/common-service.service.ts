import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ConfigurationService } from '../_service/configuration.service';
import { BankConfig, BankConfiguration } from '../bank-resolver/Models';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
  
  
})
export class CommonServiceService {
  static bankconfigurationList: BankConfig[] = [];
  static serverIp = '36.255.3.143';
  
  diff:any;
  date_msg="FROM-DATE should be lower than TO-DATE"
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private _snackBar: MatSnackBar,private datePipe:DatePipe,
    private http: HttpClient, private confSvc: ConfigurationService,
    private router: Router) { this.getConfiginSysn();}

  SnackBar_Error() {
    this._snackBar.open('Error!!!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      
    });
  }
  SnackBar_Nodata() {
    this._snackBar.open('No Data!!!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      
    });
  }
  SnackBar_Success() {
    this._snackBar.open('Done!!!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      
    });
  }
  getDay(from_date,to_date){
    
    var date1=new Date(this.datePipe.transform(from_date, 'yyyy-MM-dd'))
    var date2=new Date(this.datePipe.transform(to_date, 'yyyy-MM-dd'))
    this.diff = this.dateDiffInDays(date1,date2); 
    console.log(this.diff)
   
    return this.diff
  }
  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }


  async getConfiginSysn() {
    // RestService.configuration = (await this.confSvc.getAllConfiguration() as BankConfiguration[]);
    console.log(await this.confSvc.getAllConfiguration(CommonServiceService.serverIp) as BankConfig[])
    CommonServiceService.bankconfigurationList = (await this.confSvc.getAllConfiguration(CommonServiceService.serverIp) as BankConfig[]);
  }
  private getUrl(): string {
    // debugger;
   
    const __bName = localStorage.getItem('__bName');
    console.log(CommonServiceService.bankconfigurationList);
    
        console.log( CommonServiceService.bankconfigurationList.
          filter(e => e.bank_name.toLowerCase() === __bName.toLowerCase())[0]);
        
      const bank = CommonServiceService.bankconfigurationList.
        filter(e => e.bank_name.toLowerCase() ===
        __bName.toLowerCase())[0];
     return 'http://' + CommonServiceService.serverIp + '/' + __bName + '/api/';
      

  }
  private getMasterUrl(): string {
    const url = 'http://' + CommonServiceService.serverIp + '/ardbMasterConfig/api/';
    return url;
  }
  public addUpdDel<T>(ofwhat: string, data: T): Observable<T> {
    console.log(data)
    console.log(ofwhat)
    console.log(this.getUrl());
    console.log(this.getUrl() + ofwhat)
    return this.http.post<T>((this.getUrl() + ofwhat), data);
  }
  public addUpdDelMaster<T>(ofwhat: string, data: T): Observable<T> {
    return this.http.post<T>((this.getMasterUrl() + ofwhat), data);
  }

}
