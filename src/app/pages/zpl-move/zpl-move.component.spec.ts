import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZplMoveComponent } from './zpl-move.component';

describe('ZplMoveComponent', () => {
  let component: ZplMoveComponent;
  let fixture: ComponentFixture<ZplMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZplMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZplMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
