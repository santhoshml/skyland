import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoiDistributionComponent } from './roiDistribution.component';

describe('UploadPortfolioComponent', () => {
  let component: RoiDistributionComponent;
  let fixture: ComponentFixture<RoiDistributionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RoiDistributionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RoiDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
