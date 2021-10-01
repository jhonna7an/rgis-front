import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { ToastService } from './../../../../../../shared/services/toast.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from './../../../../../services/comment.service';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChildren } from '@angular/core';
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

  public isLoading: boolean;

  @ViewChildren('input') rows: ElementRef;

  @Input()
  set equipmentId(value: number){
    if (value) {
      this._equipmentId = value;
      this.getComments(value);
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
    this.isLoading = true;
    this.commentsForm = this.formBuilder.group({
      comments: this.formBuilder.array([])
    });
  }

  get comments(): FormArray{
    return this.commentsForm.get('comments') as FormArray;
  }

  public getComments(equipmentId: number): void {
    this.commentService.get(equipmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentComment[]) => {
        this.equipmentComments = response;
        this.patchForm();
        this.isLoading = false;
        this.commentService.setComments(response);
        this.commentService.triggerCommentsLoaded();
      });
  }

  patchForm(): void{
    this.comments.clear();
    this.equipmentComments.forEach(x => {
      this.comments.push(this.formBuilder.group({
        id: [x.id],
        comment: [x.comment, Validators.required],
        modificationDate: [x.modificationDate],
        modificationUser: [x.modificationUser],
        isNewComment: [false],
        edit: [true],
        save: [false],
        input: [false]
      }));
    });
  }

  public add(): void {
    const comment = this.formBuilder.group({
      id: [''],
      comment: ['', Validators.required],
      isNewComment: [true],
      modificationDate: [''],
      modificationUser: [''],
      edit: [false],
      save: [true],
      input: [true]
    });

    this.comments.push(comment);
  }

  public remove(index: number, value: any): void{
    if (!value.isNewComment) {
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        width: '400px'
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            const comment = this.equipmentComments.find(c => c.id === value.id);
            this.delete(comment.id);
            this.comments.removeAt(index);
          }
        });
    } else {
      this.comments.removeAt(index);
    }
  }

  public submit(formGroup: any): void{
    console.log(formGroup);

    if (formGroup.valid) {
      const comment = new EquipmentComment();
      if (formGroup.value.isNewComment) {
        comment.setByFormToCreate(formGroup.value, this.equipmentId, 1);
        this.create(comment);
      } else {
        const commentMatch = this.equipmentComments.find(c => c.id === formGroup.value.id);
        comment.setByFormToEdit(commentMatch, formGroup.value, 1);
        this.edit(comment);
      }
    }
  }

  public enableEdit(index: number, formGroup: FormGroup): void {
    formGroup.controls['edit'].setValue(false);
    formGroup.controls['save'].setValue(true);
    formGroup.controls['input'].setValue(true);

    this.comments.controls.forEach((control, i) => {
      if (i !== index) {
        (control as FormGroup).controls['input'].setValue(false);
        (control as FormGroup).controls['save'].setValue(false);
        (control as FormGroup).controls['edit'].setValue(true);
      }
    });
  }

  public cancel(formGroup: FormGroup): void{
    formGroup.controls['edit'].setValue(true);
    formGroup.controls['save'].setValue(false);
    formGroup.controls['input'].setValue(false);
  }

  private create(comment: EquipmentComment): void {
    this.commentService.create(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.toastService.showSuccess('El proceso se completó correctamente');
          this.getComments(this.equipmentId);
        }
      }, error => {
        console.error(error);
        this.toastService.showError('Se produjo un error al intentar procesar la solicitud');
      });
  }

  private edit(comment: EquipmentComment): void {
    this.commentService.edit(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.toastService.showSuccess('El proceso se completó correctamente');
          this.getComments(this.equipmentId);
        }
      }, error => {
        console.error(error);
        this.toastService.showError('Se produjo un error al intentar procesar la solicitud');
      });
  }

  private delete(id: number): void{
    this.commentService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.toastService.showSuccess('El proceso se completó correctamente');
          this.getComments(this.equipmentId);
        }
      }, error => {
        console.error(error);
        this.toastService.showError('Se produjo un error al intentar procesar la solicitud');
      });
  }
}
