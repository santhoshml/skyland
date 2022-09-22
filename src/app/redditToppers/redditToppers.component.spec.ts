import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedditToppersComponent } from './redditToppers.component';

describe('RedditToppersComponent', () => {
  let component: RedditToppersComponent;
  let fixture: ComponentFixture<RedditToppersComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RedditToppersComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RedditToppersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
