import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorPassengerComponent } from './debtor-passenger.component';

describe('DebtorPassengerComponent', () => {
  let component: DebtorPassengerComponent;
  let fixture: ComponentFixture<DebtorPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtorPassengerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtorPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
