import { SharedService } from 'src/app/services/shared/shared.service';
import { AuthenticationService } from 'src/app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails:any;
  displaypopup:boolean = false;
  isAdmin: boolean;
  showServiceTab:boolean = true;
  showVendorsTab:boolean=true;
  showCustomersTab:boolean=true;
  showGPTTab:boolean=false;
  isSettingsActive: boolean;
  constructor(private authService : AuthenticationService,
    private sharedService : SharedService,public router:Router,
    private mat_dlg: MatDialog
    ) { }

  ngOnInit(): void {
    this.addActiveClass();
    let ocr_engine = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.ocr_engine;
    let docTypes = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.documentTypes;
    let serviceTemplates = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.serviceInvoices;
    let vendorTemplates = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.vendorInvoices;
    if(docTypes.length == 1 && docTypes[0]=="Purchase Orders" || serviceTemplates == 0){
      this.showServiceTab = false;
    }else{
      this.showServiceTab = true;
    }
    if(docTypes.includes("Invoice") && vendorTemplates == 1){
      this.showVendorsTab = true;
    }else{
      this.showVendorsTab = false;
    }
    if(docTypes.includes("Purchase Orders")){
      this.showCustomersTab = true;
    }else{
      this.showCustomersTab = false;
    }
    if(ocr_engine == "GPT 3.5"){
      this.showCustomersTab = false;
      this.showVendorsTab = false;
      this.showServiceTab = false;
      this.showGPTTab= true;
    }
    this.userDetails = this.authService.currentUserValue;
    this.sharedService.userId = this.userDetails.userdetails.idUser;
    if(this.userDetails.permissioninfo.User == 1){
      this.sharedService.isAdmin = true;
    } else {
      this.sharedService.isAdmin = false;
    }
    this.isAdmin = this.sharedService.isAdmin;
  }
  get userInitials(): string {
    const { firstName, lastName } = this.userDetails.userdetails;
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`;
  }
  get fullName(): string {
    const { firstName, lastName } = this.userDetails.userdetails;
    return `${firstName} ${lastName}`.trim();
  }
  addActiveClass(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the route includes "settings"
        this.isSettingsActive = event.url.includes('settings');
      }
    });
  }
  signOut(){
    this.authService.logout();
  }
  openPopup(){
    const dialogRef = this.confirmFun('Are you sure you want to sign out?', 'confirmation', 'Sign Out');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.signOut();
      }
    });
  }
  confirmFun(body, type, head) {
    return this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: body, type: type, heading: head, icon: 'assets/Group 1336.svg' }
    })
  }
}
