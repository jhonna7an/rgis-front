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

    this.route.queryParams
      .subscribe(params => {
        this.confirmAccount(params.code, params.m, params.b);
      });
  }

  private confirmAccount(code: string, mail: string, badgeId: string): void {
    this.authService.setLoading(true);
    this.authService
      .confirmAccount(code, mail, badgeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actionResult.success("Se confirmó su cuenta correctamente", 'gpp_good');
      }, error => {
        console.log(error);
        const icon = error.status === 500 ? 'gpp_bad' : 'gpp_maybe';
        const class_name = error.status === 500 ? 'failed' : 'warning';
        this.actionResult.failed(error, icon, class_name);
      })
      .add(() => {
        this.authService.setLoading(false);
      });
  }
}
