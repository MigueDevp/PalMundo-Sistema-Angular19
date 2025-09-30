import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBadgeComponent } from './kpi-badge.component';

describe('KpiBadgeComponent', () => {
  let component: KpiBadgeComponent;
  let fixture: ComponentFixture<KpiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
