import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/dataStore/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  constructor(private dataService: DataService,private router: Router) { }
  ServiceError:boolean;
  ngOnInit(): void {
    this.ServiceError = this.dataService.isServiceLive;
  }
  onRefresh(){
    this.router.navigate(['/login']);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
