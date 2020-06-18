import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOperationPairAssetComponent } from './form-operation-pair-asset.component';

describe('FormOperationPairAssetComponent', () => {
  let component: FormOperationPairAssetComponent;
  let fixture: ComponentFixture<FormOperationPairAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOperationPairAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOperationPairAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
