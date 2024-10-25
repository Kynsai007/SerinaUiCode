import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/services/dataStore/data.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { ServiceInvoiceService } from 'src/app/services/serviceBased/service-invoice.service';
import { SharedService } from 'src/app/services/shared.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Calendar } from 'primeng/calendar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-process-reports',
  templateUrl: './process-reports.component.html',
  styleUrls: ['./process-reports.component.scss'],
})
export class ProcessReportsComponent implements OnInit {
  vendorsData = [];
  invoiceAmountData: any;
  invoiceAgechartData: any;
  invoiceBysourceChartdata: any;
  entity: any;
  invCountByvendor: any;
  vendorSummary: any;
  totalUploaded: number;
  invoicedInERP: number;
  rejectedCount: number;
  pendingCount: number;
  errorCount: number;
  uploadTime:any;
  sourceData = [];
  noDataPAboolean: boolean;
  noDataVndrCountboolean: boolean;
  noDataAgeboolean: boolean;
  noDataSourceboolean: boolean;

  vendorsSubscription : Subscription;

  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  filterData: any[];
  filteredVendors: any;

  selectedVendor = 'ALL';
  selectedSourceValue = 'ALL';
  selectedEntityValue = 'ALL';
  selectedDateValue = '';
  selectedVendorValue: any;
  invoiceByEntityChartdata = [];
  noDataSourceEntityboolean: boolean;
  pagesByEntityChartdata:any;
  noDataSourcePagesEntityboolean: boolean;

  totalTableData = [];
  columnsForTotal = [];
  totalColumnHeader = [];
  totalColumnField = [];
  ColumnLengthtotal: any;
  showPaginatortotal: boolean;

  poinfoTabledata = [];
  columnsForPoInfo = [];
  showPaginatorPOinfo:boolean;
  poInfoColumnField = [];
  ColumnLengthPoInfo:number;

  cardsArr = [
    { title: 'Total Uploaded' , count:0, image:'vendor_up' },
    { title: 'Invoiced in ERP' , count:0, image:'vendor_pr' },
    { title: 'Pending' , count:0, image:'vendor_rm' },
    { title: 'Rejected' , count:0, image:'vendor_rej' },
    { title: 'Exceptions' , count:0, image:'vendor_err' },
    { title: 'Average Upload Time' , count:0, image:'vendor_rm' },]
  @ViewChild('datePicker') datePicker: Calendar;
  @ViewChild('filterForm') filterForm:NgForm;
  filteredEnt: any;

  constructor(
    private chartsService: ChartsService,
    private sharedService: SharedService,
    private serviceProviderService: ServiceInvoiceService,
    private dataService : DataService,
    private dateFilterService: DateFilterService,
    private SpinnerService: NgxSpinnerService,
    private datePipe: DatePipe,
    private ImportExcelService: ImportExcelService
  ) {}

  ngOnInit(): void {
    this.readInvSummmary('');
    this.readVendors();
    this.readSource();
    this.chartsData();
    this.dateRange();
    this.prepareColumns();
    this.getEntitySummary();
    this.readvendorAmount('');
    this.readInvCountByVendor('');
    this.readInvCountBySource('');
    this.readInvAgeReport('');
    this.readInvCountByEntity('');
    this.readPOSummary('');
    // this.readPageCountByEntity('');

    setTimeout(() => {
      this.setConatinerForCharts();
    }, 2000);
  }

  setConatinerForCharts() {
    if (this.invoiceAmountData.length > 1) {
      this.noDataPAboolean = false;
      this.chartsService.drawLineChart(
        'vendor_line_chart',
        this.invoiceAmountData
      );
    } else {
      this.noDataPAboolean = true;
    }
    if (this.invCountByvendor.length > 1) {
      this.noDataVndrCountboolean = false;
      this.chartsService.drawStackedChart('stack_chart', this.invCountByvendor);
    } else {
      this.noDataVndrCountboolean = true;
    }
    if (this.invoiceAgechartData.length > 1) {
      this.noDataAgeboolean = false;
      this.chartsService.drawColumnChart(
        'vendor_clm_chart1',
        '#8F98B1',
        'Ageing Report',
        this.invoiceAgechartData
      );
    } else {
      this.noDataAgeboolean = true;
    }
    if (this.invoiceBysourceChartdata.length > 1) {
      this.noDataSourceboolean = false;
      this.chartsService.drawPieChart(
        'pie_chart',
        'Invoice Count by Source Type',
        this.invoiceBysourceChartdata
      );
    } else {
      this.noDataSourceboolean = true;
    }
    // if (this.invoiceByEntityChartdata.length > 1) {
      // this.noDataSourceEntityboolean = false;
    //   this.chartsService.drawPieChart(
    //     'pie_chart_entity',
    //     'Invoice Count by Entity',
    //     this.invoiceByEntityChartdata
    //   );
    // } else {
    //   this.noDataSourceEntityboolean = true;
    // }

    if (this.pagesByEntityChartdata.length > 1) {
      this.noDataSourcePagesEntityboolean = false;
        this.chartsService.drawColumnChart(
          'column_chart_entity_pages',
          '#ECB390',
          'Invoice page Count by Entity',
          this.pagesByEntityChartdata
        );
      } else {
        this.noDataSourcePagesEntityboolean = true;
      }
  }

  prepareColumns(){
    this.columnsForTotal = [
      { field: 'EntityName', header: 'Entity' },
      { field: 'count', header:'Invoice Count'},
      { field: 'pagecount', header:'Pages Count'}
    ];

    this.columnsForPoInfo = [
      { field: 'VendorName', header: 'Vendor' },
      { field: 'pocount', header:'PO Count'},
      { field: 'grncount', header:'Received'},
      { field: 'invoicecount', header:'Invoiced'}
    ];

    this.columnsForTotal.forEach((e) => {
      this.totalColumnHeader.push(e.header);
      this.totalColumnField.push(e.field);
    });
    this.columnsForPoInfo.forEach((e) => {
      this.poInfoColumnField.push(e.field);
    });

    this.ColumnLengthtotal = this.columnsForTotal.length;
    this.ColumnLengthPoInfo = this.columnsForPoInfo.length;
  }

  readVendors() {
    this.sharedService.getVendorUniqueData(`?offset=1&limit=100`).subscribe((data: any) => {
      let vendorData = [];
      const all_vendor_obj = {
        VendorCode : null,
        VendorName : 'ALL',
      }
      vendorData.unshift(all_vendor_obj);
      this.vendorsData = vendorData;
    });
  }

  filterVendor(event) {
    let query = event.query.toLowerCase();
    if(query != ''){
      this.sharedService.getVendorUniqueData(`?offset=1&limit=100&ven_name=${query}`).subscribe((data:any)=>{
        this.filteredVendors = data;
      });
    } else {
      this.filteredVendors = this.vendorsData;
    }
  }


  selectVendor(event){
    this.selectedVendorValue = event;
    this.selectedVendor = event.VendorName;
  }

  chartsData() {
    this.invoiceAmountData = [
      ['Vendor', 'Amount',{type: 'string', role: 'annotation'}]
    ];
    this.invoiceAgechartData = [
      ['age', 'InvoiceCount']
    ];

    this.invoiceBysourceChartdata = [
      ['Source', 'Count']
    ];

    this.pagesByEntityChartdata = [
      ['Entity', 'Count']
    ]
    this.invCountByvendor = [
      ['Vendor', 'Invoices']
    ];
  }

  getEntitySummary() {
    this.serviceProviderService.getSummaryEntity().subscribe((data: any) => {
      this.entity = data.result;
      this.entity.unshift({idEntity:'ALL',EntityName:'ALL'});
      this.filteredEnt = this.entity;
    });
  }
  selectEntityFilter(e) {
    this.selectedEntityValue = e.idEntity;
  }
  filterEntity(event){
    this.filteredEnt = this.dataService.uni_filter(this.entity,'EntityName',event);
  }

  readSource(){
    this.sourceData = [
      { id: 1, sourceType: 'Web' },
      { id: 2, sourceType: 'Mail' },
      { id: 3, sourceType: 'SharePoint' },
      { id: 4, sourceType: 'WhatsApp' },
      { id: 5, sourceType: 'API'}
    ];
  }
  selectedSource(e){
    this.selectedSourceValue = e;
    // let source = '';
    // if(e != ""){
    //   source = `?source=${e}`
    // } 
    // this.chartsData();
    // this.readInvSummmary(source);
    // this.readvendorAmount(source);
    // this.readInvCountByVendor(source);
    // this.readInvCountBySource(source);
    // this.readInvAgeReport(source);
    // this.getEntitySummary();
    // this.selectedVendor = '';
    // setTimeout(() => {
    //   this.setConatinerForCharts();
    // }, 500);
  }
  readInvCountByEntity(filter) {
    this.SpinnerService.show();
    this.chartsService.getInvoiceCountByEntity(filter).subscribe(
      (data: any) => {
        // data.data?.VendorBased.forEach((element) => {
        //   this.invoiceByEntityChartdata[0] = ['Entity', 'Count'];
        //   this.invoiceByEntityChartdata.push([element.EntityName, element.count]);
        // });
        this.invoiceByEntityChartdata = data.data?.VendorBased;
        this.SpinnerService.hide();
      },
      (err) => {
        this.SpinnerService.hide();
      }
    );
  }
  readPOSummary(filter) {
    this.SpinnerService.show();
    this.chartsService.getPOSummary(filter).subscribe(
      (data: any) => {
        this.poinfoTabledata = data?.data;
        this.SpinnerService.hide();
      },
      (err) => {
        this.SpinnerService.hide();
      }
    );
  }
  // readPageCountByEntity(filter) {
  //   this.SpinnerService.show();
  //   this.chartsService.getPagesCountByEntity(filter).subscribe(
  //     (data: any) => {
  //       data.data?.VendorBased?.forEach((element) => {
  //         this.pagesByEntityChartdata[0] = ['Entity', 'Count'];
  //         this.pagesByEntityChartdata.push([element.EntityName, element.count]);
  //       });
  //       this.SpinnerService.hide();
  //     },
  //     (err) => {
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }
  readInvCountByVendor(filter) {
    this.SpinnerService.show();
    this.chartsService.getInvoiceCountByVendorData(filter).subscribe((data: any) => {
      data.data.forEach((element) => {
        this.invCountByvendor[0] = ['Vendor','rejected','Invoices'];
        this.invCountByvendor.push([element.VendorName,0, element.count]);
      });
      this.readRejectedInvCountByVendor(filter);
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    });
  }
  readRejectedInvCountByVendor(filter) {
    this.SpinnerService.show();
    this.chartsService.getRejectInvoicesCount(filter).subscribe((data: any) => {
      data.data.forEach((element) => {
        this.invCountByvendor[0] = ['Vendor','Rejected', 'Invoices'];
        this.invCountByvendor.forEach(val=>{
          if(element.VendorName == val[0]){
            val[1] = element.count;
            val[2] = Number(val[2]) - Number(element.count);
          } else if(val[1] == undefined){
            val[1] = 0;
          }
        });
      });
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    });
  }

  readInvCountBySource(filter) {
    this.SpinnerService.show();
    this.chartsService.getInvoiceCountBySource(filter).subscribe((data: any) => {
      data.data.forEach((element) => {
        if (element.sourcetype != null) {
          this.invoiceBysourceChartdata.push([
            element.sourcetype,
            parseInt(element.count),
          ]);
        }
        this.SpinnerService.hide();
      });
    }, err=>{
      this.SpinnerService.hide();
    });
  }
  readvendorAmount(filter) {
    this.SpinnerService.show();
    this.chartsService.getPendingInvByAmount(filter).subscribe((data: any) => {
      data.data.forEach((element) => {
        let amount = this.convertToKM(element.amount)
        this.invoiceAmountData.push([
          element.VendorName,
          parseInt(element.amount),amount
        ]);
      });
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    });
  }
  readInvAgeReport(filter) {
    this.SpinnerService.show();
    this.chartsService.getAgeingReport(filter).subscribe((data: any) => {
      for (const count in data.data) {
        this.invoiceAgechartData.push([count, parseInt(data.data[count])]);
      }
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    });
  }

  readInvSummmary(filter) {
    this.SpinnerService.show();
    this.chartsService.getvendorBasedSummary(filter).subscribe((data: any) => {
      this.vendorSummary = data?.data;
      if(this.vendorSummary){
        this.cardsArr[0].count = this.vendorSummary?.totaluploaded[0]?.count;
        this.cardsArr[1].count = this.vendorSummary?.erpinvoice[0]?.count;
        this.cardsArr[2].count= this.vendorSummary?.pending[0]?.count;
        this.cardsArr[3].count = this.vendorSummary?.rejected[0]?.count;
        this.cardsArr[4].count = this.vendorSummary?.errorinv[0]?.count;
        this.cardsArr[5].count = this.vendorSummary?.avguptime;
      }
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    });
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }
  selectedDates(date){
    const date1 = this.datePipe.transform(date[0], 'yyyy-MM-dd');
    const date2 = this.datePipe.transform(date[1], 'yyyy-MM-dd');
    if(date1 && date2){
      if (this.datePicker.overlayVisible) {
        this.datePicker.hideOverlay();
      }
    }
  }

  filterByDate(date) {
    this.selectedDateValue = '';
    let queryParams: any = {};
    let date1: any, date2: any;
  
    if (date && date.length) {
      date1 = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      date2 = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      if (this.datePicker?.overlayVisible) {
        this.datePicker.hideOverlay();
      }
      this.selectedDateValue = date;
      queryParams.date = `${date1}To${date2}`;
    }
  
    // Set query parameters based on selected values
    if (this.selectedVendor !== 'ALL') {
      queryParams.vendor = encodeURIComponent(this.selectedVendor);
    }
    if (this.selectedEntityValue !== 'ALL') {
      queryParams.entity = this.selectedEntityValue;
    }
    if (this.selectedSourceValue !== 'ALL') {
      queryParams.source = this.selectedSourceValue;
    }
  
    // Build the query string
    const query = Object.keys(queryParams)
      .map(key => `${key}=${queryParams[key]}`)
      .join('&');
    let queryP = ''
    if(query != ''){
      queryP = `?${query}`;
    }
    // Trigger data fetching methods
    this.chartsData();
    this.readInvSummmary(queryP);
    this.readvendorAmount(queryP);
    this.readInvCountByVendor(queryP);
    this.readInvCountBySource(queryP);
    this.readInvAgeReport(queryP);
    this.readInvCountByEntity(queryP);
    this.readPOSummary(queryP);
  
    // Close the dialog and reset charts container
    this.closeDialog();
    setTimeout(() => {
      this.setConatinerForCharts();
    }, 1000);
  }
  
  clearDates(){
    this.selectedDateValue = '';
  }

  downloadReport(data){
      this.ImportExcelService.exportExcel(data);
  }
  convertToKM(value: number): string {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return (value / 1000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "M";
    } else if (absValue >= 1000) {
      return (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "k";
    } else {
      return value.toLocaleString();
    }
  }

  openFilterDialog(event){
    let top = event.clientY + 10 + "px";
    let left;
    if(this.dataService.isDesktop){
      left = "calc(55% + 100px)";
    } else {
      // left = "calc(55% + 100px)";
    }
    const dialog = document.querySelector('dialog');
    dialog.style.top = top;
    dialog.style.left = left;
    if(dialog){
      dialog.showModal();
    }
  }

  closeDialog(){
    const dialog = document.querySelector('dialog');
    if(dialog){
      dialog.close();
    }
  }
  clearFilter(){
    this.filterForm.control.reset();
    this.selectedVendor = 'ALL';
    this.selectedSourceValue = 'ALL';
    this.selectedEntityValue = 'ALL';
  }
}
