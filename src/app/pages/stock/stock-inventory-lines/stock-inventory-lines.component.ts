import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { StockService } from '../../../_services/stock.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stock-inventory-lines',
  templateUrl: './stock-inventory-lines.component.html',
  styleUrls: ['./stock-inventory-lines.component.css'],
})
export class StockInventoryLinesComponent implements OnInit {
  stock_inventory: any = [];
  locations: any = [];
  stock_id: Number;
  stock_inventory_lines: any = [];
  location_id: any = [];
  showOk: boolean = false;
  active_index: number = undefined;
  addQty: number = 1;
  qtyDir: number = 1;
  moves: any = [];
  textBus: string = '';
  keyboardDisable: boolean = true;
  intefaceBlocked: boolean = false;
  product: any;
  capturedImage;
  isCollapsed: boolean = true;
  searchForm: FormGroup;
  inputMethod = 'textBus';
  spinner: boolean = true;
  log: string = '';
  showLog: boolean = false;
  lot_stock_id: number;
  op: string;
  filters: any = [];
  @ViewChild('search') searchElement: ElementRef;
  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  searchByCode(code) {
    console.log(code);
  }
  ngOnInit(): void {
    this.stock_id = Number(this.route.snapshot.params.stock_inventory_id);
    console.log(this.stock_id);
    let leaf = [['id', '=', this.stock_id]];
    this.getStockInventory(leaf);
  }
  async getStockInventory(leaf) {
    this.spinner = true;
    this.stockService.getStockInventory(leaf).subscribe((res) => {
      this.stock_inventory = res['records'];
      this.locations = this.stock_inventory[0]['locations'];
      this.spinner = false;
    });
  }
}
