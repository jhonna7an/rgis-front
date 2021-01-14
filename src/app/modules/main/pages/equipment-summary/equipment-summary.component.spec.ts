import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentSummaryComponent } from './equipment-summary.component';

describe('EquipmentSummaryComponent', () => {
  let component: EquipmentSummaryComponent;
  let fixture: ComponentFixture<EquipmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
