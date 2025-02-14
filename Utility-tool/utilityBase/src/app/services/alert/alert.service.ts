import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AppNotificationComponent } from 'src/app/utility/components/app-notification/app-notification.component';
import { SharedService } from '../shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  snackBarRef: MatSnackBarRef<any>;
  constructor(private _snackBar:MatSnackBar,
    private sharedService: SharedService
  ) { }
  openCustomSnackbar(img:string,t_head:string,t_foot:string,bg_clr:string) {
    const position: MatSnackBarHorizontalPosition = 'right';
    const verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    const snackBarRef: MatSnackBarRef<any> = this._snackBar.openFromComponent(AppNotificationComponent, {
      duration: 5000,
      data: { image:img, text_header: t_head, text_foot:t_foot,bg_color:bg_clr },
      horizontalPosition: position,
      verticalPosition: verticalPosition,
      panelClass: ['custom_snackbar'],
    });
    this.sharedService.snackBarRef = snackBarRef;
  }
  
  success_alert(msg){
    this.openCustomSnackbar('/assets/Group 1391.svg','Hurray!',msg,'#14BB12');
  }
  error_alert(msg){
    this.openCustomSnackbar('/assets/Group 1599.svg',"Oops!",msg,'#FF5858');
  }
  update_alert(msg){
    this.openCustomSnackbar('/assets/Group 1599.svg',"Suggestion",msg,'#B2B2B2');
  }
}
