import { PermissionService } from './../../services/permission.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig
} from "primeng/api";
import { AlertService } from 'src/app/services/alert/alert.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
interface EmailRecipient {
  reciptentId: number;
  recipientEmail: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userDetails = '_______';
  emailBodyDummy ='There is a mismatch details In the Invoice number_____, that is in the vendor name some mistake is there instead of ____there is _____. So, please check that.';
  emailBody ='There is a mismatch details In the Invoice number_____, that is in the vendor name some mistake is there instead of ____there is _____. So, please check that.';
  smsBody ='This is the format for the email body if you want you can change the data.'
  emailSubject: any;
  ntBody: any;
  activeMenuSetting:string;
  viewType = 'Notification';

  actions =[
    'Missing Key Labels data in OCR Extaction in Invoice',
    'Missing Label data in OCR Extraction ',
    'Low OCR confidance in Key Labels',
    'Low OCR Confidance in Other Labels',
    'Too many OCR Errors In Invoice',
    'Too many OCR errors from a Vendor/ Service Provider'
  ]
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isAdmin: boolean;
  isEditable: boolean = false;
  templateGroups: any;
  selectedItem: any;
  templates: any;
  templatesname: boolean = false;
  spectemplates: any;
  emailtemplateavail: boolean = false;
  eSubject: string =  '';
  eContent: string =  '';
  editable: boolean = false;
  teplatesNames: any[];
  filteredTemplates: any;
  rejInvoice: boolean = false;
  sucessInvoice: boolean = false;
  filteredEnt: any[];
  templateGroupId: any;
  templateNameId: any;
  templateGroupName: any;
  newTemplete: boolean = false;
  exTemplatete: boolean = false;
  newTemplateDetails: any;
  etemplateName: any;
  editedDetails: { subject: string; templateContent: string; };
  originalTemplateData: any;
  emailRecepiants: EmailRecipient[] = [];
  selectedEmails: string[] = [];
  addGroup: boolean = false;
  addGroupPopUp: boolean = false;
  selectedCc: string[] = [];
  filteredCcOptions: EmailRecipient[] = [];
  recEmails: boolean = false;
  isDisabled: boolean = false;
  sendEmail: boolean = false;
  groupName: any;
  recipientsDetails: any;
  recipientsGroup: any;
  currgroupName: any;
  emailRecepeantsList: string[] = [];
  filteredCcOptionsList: string[] = [];
  recepientsGroupId: void;
  editedrecipientsDetails: any;
  exEmails: string[] = [];
  exCcMails: string[] = [];
  exgroupName: any;
  // customer_name: string = 'Anto';

  constructor(private sharedService: SharedService,
              private router: Router,
              private route:ActivatedRoute,
              private PermissionService : PermissionService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private SharedService: SharedService,
              private AlertService: AlertService,
              private sanitizer: DomSanitizer,
              public dialog: MatDialog
            ) { }

  ngOnInit(): void {
    this.getTemplateGroup()
   if(this.PermissionService.settingsPageAccess == true){
    this.activeMenuSetting = this.sharedService.activeMenuSetting ;
    this.isAdmin = this.PermissionService.addUsersBoolean;
  } else{
    alert("Sorry!, you do not have access");
    this.router.navigate(['customer/invoice/allInvoices'])
  }
  this.SharedService.getEmailRecipients().subscribe((data: any) =>{
      
    this.emailRecepiants = data;

    this.emailRecepeantsList = data.map(item => item.recipientEmail);
    this.filteredCcOptionsList = data.map(item => item.recipientEmail);
    this.filteredCcOptions = [...this.emailRecepiants];
  })
  }
  menuChange(value){
    this.sharedService.activeMenuSetting  = value;
    this.activeMenuSetting = this.sharedService.activeMenuSetting
  }

  getEmailTemplate(){
    this.sharedService.displayTemplate().subscribe((data:any)=>{
      this.emailSubject = data[0].subject;
      this.emailBody = data[0].template_body;
    })
  }
  updateTemplate(){
    let updateData={
      "template_body": this.emailBody,
      "subject":  this.emailSubject 
    }
    this.sharedService.updateTemplate(JSON.stringify(updateData)).subscribe((data:any)=>{
      if(data.result=='Updated'){
        this.messageService.add({
          severity: "info",
          summary: "Updated",
          detail: "Updated Successfully"
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "error",
          detail: "Something went wrong"
        });
      }
    })
  }
  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.eContent);
  }
  displayNTtemplate(){
    this.sharedService.displayNTtemplate().subscribe((data)=>{
      this.ntBody = data[2];
    })
  }
  updateNTtemplate(e){
    this.sharedService.NTtempalteId = e.idPullNotificationTemplate;
    let updateData={
      "templateMessage": e.templateMessage,
      "notificationTypeID": e.notificationTypeID,
      "notificationPriorityID": e.notificationPriorityID
    }
    this.sharedService.updateNTtemplate(JSON.stringify(updateData)).subscribe((data)=>{
      if(data[0]=='updated'){
        this.messageService.add({
          severity: "info",
          summary: "Updated",
          detail: "Updated Successfully"
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "error",
          detail: "Something went wrong"
        });
      }
    })
  }
  // emailnotification(){
  //   this.emailhead = "Email Notificaion"
  //   this.emailprop = true;
  //   this.getTemplateGroup()
  // }
  getTemplateGroup(){
    this.SharedService.getTemplateGroup().subscribe((data: any) =>{
      
      this.templateGroups = data.data;
    })
  }
  searchTemplates(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    if (this.templateGroups?.length > 0) {
      for (let i = 0; i < this.templateGroups?.length; i++) {
        let ent: any = this.templateGroups[i];
        if (ent.TemplateGroupName.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(ent);
        }
      }
    }
    this.filteredEnt = filtered;
  }

  filterTemplates(query: string): string[] {
    return this.filteredTemplates.filter(template =>
      template.toLowerCase().includes(query.toLowerCase())
    );
  }
  // filterTemplateGroup(query: string): string[] {
  //   return this.filteredTemplates.filter(template =>
  //     template.toLowerCase().includes(query.toLowerCase())
  //   );
  // }
  onSelectionChange(event) {
    this.editable = false;
    this.isEditable = false;
    this.newTemplete = false;
    this.templateGroupName = event.TemplateGroupName;
    if(this.templateGroupName == 'OCR Failure Scenarios' || 'Rejection Notifications'){
      this.rejInvoice = true;
      this.sucessInvoice = false;
    }
    if(this.templateGroupName == 'Approval Notifications'){
      this.sucessInvoice = true;
      this.rejInvoice = false;
    }
  
   
    this.templateGroupId = event.TemplateGroupID;
    this.SharedService.getEmailTemplate(this.templateGroupId).subscribe((data: any) =>{
      
      this.templates = data.data;
    })
    this.templatesname = true;
    this.emailtemplateavail = false;
  }
  openTemplate(event, fun){
    if(fun == 'send'){
      this.isDisabled = true;
      this.sendEmail = true;
      this.exTemplatete = false;
    }
    else{
      this.isDisabled = false;
      this.exTemplatete = true;
      this.sendEmail = false;
    }
    this.newTemplete = false;
    this.isEditable = true;
    this.templatesname = false;
    this.emailtemplateavail = true;
    this.editable = false;
    this.templateNameId = event.TemplateID;
    this.SharedService.getEmailRecipientsSpec(this.templateNameId).subscribe((data: any) =>{
      // this.selectedEmails = data.map(item => item.Recipients);
      this.selectedEmails = data.map(item => item.Recipients.split(',').map(email => email.trim()))  // Split and trim each email
      .flat();  // Flatten the array of arrays into a single array of emails
      this.groupName = data[0]?.RecipientGroup || '';
      // this.selectedCc = data.map(item => item.ccRecipients);
      this.selectedCc = data.map(item => item.ccRecipients.split(',').map(email => email.trim()))  // Split and trim each email
      .flat();
      this.recepientsGroupId = data[0]?.recipientGroupId || '';
      this.exEmails = this.selectedEmails;
      this.exCcMails = this.selectedCc;
      this.exgroupName = this.groupName;
      this.selectedRecipients();
    })
    this.SharedService.getEmailTemplateSpec(this.templateNameId).subscribe((data: any) =>{
      
      this.spectemplates = data.data;
      if (this.spectemplates.length > 0) {
        this.eSubject = this.spectemplates[0].Subject;
        this.eContent = this.spectemplates[0].Content;
        this.emailtemplateavail = true;
        this.originalTemplateData = {
          eSubject: this.eSubject,
          eContent: this.eContent
        };
      }
    })
  }
  createTemplate(){
    this.exTemplatete = false;
    this.sendEmail = false;
    this.newTemplete = true;
    this.templatesname = false;
    this.emailtemplateavail = true;
    this.editable = false;
    this.isEditable = true;
    this.eContent = '';
    this.eSubject = '';
    this.selectedEmails = null;
    this.selectedCc = null;
  }
  deleteTemplate(event){

    this.templateNameId = event.TemplateID;
    this.SharedService.deleteEmailTemplate(this.templateGroupId,this.templateNameId).subscribe((data: any) => {
      if (data?.message) {
        this.success(data?.message)
          this.SharedService.deleteEmailRecipients(this.templateNameId,this.recepientsGroupId).subscribe((data: any) => {})
          this.SharedService.getEmailTemplate(this.templateGroupId).subscribe((data: any) =>{
      
            this.templates = data.data;
          })
      }
    }, err => {
      this.error('Server error');
    })
  }
  editGroupName(){
    this.open_dialog();
  }

  selectedRecipients() {
    this.selectedEmails = this.selectedEmails;
    // Find the selected emails (already available in selectedEmails)
    const selectedEmailsSet = new Set(this.selectedEmails);
    
    // Filter out selected emails from emailRecepeantsList
    this.filteredCcOptionsList = this.emailRecepeantsList.filter(
      email => !selectedEmailsSet.has(email)
    );
      
  // Additional logic based on the number of selected emails
    if (this.selectedEmails.length === 1) {
      this.addGroup = false;
      this.recEmails = true;
        // Perform any other logic when only one email is selected
    } else {
      this.addGroup = true;
      this.recEmails = true;
        // Perform any other logic when more than one email is selected
    }
  }
  open_dialog(){
    this.addGroupPopUp = true;
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
    });
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  createNewTemplate(){
    if(this.newTemplete){
      this.newTemplateDetails = {
        partitionKey: this.templateGroupId,
        isActive: true,
        subject: this.eSubject,
        templateContent: this.eContent,
        templateName: this.etemplateName
      };
      this.SharedService.createNewEmailTemplate(this.newTemplateDetails).subscribe((data: any) => {
        if (data) {
          this.recipientsDetails = {
            partitionKey: data,
            groupName: this.groupName,
            recipients: this.selectedEmails.join(', '),
            ccRecipients: this.selectedCc.join(', ')
          }
          this.SharedService.setEmailRecipients(this.recipientsDetails).subscribe((data: any) => {
            if(data.RowKey){
              let mesage = "Template Created Sccessfully"
              this.success(mesage)
              this.templatesname = true;
              this.emailtemplateavail = false;
              this.editable = false;
              this.newTemplete = false;
              this.isEditable = false;
              this.addGroup = false;
              this.addGroupPopUp = false;
              this.closeDialog();
              this.SharedService.getEmailTemplate(this.templateGroupId).subscribe((data: any) =>{
                this.templates = data.data;
              })
            }
            
          })
          }
        }
      , err => {
        this.error('Server error');
      })
    }
  }

  updateExTempleateRecp() {
  
    // Prepare edited recipients details
    this.editedrecipientsDetails = {
      recipientGroup: this.groupName,
      recipients: this.selectedEmails.join(', '),  // Convert array to string
      ccRecipients: this.selectedCc.join(', ')     // Convert array to string
    };
  
    // Convert selectedEmails and selectedCc to strings for comparison
    const selectedEmailsStr = this.selectedEmails.join(', ');
    const selectedCcStr = this.selectedCc.join(', ');
  
    // Compare all values with original data to check if there are any changes
    if (
      this.eSubject === this.originalTemplateData.eSubject &&
      this.eContent === this.originalTemplateData.eContent &&
      this.selectedEmails === this.exEmails &&
      this.selectedCc === this.exCcMails &&
      this.groupName === this.exgroupName
    ) {
      alert('There are NO changes');
    } else {
      // Update email template if subject and content have changed
      if (
        this.eSubject !== this.originalTemplateData.eSubject || 
        this.eContent !== this.originalTemplateData.eContent
      ) {
        this.editedDetails = {
          subject: this.eSubject,
          templateContent: this.eContent
        };
  
        // Call service to update the email template
        this.SharedService.editEmailTemplate(this.editedDetails, this.templateGroupId, this.templateNameId)
          .subscribe((data: any) => {
            if (data?.message) {
              this.success(data?.message);
            }
          }, err => {
            this.error('Server error');
          });
      }
  
      // Update email recipients if email or group data has changed
      if (
        this.selectedEmails !== this.exEmails || 
        this.selectedCc !== this.exCcMails || 
        this.groupName !== this.exgroupName
      ) {
        this.SharedService.updateEmailRecipients(this.templateNameId, this.recepientsGroupId, this.editedrecipientsDetails)
          .subscribe((data: any) => { 
            if (data?.Message) {
            this.success(data?.Message);
          }
        }, err => {
          this.error('Server error');
          });
      }
    }
  }
  backBtn(){
    this.templatesname = true;
    this.emailtemplateavail = false;
    this.editable = false;
    this.newTemplete = false;
    this.isEditable = false;
    this.addGroup = false;
    this.addGroupPopUp = false;
    this.groupName = null;
  }
  
  cancelChanges(){
    if(this.exTemplatete){
      this.eSubject = this.originalTemplateData.eSubject;
      this.eContent = this.originalTemplateData.eContent;
      this.selectedEmails = this.exEmails;
      this.selectedCc = this.exCcMails;
    }
    if(this.newTemplete){
      this.etemplateName = null;
      this.eSubject = null;
      this.eContent = null;
      this.selectedEmails = null;
      this.selectedCc = null;
    }
   
  }
  success(msg) {
    this.AlertService.success_alert(msg);
  }
  error(msg) {
    this.AlertService.error_alert(msg);
  }
}
