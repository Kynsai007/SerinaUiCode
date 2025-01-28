import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-app-notification',
  templateUrl: './app-notification.component.html',
  styleUrls: ['./app-notification.component.scss']
})
export class AppNotificationComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  closeSnackBar(){
    this.sharedService.closeSnackbar();
  }

}
