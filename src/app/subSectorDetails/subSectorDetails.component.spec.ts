import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectorDetailsComponent } from './subSectorDetails.component';

describe('UploadPortfolioComponent', () => {
  let component: SubSectorDetailsComponent;
  let fixture: ComponentFixture<SubSectorDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubSectorDetailsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
