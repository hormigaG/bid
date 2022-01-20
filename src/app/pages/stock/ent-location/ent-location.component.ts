import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { HostListener } from '@angular/core';
import { ProductService } from '../../../_services/product.service';
import { environment } from '../../../../environments/environment';
import { Events } from '../../../_services/events.service';
//import { BarcodeProvider } from '../../../_services/intent.service';
import { HoneyService } from '../../../_services/honey.service';
import { ConfigService } from '../../../_services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StockService } from '../../../_services/stock.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ent-location',
  templateUrl: './ent-location.component.html',
  styleUrls: ['./ent-location.component.css'],
})
export class EntLocationComponent implements OnInit {
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
    public productService: ProductService,
    private formBuilder: FormBuilder,
    public HoneyService: HoneyService,
    private changeDetectorRef: ChangeDetectorRef,
    public ConfigService: ConfigService,
    private route: ActivatedRoute,
    public stockService: StockService,
    private modalService: NgbModal,
    public Router: Router,
  ) {
    /*  */
  }
  ngOnInit(): void {
    this.lot_stock_id = Number(
      this.route.snapshot.paramMap.get('lot_stock_id')
    );
    this.op = String(this.route.snapshot.paramMap.get('op'));

    this.getAssignedMoves();
  }
  togleShowOk() {
    if (this.showOk) {
      this.showOk = false;
    } else {
      this.showOk = true;
    }
  }
  refresh() {
    this.spinner = true;
    this.lot_stock_id = Number(
      this.route.snapshot.paramMap.get('lot_stock_id')
    );
    this.op = String(this.route.snapshot.paramMap.get('op'));
    this.getAssignedMoves();
  }
  removeFilter(i) {
    this.filters.splice(i, 1);
    //TODO: VER COMO USAR FILTERS PARA FILTRAR
    this.spinner = true;
    this.getAssignedMoves();
  }
  selectPiking(picking_id) {
    this.spinner = true;
    const element = {
      name: 'picking_id',
      label: picking_id[1],
      value: picking_id[0],
    };
    const exist = this.filters.find(
      (e) => e.value === element.value && e.name === element.name
    );

    if (!exist) {
      this.filters.push(element);
      this.op = 'picking';
      this.lot_stock_id = picking_id[0];
      this.getAssignedMoves();
    }
  }

  getAssignedMoves() {
    let leaf = [];

    if (this.op == 'location-entry') {
      leaf = [
        ['state', '=', ['assigned', 'draft', 'partially_available']],
        ['location_dest_id', 'child_of', this.lot_stock_id],
      ];
    } else if (this.op == 'picking') {
      leaf = [
        ['state', 'in', ['assigned', 'draft', 'partially_available']],
        ['picking_id', '=', this.lot_stock_id],
      ];
    }

    let dateExpected = this.filters.filter(
      (filter) => filter.name == 'date_expected'
    );
    if (dateExpected.length) {
      dateExpected = this.makeDateLeaf(
        dateExpected[0]['value']['fromDate'],
        dateExpected[0]['value']['toDate']
      );
    } else if (!this.filters.length) {
      dateExpected = this.makeDateLeaf(
        this.parseDateObject(new Date()),
        undefined
      );

      this.filters.push({
        label: 'Ingresos hasta hoy',
        value: { fromDate: this.parseDateObject(new Date()) },
        name: 'date_expected',
      });
    }
    leaf.push(...dateExpected);

    if (leaf.length) {
      this.stockService.getMoves(leaf, 'incoming').subscribe((res) => {
        res['records'].forEach(function (part, index, theArray) {});

        this.moves = res['records'];
        this.spinner = false;
      });
    }
  }

  makeDateLeaf(fromDate, toDate) {
    let leaf: any = [];
    if (!toDate) {
      toDate = fromDate;
    }
    leaf.push(['date_expected', '>=', fromDate + ' 00:00:00']);
    leaf.push(['date_expected', '<', toDate + ' 23:59:59']);
    return leaf;
  }
  formSearch() {
    const search = this.searchForm.controls.search.value;
    this.searchByCode(search);
    this.searchForm.controls.search.patchValue('');
    this.searchElement.nativeElement.focus();
  }

  searchByCode(code) {
    this.changeDetectorRef.detectChanges();
    if (code.length < 2) {
      return;
    }
    var line = this.moves.findIndex(function (item) {
      let codeLow = code.toLowerCase();
      return (
        (item.default_code.toLowerCase().indexOf(codeLow) !== -1 ||
          item.product_id[1].toLowerCase().indexOf(codeLow) !== -1 ||
          item.barcode == code) &&
        //|| item.picking_id[1].toLowerCase().indexOf(codeLow) !== -1
        item.quantity_done < item.reserved_availability
      );
    });
    this.textBus = '';

    if (line == -1) {
      alert(code + ' NO diponible');
    } else {
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
  openMoveLineModal(line) {
    this.active_index = line;
    this.addQty = 1;
    this.qtyDir = 1;

    this.modalService.open(this.moveLineModal).result.then((result) => {
      this.active_index = undefined;
    });
  }

  removeToLocalStorage(storage, move) {
    this.stockService.deleteQuantity(storage, move.id);
  }

  addToLocalStorage(storage, move, qty) {
    this.stockService.setQuantity(storage, move.id, qty);
  }
  addScannedQuantity(line, qty = 1) {
    this.changeDetectorRef.detectChanges();

    if (this.moves[line]['scanned_qty'] + qty < 1) {
      this.moves[line]['quantity_done'] =
        this.moves[line]['quantity_done'] - this.moves[line]['scanned_qty'];
      this.moves[line]['scanned_qty'] = 0;
      return;
    }
    this.moves[line]['scanned_qty'] += qty;
    this.moves[line]['quantity_done'] += qty;
    // TODO: LocalSOTRAGE -> this.moves[line]['scanned_qty']
    this.addToLocalStorage('incoming', this.moves[line], qty);
    if (
      qty > 0 &&
      this.moves[line]['quantity_done'] >
        this.moves[line]['reserved_availability']
    ) {
      let message =
        'Esta por confirmar mas items de los esperados ¿esta seguro?';
      if (!window.confirm(message)) {
        this.moves[line]['scanned_qty'] -= qty;
        this.moves[line]['quantity_done'] -= qty;
        this.addToLocalStorage('incoming', this.moves[line], -qty);

        return;
      }
      this.removeToLocalStorage('incoming', this.moves[line]);
    }

    let line_id = this.moves[line];
    this.changeDetectorRef.detectChanges();

    if (line_id.quantity_done == line_id.reserved_availability) {
      //if (line_id.scanned_qty == 5){
      this.spinner = true;
      this.stockService
        .move_products(
          'incoming',
          this.moves[line],
          this.moves[line]['scanned_qty'],
          line
        )
        .subscribe((res) => {
          this.removeToLocalStorage('incoming', this.moves[line]);
          this.moves[line]['scanned_qty'] = 0;
          this.moves[line]['move_line_ids'] = [res];
          // delete this.moves[line];
          this.getAssignedMoves();

          this.modalService.dismissAll();
          this.check_pick_ok(this.active_index);
          this.active_index = undefined;
        });
    }
  }
  check_pick_ok(line) {
    let picking_id = this.moves[line]['picking_id'][0];
    let no_ok = this.moves.filter(function (el) {
      if (
        el['picking_id'][0] == picking_id &&
        el['quantity_done'] < el['reserved_availability']
      ) {
        return true;
      } else {
        return false;
      }
    });
    if (no_ok.length == 0) {
      this.spinner = true;

      this.stockService.button_validate(picking_id).subscribe((res: any) => {
        if (res.name) {
          alert(res.name);
        }
        this.getAssignedMoves();
      });
    }
 
  }
  parcialMoveProducts(line) {
    if (this.moves[line]['scanned_qty'] > 0) {
      this.spinner = true;
      this.stockService
        .move_products(
          'incoming',
          this.moves[line],
          this.moves[line]['scanned_qty'],
          line
        )
        .subscribe((res) => {
          this.moves[line]['scanned_qty'] = 0;
          this.moves[line]['move_line_ids'] = [res];
          // delete this.moves[line];
          this.spinner = false;
          this.getAssignedMoves();
          this.modalService.dismissAll();
          this.removeToLocalStorage('incoming', this.moves[line]);
          this.active_index = undefined;
        });
    }
  }
  print(item){
            this.Router.navigateByUrl('/move_zpl/' + item['id'] + '/' + item['product_uom_qty']);

  }
  dateRange(value) {
    const index = this.filters.findIndex((e) => e.name == 'date_expected');
    if (index >= 0) {
      this.filters.splice(index, 1);
    }
    if (value.fromDate && value.toDate) {
      const fromDate =
        value.fromDate.day +
        '/' +
        value.fromDate.month +
        '/' +
        value.fromDate.year;
      const toDate =
        value.toDate.day + '/' + value.toDate.month + '/' + value.toDate.year;
      this.filters.push({
        label: fromDate + ' a ' + toDate,
        value: {
          fromDate: this.parseDate(value.fromDate),
          toDate: this.parseDate(value.toDate),
        },
        name: 'date_expected',
      });
    } else if (value.fromDate) {
      const fromDate =
        value.fromDate.day +
        '/' +
        value.fromDate.month +
        '/' +
        value.fromDate.year;
      this.filters.push({
        label: fromDate,
        value: { fromDate: this.parseDate(value.fromDate) },
        name: 'date_expected',
      });
    }
    this.spinner = true;

    this.getAssignedMoves();
  }
  private parseDate(date) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    return (
      date.year + '-' + zeroPad(date.month, 2) + '-' + zeroPad(date.day, 2)
    );
  }
  private parseDateObject(date) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    return (
      date.getFullYear() +
      '-' +
      zeroPad(date.getMonth() + 1, 2) +
      '-' +
      zeroPad(date.getDate(), 2)
    );
  }
}
