import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyScheduleDialogPage } from './modify-schedule-dialog.page';

describe('ModifyScheduleDialogPage', () => {
  let component: ModifyScheduleDialogPage;
  let fixture: ComponentFixture<ModifyScheduleDialogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModifyScheduleDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
