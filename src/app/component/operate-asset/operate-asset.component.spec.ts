import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateAssetComponent } from './operate-asset.component';

describe('OperateAssetComponent', () => {
  let component: OperateAssetComponent;
  let fixture: ComponentFixture<OperateAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperateAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperateAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
