import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAssetComponent } from './sell-asset.component';

describe('SellAssetComponent', () => {
  let component: SellAssetComponent;
  let fixture: ComponentFixture<SellAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
