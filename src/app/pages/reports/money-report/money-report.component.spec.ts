import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyReportComponent } from './money-report.component';

describe('MoneyReportComponent', () => {
  let component: MoneyReportComponent;
  let fixture: ComponentFixture<MoneyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
