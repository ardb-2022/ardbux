import { RestService } from './../../_service/rest.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN_MASTER, SystemValues } from '../Models';
import { InAppMessageService } from 'src/app/_service';
import { sm_parameter } from '../Models/sm_parameter';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from '../common-service.service';
// import {WINDOW} from '../../bank-resolver/window.providers'
// import { SampleService } from './services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[DatePipe]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  isError = false;
  brnDtls: any = [];
  // ardbBrnMst: mm_ardb[] = [];
  ardbBrnMst: any = [];
  // ardbBrnMst: any[] = [];
  systemParam: sm_parameter[] = [];
  // genparam=new p_gen_param();
  isLoading = false;
  showAlert = false;
  alertMsg = '';
  ipAddress: any;
  showUnlockUsr = false;
  usrToUnlock: any;
  nm: any
  userData: any;
  dtData:any
  getIp:any
  loginStatus:boolean=true;
  filterUser:any=[];
  selectalluser:any=[];
  sys = new SystemValues();
  wrongAttamt:any;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private rstSvc: RestService,
    private msg: InAppMessageService,
    private http: HttpClient,
    private cms:CommonServiceService
    // @Inject(WINDOW) private window:Window
    ) {
     
     }

  ngOnInit(): void {
    this.wrongAttamt=localStorage.getItem('W_attempt')
    this.encriptPass();
    localStorage.removeItem('ardb_name');
    localStorage.removeItem('L2L');
    if (this.router.url.includes('/login')) {
      this.getLogdUser();
      //  this.updateLoginStatus();
    }
   
    // alert("hii")
    // const getmac = require('getmac')
    // //console.log(getmac)
    // //console.log(window.location.hostname)
  //  this.getPrivateIP()
    this.loginForm = this.formBuilder.group({
      ardbbrMst: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      branch: ['', Validators.required]
    });
    this.loginForm.enable();
    this.msg.sendisLoggedInShowHeader(false);
    this.isLoading = true;

    setTimeout(() => {
      this.GetBranchMaster();
      this.GetARDBMaster();
      const sys = new SystemValues();
      if (null !== sys.UserId && sys.UserId.length > 0) {
        const usr = new LOGIN_MASTER();
        usr.brn_cd = sys.BranchCode;
        usr.user_id = sys.UserId;
        usr.login_status = 'N';

        this.updateUsrStatus(usr);
      }
      localStorage.removeItem('__userId');
      this.isLoading = false
    }, 300);

  }
  encriptPass(){
    const text = "Partha@123";

    // Convert the text to hexadecimal
    const hexText = Array.from(text, char => char.charCodeAt(0).toString(16)).join('');
    
    console.log(hexText);
    debugger
    }

  getLogdUser(){
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('itemUX');
    login.brn_cd = localStorage.getItem('BUX'); 
    login.ardb_cd=this.sys.ardbCD;
  
    this.cms.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
      res => {
        
      
        this.selectalluser=res
        this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y')
      
        //console.log(this.filterUser);
        for(let i=0;i<this.filterUser.length;i++){
          if(this.filterUser[i].user_id ==localStorage.getItem('itemUX')){
            this.filterUser[i].login_status='N';
          
        //console.log(this.filterUser);
      
        this.filterUser.forEach(e => {
          e.ardb_cd=this.sys.ardbCD
          e.brn_cd=this.sys.BranchCode
         });
    
         this.cms.addUpdDel('Sys/UpdateUserIdStatus', this.filterUser).subscribe(
          res => {
            //console.log(res)
            
          },)
         
        localStorage.removeItem('itemUX')
        localStorage.removeItem('BUX')

          }

       }
        
       
        
        
      })

   
 }
  getArdbCode(e: any) {
    
    //console.log(e);
    //console.log(this.ardbBrnMst);
    let bankName=this.ardbBrnMst.filter(x=>x.ardB_CD==this.f.ardbbrMst.value)[0].bank_name
    // let bankName2=this.ardbBrnMst.filter(x=>x.ardB_CD=='100')[0].bank_name
    if(this.f.ardbbrMst.value=='100'){
        localStorage.setItem('__ardb_cd', '26');
    }
    
    else{
      localStorage.setItem('__ardb_cd',this.f.ardbbrMst.value);
    }
    localStorage.setItem('__bName', bankName);

    this.router.navigate([bankName + '/login']);
    this.GetBranchMaster();
  }
  get f() { return this.loginForm.controls; }
  onSubmit(): void {
    this.showUnlockUsr = false;
    // this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const __bName = localStorage.getItem('__bName');
    // this.router.navigate([__bName + '/la']); // TODO remove this it will be after login
    const login = new LOGIN_MASTER();
    const toreturn = false;
    const hexText: string = Array.from(this.f.password.value, (char: string) => char.charCodeAt(0).toString(16)).join('');
    login.ardb_cd = this.f.ardbbrMst.value=='100'?'26':this.f.ardbbrMst.value;
    login.user_id = this.f.username.value;
    login.password = hexText;
    login.brn_cd = this.f.branch.value;
    this.nm = this.ardbBrnMst.find(x => x.ardB_CD == this.f.ardbbrMst.value)
    
    this.nm.name = this.nm.name.substr(0,this.nm.name.length-10)
    this.nm.name = this.nm.name +' Co-Operative Agriculture & Rural Development Bank Ltd.'
    localStorage.setItem('ardb_name', this.nm.name)
   
    if( this.f.ardbbrMst.value=='26'){
      let ardb_addrs=` H.O.: Old Court Compound, PO+PS- Burdwan, Purba Bardhaman- 713101 
      Contact No: (0342) 2662390/ 9800960007`
      localStorage.setItem('ardb_addr', ardb_addrs)
    }
    if( this.f.ardbbrMst.value=='4'){
      let ardb_addrs=` Ghatal : Kushpata, Paschim Medinipur, WestBengal`
      localStorage.setItem('ardb_addr', ardb_addrs)
    }
    else{
      let ardb_addrs=''
      localStorage.setItem('ardb_addr', ardb_addrs)
    }
    
    localStorage.setItem('itemUX', this.f.username.value)
    localStorage.setItem('BUX', this.f.branch.value)
    this.rstSvc.addUpdDel<any>('Mst/GetUserDtls', login).subscribe(
      res => {
        //console.log(res.length)
        // this.isLoading = false;
        if (res.length === 0) {
          this.showAlert = true;
          this.isLoading=false;
          this.alertMsg = 'Invalid UserName Or Password!';
          this.wrongAttamt?this.wrongAttamt:0
          this.wrongAttamt+=1;
          localStorage.setItem('W_attempt',  this.wrongAttamt);
          if(this.wrongAttamt>3){
            this.loginForm.invalid;
          }

          debugger
        }
        else {
          //console.log(res[0])

          if (res[0].login_status === "Y") {
            this.showAlert = true;
            this.isLoading=false;
            this.alertMsg = 'User id already logged in another machine;';
            this.showUnlockUsr = true;
            // alert(this.showUnlockUsr)
            this.usrToUnlock = res[0];
            return;
          }
          else {
            // this.isLoading=true;
            var dt = this.brnDtls.find(x => x.brn_cd == this.f.branch.value)
            // this.getPrivateIP()
            this.getBranchIp(dt).then(response => {
        
              if (response == true) {
                res[0].login_status = 'Y';
                res[0].ip = localStorage.getItem('getIPAddress');
                this.updateUsrStatus(res[0]);
                this.getSystemParam();
          
              }
              
              else {

              }
              //  this.isLoading=false;
            })
          }
        }
      },
      err => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMsg = 'Invalid Credential !!!!!';
      }
    );
    
  }
  
  closeAlert() {
    this.showAlert = false;
  }

  public unlockUsr(): void {
    this.isLoading = true;
    this.usrToUnlock.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', this.usrToUnlock).subscribe(
      res => {
        this.isLoading = false;
        this.onSubmit();
      },
      err => { }
    );
  }

  private updateUsrStatus(usr: any): void {
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
      res => {
      },
      err => { }
    );
  }
  private getSystemParam(): void {
    this.isLoading=true
    var dt={
      "ardb_cd":this.f.ardbbrMst.value=='100'?'26':this.f.ardbbrMst.value
    }
   
    this.rstSvc.addUpdDel('Mst/GetSystemDate',dt).subscribe(data=>
      {
        //console.log(data)
        this.dtData=data
        //console.log(this.dtData.sys_date)
        localStorage.setItem('__currentDate', this.dtData.sys_date); // Day initilaze
        localStorage.setItem('__prevDate',this.dtData.prev_date)
     
    this.rstSvc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        try {
          //console.log(sysRes);
          const __bName = localStorage.getItem('__bName');
          this.systemParam = sysRes;
          // //console.log(this.systemParam.find(x => x.param_cd === '206').param_value)

          this.router.navigate([__bName + '/la']);
          this.http.get<{ ip: string }>('https://jsonip.com').subscribe(
            data => {
              // //console.log(data)
              const getIP =  data.ip.split(",");
             localStorage.setItem('getIPAddress', getIP[0]); // feather
          // localStorage.setItem('__userId', this.f.username.value +'/'+data.ip); // "101"


            })
            
          localStorage.setItem('L2L', 'true');
          // //console.log(localStorage.getItem('ipAddress'))
          // localStorage.setItem('__ardb_cd', this.f.ardbbrMst.value);
          localStorage.setItem('__dist_cd', this.ardbBrnMst.find(x=>x.ardB_CD == this.f.ardbbrMst.value).dist_code)
          localStorage.setItem('__brnCd', this.f.branch.value); // "101"
          localStorage.setItem('__brnName', this.brnDtls.find(x => x.brn_cd === this.f.branch.value).brn_name); // "101"
          // localStorage.setItem('__currentDate', this.systemParam.find(x => x.param_cd === '206').param_value); // Day initilaze
          localStorage.setItem('__cashaccountCD', this.systemParam.find(x => x.param_cd === '213').param_value); // 28101
          localStorage.setItem('__ddsPeriod', this.systemParam.find(x => x.param_cd === '220').param_value); // 12
          localStorage.setItem('__userId', this.f.username.value); // feather
          localStorage.setItem('__minBalWdChq', this.systemParam.find(x => x.param_cd === '301').param_value);
          localStorage.setItem('__minBalNoChq', this.systemParam.find(x => x.param_cd === '302').param_value);
          localStorage.setItem('__dpstBnsRt', this.systemParam.find(x => x.param_cd === '805').param_value);
          localStorage.setItem('__pnlIntRtFrAccPreMatClos', this.systemParam.find(x => x.param_cd === '802').param_value);
          localStorage.setItem('__curFinyr', this.systemParam.find(x => x.param_cd === '207').param_value);
          // localStorage.setItem('__neftPayDrAcc', this.systemParam.find(x => x.param_cd === '820').param_value);
          localStorage.setItem('__sbInttCalTilDt', this.systemParam.find(x => x.param_cd === '799').param_value);
          localStorage.setItem('__lastDt', this.systemParam.find(x => x.param_cd === '210').param_value);
          localStorage.setItem('__PrevStatus', this.systemParam.find(x => x.param_cd === '215').param_value);
          localStorage.setItem('__FinYearClose', this.systemParam.find(x => x.param_cd === '214').param_value);
          
          this.f.ardbbrMst.value=='26'?localStorage.setItem('__neftPayDrAcc','401101000283' ):localStorage.setItem('__neftPayDrAcc','0' )
        
    //  //console.log(this.dtData.sys_date)
        //  //console.log(localStorage.getItem('__currentDate'))
          this.msg.sendisLoggedInShowHeader(true);
          this.loginForm.disable();
        }
      
        catch (exception) {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMsg = 'Initialization Failed. Contact Administrator !';
        }
      },
      sysErr => { }
    );
  })
    
  }

  cancel() {
    // localStorage.clear();
    // localStorage.removeItem('__bName');
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');
    localStorage.removeItem('ardb_name');
    localStorage.removeItem('__ardb_cd');
    localStorage.removeItem('ardb_addr');
    localStorage.removeItem('L2L');
    this.brnDtls.length = 0;
    this.loginForm.reset();
    this.loginForm.enable();
  }

  private GetBranchMaster() {
    // this.isLoading = true;
    var dt = { "ardb_cd": this.f.ardbbrMst.value ?this.f.ardbbrMst.value:null };
    //console.log(dt)
    this.rstSvc.addUpdDel('Mst/GetBranchMaster', dt).subscribe(
      res => {
        //console.log(res)
        // this.isLoading = false;
        this.brnDtls = res;
      },
      err => { 
        // this.isLoading = false;
       }
    );
  }

  private GetARDBMaster() {
    // this.isLoading = true;
    // this.rstSvc.addUpdDel('Mst/GetARDBMaster', null).subscribe(
    //   res => {
    //     //console.log(res)
    //     this.ardbBrnMst = res;
    //   },
    //   err => { 
    //     // this.isLoading = false; 
    //   }
    // );
    this.rstSvc.getlbr(environment.ardbUrl,null).subscribe(data=>{
      // //console.log(data)
      this.ardbBrnMst = data;
      // this.menuConfigs=data;
    })
  }
  onfocusOut(e: any) {

    var dt = {
      "ardb_cd": this.f.ardbbrMst.value,
      "user_id": e.target.value
    }
    this.rstSvc.addUpdDel('Mst/GetUserType', dt).subscribe(data => { //console.log(data)
       this.userData = data;
       localStorage.setItem('userType',this.userData[0].user_type)
       this.loginForm.patchValue({branch:this.userData[0].user_type != 'A' ?  this.userData[0].brn_cd : ''})
       this.userData[0].user_type != 'A' ? this.f.branch.disable() : this.f.branch.enable();
       this.showAlert = this.userData[0].login_status == 'Y' ? true : false;
       this.alertMsg = this.userData[0].login_status == 'Y' ? 'User id already logged in another machine' : '';
       // if (this.userData[0].user_type != 'A') {
      //   this.loginForm.patchValue({
      //     branch: this.userData[0].brn_cd
      //   })
      // }
  
      // else{
      //   this.loginForm.patchValue({
      //     branch: ''
      //   })
      //   this.f.branch.enable();
      // }
      // if (this.userData[0].login_status == 'Y') {
      //   this.showAlert = true;

      //   this.alertMsg = 'User id already logged in another machine;';
      // }
    })
  }
  public getBranchIp(e: any) {
    this.loginForm.disable();
    return new Promise((resolve, reject) => 
     {
      
      this.http.get<{ ip: string }>('https://jsonip.com').subscribe(
        data => {
          ////console.log(data)
          this.ipAddress = data.ip;
          const myIP =  this.ipAddress.split(",");
          localStorage.setItem('ipAddress',myIP[0])
          this.isLoading = false;

          // this.loginForm.enable();
          // resolve(true);

          let ipMatched = false;
          if (e.ip_address.indexOf(myIP[0]) !== -1) {
             ipMatched = true; 
            }
      
          if (!ipMatched) {
            this.showAlert = true;
            this.alertMsg = 'IP not allowed to access, contact support.';
            this.loginForm.disable();
            resolve(false);
          } else {
            this.loginForm.enable();
            resolve(true);
          }
        },
        ipErr => {
          this.isLoading = false;
          this.alertMsg = 'Unable to get IP, contact support.';
          resolve(false);
        }
      );

     }
    )

  }
//   getPrivateIP(){
//   //   this.rstSvc.addUpdDel('Loan/GetHostName1',null).subscribe(data => {
//   //     //console.log(data)
//   // })
//   this.http.get('http://localhost/api.php').subscribe(data=>//console.log(data))
// }
//   getPrivateIP(){
//     var RTCPeerConnection = window.RTCPeerConnection ;  
//     if (RTCPeerConnection)(function() {  
//         var rtc = new RTCPeerConnection({  
//             iceServers: []  
//         });  
//         if (1 || window.RTCPeerConnection) {  
//             rtc.createDataChannel('', {  
//                 // reliable: false  
//             });  
//         };  
//         rtc.onicecandidate = function(evt) {  
//             if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);  
//         };  
//         rtc.createOffer(function(offerDesc) {  
//             grepSDP(offerDesc.sdp);  
//             rtc.setLocalDescription(offerDesc);  
//         }, function(e) {  
//             console.warn("offer failed", e);  
//         });  
//         var addrs = Object.create(null);  
//         addrs["0.0.0.0"] = false;  
      
//         function updateDisplay(newAddr) {  
//             if (newAddr in addrs) return;  
//             else addrs[newAddr] = true;  
//             var displayAddrs = Object.keys(addrs).filter(function(k) {  
//                 return addrs[k];  
//             });  
//             // document.getElementById('list').textContent = displayAddrs.join(" or perhaps ") || "n/a"; 
//             //console.log(displayAddrs)
//            ;
//         }  
      
//         function grepSDP(sdp) {  
//             var hosts = [];  
//             sdp.split('\r\n').forEach(function(line) {  
//                 if (~line.indexOf("a=candidate")) {  
//                     var parts = line.split(' '),  
//                         addr = parts[4],  
//                         type = parts[7];  
//                     if (type === 'host') updateDisplay(addr);  
//                 } else if (~line.indexOf("c=")) {  
//                     var parts = line.split(' '),  
//                         addr = parts[2];  
//                     updateDisplay(addr);  
//                 }  
//             });  
//         }  
//     })();  
//     else {  
//         document.getElementById('list').innerHTML = "<code>ifconfig| grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";  
//         document.getElementById('list').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull."; 
//   }
// }
}
