import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionResult } from 'src/app/modules/auth/models/action-result.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent extends BaseComponent implements OnInit {

  public actionResult: ActionResult;
  public actionResolved: boolean = false;

  public loading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionResult = new ActionResult();
    this.loading$ = this.authService.getLoading();
    this.confirmAccount('asdad');

    // this.route.queryParams
    //   .subscribe(params => {
    //     this.confirmAccount(params.activationCode);
    //   });
  }

  private confirmAccount(activationCode: string): void {
    this.authService.setLoading(true);
    this.authService
      .confirmAccount(activationCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actionResult.success("Se confirmó su cuenta correctamente", '');
      }, error => {
        this.actionResult.failed("Ocurrió un error al intentar procesar la solicitud");
      })
      .add(() => {
        this.authService.setLoading(false);
      });
  }
}
