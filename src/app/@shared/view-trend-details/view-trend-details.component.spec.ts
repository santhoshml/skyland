import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrendDetailsComponent } from './view-trend-details.component';

describe('ViewTrendDetailsComponent', () => {
  let component: ViewTrendDetailsComponent;
  let fixture: ComponentFixture<ViewTrendDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTrendDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTrendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
