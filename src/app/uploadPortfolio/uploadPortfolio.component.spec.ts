import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPortfolioComponent } from './uploadPortfolio.component';

describe('UploadPortfolioComponent', () => {
  let component: UploadPortfolioComponent;
  let fixture: ComponentFixture<UploadPortfolioComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UploadPortfolioComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
