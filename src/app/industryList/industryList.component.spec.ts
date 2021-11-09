import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryListComponent } from './industryList.component';

describe('UploadPortfolioComponent', () => {
  let component: IndustryListComponent;
  let fixture: ComponentFixture<IndustryListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IndustryListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
