import { Injectable } from '@angular/core';
import { OdooRPCService } from './odoo-rpc.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(public odooRPC: OdooRPCService) {}

  getWh() {
    const transaction$ = new Observable((observer) => {
      var prlsIds: any = [];

      this.odooRPC
        .searchRead(
          'stock.warehouse',
          [],
          ['name', 'lot_stock_id', 'wh_input_stock_loc_id'],
          0,
          0
        )
        .then((res) => {
          observer.next(res);
          observer.complete();

          observer.complete();
        })
        .catch((err) => {
          alert(err);
        });
    });
    return transaction$;
  }

  getMoves(leaf) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead(
          'stock.move',
          leaf,
          [
            'product_id',
            'name',
            'product_uom_qty',
            'product_uom',
            'reserved_availability',
            'quantity_done',
            'sequence',
            'picking_id',
            'company_id',
            'location_id',
            'location_dest_id',
            'purchase_line_id',
            'origin'
          ],
          0,
          0
        )
        .then((res) => {
          let product_ids = res['records'].map(function (move) {
            return move['product_id'][0];
          });
          this.odooRPC
            .read('product.product', product_ids, [
              'uom_id',
              'uom_po_id',
              'barcode',
              'default_code',
            ])
            .then((products) => {
              let product_dict: any = {};
              products.map(function (p) {
                product_dict[p['id']] = p;
              });
              var self = this;
              res['records'].forEach(async function (part, index) {
                res['records'][index]['barcode'] =
                  product_dict[part['product_id'][0]]['barcode'];
                res['records'][index]['default_code'] =
                  product_dict[part['product_id'][0]]['default_code'];
                res['records'][index]['uom_po_id'] =
                  product_dict[part['product_id'][0]]['uom_po_id'];
                res['records'][index]['uom_id'] =
                  product_dict[part['product_id'][0]]['uom_id'];
                if (self.getQuantity(res['records'][index].id) > -1) {
                  const cant = self.getQuantity(res['records'][index].id);
                  res['records'][index]['scanned_qty'] = cant;
                  res['records'][index]['quantity_done'] = cant;
                } else {
                  res['records'][index]['scanned_qty'] = 0;
                }
              });

              observer.next(res);
              observer.complete();
            });
        })
        .catch((err) => {
          alert(err);
        });
    });
    return transaction$;
  }
  private getQuantity(id) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array) {
      let element = scanned_qty_array.find((e) => id == e.id);
      if (element) {
        return element.scanned_qty;
      }
    }
    return -1;
  }
  move_products(move_id, qty_done, description_picking = '') {
    let move_line = {
      picking_id: move_id.picking_id[0],
      move_id: move_id.id,
      company_id: move_id.company_id[0],
      product_id: move_id.product_id[0],
      product_uom_id: move_id.product_uom[0],
      location_id: move_id.location_id[0],
      location_dest_id: move_id.location_dest_id[0],
      description_picking: description_picking,
      qty_done: qty_done || move_id['qty_done'],
    };
    this.deleteQuantity(move_id.move_id);

    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .call('stock.move.line', 'create', [move_line], {})
        .then((res) => {
          observer.next(res);
          observer.complete();
        })
        .catch((err) => {
          alert(err);
        });
    });
    return transaction$;
  }
  private pushObject(id, scanned_qty, array) {
    const obj = {
      id,
      scanned_qty,
    };
    array.push(obj);
    localStorage.setItem('scanned_qty', JSON.stringify(array));
  }
  deleteQuantity(id) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array) {
      let index = scanned_qty_array.findIndex((e) => id == e.id);
      if (index > -1) {
        scanned_qty_array.splice(index, 1);
        localStorage.setItem('scanned_qty', JSON.stringify(scanned_qty_array));
      }
    }
  }

  setQuantity(id, scanned_qty) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array) {
      let index = scanned_qty_array.findIndex((e) => id == e.id);
      if (index > -1) {
        let element = scanned_qty_array.find((e) => id == e.id);
        element.scanned_qty += scanned_qty;
        scanned_qty_array[index] = element;
        localStorage.setItem('scanned_qty', JSON.stringify(scanned_qty_array));
      } else {
        this.pushObject(
          id,
          scanned_qty,
          scanned_qty_array ? scanned_qty_array : []
        );
      }
    } else {
      this.pushObject(id, scanned_qty, []);
    }
  }
  button_validate(picking_id) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .call('stock.picking', 'button_validate', [picking_id], {})
        .then((res) => {
          observer.next(res);
          observer.complete();
        })
        .catch((err) => {
          alert(err);
        });
    });

    return transaction$;
  }
}
