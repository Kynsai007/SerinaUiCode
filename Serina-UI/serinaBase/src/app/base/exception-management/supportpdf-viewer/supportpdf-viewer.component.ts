import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-supportpdf-viewer',
  templateUrl: './supportpdf-viewer.component.html',
  styleUrls: ['./supportpdf-viewer.component.scss']
})
export class SupportpdfViewerComponent implements OnInit {
  srcFile:any;
  isImgBoolean:boolean;
  constructor(
    private d_ref :MatDialogRef<SupportpdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.srcFile = this.data.file;
  }

}
