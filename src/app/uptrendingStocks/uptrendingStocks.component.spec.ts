import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptrendingStocksComponent } from './uptrendingStocks.component';

describe('UploadPortfolioComponent', () => {
  let component: UptrendingStocksComponent;
  let fixture: ComponentFixture<UptrendingStocksComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UptrendingStocksComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UptrendingStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
