import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBarCodeComponent } from './test-bar-code.component';

describe('TestBarCodeComponent', () => {
  let component: TestBarCodeComponent;
  let fixture: ComponentFixture<TestBarCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestBarCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBarCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
