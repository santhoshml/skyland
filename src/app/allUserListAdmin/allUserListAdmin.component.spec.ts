import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserListAdminComponent } from './allUserListAdmin.component';

describe('AllUserListAdminComponent', () => {
  let component: AllUserListAdminComponent;
  let fixture: ComponentFixture<AllUserListAdminComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AllUserListAdminComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
