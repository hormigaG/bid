import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntWhSelectorComponent } from './ent-wh-selector.component';

describe('EntWhSelectorComponent', () => {
  let component: EntWhSelectorComponent;
  let fixture: ComponentFixture<EntWhSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntWhSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntWhSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
