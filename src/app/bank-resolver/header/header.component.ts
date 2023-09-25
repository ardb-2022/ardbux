import { AfterViewInit, Component,ViewChild , HostListener, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { AuthenticationService, InAppMessageService, RestService } from 'src/app/_service';
import { BankConfigMst, submenu, SystemValues, LOGIN_MASTER, MenuConfig } from '../Models';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { sd_day_operation } from '../Models/sd_day_operation';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy,AfterViewInit {
  currentRoute: any;
  objectKeys = Object.keys;
  constructor(private rstSvc: RestService, private router: Router, private svc:RestService, private modalService:BsModalService,
              private msg: InAppMessageService,private auth:AuthenticationService,private http: HttpClient) {
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
  dynamicLink3:any;
  showOpenYear:boolean=false;
  items: any[];
  showLocker:boolean=true;
  menuItems:any[]=[]
  AllItem:any[]=[]
  allMenu:any;
  roleCD:any;
  ngOnInit(): void {
  // this.getUser()
  this.getLogdUser()
   //console.log(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate'))
   
    setInterval(()=>{
      this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
      this.currDt= new Date().toString().substring(0,15) 
      // if(this.route.url.includes('la'))
      //    this.showScreenTitle=false
    ,1000})
    
    this.ardbName=localStorage.getItem('ardb_name')
    this.bankName = localStorage.getItem('__bName');
    
    debugger
    this.retrieve();

  }
  
  callMenu(){
   
      this.isLoading=true;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "role_cd":this.roleCD
      }
      this.svc.addUpdDel('Mst/GetMenuPermission', dt).subscribe(
        res => {
          console.log(res);
          this.allMenu=res
          this.AllItem=this.allMenu.menu_module;
          this.menuItems=[]
          const customOrder = ['UCIC', 'Finance', 'Deposit', 'Loans', 'System', 'Transfer', 'Investment', 'Locker'];
          this.menuItems = this.AllItem.sort((a, b) => {
            const menuNameA = a.menu_name;
            const menuNameB = b.menu_name;
            const indexA = customOrder.indexOf(menuNameA);
            const indexB = customOrder.indexOf(menuNameB);
            
            return indexA - indexB;
          });
          console.log(this.menuItems);
          debugger
       this.isLoading=false
          
        })
       
  }
  getLogdUser(){
    this.isLoading=true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    // login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    
    this.svc.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
      res => {
        if(res){
        this.selectalluser=res
        
        // this.roleCD=1
        // if(this.roleCD>0){this.callMenu()}
      }
      })
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
 

  private hideScreenTitle(): void {
    this.showScreenTitle = false;
    // this.selectedScreenToShow = '';
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  ngAfterViewInit(){
    // this.isLoading=true
    setTimeout(() => {
      // this.getPermission();
      //  this.isLoading=false
    }, 5000);

  }
  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }

//  getPermission(){
//   this.isLoading=true;
//   var data = {
//     "ardb_cd": this.sys.ardbCD,
//     "role_cd":this.userType=='S'?2:this.userType=='G'?3:1
//   }
//   this.svc.addUpdDel<any>('Mst/GetRolePermission', data).subscribe(
//     res => {
//       //console.log(res);
//       this.userPermission=res
//       this.items=res
      
      
//     })
  
//  }



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
              this.roleCD=this.userType=='A'?1:this.userType=='S'?2:this.userType=='G'?3:4
              debugger
              if(this.roleCD>0){this.callMenu()}
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
                // this.isLoading = false;
                

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
openNewTab() {
  this.auth.report=true;
  debugger
  const urlToOpen = `http://36.255.3.143/ardb.SynergicBanking/${this.bankName}/FR_ProfitLoss`;
  window.open(urlToOpen);
}
}
