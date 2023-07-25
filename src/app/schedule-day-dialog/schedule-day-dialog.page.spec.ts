import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDayDialogPage } from './schedule-day-dialog.page';

describe('ScheduleDayDialogPage', () => {
  let component: ScheduleDayDialogPage;
  let fixture: ComponentFixture<ScheduleDayDialogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScheduleDayDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
