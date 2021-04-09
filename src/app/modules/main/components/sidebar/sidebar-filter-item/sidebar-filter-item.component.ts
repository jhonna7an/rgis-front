import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterData, FilterDetail } from '../../../models/pages/equipment-detail';

@Component({
  selector: 'app-sidebar-filter-item',
  templateUrl: './sidebar-filter-item.component.html',
  styleUrls: ['./sidebar-filter-item.component.css']
})
export class SidebarFilterItemComponent implements OnInit {

  public isTitleExpanded: boolean;
  public _filter: FilterDetail;

  @Input()
  public set filter(value: FilterDetail){
    if (value){
      this._filter = value;
    }
  }

  public get filter(): FilterDetail{
    return this._filter;
  }

  @Output() public sendFilter = new EventEmitter<FilterData>();

  constructor() {
    this.isTitleExpanded = true;
  }

  ngOnInit(): void {
  }

  public SetFilter = (group: string, value: string): void =>
    this.sendFilter.emit(new FilterData(group, value));
}
