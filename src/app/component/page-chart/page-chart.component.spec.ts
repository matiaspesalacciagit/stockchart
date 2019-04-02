import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageChartComponent } from './page-chart.component';

describe('PageChartComponent', () => {
  let component: PageChartComponent;
  let fixture: ComponentFixture<PageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
