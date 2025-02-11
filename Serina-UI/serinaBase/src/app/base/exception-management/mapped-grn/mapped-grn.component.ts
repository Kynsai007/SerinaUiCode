import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'mapped-grn',
  templateUrl: './mapped-grn.component.html',
  styleUrls: ['./mapped-grn.component.scss','../../invoice/view-invoice/view-invoice.component.scss']
})
export class MappedGRNComponent implements OnInit,OnChanges {
  @Input() grnTabDatalength:number;
  @Input() GRNTabData: any;
  currentlyOpenedItemIndex = -1;
  lineTableHeaders: string[];

  constructor(private SharedService: SharedService) { }

  ngOnInit(): void {
    

  }
  ngOnChanges(changes:SimpleChanges): void {
    if(changes.GRNTabData && changes.GRNTabData.currentValue) {
      Object?.keys(this.GRNTabData)?.forEach((element:any) => {
        this.GRNTabData[element]?.forEach(ele => {
          this.lineTableHeaders = Object?.keys(ele);
        })
      })
    }
  }
  // getGRNtabData() {
  //   this.SharedService.getGRNTabData().subscribe((data: any) => {
  //     this.GRNTabData = data?.result;
  //     this.grnTabDatalength = Object.keys(this.GRNTabData).length;
  //   })
  // }

  
  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
}
