import { ConfigurationService } from './../_service/configuration.service';
import { BankConfiguration } from './Models/bankConfiguration';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService, InAppMessageService, RestService } from '../_service';
import { Title } from '@angular/platform-browser';
import { LOGIN_MASTER, SystemValues } from './Models';
import { IdleService } from '../_service/idle.service';
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
              private titleService: Title,private idleService: IdleService,private authService: AuthenticationService) {
                // window.addEventListener('keypress', () => this.resetTimer());
                // window.addEventListener('mousemove', () => this.resetTimer());

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
    this.idleService.onIdle().subscribe(() => {
      if (this.authService.isLoggedIn()) {
        // this.authService.logout();
        if (this.router.url.includes('/login')) {
        alert("You have Idle more than 5 Min...")
        }
        else{this.logoutUser() ;}
        // Perform additional actions like showing a modal or redirecting to the login page.
      }
    });
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
  
  // resetTimer() {
    
  //   if (!this.router.url.includes('/login')) {
  //     this.restartIdleLogoutTimer();
  //   }
  // }
  // restartIdleLogoutTimer() {
  //   clearTimeout(this.idleLogoutTimer);
  //   this.idleLogoutTimer = setTimeout(() => {
  //     this.logoutUser();
  //   }, 60*1000);
  // }

  logoutUser() {
    debugger;
    this.authService.isAuthenticated = false;
    debugger
    

      this.updateUsrStatus();
      
    
  }
  private updateUsrStatus(): void {
    
    const usr = new LOGIN_MASTER();
    usr.ardb_cd=localStorage.getItem('__ardb_cd');
    usr.brn_cd = localStorage.getItem('__brnCd');
    usr.user_id = localStorage.getItem('__userId');
    usr.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
      res => {debugger 
        localStorage.clear();
        this.msg.sendisLoggedInShowHeader(true);
        const bankName = localStorage.getItem('__bName');
        this.router.navigate([bankName + '/login']);
      },
      err => { }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
