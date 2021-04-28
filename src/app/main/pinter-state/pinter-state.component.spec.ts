import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinterStateComponent } from './pinter-state.component';

describe('PinterStateComponent', () => {
  let component: PinterStateComponent;
  let fixture: ComponentFixture<PinterStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinterStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinterStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
