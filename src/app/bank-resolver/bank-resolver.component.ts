import { ConfigurationService } from './../_service/configuration.service';
import { BankConfiguration } from './Models/bankConfiguration';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from '../_service';
import { Title } from '@angular/platform-browser';
import { LOGIN_MASTER, SystemValues } from './Models';
@Component({
  selector: 'app-bank-resolver',
  templateUrl: './bank-resolver.component.html',
  styleUrls: ['./bank-resolver.component.css']
})
export class BankResolverComponent implements OnInit,OnDestroy {
  idleLogoutTimer: any;
  passedValue: BankConfiguration;
  subscription: Subscription;
  showHeader = false;
  showTitle = true;
  sys = new SystemValues();
  constructor(private route: ActivatedRoute,
              private confSvc: ConfigurationService,
              private msg: InAppMessageService,
              private router: Router,
              private rstSvc: RestService,
              private titleService: Title) {
    // console.log(window.location)

    this.subscription = this.msg.getisLoggedInShowHeader().subscribe(
      res => {
        
        if (res === null) {
          this.route.paramMap.subscribe(param => {
            const paramValue = param.get('bankName');
            console.log(paramValue);
            if (null !== paramValue) {
              localStorage.setItem('__bName', paramValue);
              const __bName = localStorage.getItem('__bName');
              if (__bName !== null) {
                this.router.navigate([__bName]);
              }
            } else {
              
            }
            
          });
        } else {
          this.showHeader = res;
          this.showTitle = false;
          this.getBankName();
        }
      },
      err => { }
    );

  }

  ngOnInit(): void {
    this.getBankName();
  }

  private getBankName(): void {
    this.route.paramMap.subscribe(param => {
      const paramValue = param.get('bankName');
      if (null !== paramValue) {
        // todo we can chek if the bank name exists in our db or else route to
        // todo pageNotfound
        localStorage.setItem('__bName', paramValue);
        // this.confSvc.getConfigurationForName(paramValue).then(
        //   res => {
        //     if (undefined === res) {
        //       // todo need to block the user
        //     }
        //     this.passedValue = res;
        //     this.titleService.setTitle('Welcome to ' + this.passedValue.description);
        //   },
        //   err => { }
        // );
      } else {
        // TODO need to think what we will do if the bank name doesn't come
      }
    });
  }
  @HostListener('document:mousemove')
  @HostListener('document:keyup')
  @HostListener('document:click')
  @HostListener('document:wheel')
  resetTimer() {
    
    if (!this.router.url.includes('/login')) {
      // debugger
      this.restartIdleLogoutTimer();
    }
  }
  restartIdleLogoutTimer() {
    clearTimeout(this.idleLogoutTimer);
    this.idleLogoutTimer = setTimeout(() => {
      this.logoutUser();
    }, 10*60*1000);
  }

  logoutUser() {
    // debugger;

    // alert("hello")
    // console.log(JSON.stringify(this.sys));
    if (null !== this.sys.BranchCode && null !== this.sys.UserId) {

      this.updateUsrStatus();
      localStorage.removeItem('__brnName');
      localStorage.removeItem('__brnCd');
      localStorage.removeItem('__currentDate');
      localStorage.removeItem('__cashaccountCD');
      localStorage.removeItem('__ddsPeriod');
      localStorage.removeItem('__userId');
      this.msg.sendisLoggedInShowHeader(true);
      const bankName = localStorage.getItem('__bName');
      this.router.navigate([bankName + '/login']);
    }
  }
  private updateUsrStatus(): void {
    
    const usr = new LOGIN_MASTER();
    usr.ardb_cd=this.sys.ardbCD
    usr.brn_cd = this.sys.BranchCode;
    usr.user_id = this.sys.UserId;
    usr.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
      res => { },
      err => { }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
