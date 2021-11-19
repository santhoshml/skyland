import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPortfolioComponent } from './myPortfolio.component';

describe('UploadPortfolioComponent', () => {
  let component: MyPortfolioComponent;
  let fixture: ComponentFixture<MyPortfolioComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MyPortfolioComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
