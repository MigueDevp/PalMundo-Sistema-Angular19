import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCatalogComponent } from './trip-catalog.component';

describe('TripCatalogComponent', () => {
  let component: TripCatalogComponent;
  let fixture: ComponentFixture<TripCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
