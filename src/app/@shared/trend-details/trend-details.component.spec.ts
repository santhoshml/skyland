import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendDetailsComponent } from './trend-details.component';

describe('TrendDetailsComponent', () => {
  let component: TrendDetailsComponent;
  let fixture: ComponentFixture<TrendDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrendDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
