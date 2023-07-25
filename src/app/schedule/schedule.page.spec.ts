import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchedulePage } from './schedule.page';
import {async} from "rxjs";

describe('SchedulePage', () => {
  let component: SchedulePage;
  let fixture: ComponentFixture<SchedulePage>;

  // @ts-ignore
  beforeEach(async(() => {
    fixture = TestBed.createComponent(SchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
