import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInventoryLinesProductComponent } from './stock-inventory-lines-product.component';

describe('StockInventoryLinesProductComponent', () => {
  let component: StockInventoryLinesProductComponent;
  let fixture: ComponentFixture<StockInventoryLinesProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInventoryLinesProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInventoryLinesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
