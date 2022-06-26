import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersDetailsComponent } from './adminUsersDetails.component';

describe('AdminUsersDetailsComponent', () => {
  let component: AdminUsersDetailsComponent;
  let fixture: ComponentFixture<AdminUsersDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdminUsersDetailsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
