import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-openai',
  templateUrl: './openai.component.html',
  styleUrls: ['./openai.component.scss']
})
export class OpenaiComponent implements OnInit {
  tags = [
    { name: 'Tag 1', description: 'tag1 description', isMandatory: true, isActive: true },
    { name: 'Tag 2', description: 'tag2 description', isMandatory: true, isActive: true },
    { name: 'Tag 3', description: 'tag3 description', isMandatory: true, isActive: true },
    { name: 'Tag 4', description: 'tag4 description', isMandatory: false, isActive: false },
    { name: 'Tag 5', description: 'tag5 description', isMandatory: true, isActive: false },
    { name: 'Tag 6', description: 'tag6 description', isMandatory: false, isActive: true },
    { name: 'Tag 7', description: 'tag7 description', isMandatory: false, isActive: true },
    { name: 'Tag 8', description: 'tag8 description', isMandatory: true, isActive: true },
    { name: 'Tag 9', description: 'tag9 description', isMandatory: false, isActive: true },
    { name: 'Tag 10', description: 'tag10 description', isMandatory: true, isActive: true },
    { name: 'Tag 11', description: 'tag11 description', isMandatory: false, isActive: false },
    { name: 'Tag 12', description: 'tag12 description', isMandatory: true, isActive: false },
    { name: 'Tag 13', description: 'tag13 description', isMandatory: true, isActive: true },
    { name: 'Tag 14', description: 'tag14 description', isMandatory: true, isActive: true },
    { name: 'Tag 15', description: 'tag15 description', isMandatory: false, isActive: true },
    { name: 'Tag 16', description: 'tag16 description', isMandatory: true, isActive: true },
    { name: 'Tag 17', description: 'tag17 description', isMandatory: true, isActive: true },
    { name: 'Tag 18', description: 'tag18 description', isMandatory: true, isActive: false },
    { name: 'Tag 19', description: 'tag19 description', isMandatory: true, isActive: true },
    { name: 'Tag 20', description: 'tag20 description', isMandatory: true, isActive: true },
  ];
  filterTags:any[];
  dialogList: any[];
  constructor() { }

  ngOnInit(): void {
    this.filterTags = this.tags;
    this.dialogList = this.tags;
  }
  openFilterDialog(event){
    let top = event.clientY + 10 + "px";
    let left;
      left = "calc(55% + 100px)";

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
  saveTags(){
    // this.sharedService.saveTags(this.tags);
  }
  searchTags(key){
    this.dialogList = this.filterTags;
    this.dialogList = this.dialogList.filter(el=> el.name.toLowerCase().includes(key.toLowerCase()));
  }
  searchGlobalTags(key){
    this.tags = this.filterTags;
    this.tags = this.tags.filter(el=> el.name.toLowerCase().includes(key.toLowerCase()));
  }
  checktag(isChecked,name){
    this.tags.forEach(el=>{
      if(el.name == name){
        el.isActive = isChecked;
      }
    })
    // this.sharedService.saveTags(this.tags);
  }
}
