import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OpenAIService } from 'src/app/services/openAI/open-ai.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-openai',
  templateUrl: './openai.component.html',
  styleUrls: ['./openai.component.scss']
})
export class OpenaiComponent implements OnInit {
  tags = [
    { Name: 'Tag 1', Description: 'tag1 Description', Ismandatory: true, isUsed: true }
  ];
  filterTags:any[];
  dialogList: any[];
  isImgBoolean;
  isLoaded:boolean;
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  zoomX = 1;
  orgX = '0px';
  orgY = '0px';
  showInvoice: string | null = null;
  content_type: any;
  imageCanvas: HTMLImageElement;
  isPdfAvailable: boolean;
  zoomVal: number = 0.8;
  zoom: number = 1;
  rotation = 0;
  page: number = 1;
  totalPages: number;
  panX: number;   
  panY: number;
  zoomdata: number = 1; 
  testingMode = false;
  file: File;
  file_url: string;
  dragging: boolean;
  isServiceProvider = false;
  isHeader = false;
  isTagDialog: boolean;
  prompt:string = '';
  constructor(private router: Router,
    private openAIService : OpenAIService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.applyFilters();
    // this.filterTags = this.tags;
    // this.dialogList = this.tags;
    this.readAllTags();
  }
  applyFilters() {
    this.router.navigate([], {
      queryParams: {
        isServiceProvider: this.isServiceProvider || null, 
        isHeader: this.isHeader || null,
      },
      queryParamsHandling: 'merge', 
    });
  }
  openFilterDialog(event,text){
    let top = event.clientY + 10 + "px";
    let left;
    if(text == 'tags'){
      this.isTagDialog = true;
      left = "calc(55% + 100px)";
    } else {
      this.isTagDialog = false;
      left = "calc(38% + 100px)";
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
  saveTags(){
    // this.sharedService.saveTags(this.tags);
  }
  searchTags(key){
    this.dialogList = this.filterTags;
    this.dialogList = this.dialogList.filter(el=> el.Name.toLowerCase().includes(key.toLowerCase()));
  }
  searchGlobalTags(key){
    this.tags = this.filterTags;
    this.tags = this.tags.filter(el=> el.Name.toLowerCase().includes(key.toLowerCase()));
  }
  checkTag(isChecked,tagData,tagName){
    console.log(tagData,tagName);
    let apiParams = {
      "tagid": 0,
      "isMandatory": true,
      "isActive": true,
      "isglobal": true,
      "description": "string"
    }

    apiParams.tagid = tagData.idDefaultFields;
    apiParams.isMandatory = tagData.Ismandatory || false;
    apiParams.isActive = tagData.isUsed || false;
    apiParams.isglobal = true;
    apiParams.description = tagData.Description|| '';
    if(tagName == 'Ismandatory'){
      apiParams.isMandatory = isChecked;
    } else if(tagName == 'isActive'){
      apiParams.isActive = isChecked;
    }
    console.log(apiParams);
    this.openAIService.updateTags(apiParams).subscribe((data)=>{
      console.log(data);
      this.readAllTags();
    }); 
  }
  loadImage() {
    if (this.isImgBoolean == true) {
      setTimeout(() => {
        this.zoomVal = 1;
        this.panX = 0;
        this.panY = 0;
        this.canvasRef.nativeElement.style.transform =
          'scale(' + this.zoomVal + ') translate(' + this.panX + 'px, ' + this.panY + 'px)';
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
        this.canvasRef.nativeElement.width = window.innerWidth;
        this.canvasRef.nativeElement.height = window.innerHeight;
        this.drawImagein();
        this.addEventListeners();
      }, 50);

    }
  }

  drawImagein() {
    this.imageCanvas = new Image();
    // this.imageCanvas.src = this.showInvoice;
    let imageWidth, imageHeight;
    this.imageCanvas.onload = () => {
      const imageAspectRatio = this.imageCanvas.width / this.imageCanvas.height;
      const canvasAspectRatio = this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height;

      if (imageAspectRatio > canvasAspectRatio) {
        imageWidth = this.canvasRef.nativeElement.width;
        imageHeight = imageWidth / imageAspectRatio;
      } else {
        imageHeight = this.canvasRef.nativeElement.height;
        imageWidth = imageHeight * imageAspectRatio;
      }
      this.ctx.drawImage(this.imageCanvas, 0, 0, imageWidth, imageHeight);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    };
  }

  addEventListeners() {
    this.canvasRef.nativeElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      const zoomFactor = 1.1;
      const zoom = this.zoomVal;
      if (delta < 0) {
        this.zoomVal = zoom * zoomFactor;
      } else {
        this.zoomVal = zoom / zoomFactor;
      }
      this.canvasRef.nativeElement.style.transform =
        'scale(' + this.zoomVal + ') translate(' + this.panX + 'px, ' + this.panY + 'px)';
      this.drawImagein();
    });

    this.canvasRef.nativeElement.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      const startZoom = this.zoomVal;
      const startPanX = this.panX;
      const startPanY = this.panY;

      const mouseMove = (e) => {
        e.preventDefault();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        this.panX = startPanX + (endX - startX) / startZoom;
        this.panY = startPanY + (endY - startY) / startZoom;
        this.canvasRef.nativeElement.style.transform =
          'scale(' + this.zoomVal + ') translate(' + this.panX + 'px, ' + this.panY + 'px)';
      };

      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    });
  }
  zoomIn() {
    if(this.isImgBoolean){
      this.zoomVal = this.zoomVal + 0.2;
      this.zoomX = this.zoomX + 0.05;
      this.orgX = this.orgX + '50px';
      this.orgY = this.orgY + '50px';
      if (this.zoomVal >= 2.0 && this.zoomX >= 2.0) {
        this.zoomVal = 1;
        this.zoomX = 1;
        this.orgX = '0px';
        this.orgY = '0px';
      }
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `translate(${this.orgX},${this.orgY})`;
    } else {
      this.zoomdata = this.zoomdata + 0.1;
    }
  }

  zoomOut() {
    if(this.isImgBoolean) {
      this.zoomVal = this.zoomVal - 0.2;
      this.zoomX = this.zoomX - 0.05;
      // this.orgX  = this.orgX - '50px';
      // this.orgY  = this.orgY - '50px';
      if (this.zoomVal <= 0.5 && this.zoomX <= 0.8) {
        this.zoomVal = 1;
        this.zoomX = 1;
        this.orgX = '0px';
        this.orgY = '0px';
      }
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `translate(${this.orgX},${this.orgY})`;
    } else {
      this.zoomdata = this.zoomdata - 0.1;
    }
  }
  afterLoadComplete(pdfData) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  // onDrop(event) {
  //   event.preventDefault();
  //   console.log(event);
  //   const files = event.dataTransfer.files;
  //   this.onFileChange(files);
  // }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.onFileChange(event.dataTransfer.files);
    }
  }
  onFileChange(event: any) {
    // const files = event.target.files;
    // if (files.length > 0) {
    //   this.file = files[0];
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.showInvoice = e.target.result;
    //     if (this.file.type === 'application/pdf') {
    //       this.isImgBoolean = false;
    //       this.loadPDFtest(this.showInvoice);
    //     } else if (this.file.type === 'text/html') {
    //       // this.loadHTML(this.showInvoice);
    //     } else {
    //       console.log(this.file.type)
    //       this.isImgBoolean = true;
    //       this.loadImage();
    //     }
    //   };
    //   reader.readAsDataURL(this.file);
    // }
    this.clearPreview();
    const fileInput = event.target.files || event;
    if (fileInput && fileInput?.length > 0) {
      const file = fileInput[0];

      // Validate file type
      if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
        alert('Unsupported file type. Please upload a PDF or an image.');
        return;
      }

       if (file?.type === 'application/pdf') {
          this.isImgBoolean = false;
          // this.loadPDFtest(this.showInvoice);
                // Read the file as a data URL
          const blob = new Blob([file], { type: file.type });
          this.showInvoice = URL.createObjectURL(blob);
        } else{
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.showInvoice = e.target.result;
            
            this.isImgBoolean = true;
            this.loadImage();
          };
          reader.readAsDataURL(file);

        }


    }
  }

    // Clean up the blob URL to avoid memory leaks
    clearPreview() {
      if (this.showInvoice) {
        URL.revokeObjectURL(this.showInvoice);
        this.showInvoice = null;
      }
    }

  loadPDFtest(fileUrl: string): void {
    // Implement the logic to load and display the PDF
    // console.log('Loading PDF from URL:', fileUrl);
  }
  updateCharacterCount(event){
    this.prompt = event.target.value;
    if (this.prompt.length > 250) {
      this.prompt = this.prompt.substring(0, 250);
      event.target.value = this.prompt;
    }
  }
  savePrompt(){
    let context = 'vendor';
    if(this.isServiceProvider){
      context = 'sp';
    }
    this.openAIService.updatePrompt(null,context,this.prompt).subscribe((data)=>{
      console.log(data);
      this.closeDialog();
    });
  }
  readAllTags(){
    let context = 'vendor';
    if(this.isServiceProvider){
      context = 'sp';
    }
    this.openAIService.readAllTags(null,context,!this.isHeader).subscribe((data)=>{
      this.tags = data.fields;
      this.prompt = data.tail_prompt;
      this.filterTags = this.tags;
    })
  }
  changeServiceProvider(){
    this.readAllTags();
  }
  changeHeader(){
    this.readAllTags();
  }
}
