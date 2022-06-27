import { ToastService } from 'src/app/services/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { EquipmentAbm } from '../../models/equipments/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { PreviewComponent } from './preview/preview.component';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class UploadFileComponent extends BaseComponent implements OnInit {

  public files: any[] = [];
  public excelData: any[] = [];
  public isHovering: boolean;
  public isDisabled: boolean;

  @ViewChild('fileDropRef') filesUploaded: ElementRef;
  @Input() isMultiFile: boolean;

  constructor(
    private equipmentService: EquipmentService,
    private toastService: ToastService,
    private dialog:MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.isDisabled = true;
  }

  public onFileChange(files: FileList): void{
    let message: string = '';
    const extension = files[0].name.split('.')[1];
    if (extension.toUpperCase() !== 'XLSX') {
      this.toastService.showError("Solo se pueden procesar archivos con extension '.xlsx'.");
      throw new Error(message);
    }

    if (files.length !== 1) {
      this.toastService.showError("Solo se puede procesar un archivo.");
      throw new Error(message);
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, {type: 'binary', cellText:false, cellDates:true});
      const wsName : string = workbook.SheetNames[0];
      const ws: XLSX.WorkSheet = workbook.Sheets[wsName];
      this.excelData = XLSX.utils.sheet_to_json(ws, {header: 0, raw:false, dateNF:'yyyy/mm/dd'});
      console.log(this.excelData);

      const data2 = XLSX.utils.sheet_to_json(ws, {header: 0, raw:false, dateNF:'yyyy/mm/dd'});
      console.log(data2);
    };

    reader.readAsBinaryString(files[0]);
    this.prepareFilesList(files);
  }

  //UPLOAD EQUIPMENT FILE
  public loadExcelFile(){
    const equipments = new Array<EquipmentAbm>();
    for (const row of this.excelData) {
      const equipment = new EquipmentAbm();
      equipment.type = row.equipo;
      equipment.brand = row.marca;
      equipment.model = row.modelo;
      equipment.serial = row.serial;
      equipment.inServices = row.inService;
      equipment.district = row.distrito;
      equipment.completeData();
      equipments.push(equipment);
    }

    this.saveCreateList(equipments);
  }

  private saveCreateList(equipments: Array<EquipmentAbm>) {
    this.equipmentService.createList(equipments)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        this.deleteFile(0);
        this.toastService.showSuccess('Se procesaron los registros correctamente.');
      }, error => {
        console.error(error);
        this.toastService.showError('Ocurrió un error al intentar procesar la solicitud.');
        this.deleteFile(0);
      });
  }

  public fileBrowseHandler(files){
    this.prepareFilesList(files);
  }

  public deleteFile(index: number){
    this.files.splice(index, 1);
    this.excelData = [];
    this.filesUploaded.nativeElement.value = null;
    this.isDisabled = true;
  }

  public uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        this.isDisabled = false;
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 10;
          }
        }, 200);
      }
    }, 200);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  prepareFilesList(files: any) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }

    this.uploadFilesSimulator(0);
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    this.onFileChange(files);
  }

  public openPreviewDialog(){
    this.dialog.open(PreviewComponent, {
      data: this.excelData
    });
  }
}
