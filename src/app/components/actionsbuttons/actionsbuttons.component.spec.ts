import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsbuttonsComponent } from './actionsbuttons.component';

describe('ActionsbuttonsComponent', () => {
  let component: ActionsbuttonsComponent;
  let fixture: ComponentFixture<ActionsbuttonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsbuttonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsbuttonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
