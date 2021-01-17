import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPicksComponent } from './topPicks.component';

describe('UploadPortfolioComponent', () => {
  let component: TopPicksComponent;
  let fixture: ComponentFixture<TopPicksComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TopPicksComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
