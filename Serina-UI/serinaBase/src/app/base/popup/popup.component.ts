import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  POLineData = [];
  selectedPOLines = [];
  type: string;
  component: string;
  uploadBool: boolean = false;
  GRNData = [];
  po_num:string;
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private ES: ExceptionsService,
    private alert: AlertService,
    private message : MessageService,
    private spin: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    this.po_num = this.data.po_num
    let grn = this.data.grnLine;
    if (grn) {
      grn?.forEach(el => {
        let obj = { LineNumber: el.POLineNumber, grnpackagingid: el.PackingSlip };
        this.GRNData.push(obj);
      })
    }
    if (this.type == 'flip') {
      this.component = 'normal';
    } else if (this.type == 'flip line') {
      this.component = 'mapping';
    }
    if (this.data.comp == 'upload') {
      this.uploadBool = true;
    }
    this.POLineData = this.data.resp;
    this.POLineData.forEach(val => {
      val.isSelected = false;
    })
  }
  onSubmit(value) {
    this.spin.show();
    this.ES.flip_po(JSON.stringify(this.selectedPOLines)).subscribe((data: any) => {
      if (data?.result) {
        this.dialogRef.close();
        this.ES.popupmsg.next(this.component);
        this.alert.addObject.detail = "PO flip is successful"
        this.message.add(this.alert.addObject)
      } else {
        this.alert.errorObject.detail = data?.error
        this.message.add(this.alert.errorObject)
      }
      this.spin.hide();
    }, err => {
      this.alert.errorObject.detail = "Server error"
      this.message.add(this.alert.errorObject)
      this.spin.hide();
    })
  }
  onSelect(bool, data) {
    let id = data.LineNumber;
    data.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
    if (bool) {
      let boolean = this.selectedPOLines?.findIndex(el => el.LineNumber == data.LineNumber);
      if (boolean) {
        this.selectedPOLines.push(data);
      }
    } else {
      const ind = this.selectedPOLines?.findIndex(el => el.LineNumber == data.LineNumber);
      if (ind != -1) {
        this.selectedPOLines.splice(ind, 1)
      }
    }
  }
  onSelectAll(bool) {
    if (bool) {
      this.POLineData.forEach(val => {
        val.isSelected = true;
        let id = val.LineNumber;
        val.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
      })
      this.selectedPOLines = this.POLineData
    } else {
      this.selectedPOLines = [];
      this.POLineData.forEach(val => {
        val.isSelected = false;
      })
    }
  }
  changeQty(qty, lineid) {
    this.selectedPOLines.forEach(el => {
      if (el.LineNumber == lineid) {
        el.Quantity = qty;
      }
    })
  }
  onSubmitRequest(val) {
    console.log(val)
  }

  validateFlip() {
    this.spin.show();
    let obj = {
      Podata: this.selectedPOLines,
      GRNdata: this.GRNData
    }
    this.ES.validateFlipPO(JSON.stringify(obj),this.po_num).subscribe((data:string) => {
      console.log(data)
      if (data == 'success') {
        this.ES.popupmsg.next(this.component);
        this.alert.addObject.detail = "PO flip is successful";
        this.message.add(this.alert.addObject);
        this.dialogRef.close(this.selectedPOLines);
      } else {
        this.alert.errorObject.detail = data;
        this.message.add(this.alert.errorObject);
      }
      this.spin.hide();
    }, err => {
      this.alert.errorObject.detail = "Server error"
      this.message.add(this.alert.errorObject)
      this.spin.hide();
    });

  }

}
