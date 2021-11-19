import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminControlsComponent } from './adminControls.component';

describe('AllUserListAdminComponent', () => {
  let component: AdminControlsComponent;
  let fixture: ComponentFixture<AdminControlsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdminControlsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
