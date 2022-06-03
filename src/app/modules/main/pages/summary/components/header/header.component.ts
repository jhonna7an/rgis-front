import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SummarySubject } from '../../subjects/summary.subject';

import { Country } from '../../../../../shared/models/management/country.model';
import { District } from 'src/app/models/district.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public name$: Observable<string>;

  constructor(
    private summarySubject: SummarySubject
  ) { }

  ngOnInit(): void {
    this.name$ = this.summarySubject.getNameDetail();
  }
}
