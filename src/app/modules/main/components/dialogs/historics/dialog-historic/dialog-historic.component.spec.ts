import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistoricComponent } from './dialog-historic.component';

describe('DialogHistoricComponent', () => {
  let component: DialogHistoricComponent;
  let fixture: ComponentFixture<DialogHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
