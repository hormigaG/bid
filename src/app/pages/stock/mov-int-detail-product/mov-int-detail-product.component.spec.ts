import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovIntDetailProductComponent } from './mov-int-detail-product.component';

describe('MovIntDetailProductComponent', () => {
  let component: MovIntDetailProductComponent;
  let fixture: ComponentFixture<MovIntDetailProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovIntDetailProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovIntDetailProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
