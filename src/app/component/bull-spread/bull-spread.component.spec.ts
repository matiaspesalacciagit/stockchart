import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullSpreadComponent } from './bull-spread.component';

describe('BullSpreadComponent', () => {
  let component: BullSpreadComponent;
  let fixture: ComponentFixture<BullSpreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullSpreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullSpreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
