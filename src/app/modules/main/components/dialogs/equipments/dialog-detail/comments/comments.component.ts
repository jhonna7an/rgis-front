import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { ToastService } from './../../../../../../shared/services/toast.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from './../../../../../services/comment.service';
import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { EquipmentComment } from 'src/app/modules/main/models/equipments/equipment-comment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentComponent extends BaseComponent implements OnInit {

  private _equipmentId: number;
  public commentsForm: FormGroup;
  public equipmentComments: EquipmentComment[];

  @ViewChildren('input') rows: ElementRef;

  @Input()
  set equipmentId(value: number){
    if (value) {
      this._equipmentId = value;
      this.commentService.get(value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: EquipmentComment[]) => {
          this.equipmentComments = response;
          this.patchForm();
        });
    }
  }

  get equipmentId(): number {
    return this._equipmentId;
  }

  constructor(
    private commentService: CommentService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.commentsForm = this.formBuilder.group({
      comments: this.formBuilder.array([])
    });
  }

  get comments(): FormArray{
    return this.commentsForm.get('comments') as FormArray;
  }

  patchForm(){
    this.equipmentComments.forEach(x => {
      this.comments.push(this.formBuilder.group({
        comment: [x.comment, Validators.required],
        isNewComment: [false],
        edit: [true],
        save: [false],
        input: [false]
      }))
    });
    console.log(this.comments);

  }

  public add() {
    const comment = this.formBuilder.group({
      comment: ['', Validators.required],
      isNewComment: [true],
      edit: [false],
      save: [true],
      input: [true]
    });

    this.comments.push(comment);
  }

  public remove(index: number, isNewComment: boolean){
    if (!isNewComment) {
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        width: '400px'
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          console.log(result);
          if (result) {
            this.comments.removeAt(index);
          }
        });
    } else {
      this.comments.removeAt(index);
    }
  }

  public submit(value: any): void{
    if (this.commentsForm.valid) {
      console.log(value);
      if (value.isNewComment) {
        this.create(value);
      }
      else{
        this.edit(value);
      }
    }
  }

  public enableEdit(formGroup: FormGroup){
    formGroup.controls['edit'].setValue(false);
    formGroup.controls['save'].setValue(true);
    formGroup.controls['input'].setValue(true);
  }

  private create(comment): void {
    this.commentService.create(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.toastService.showSuccess("Se completó el proceso correctamente.")
        }
      }, error => {
        console.error(error);
        this.toastService.showError("Se produjo un error al intentar procesar la solicitud.")
      });
  }

  private edit(comment: any): void {
    this.commentService.edit(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.toastService.showSuccess("Se completó el proceso correctamente.")
        }
      }, error => {
        console.error(error);
        this.toastService.showError("Se produjo un error al intentar procesar la solicitud.")
      });
  }

  private delete(){
    this.commentService.delete(this.equipmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.toastService.showSuccess("Se completó el proceso correctamente.")
        }
      }, error => {
        console.error(error);
        this.toastService.showError("Se produjo un error al intentar procesar la solicitud.")
      });
  }
}
