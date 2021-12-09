import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StockService } from "../../../_services/stock.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-mov-int-detail-product",
  templateUrl: "./mov-int-detail-product.component.html",
  styleUrls: ["./mov-int-detail-product.component.css"],
})
export class MovIntDetailProductComponent implements OnInit {
  location_id: Number = 0;
  picking_id: Number = 0;
  moves: any = [];
  product_id: any = [];
  active_index: number = undefined;
  addQty: number = 1;
  qtyDir: number = 1;
  @Input() products: any = [];
  inputMethod: String = "textBus";
  @ViewChild("moveLineModal") moveLineModal: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //this.getMoves();
  }

  searchByCode(code) {
    this.changeDetectorRef.detectChanges();
    if (code.length < 2) {
      return;
    }
    var line = this.products.findIndex(function(item) {
      let codeLow = code.toLowerCase();
      return (
        (item.default_code == code
         ||
        item.barcode == code)  && 
        item.product_uom_qty > item.scanned_qty + item.qty_done 

        //|| item.picking_id[1].toLowerCase().indexOf(codeLow) !== -1
        /*         item.quantity_done < item.reserved_availability
         */
      );
    });
    if (line == -1) {
      alert(code + " NO diponible");
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
    let selected_product = this.products[line];

    let total =
      qty +
      this.products[line]["scanned_qty"] +
      this.products[line]["qty_done"];

    if (total > this.products[line]["product_uom_qty"] || this.products[line]["scanned_qty"] + qty < 0) {
      // TODO: mostrar un notificacion de que ya estan todos
      // Cerrar el modal
      //Si el escenado + qty_done color poner en color verde
      this.modalService.dismissAll();
      return;
    }

    this.products[line]["scanned_qty"] += qty;
    //this.products[line]['qty_done'] += qty;
    // TODO: LocalSOTRAGE -> this.products[line]['scanned_qty']
    this.addToLocalStorage("mov_int", this.products[line], qty);
    if (total == this.products[line]["product_uom_qty"]) {
      this.modalService.dismissAll();
      return;
    }
  }
}
