import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovIntDetailComponent } from './mov-int-detail.component';

describe('MovIntDetailComponent', () => {
  let component: MovIntDetailComponent;
  let fixture: ComponentFixture<MovIntDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovIntDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovIntDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
