import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../_services/stock.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-inventory-lines',
  templateUrl: './stock-inventory-lines.component.html',
  styleUrls: ['./stock-inventory-lines.component.css'],
})
export class StockInventoryLinesComponent implements OnInit {
  stock_inventory: any = [];
  locations: any = [];
  stock_id: Number;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.stock_id = Number(this.route.snapshot.params.stock_inventory_id);
    console.log(this.stock_id);
    let leaf = [['id', '=', this.stock_id]];
    this.getStockInventory(leaf);
  }
  async getStockInventory(leaf) {
    this.stockService.getStockInventory(leaf).subscribe((res) => {
      this.stock_inventory = res['records'];
      this.locations = this.stock_inventory[0]['locations'];
    });
  }
}
