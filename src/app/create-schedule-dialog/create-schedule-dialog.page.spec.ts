import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateScheduleDialogPage } from './create-schedule-dialog.page';

describe('CreateScheduleDialogPage', () => {
  let component: CreateScheduleDialogPage;
  let fixture: ComponentFixture<CreateScheduleDialogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateScheduleDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
