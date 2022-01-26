import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInventoryLinesComponent } from './stock-inventory-lines.component';

describe('StockInventoryLinesComponent', () => {
  let component: StockInventoryLinesComponent;
  let fixture: ComponentFixture<StockInventoryLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInventoryLinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInventoryLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
