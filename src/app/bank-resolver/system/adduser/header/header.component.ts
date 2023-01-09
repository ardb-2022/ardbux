import { BankConfiguration } from './../Models/bankConfiguration';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BankConfigMst, mainmenu, submenu, screenlist, SystemValues, LOGIN_MASTER, MenuConfig } from '../Models';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { lvLocale } from 'ngx-bootstrap/chronos';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  currentRoute: any;

  constructor(private rstSvc: RestService, private router: Router, private svc:RestService,
              private msg: InAppMessageService) {
                this.showScreenTitle=false
                this.selectedScreenToShow=''
                this.router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                    this.currentRoute = event.url;          
                      console.log(event);
                      this.showScreenTitle=event.url.includes('/la') ? false:true
                  
                }
                });
   
  }
  currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
  currDt= new Date().toString().substring(0,15) 
  ardbName:any;
  subscription: Subscription;
  collapsed = true;
  bankConfig: BankConfigMst;
  bankName: string;
  userType:any
  bankFullName: string;
  childMenu: mainmenu;
  subMenu: submenu;
  showMenu = false;
  showChildMenu = false;
  showSubMenu = false;
  showScreenTitle = false;
  selectedScreenToShow: string;
  sys = new SystemValues();
  show = false;
  // menuConfigs: any;
  currentMenu: MenuConfig;
  inside = false;
  menuConfigs:any=[];
  hideMenuOnComplete=false
  selectalluser:any=[];
  filterUser:any=[]
  // menuConfigs=[
  //       {
  //       menu_name: 'UCIC',
  //       level_no:1,
  //       childMenuConfigs:[
  //          {
  //           menu_name:'Transaction',
  //           show:false,
  //           level_no:2,
  //           childMenuConfigs:[
  //             {
  //              menu_name:'Customer Profile Entry',
  //              show:false,
  //              level_no:3,
  //              ref_page:'UT_CustomerProfile'
  //             },
  //             {
  //               menu_name:'Self Help Group',
  //               show:false,
  //               level_no:3,
  //               ref_page:'UT_SelfHelp'

  //              },
  //              {
  //               menu_name:'Member List',
  //               show:false,
  //               level_no:3,
  //               ref_page:'UR_MemberList'
                 
  //              },
  //              {
  //               menu_name:'Net Worth Statement',
  //               show:false,
  //               level_no:3,
  //               ref_page:'UR_Networth'

  //              }

  //          ],
  //          }
  //       ],
  //       show:false
  //       },
  //       {
  //         menu_name: 'FINANCE',
  //         level_no:1,
  //         childMenuConfigs:[
  //           {
  //            menu_name:'Transaction',
  //            show:false,
  //            level_no:2,
  //            childMenuConfigs:[
  //             {
  //              menu_name:'Voucher Entry Screen',
  //              show:false,
  //              level_no:3,
  //              ref_page:'FT_Voucher'
  //             },
  //             {
  //               menu_name:'Print Voucher',
  //               show:false,
  //               level_no:3,
  //               ref_page:'FT_PrintVoucher'

  //              },
  //              {
  //               menu_name:'Approve Voucher',
  //               show:false,
  //               level_no:3,
  //               ref_page:'FT_ApproveTrns'
                 
  //              },
  //              {
  //               menu_name:'Yearly Adjustment Voucher Entry',
  //               show:false,
  //               level_no:3,
  //               ref_page:'FT_BackdateVoucher'

  //              }

  //          ],
  //           },
  //           {
  //             menu_name:'Report',
  //             show:false,
  //             level_no:2,
  //             childMenuConfigs:[
  //               {
  //                menu_name:'Cash Cum Trial',
  //                show:false,
  //                level_no:3,
  //                ref_page:'FR_CashCumTrial'
  //               },
  //               {
  //                 menu_name:'Trial Balance',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_TrialBalance'
  
  //                },
  //                {
  //                 menu_name:'General Ledger',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_GeneralLadger'
                   
  //                },
  //                {
  //                 menu_name:'GL Transaction Details',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_GLTD'
  
  //                },
  //                {            
  //                 menu_name:'Cash Account',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_CashAccount'
                   
  //                },
  //                {
  //                 menu_name:'Day Book',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_DayBook'
  
  //                },
  //                {
  //                 menu_name:'Day Scroll Book',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_DayScrollBook'
  //                },
  //                {
  //                 menu_name:'Balance Sheet',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'FR_BalanceSheet'
  
  //                },
  //                 {
  //                  menu_name:'Profit And Loss A/C',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'FR_ProfitLoss'
                    
  //                 },
  //                 {
  //                  menu_name:'Trading Account',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'FR_Trading'
   
  //                 },
  //            ],
               
  //            }
  //        ],
  //        show:false
  //       },
  //       {
  //         menu_name: 'DEPOSITS',
  //         level_no:1,
  //         childMenuConfigs:[
  //           {
  //           menu_name:'Transaction',
  //            show:false,
  //            level_no:2,
  //            childMenuConfigs:[
  //             {
  //              menu_name:'Account Opening',
  //              show:false,
  //              level_no:3,
  //              ref_page:'DT_OpenAcc'
  //             },
  //             {
  //               menu_name:'Account Transactions',
  //               show:false,
  //               level_no:3,
  //               ref_page:'DT_AccTrans'

  //              },
  //              {
  //               menu_name:'Approve Transaction',
  //               show:false,
  //               level_no:3,
  //               ref_page:'DT_ApproveTran'
                 
  //              },
  //              {
  //               menu_name:'Lien A/C Lock/Unlock',
  //               show:false,
  //               level_no:3,
  //               ref_page:'DT_AccLockUnlock'

  //              },
  //              {
  //               menu_name:'View Account Details',
  //               show:false,
  //               level_no:3,
  //               ref_page:'DT_OpenAccView'
                 
  //              },
  //              {
  //               menu_name:'NEFT/RTGS/IMPS Payment',
  //               show:false,
  //               level_no:3,
  //               ref_page:'DT_NEFTPayment'

  //              }

  //          ],

  //           },
  //           {
  //             menu_name:'Report',
  //             show:false,
  //             level_no:2,
  //             childMenuConfigs:[
  //               {
  //                menu_name:'Sub Cash Book',
  //                show:false,
  //                level_no:3,
  //                ref_page:'DR_SubCashBook'
  //               },
  //               {
  //                 menu_name:'Detail List SB/CA',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DR_DLS'
  
  //                },
  //                {
  //                 menu_name:'Detail List RD',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DR_DLR'
                   
  //                },
  //                {
  //                 menu_name:'Detail List FD/MIS',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DR_DLF'
  
  //                },
                             
  //                {
  //                 menu_name:'Account Statement SB/CA',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DR_ASS'
                   
  //                },
  //                {
  //                 menu_name:'Account Statement RD',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DR_ASR'
  
  //                },
  //                {
  //                 menu_name:'Account Statement TD',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DR_ASF'
  //                },
  //                {
  //                  menu_name:'Near Maturity Report',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'DR_NearMatReport'
   
  //                 },
  //                 {
  //                  menu_name:'Open/Closing Register',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'DR_OpenCloseReg'
                    
  //                 },
  //                 {
  //                  menu_name:'NEFT Inward Report',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'DR_NeftIn'
   
  //                 },
  //                 {
  //                  menu_name:'NEFT Outward Report',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'DR_NeftOut'
                    
  //                 },
  //                 {
  //                  menu_name:'Pass book Printing',
  //                  show:false,
  //                  level_no:3,
  //                  ref_page:'DR_PbkPrn'
   
  //                 }
  
  //            ],

  //            }
  //        ],
  //        show:false
  //       },
  //       {
  //         menu_name: 'LOANS',
  //         level_no:1,
  //         childMenuConfigs:[
  //           {
  //            menu_name:'Transaction',
  //            show:false,
  //            level_no:2,
  //            childMenuConfigs:[
  //             {
  //              menu_name:'Open Loan Account',
  //              show:false,
  //              level_no:3,
  //              ref_page:'LT_OpenLoanAcc'
  //             },
  //             {
  //               menu_name:'Loan Transaction',
  //               show:false,
  //               level_no:3,
  //               ref_page:'LT_LoanTrans'

  //              },
  //              {
  //               menu_name:'Approve Transaction',
  //               show:false,
  //               level_no:3,
  //               ref_page:'LT_LoanAprv'
                 
  //              },
  //              {
  //               menu_name:'Calculate Loan Interest',
  //               show:false,
  //               level_no:3,
  //               ref_page:'LT_CalcIntt'

  //              },
  //              {
  //               menu_name:'Subsidy Entry',
  //               show:false,
  //               level_no:3,
  //               ref_page:'LT_Subsidy'

  //              }

  //          ],
               
  //           },
  //           {
  //             menu_name:'Report',
  //             show:false,
  //             level_no:2,
  //             childMenuConfigs:[
  //               {
  //                menu_name:'Loan Ledger',
  //                show:false,
  //                level_no:3,
  //                ref_page:'FT_Voucher'
  //               },
  //               {
  //                 menu_name:'Loan Statement',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'LR_LoanStmt'
  
  //                },
  //                {
  //                 menu_name:'Detail List',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'LR_DtlLst'
  
  //                },
  //                {
  //                 menu_name:'Loan Disbursement Register',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'LR_DisReg'
                   
  //                },
  //                {
  //                 menu_name:'Recovery Register',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'LR_RecReg'
  
  //                },
  //                {
  //                 menu_name:'Sub Cash Book',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'LR_SubCashBk'
  
  //                }

  
  //            ],
  //            },
  //            {
  //             menu_name:'Masters',
  //             show:false,
  //             level_no:2,
  //             childMenuConfigs:[
  //               {
  //                menu_name:'KCC Member Entry',
  //                show:false,
  //                level_no:3,
  //                ref_page:'LM_Kccmember'
  //               }
  //             ]

  //            }
  //        ],
  //        show:false
  //       },
  //       {
  //         menu_name: 'SYSTEM',
  //         level_no:1,
  //         childMenuConfigs:[
  //           {
  //            menu_name:'User Maintenance',
  //            show:false,
  //            level_no:2,
  //            childMenuConfigs:[
  //             {
  //              menu_name:'Add User',
  //              show:false,
  //              level_no:3,
  //              ref_page:'UM_AddUsr'
  //             }
  //           ]
              
  //           },
  //           {
              
  //             menu_name:'Daily Activity',
  //             show:false,
  //             level_no:2,
  //             childMenuConfigs:[
  //               {
  //                menu_name:'Day Initialization',
  //                show:false,
  //                level_no:3,
  //                ref_page:'DA_DayInit'
  //               },
  //               {
  //                 menu_name:'Day Completion',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DA_DayCmpl'
  //                },
  //                {
  //                 menu_name:'Year Open',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DA_YearOpn'
  //                },
  //                {
  //                 menu_name:'Year Close',
  //                 show:false,
  //                 level_no:3,
  //                 ref_page:'DA_YearCls'
  //                }
  //             ]

  //            },
  //            {
  //             menu_name:'Parameter',
  //             show:false,
  //             level_no:2,
  //             childMenuConfigs:[
  //               {
  //                menu_name:'System Parameter Update',
  //                show:false,
  //                level_no:3,
  //                ref_page:'SP_Update'
  //               }
  //             ]

  //            }
  //        ],
  //        show:false
  //       },
  //       {
  //         menu_name: 'TRANSFER',
  //         level_no:1,
  //         childMenuConfigs:[
  //           {
  //            menu_name:'Transaction',
  //            show:false,
  //            level_no:2,
  //            childMenuConfigs:[
  //             {
  //              menu_name:'Transfer Entry',
  //              show:false,
  //              level_no:3,
  //              ref_page:'TT_TransEntry'
  //             },
  //             {
  //               menu_name:'Approve Transfer',
  //               show:false,
  //               level_no:3,
  //               ref_page:'TT_TransApprove'
  //              }
  //           ]

  //           },
           
  //        ],
  //        show:false
  //       },
      
    
  // ]
  ngOnInit(): void {
  this.getLogdUser()
   console.log(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate'))
   
    setInterval(()=>{
      this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
      this.currDt= new Date().toString().substring(0,15) 
      // if(this.router.url.includes('la'))
      //    this.showScreenTitle=false
    ,1000})
    
    console.log(new Date())
    this.ardbName=localStorage.getItem('ardb_name')
    this.bankName = localStorage.getItem('__bName');
    this.getBankConfigMaster();
    this.getMenu();
    this.rstSvc.getlbr(environment.menuUrl,null).subscribe(data=>{
      console.log(data)
      this.menuConfigs=data;
    })
    this.retrieve()
    // this.bankName=this.titleService.getTitle()
  }
  getLogdUser(){
    // Getuserdetails
    // this.isLoading=true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    login.brn_cd = localStorage.getItem('__brnCd');
    login.ardb_cd=this.sys.ardbCD,
    
    this.svc.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
      res => {
        
        this.selectalluser=res
        this.filterUser=this.selectalluser.filter(x => x.user_id ==localStorage.getItem('__userId'))
        console.log(this.filterUser[0])
        
        //   if(this.filterUser.login_status=='Y'){
        //     this.loginStatus=true;

        //   }
        //   else{
        //     this.loginStatus=false
        //   }
        // console.log(this.loginStatus)
        //   ;
        
        console.log(res);
      })
 }
  // @HostListener('mouseout')
  // onMouseOut() {
  //   this.menuConfigs.forEach(lv1 => {
  //     lv1.show = false;
  //     lv1.childMenuConfigs.forEach(lv2 => {
  //       // lv2.show = false;
  //     });
  //   });
  // }

  @HostListener('click')
  clicked() {
    this.inside = true;
  }
  @HostListener('document:click')
  clickedOut() {
    if (!this.inside) {
      this.menuConfigs.forEach(lv1 => {
        lv1.show = false;
        lv1.childMenuConfigs.forEach(lv2 => {
          lv2.show = false;
        });
      });
    }
    this.inside = false;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
  over(menu: MenuConfig): void {
    if(menu.childMenuConfigs){
      if (null === this.currentMenu || 
      undefined === this.currentMenu) {
      menu.show = true;
      this.currentMenu = menu;
    } else if (this.currentMenu.level_no < menu.level_no) {
      const diff = this.currentMenu.level_no - menu.level_no;
      console.log(diff)
       switch (diff) {
        case 1:
        case -1:
          this.currentMenu.childMenuConfigs.forEach(lv2 => {
            lv2.show = false;
          });
          this.currentMenu.childMenuConfigs.forEach(lv3 => {
            lv3.childMenuConfigs.forEach(lv4 => {
              lv4.show = false;
            });
          })
          
          break;
        case 2:
          this.currentMenu.childMenuConfigs.forEach(lv2 => {
            lv2.childMenuConfigs.forEach(lv3 => {
              lv3.show = false;
            });
          });
          break;
          case 3:
          this.currentMenu.childMenuConfigs.forEach(lv3 => {
            lv3.childMenuConfigs.forEach(lv4 => {
              lv4.show = false;
            });
          });
      }
      menu.show = !menu.show;
    } else {
      ////debugger;
      this.hideMenu();
      
      menu.show = true;
      this.currentMenu = menu;
    }
  }
  else{
    const diff = this.currentMenu.level_no - menu.level_no;
    console.log(diff)
    //debugger
    this.gotoNewScreen(menu)
  }
  }

  private hideMenu(): void {
    this.inside = false;
    this.menuConfigs.forEach(lv1 => {
      lv1.show = false;
      lv1.childMenuConfigs.forEach(lv2 => {
        lv2.show = false;
        // lv2.childMenuConfigs.forEach(lv3 => {
        //   lv3.show = false;
        //   lv3.childMenuConfigs.forEach(lv4 => {
        //     lv4.show = false;
          });
        });
      // });
    // });
  }
  // changeScreen(){
    
  //   this.selectedScreenToShow=this.menuConfigs[0].childMenuConfigs[0].childMenuConfigs[0].menu_name
  //   this.showScreenTitle = true;
  //   console.log(this.selectedScreenToShow)
  // }

  gotoNewScreen(menu: MenuConfig): void {
    // console.log(menu)
    this.hideMenu();
    this.showScreenTitle = true;
    this.selectedScreenToShow = ''; // reset values;
    this.selectedScreenToShow = menu.menu_name;
    console.log(this.selectedScreenToShow)
    // if(menu.childMenuConfigs.length==0)
    if(!menu.childMenuConfigs){
      console.log(this.userType)
      this.router.navigate([this.bankName + '/' + menu.ref_page]);

    }
    // window.open(this.bankName + '/' + menu.ref_page);
    else{
      
      this.over(menu)
    }
  }
  out(menu: MenuConfig): void {
    menu.show = false;
  }

  /** this is the new menu call from db */
  getMenu() {
    const menuConfig = new MenuConfig(); let rcvdMenuConfigs: MenuConfig[];
    menuConfig.bank_config_id = 1;
    // this.rstSvc.addUpdDel<any>('Admin/GetMenuConfig', menuConfig).subscribe(
    //   res => {
    //     if (null !== res && undefined !== res) {
    //       // res = res as MenuConfig[];
    //       rcvdMenuConfigs = res;
    //       console.log(res);
    //       if (undefined !== res && null !== res) {
    //         // create the hirarchal data
    //         this.menuConfigs = rcvdMenuConfigs.filter(e => e.level_no === 1);
    //         this.menuConfigs.forEach(frstLvlEle => {
    //           if (frstLvlEle.is_screen === 'N') {
    //             const scndLvlMenus = rcvdMenuConfigs.filter(e =>
    //               e.parent_menu_id === frstLvlEle.menu_id);
    //             frstLvlEle.childMenuConfigs.push(...scndLvlMenus);

    //             scndLvlMenus.forEach(scndLvlEle => {
    //               if (scndLvlEle.is_screen === 'N') {
    //                 const thrdLvlMenus = rcvdMenuConfigs.filter(e =>
    //                   e.parent_menu_id === scndLvlEle.menu_id);
    //                 scndLvlEle.childMenuConfigs.push(...thrdLvlMenus);

    //                 thrdLvlMenus.forEach(thrdLvlEle => {
    //                   if (thrdLvlEle.is_screen === 'N') {
    //                     const forthLvlMenus = rcvdMenuConfigs.filter(e =>
    //                       e.parent_menu_id === thrdLvlEle.menu_id);
    //                     thrdLvlEle.childMenuConfigs.push(...forthLvlMenus);


    //                   }
    //                 });
    //               }
    //             });
    //           }
    //         });

    //         // console.log(firtLvlMenus);
    //       } else {
    //         // todo need to check if the menu doesnt come then what
    //       }
    //     }
    //   },
    //   err => { }
    // );
  }

  getBankConfigMaster() {
    // this.rstSvc.getAll<BankConfigMst>('BankConfigMst').subscribe(
    //   res => {
    //     console.log(res);
    //     this.bankConfig = res;
    //     this.bankFullName = this.bankConfig.bankname;
    //     this.showMenu = true;
    //     this.showChildMenu = false;
    //     this.showSubMenu = false;
    //     // TODO roles if required.
    //   },
    //   err => { }
    // );
  }

  logout() {
    // alert("hii")
    this.hideMenu();
    // localStorage.removeItem('__bName');
    // this.router.navigate(['/']);
    this.updateUsrStatus();
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');
    localStorage.removeItem('ardb_name');
    localStorage.removeItem('__ardb_cd');

    this.msg.sendisLoggedInShowHeader(false);
    this.router.navigate([this.bankName + '/login']);
  }

  private updateUsrStatus(): void {
    // alert("hii")
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

  goToHome() {
    this.hideMenu();
    this.router.navigate([this.bankName + '/la']);
    this.showMenu = true;
    this.showChildMenu = false;
    this.showSubMenu = false;
    this.showScreenTitle = false;
  }

  // showChildMenuFor(menu: mainmenu): void {
  //   this.childMenu = menu;
  //   this.subMenu = null;
  //   this.showMenu = false;
  //   this.showChildMenu = true;
  //   this.showSubMenu = false;
  //   this.router.navigate([this.bankName + '/la']);
  // }

  // showSubChildMenuFor(submenu: submenu): void {
  //   this.subMenu = submenu;
  //   this.showMenu = false;
  //   this.showChildMenu = false;
  //   this.showSubMenu = true;
  //   this.router.navigate([this.bankName + '/la']);
  // }

  // gotoScreen(screen: screenlist): void {
  //   this.showScreenTitle = true;
  //   this.selectedScreenToShow = ''; // reset values;
  //   this.selectedScreenToShow = screen.screen;
  //   this.router.navigate([this.bankName + '/' + screen.value]);
  // }

  back(fromwhere: string) {
    if (fromwhere === 'sub') {
      this.showMenu = false;
      this.showChildMenu = true;
      this.showSubMenu = false;
    } else if (fromwhere === 'child') {
      this.showMenu = true;
      this.showChildMenu = false;
      this.showSubMenu = false;
    }
    this.hideScreenTitle();
    this.router.navigate([this.bankName + '/la']);
  }

  private hideScreenTitle(): void {
    this.showScreenTitle = false;
    // this.selectedScreenToShow = '';
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  retrieve ()
  {
   
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
      res => {
        ;console.log(res)
        this.userType=res[0].user_type
        if(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate')){
          this.hideMenuOnComplete=true
        }
        else{
          this.hideMenuOnComplete=false
        }
       } )}
}
