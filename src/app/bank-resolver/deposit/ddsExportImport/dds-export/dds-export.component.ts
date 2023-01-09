import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues } from 'src/app/bank-resolver/Models';
import { ddsExport } from 'src/app/bank-resolver/Models/deposit/ddsExport';
import { getExportData } from 'src/app/bank-resolver/Models/deposit/getExportData';
import { RestService } from 'src/app/_service';
@Component({
  selector: 'app-dds-export',
  templateUrl: './dds-export.component.html',
  styleUrls: ['./dds-export.component.css']
})
export class DdsExportComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  sys = new SystemValues();
  config = { keyboard: false, backdrop: true, ignoreBackdropClick: true };
  exportEntryForm: FormGroup;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  selectTitle = true;
  fileUrl: any;
  getExportData: any;
  agentPass: any;
  agentCD: any;
  agentOpenDt: any;
  agentTableData: getExportData[];
  fileData: any;
  str = ''
  agentData: any;
  agentName: any;
  mType:any
  isType=true;
  typeName:any;
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: BsModalService, private router: Router) { }
  ngOnInit(): void {
    this.getAgentList()
    this.exportEntryForm = this.formBuilder.group({
      agent_id: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(data => this.agentData = data)
  }
  exportAsTxt() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode,
      "agent_cd": this.agentCD,
      "machine_type": this.mType
    }
    this.svc.addUpdDel('Deposit/GetDataForFile', dt).subscribe(data => {
      this.fileData = data;
      for (let i = 0; i < this.fileData.length; i++)
        this.str = this.str + this.fileData[i] + '\n'
      let fileDt = this.str;
      const file = new Blob([fileDt], { type: 'text/json' });
      var file_name = 'pctx.txt';
      let newLink = document.createElement('a');
      newLink.download = file_name;
      const fileURL = URL.createObjectURL(file);
      newLink.href = fileURL;
      newLink.click();
      this.str = ''
    })
  }
  get entry() { return this.exportEntryForm.controls }
  public SubmitReport() {
    this.isLoading = true
    if (this.exportEntryForm.invalid) {
      this.isLoading = false;
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      this.isLoading = false;
      var ddsExp = new ddsExport()
      ddsExp.ardb_cd = this.sys.ardbCD
      ddsExp.brn_cd = this.sys.BranchCode
      ddsExp.agent_cd = this.entry.agent_id.value;
      ddsExp.agent_name = this.agentData.filter(x => x.agent_cd == this.entry.agent_id.value)[0].agent_name
      this.svc.addUpdDel('Deposit/GetExportData', ddsExp).subscribe(data => {
        this.getExportData = data;
        this.getExportData.forEach(x => x.interest = '.0' + x.interest)
        this.getExportData.forEach(x => x.curr_bal_amt = '000' + x.curr_bal_amt)
        this.getExportData.forEach(x => x.balance_amt = '000' + x.balance_amt)
        this.agentPass = this.getExportData[0].password
        this.agentCD = this.getExportData[0].agent_cd
        this.agentOpenDt = this.getExportData[0].opening_dt
        this.agentName = this.getExportData[0].agent_name
      })
      this.modalRef.hide();
    }
  }
  public closeAlert() { this.showAlert = false; }
  closeScreen() { this.router.navigate([this.sys.BankName + '/la']); }
  exportFormat(e:any){
    this.mType=document.getElementById(e.target.id)
    this.mType=this.mType.value
    this.isType=false
  }
}
