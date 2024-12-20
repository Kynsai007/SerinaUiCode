import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  isImgBoolean;
  isLoaded:boolean;
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  zoomX = 1;
  orgX = '0px';
  orgY = '0px';
  showInvoice: any;
  content_type: any;
  imageCanvas: HTMLImageElement;
  isPdfAvailable: boolean;
  zoomVal: number = 0.8;
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
    this.imageCanvas.src = this.showInvoice;
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
    console.log(event);
    const files = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.showInvoice = e.target.result;
        if (this.file.type === 'application/pdf') {
          this.isImgBoolean = false;
          this.loadPDFtest(this.showInvoice);
        } else if (this.file.type === 'text/html') {
          // this.loadHTML(this.showInvoice);
        } else {
          console.log(this.file.type)
          this.isImgBoolean = true;
          this.loadImage();
        }
      };
      reader.readAsDataURL(this.file);
    }
  }

  loadPDFtest(fileUrl: string): void {
    // Implement the logic to load and display the PDF
    // console.log('Loading PDF from URL:', fileUrl);
  }
}
