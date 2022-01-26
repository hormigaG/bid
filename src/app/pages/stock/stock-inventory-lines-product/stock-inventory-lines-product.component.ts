import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { StockService } from '../../../_services/stock.service';
import { ActivatedRoute } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { convertCompilerOptionsFromJson } from 'typescript';

@Component({
  selector: 'app-stock-inventory-lines-product',
  templateUrl: './stock-inventory-lines-product.component.html',
  styleUrls: ['./stock-inventory-lines-product.component.css'],
})
export class StockInventoryLinesProductComponent implements OnInit {
  stock_inventory_lines: any = [];
  location_id: any = [];
  stock_id: Number;
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
  @ViewChild('moveLineModal') moveLineModal: ElementRef;
  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef,
    private config: NgbModalConfig
  ) {}

  ngOnInit(): void {
    this.stock_id = Number(this.route.snapshot.params.stock_inventory_id);
    this.location_id = Number(this.route.snapshot.params.location_id);
    this.config.backdrop = 'static';
    this.config.keyboard = false;

    let leaf = [];

    leaf.push(['inventory_id', '=', this.stock_id]);
    leaf.push(['location_id', '=', this.location_id]);
    this.getStockInventory(leaf);
  }
  getStockInventory(leaf) {
    this.stockService.getStockInventoryLine(leaf).subscribe((res) => {
      this.stock_inventory_lines = res['records'];
      this.spinner = false;
      this.stock_inventory_lines.forEach((element) => {
        this.initLocalStorage(
          'stock_inventory',
          element,
          element['product_qty']
        );
      });
    });
  }
  openMoveLineModal(line) {
    this.active_index = line;
    this.addQty = 1;
    this.qtyDir = 1;
    /* this.addToLocalStorage(
      'stock_inventory',
      this.stock_inventory_lines[line],
      this.stock_inventory_lines[line]['product_qty']
    );
 */
    this.modalService.open(this.moveLineModal).result.then((result) => {
      this.active_index = undefined;
    });
  }
  removeToLocalStorage(storage, move) {
    this.stockService.deleteQuantity(storage, move.id);
  }

  initLocalStorage(storage, move, qty) {
    const index = this.stockService.getQuantity('stock_inventory', move.id);
    if (index == -1) {
      this.stockService.setQuantity(storage, move.id, qty);
    }
  }
  addToLocalStorage(storage, move, qty) {
    this.stockService.setQuantity(storage, move.id, qty);
  }
  refresh() {}
  togleShowOk() {
    if (this.showOk) {
      this.showOk = false;
    } else {
      this.showOk = true;
    }
  }
  searchByCode(code) {
    this.changeDetectorRef.detectChanges();
    if (code.length < 2) {
      return;
    }
    var line = this.stock_inventory_lines.findIndex(function (item) {
      let codeLow = code.toLowerCase();
      return (
        //item.default_code.toLowerCase().indexOf(codeLow) !== -1 ||
        item.product_id[1].toLowerCase().indexOf(codeLow) !== -1 ||
        item.barcode == code
      );
    });
    this.textBus = '';

    if (line == -1) {
      this.stockService.searchProductByLine(code).subscribe((res) => {
        console.log(res);
        if (res['length']) {
          this.stockService
            .newLine(
              res['records'][0].id,
              this.stock_id,
              this.location_id,
              res['records'][0]['uom_id'][0]
            )
            .subscribe((res_line) => {
              let leaf = [];
              leaf.push(['inventory_id', '=', this.stock_id]);
              leaf.push(['location_id', '=', this.location_id]);
              this.getStockInventory(leaf);
            });
        } else {
          alert('Producto no encontrado');
        }
      });
    } else {
      console.log('linea', line);

      let openModal = this.modalService.hasOpenModals();
      this.active_index = line;
      this.addScannedQuantity(line, 1);
      this.addQty = 1;
      this.qtyDir = 1;
      this.changeDetectorRef.detectChanges();
      if (!openModal) {
        this.modalService.open(this.moveLineModal).result.then((result) => {
          this.active_index = undefined;
          this.changeDetectorRef.detectChanges();
        });
      }
    }
  }
  cerrarModal() {
    this.modalService.dismissAll();
    this.stockService.controlInventory();
  }
  addScannedQuantity(line, qty = 1) {
    this.changeDetectorRef.detectChanges();

    if (this.stock_inventory_lines[line]['scanned_qty'] + qty < 1) {
      this.stock_inventory_lines[line]['product_qty'] =
        this.stock_inventory_lines[line]['product_qty'] -
        this.stock_inventory_lines[line]['scanned_qty'];
      this.stock_inventory_lines[line]['scanned_qty'] = 0;
      return;
    }
    this.stock_inventory_lines[line]['scanned_qty'] += qty;
    this.stock_inventory_lines[line]['product_qty'] += qty;
    this.addToLocalStorage(
      'stock_inventory',
      this.stock_inventory_lines[line],
      qty
    );
    if (
      qty > 0 &&
      this.stock_inventory_lines[line]['product_qty'] >
        this.stock_inventory_lines[line]['reserved_availability']
    ) {
      let message =
        'Esta por confirmar mas items de los esperados ¿esta seguro?';
      if (!window.confirm(message)) {
        this.stock_inventory_lines[line]['scanned_qty'] -= qty;
        this.stock_inventory_lines[line]['product_qty'] -= qty;
        this.addToLocalStorage(
          'stock_inventory',
          this.stock_inventory_lines[line],
          -qty
        );

        return;
      }
      this.removeToLocalStorage(
        'stock_inventory',
        this.stock_inventory_lines[line]
      );
    }

    let line_id = this.stock_inventory_lines[line];
    this.changeDetectorRef.detectChanges();

    if (line_id.product_qty == line_id.reserved_availability) {
      //if (line_id.scanned_qty == 5){
      this.spinner = true;
      this.stockService
        .move_products(
          'stock_inventory',
          this.stock_inventory_lines[line],
          this.stock_inventory_lines[line]['scanned_qty'],
          line
        )
        .subscribe((res) => {
          this.removeToLocalStorage(
            'stock_inventory',
            this.stock_inventory_lines[line]
          );
          this.stock_inventory_lines[line]['scanned_qty'] = 0;
          this.stock_inventory_lines[line]['move_line_ids'] = [res];
          // delete this.moves[line];
          //this.getAssignedMoves();

          this.modalService.dismissAll();
          //this.check_pick_ok(this.active_index);
          this.active_index = undefined;
        });
    }
  }
}
