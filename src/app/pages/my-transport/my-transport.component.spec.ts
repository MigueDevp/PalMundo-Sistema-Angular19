import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTransportComponent } from './my-transport.component';

describe('MyTransportComponent', () => {
  let component: MyTransportComponent;
  let fixture: ComponentFixture<MyTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTransportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
