import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolDetailsComponent } from './symbolDetails.component';

describe('UploadPortfolioComponent', () => {
  let component: SymbolDetailsComponent;
  let fixture: ComponentFixture<SymbolDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SymbolDetailsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
