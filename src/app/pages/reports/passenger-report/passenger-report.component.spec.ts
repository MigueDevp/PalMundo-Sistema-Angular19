import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerReportComponent } from './passenger-report.component';

describe('PassengerReportComponent', () => {
  let component: PassengerReportComponent;
  let fixture: ComponentFixture<PassengerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
