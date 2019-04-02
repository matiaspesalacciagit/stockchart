import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAssetQuoteComponent } from './page-asset-quote.component';

describe('PageAssetQuoteComponent', () => {
  let component: PageAssetQuoteComponent;
  let fixture: ComponentFixture<PageAssetQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAssetQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAssetQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
