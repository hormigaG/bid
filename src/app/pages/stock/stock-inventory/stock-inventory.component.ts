import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../_services/stock.service';
@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.css'],
})
export class StockInventoryComponent implements OnInit {
  stock_inventory: any = [];
  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getStockInventory();
  }

  getStockInventory() {
    this.stockService.getStockInventory([]).subscribe((res) => {
      this.stock_inventory = res['records'];
    });
  }
}
