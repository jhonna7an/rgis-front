import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnDestroy {

  destroy$: Subject<any> = new Subject();

  protected destroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnDestroy() {
      this.destroy();
  }

  ionViewWillLeave() {
      this.destroy();
  }
}
