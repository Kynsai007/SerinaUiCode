import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  menu_list = [
    { name: "Overview", route_name:"overview"},
    { name: "Workflow Analysis", route_name:"workflow_analysis"},
    { name: "Exception Analysis", route_name:"exception_analysis"},
    { name: "Customer Analysis", route_name:"customer_analysis"},
    { name: "Vendor Analysis", route_name:"vendor_analysis"},
    { name: "Spend Analysis", route_name:"spend_analysis"},
    { name: "Service Provider", route_name:"service_provider"},
  ];
  active_tab:string = "overview"
  constructor() {}

  ngOnInit(): void {}
  tabChange(name){
    this.active_tab = name;
  }
}
