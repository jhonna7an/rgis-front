import { SpinnerService } from './../../../main/services/spinner.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  public isLoading$ = this.spinnerService.isLoading$;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }

}
