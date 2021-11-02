import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovIntComponent } from './mov-int.component';

describe('MovIntComponent', () => {
  let component: MovIntComponent;
  let fixture: ComponentFixture<MovIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
