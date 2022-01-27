import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { StockService } from '../../../_services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  searchByCode(code) {
    const elemento = this.locations.find((e) => e.name === code);
    if (elemento) {
      this.router.navigate([
        `/stock-inventory/${this.stock_id}/${elemento.id}`,
      ]); // navigate to other page
    } else {
      alert('La ubicación escaneada no corresponde al control de inventario');
    }
  }
  ngOnInit(): void {
    this.stock_id = Number(this.route.snapshot.params.stock_inventory_id);
    let leaf = [['inventory_id', '=', this.stock_id]];
    this.getStockInventory(leaf);
  }
  async getStockInventory(leaf) {
    this.spinner = true;
    this.stockService.getStockInventoryLineUbications(leaf).subscribe((res) => {
      const result = res;
      this.locations = result.reduce((unique, o) => {
        if (!unique.some((obj) => obj.id === o.id)) {
          unique.push(o);
        }
        return unique;
      }, []);
      this.spinner = false;
    });
  }
}
