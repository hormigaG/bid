import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZplFileComponent } from './zpl-file.component';

describe('ZplFileComponent', () => {
  let component: ZplFileComponent;
  let fixture: ComponentFixture<ZplFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZplFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZplFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
