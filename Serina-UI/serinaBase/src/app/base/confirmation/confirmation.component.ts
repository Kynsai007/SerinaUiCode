import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  componentTxt:string;
  typeOfDialog = 'confirmation';
  icon:string;
  heading:string;
  ngOnInit(): void {
    this.componentTxt = this.data.body;
    this.typeOfDialog = this.data.type;
    // this.icon = this.data?.icon;
    // this.heading = this.data?.heading;
  }
  closedialog(bool:boolean){
    this.dialogRef.close(bool)
  }

}
