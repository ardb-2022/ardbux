import { BankConfiguration } from './../Models/bankConfiguration';
import { AfterViewInit, Component,ViewChild , HostListener, OnDestroy, OnInit, TemplateRef , ElementRef, Renderer2, ViewChildren, QueryList, Input} from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BankConfigMst, mainmenu, submenu, screenlist, SystemValues, LOGIN_MASTER, MenuConfig } from '../Models';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { lvLocale } from 'ngx-bootstrap/chronos';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { sd_day_operation } from '../Models/sd_day_operation';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy,AfterViewInit {
  currentRoute: any;
  objectKeys = Object.keys;
  constructor(private rstSvc: RestService, private router: Router, private svc:RestService, private modalService:BsModalService,private elementRef: ElementRef, private renderer: Renderer2,
              private msg: InAppMessageService) {
                this.showScreenTitle=false
                this.selectedScreenToShow=''
                this.router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                    this.currentRoute = event.url;          
                      //console.log(event);
                      this.showScreenTitle=event.url.includes('/la') ? false:true
                  
                }
                });
   
  }
  
  @ViewChild('fast') public fast;
  @ViewChild('second') public second;
  @ViewChild('third') public third;
  @ViewChild('foth') public foth;
  @ViewChild('template2', { static: true }) template2: TemplateRef<any>;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  @ViewChild(MatMenu) menu: MatMenu;
  @ViewChild('menuItem') menuItem: MatMenuItem;
  currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
  currDt= new Date().toString().substring(0,15) 
  ardbName:any;
  subscription: Subscription;
  collapsed = true;
  bankConfig: BankConfigMst;
  bankName: string;
  userType:any;
  userPermission:any[]=[];
  brnCD=localStorage.getItem('__brnCd');
  bankFullName: string;
  // childMenu: mainmenu;
  subMenu: submenu;
  showMenu = false;
  showChildMenu = false;
  showSubMenu = false;
  showScreenTitle = false;
  currUser:any;
  menuUserType:any;
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
  modalRef?:BsModalRef
  sdoRet:any=[]
  sdo:any;
  buttonID:string;
  isLoading = false;
matmenuTrg:any=[];
  permission:boolean=false;
  dynamicLink:any;
  dynamicLink2:any;
  showOpenYear:boolean=false;
  items: any[];
 
  ngOnInit(): void {
    if(this.sys.ardbCD=='26'){
      this.dynamicLink='LR_BMLoanStmt';
      this.dynamicLink2='LR_Disb_Cert'
    }
    if(this.sys.ardbCD=='4'){
      this.dynamicLink2='LR_GM_DC'
    }
    else{
      this.dynamicLink='LR_LoanStmt';
      this.dynamicLink2='LR_Disb_Cert'
      }
  this.getLogdUser()
   //console.log(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate'))
   
    setInterval(()=>{
      this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
      this.currDt= new Date().toString().substring(0,15) 
      // if(this.router.url.includes('la'))
      //    this.showScreenTitle=false
    ,1000})
    
    //console.log(new Date())
    this.ardbName=localStorage.getItem('ardb_name')
    this.bankName = localStorage.getItem('__bName');
    this.getBankConfigMaster();
    this.getMenu();
    this.rstSvc.getlbr(environment.menuUrl,null).subscribe(data=>{
      //console.log(data)
      this.menuConfigs=data;
    })
    debugger
    this.retrieve();

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
        //console.log(this.filterUser[0])
        
        //   if(this.filterUser.login_status=='Y'){
        //     this.loginStatus=true;

        //   }
        //   else{
        //     this.loginStatus=false
        //   }
        // //console.log(this.loginStatus)
        //   ;
        
        //console.log(res);
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
      //console.log(diff)
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
          case -2:
          this.currentMenu.childMenuConfigs.forEach(lv2 => {
            lv2.childMenuConfigs.forEach(lv3 => {
              lv3.show = false;
            });
          });
          break;
          case 3:
            case -3:
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
    //console.log(diff)
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
  //   //console.log(this.selectedScreenToShow)
  // }

  gotoNewScreen(menu: MenuConfig): void {
    // //console.log(menu)
    this.hideMenu();
    this.showScreenTitle = true;
    this.selectedScreenToShow = ''; // reset values;
    this.selectedScreenToShow = menu.menu_name;
    //console.log(this.selectedScreenToShow)
    // if(menu.childMenuConfigs.length==0)
    if(!menu.childMenuConfigs){
      //console.log(this.userType)
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
    //       //console.log(res);
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

    //         // //console.log(firtLvlMenus);
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
    //     //console.log(res);
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
    localStorage.removeItem('L2L');
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
  openModal(template: TemplateRef<any>) {
    this.currUser=localStorage.getItem('__userId');
    this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
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
  confirm(): void {
    this.modalRef?.hide();
    this.logout();
  }
 
  decline(): void {
    this.modalRef?.hide();
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
  ngAfterViewInit(){
    this.isLoading=true
    setTimeout(() => {
      this.getPermission();
      this.isLoading=false
    }, 1000);

  }
  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }
  hideButton(buttonId: any) {
    console.log(buttonId);
    debugger
    if(this.userPermission.length>0){
      this.matmenuTrg=this.userPermission.filter(e=>e.identification==buttonId.target.id)
     if( this.matmenuTrg[0].permission=='N'){
      const input = document.getElementById(buttonId.target.id) as HTMLInputElement | null;
      debugger
      input.disabled=true
     }
    }
   
    this.isLoading=false;  
    
      }
 abc(){
  if(this.userPermission.length>0){
    for(let i=0;i<this.userPermission.length;i++){
      var input = document.getElementById(this.userPermission[i].identification) as HTMLInputElement | null;
      if(this.userPermission[i].permission=='N'){
        input.style.display="none";
       }
      }
  }
 }
 getPermission(){
  this.isLoading=true;
  var data = {
    "ardb_cd": this.sys.ardbCD,
    "role_cd":this.userType=='S'?2:this.userType=='G'?3:1
  }
  debugger
  this.svc.addUpdDel<any>('Mst/GetRolePermission', data).subscribe(
    res => {
      console.log(res);
      this.userPermission=res
      this.items=res
      debugger
      
      
    })
  
 }



  retrieve ()
  {
    this.isLoading = true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    // 
    // login.user_id=login.user_id.split('/')[0]
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    // this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
    //   res => {
    //     ;//console.log(res)
    //     this.userType=res[0].user_type
    //     if(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate')){
    //       this.hideMenuOnComplete=true
    //     }
    //     else{
    //       this.hideMenuOnComplete=false
    //     }
    //    } )
    this.sdo = new sd_day_operation();
    this.sdo.ardb_cd=this.sys.ardbCD
    //sdo.operation_dt =this.convertDate(localStorage.getItem('__currentDate'));// new Date();
    this.sdo.operation_dt =this.sys.CurrentDate;
    ;
    this.svc.addUpdDel<any>('Sys/GetDayOperation', this.sdo).subscribe(
      res => {//console.log(res)
        this.sdoRet=res
        this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
            res => {
              ;//console.log(res)
              this.userType=res[0].user_type
              //console.log(this.sdoRet.filter(x=>x.brn_cd==this.sys.BranchCode)[0].cls_flg=="Y")
              // if(this.sdoRet.filter(x=>x.brn_cd==this.sys.BranchCode)[0].cls_flg=="Y"){
              //   this.hideMenuOnComplete=true
              // }
              
               if(this.sdoRet.filter(x=>x.brn_cd==this.sys.BranchCode)[0].cls_flg=="Y" ){
                const m = this.convertDate(this.sys.lastDt);
                const c = this.sys.CurrentDate;
                const diffDays = Math.ceil((m.getTime() - c.getTime()) / (1000 * 3600 * 24)); 
               
                //console.log(c);
                //console.log(m);
                //console.log(diffDays);
                debugger
                if(diffDays==0 && this.sys.BranchCode=='101'){
                  this.hideMenuOnComplete=true
                  this.showOpenYear=true;
                }
                else{this.hideMenuOnComplete=true}
              }
              else
              this.hideMenuOnComplete=false
              if(res.length>0){
                debugger
                this.isLoading = false;
                

              }
            }

        )

       

      
      })
      // this.getPermission()
  }
  private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}

}
