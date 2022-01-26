import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterPerformingComponent } from './betterPerforming.component';

describe('BetterPerformingComponent', () => {
  let component: BetterPerformingComponent;
  let fixture: ComponentFixture<BetterPerformingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BetterPerformingComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BetterPerformingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
