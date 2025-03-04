import { ImportExcelService } from './../../../services/importExcel/import-excel.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { SharedService } from 'src/app/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-vendor-based-charts',
  templateUrl: './vendor-based-charts.component.html',
  styleUrls: ['./vendor-based-charts.component.scss'],
})
export class VendorBasedChartsComponent implements OnInit {
  vendorsData: any;
  viewType ;
  exceptionData: any;

  exceptionTableData = [];
  columnsForException = [];
  exceptionColumnHeader = [];
  exceptionColumnField = [];
  ColumnLengthException: any;
  showPaginatorException: boolean;

  onboardTableData = [];
  columnsForonboard = [];
  onboardColumnHeader = [];
  onboardColumnField = [];
  ColumnLengthonboard: any;
  showPaginatoronboard: boolean;

  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  filterDataTotal: any[];

  selectedMonth = 'Current Month'
  months: string[];
  selectDate: Date;
  displayYear;
  lastYear: number;
  isDesktop: boolean;

  constructor(
    private chartsService: ChartsService,
    private dataService: DataService,
    private SpinnerService: NgxSpinnerService,
    private ImportExcelService: ImportExcelService,
    private router : Router,
    private datePipe : DatePipe,
    private dateFilterService: DateFilterService,
  ) {}

  ngOnInit(): void {
    if(this.dataService.configData?.vendorInvoices){
      this.viewType = this.chartsService.vendorTabs;
      this.isDesktop = this.dataService.isDesktop;
      // this.readExceptionData();
      this.prepareColumns();
      this.dateRange();
      if (this.router.url.includes('/vendorBasedReports/processReports')) {
        this.viewType = 'Process';
      } else if(this.router.url.includes('/vendorBasedReports/exceptionReports')){
        this.viewType = 'Exception';
      } else if(this.router.url.includes('/vendorBasedReports/emailExceptionReports')){
        this.viewType = 'emailException';
        this.readEmailExceptionData('');
      }else {
        this.viewType = 'onboarded';
        this.readOnboardedData('');
        this.getDate();
      }
    } else {
      history.back();
    }
  }

  // changing tabs
  choosepageTab(value) {
    this.viewType = value;
    this.chartsService.vendorTabs = value;
    if (value == 'Process') {
      this.router.navigate(['/customer/home/vendorBasedReports/processReports']);
    } else if(value == 'Exception') {
      this.router.navigate(['/customer/home/vendorBasedReports/exceptionReports']);
    } else if(value == 'emailException') {
      this.readEmailExceptionData('');
      this.router.navigate(['/customer/home/vendorBasedReports/emailExceptionReports']);
    } else if(value == 'onboarded') {
      this.router.navigate(['/customer/home/vendorBasedReports/onboardedReports']);
      this.readOnboardedData('');
    }
  }

  prepareColumns() {
    this.columnsForException = [
      { dbColumnname: 'Filename', columnName: 'File Name' },
      { dbColumnname: 'EmailSender', columnName: 'Sender' },
      { dbColumnname: 'Exception', columnName: 'Exception Type' },
      // { dbColumnname: 'EntityName', columnName: 'Entity' },
      { dbColumnname: 'UploadedDate', columnName: 'Upload Date' },
    ];

    this.columnsForonboard = [
      { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'OnboardingStatus', columnName: 'Onboarded Status' },
      { dbColumnname: 'CreatedOn', columnName: 'Onboarded Date' },
      { dbColumnname: 'firstName', columnName: 'Created by' },
      { dbColumnname: 'UpdatedOn', columnName: 'Last updated' },
    ];

    this.columnsForException.forEach((e) => {
      this.exceptionColumnHeader.push(e.columnName);
      this.exceptionColumnField.push(e.dbColumnname);
    });

    this.columnsForonboard.forEach((e) => {
      this.onboardColumnHeader.push(e.columnName);
      this.onboardColumnField.push(e.dbColumnname);
    });

    this.ColumnLengthException = this.columnsForException.length;
    this.ColumnLengthonboard = this.columnsForonboard.length;
  }

  // readExceptionData() {
  //   this.SpinnerService.show();
  //   this.chartsService.getvendorExceptionSummary().subscribe((data) => {
  //     console.log(data);
  //     this.exceptionData = data;
  //     this.SpinnerService.hide();
  //   },(err)=>{
  //     this.SpinnerService.hide();
  //   });
  // }

  readEmailExceptionData(filter){
    this.chartsService.getEmailExceptionSummary(filter).subscribe((data:any)=>{
      this.exceptionTableData = data.data;
      this.filterDataTotal = this.exceptionTableData;
      if(this.exceptionTableData.length >10){
        this.showPaginatorException = true;
      }
    })
  }

  readOnboardedData(filter){
    this.SpinnerService.show();
    this.chartsService.getOnbordedData(filter).subscribe((data:any)=>{
      this.onboardTableData = data.data;
      this.SpinnerService.hide();
      if(this.onboardTableData.length >10){
        this.showPaginatoronboard = true;
      }
    },err=>{
      this.SpinnerService.hide();
    })
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  filterByDate(date) {
    // if(date != ''){
    //   let frmDate:any = this.datePipe.transform(date[0], "yyyy-MM-dd");
    //   let toDate:any = this.datePipe.transform(date[1], "yyyy-MM-dd");
    //   this.exceptionTableData = this.filterDataTotal;
    //   this.exceptionTableData = this.exceptionTableData.filter((element) => {
    //     const dateF = new Date(element.UploadedDate).toISOString().split('T');
    //     console.log(dateF[0],frmDate,toDate)
    //     return (dateF[0] >= frmDate && dateF[0] <= toDate)
    //   });
    //   if(this.exceptionTableData.length >10){
    //     this.showPaginatorException = true;
    //   }
    //  } else {
    //   this.exceptionTableData = this.filterDataTotal;
    //  }

    let dateFilter = '';
    if(date != ""){
      let frmDate:any = this.datePipe.transform(date[0], "yyyy-MM-dd");
      let toDate:any = this.datePipe.transform(date[1], "yyyy-MM-dd");
      dateFilter = `?date=${frmDate}To${toDate}`;
    }
    if(this.viewType == 'emailException'){
      this.readEmailExceptionData(dateFilter);
    } else if (this.viewType == 'onboarded'){
      // this.readOnboardedData(dateFilter);
    }
  }
  clearDates(){
    this.filterByDate('')
  }
  getDate() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let today = new Date();
    let month = today.getMonth();
    this.selectedMonth = this.months[month];
    let year = today.getFullYear();
    this.lastYear = year - 5;
    this.displayYear = `${this.lastYear}:${year}`;
    let prevYear = year - 5;

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(prevYear);

    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear(year);
  }
  applyMonthfilter(month){
    let monthIndex = month.getMonth()+1;
    let dateFilter = `?month=${monthIndex}`;
    this.readOnboardedData(dateFilter);

  }

  downloadReport(){
    if(this.viewType == 'onboarded') {
      this.ImportExcelService.exportExcel(this.onboardTableData);
    }
  }
}
