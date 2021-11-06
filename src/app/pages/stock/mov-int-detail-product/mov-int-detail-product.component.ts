import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../_services/stock.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-mov-int-detail-product',
  templateUrl: './mov-int-detail-product.component.html',
  styleUrls: ['./mov-int-detail-product.component.css'],
})
export class MovIntDetailProductComponent implements OnInit {
  location_id: Number = 0;
  picking_id: Number = 0;
  moves: any = [];
  product_id: any = [];
  active_index: number = undefined;
  addQty: number = 1;
  qtyDir: number = 1;

  inputMethod: String = 'textBus';

  @ViewChild('moveLineModal') moveLineModal: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getMoves();
  }
  searchByCode(code) {}
  filterLocations() {
    this.product_id = this.moves.reduce((unique, o) => {
      if (!unique.some((obj) => obj.product_id[0] === o.product_id[0])) {
        unique.push(o);
      }
      return unique;
    }, []);
    console.log(this.product_id);
  }
  openMoveLineModal(line) {
    this.active_index = line;
    this.addQty = 1;
    this.qtyDir = 1;

    this.modalService.open(this.moveLineModal).result.then((result) => {
      this.active_index = undefined;
    });
  }
  addToLocalStorage(storage, move, qty) {
    //console.log('aca me llego', move.id, move.scanned_qty);
    this.stockService.setQuantity(storage, move.id, qty);
  }
  removeToLocalStorage(storage, move) {
    //console.log('aca me llego', move.id, move.scanned_qty);
    this.stockService.deleteQuantity(storage, move.id);
  }

  addScannedQuantity(line, qty = 1) {
    this.changeDetectorRef.detectChanges();
    console.log(line, qty);
    if (this.moves[line]['scanned_qty'] + qty < 1) {
      this.moves[line]['quantity_done'] =
        this.moves[line]['quantity_done'] - this.moves[line]['scanned_qty'];
      this.moves[line]['scanned_qty'] = 0;
      return;
    }
    this.moves[line]['scanned_qty'] += qty;
    this.moves[line]['quantity_done'] += qty;
    // TODO: LocalSOTRAGE -> this.moves[line]['scanned_qty']
    this.addToLocalStorage('mov_int', this.moves[line], qty);
    /* if (
      qty > 0 &&
      this.moves[line]['quantity_done'] >
        this.moves[line]['reserved_availability']
    ) {
      let message =
        'Esta por confirmar mas items de los esperados ¿esta seguro?';
      if (!window.confirm(message)) {
        this.moves[line]['scanned_qty'] -= qty;
        this.moves[line]['quantity_done'] -= qty;
        this.addToLocalStorage(this.moves[line], -qty);

        return;
      }
      this.removeToLocalStorage('mov_int', this.moves[line]);
    }

    let line_id = this.moves[line];
    this.changeDetectorRef.detectChanges();

    if (line_id.quantity_done == line_id.reserved_availability) {
      //if (line_id.scanned_qty == 5){
      this.stockService
        .move_products(
          'mov_int',
          this.moves[line],
          this.moves[line]['scanned_qty'],
          line
        )
        .subscribe((res) => {
          this.removeToLocalStorage('mov_int', this.moves[line]);
          this.moves[line]['scanned_qty'] = 0;
          this.moves[line]['move_line_ids'] = [res];
          // delete this.moves[line];
          this.getMoves();
          this.modalService.dismissAll();
          //this.check_pick_ok(this.active_index);
          this.active_index = undefined;
        });
    } */
  }
  getMoves() {
    this.location_id = this.route['params']['value']['location_id'];
    this.picking_id = this.route['params']['value']['picking_id'];

    let leaf = [
      ['location_id', '=', Number(this.location_id)],
      ['picking_id', '=', Number(this.picking_id)],
    ];
    this.stockService.getMoves('mov_int', leaf).subscribe((res) => {
      this.moves = res['records'];
      console.log('aca mis moves', this.moves);
      this.filterLocations();
    });
  }
}
