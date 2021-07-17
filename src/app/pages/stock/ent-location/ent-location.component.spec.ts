import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntLocationComponent } from './ent-location.component';

describe('EntLocationComponent', () => {
  let component: EntLocationComponent;
  let fixture: ComponentFixture<EntLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
