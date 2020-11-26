import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullSpreadFormComponent } from './bull-spread-form.component';

describe('BullSpreadFormComponent', () => {
  let component: BullSpreadFormComponent;
  let fixture: ComponentFixture<BullSpreadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullSpreadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullSpreadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
