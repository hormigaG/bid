import { Injectable } from '@angular/core';
import { OdooRPCService } from './odoo-rpc.service';
import { Observable } from 'rxjs';
import {AlertService} from '../_services/alert.service'
@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(public odooRPC: OdooRPCService, private alertService: AlertService) {}

  private getQuantityStorage(storage) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array && scanned_qty_array[storage]) {
      return scanned_qty_array;
    }
    return [];
  }
  
  controlInventory() {
    const controlInventory = this.getQuantityStorage('stock_inventory');
    if (controlInventory.stock_inventory.length) {
      for (let i = 0; i < controlInventory.stock_inventory.length; i++) {
        this.odooRPC
          .call(
            'stock.inventory.line',
            'write',
            [
              [controlInventory.stock_inventory[i].id],
              { product_qty: controlInventory.stock_inventory[i].scanned_qty },
            ],
            {}
          )
          .then((res) => {
            this.deleteQuantity(
              'stock_inventory',
              controlInventory.stock_inventory[i].id
            );
          });
      }
    }
  }
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
          this.alertService.showAlert(err);
        });
    });
    return transaction$;
  }
  getLocationByCode(code) {
    const transaction$ = new Observable((observer) => {
      var prlsIds: any = [];

      this.odooRPC
        .searchRead(
          'stock.location',
          [['name', '=', code]],
          ['name', 'barcode'],
          1,
          0
        )
        .then((res) => {
          observer.next(res);
          observer.complete();

          observer.complete();
        })
        .catch((err) => {
          this.alertService.showAlert(err);
        });
    });
    return transaction$;
  }

  getPicking(leaf = []) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead(
          'stock.picking',
          leaf,
          [
            'display_name',
            'scheduled_date',
            'location_id',
            'location_dest_id',
            'move_lines',
            'priority',
          ],
          0,
          0,
          {},
          'priority asc'
        )
        .then((res) => {
          observer.next(res);
          observer.complete();
        });
    });
    return transaction$;
  }
  getMoveById(id) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .read(
          'stock.move',
          [id],
          ['product_id', 'date', 'reference', 'product_uom', 'product_uom_qty'],
          {}
        )
        .then((res) => {
          observer.next(res);
          observer.complete();
        });
    });
    return transaction$;
  }
  searchProductByLine(code) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead('product.product', [['barcode', '=', code]], [], 0, 0, {})
        .then((res) => {
          observer.next(res);
          observer.complete();
        });
    });
    return transaction$;
  }
  newLine(product_id, inventory_id, location_id, product_uom_id) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .call(
          'stock.inventory.line',
          'create',
          [{ product_id, inventory_id, location_id, product_uom_id }],
          {}
        )
        .then((res) => {
          observer.next(res);
          observer.complete();
        });
    });
    return transaction$;
  }

  getStockInventory(leaf = []) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead('stock.inventory', leaf, [], 0, 0, {}, 'id asc')
        .then(async (res) => {
          const len = res.records.length;
          for (let i = 0; i < len; i++) {
            let locations_id = res['records'][i]['location_ids'];
            let products_id = res['records'][i]['product_ids'];
            let res_locations = await this.odooRPC.read(
              'stock.location',
              locations_id,
              ['name']
            );
            res['records'][i]['locations'] = res_locations;
            let res_product = await this.odooRPC.read(
              'product.product',
              products_id,
              ['uom_id', 'uom_po_id', 'display_name', 'barcode', 'default_code']
            );
            res['records'][i]['products'] = res_product;
          }

          observer.next(res);
          observer.complete();
          //});
        });
    });
    return transaction$;
  }
  getStockInventoryLine(leaf = [], storage = 'stock_inventory') {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead('stock.inventory.line', leaf, [], 0, 0, {}, 'id asc')
        .then((res) => {
          var self = this;
          let product_ids = res.records.map((e) => e.product_id[0]);
          this.odooRPC
            .read('product.product', product_ids, [
              'uom_id',
              'uom_po_id',
              'barcode',
              'default_code',
            ])
            .then((res_product) => {
              let product_dict: any = {};
              res_product.map(function (p) {
                product_dict[p['id']] = p;
              });
              res['records'].forEach(function (part, index) {
                res['records'][index]['barcode'] =
                  product_dict[part['product_id'][0]]['barcode'];
                res['records'][index]['default_code'] =
                  product_dict[part['product_id'][0]]['default_code'];
                res['records'][index]['uom_po_id'] =
                  product_dict[part['product_id'][0]]['uom_po_id'];
                res['records'][index]['uom_id'] =
                  product_dict[part['product_id'][0]]['uom_id'];
                if (self.getQuantity(storage, res['records'][index].id) > -1) {
                  const cant = self.getQuantity(
                    storage,
                    res['records'][index].id
                  );
                  res['records'][index]['scanned_qty'] = cant;
                  res['records'][index]['product_qty'] = cant;
                } else {
                  res['records'][index]['scanned_qty'] =
                    res['records'][index]['product_qty'];
                }

                observer.next(res);
                observer.complete();
              });
            });
          //});
        });
    });
    return transaction$;
  }

  getStockInventoryLineUbications(leaf = []) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead('stock.inventory.line', leaf, [], 0, 0, {}, 'id asc')
        .then((res) => {
          var self = this;
          let locations_ids = res['records'].map(function (move) {
            return move['location_id'][0];
          });
          this.odooRPC
            .read('stock.location', locations_ids, ['name'])
            .then((res_locations) => {
              observer.next(res_locations);
              observer.complete();
            });
          //});
        });
    });
    return transaction$;
  }

  getMovesLines(leaf = []) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead('stock.move.line', leaf, [], 0, 0, {}, 'id asc')
        .then((res) => {
          let product_ids = res['records'].map(function (move) {
            return move['product_id'][0];
          });

          let locations_ids = res['records'].map(function (move) {
            return move['location_id'][0];
          });
          let locations_dest_ids = res['records'].map(function (move) {
            return move['location_dest_id'][0];
          });

          // "[('categ_id', 'child_of', 94)]"
          const locations = [
            ...new Set([...locations_ids, ...locations_dest_ids]),
          ];
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
              this.odooRPC
                .read('stock.location', locations, ['name'])
                .then((res_locations) => {
                  let location_dict: any = {};
                  res_locations.map(function (p) {
                    location_dict[p['id']] = p;
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
                    res['records'][index]['location_name'] =
                      location_dict[part['location_id'][0]]['name'];
                    res['records'][index]['location_dest_name'] =
                      location_dict[part['location_dest_id'][0]]['name'];

                    self.odooRPC
                      .searchRead(
                        'stock.location',
                        [
                          [
                            'id',
                            'child_of',
                            res['records'][0]['location_dest_id'][0],
                          ],
                        ],
                        ['name', 'id'],
                        0,
                        0,
                        {}
                      )
                      .then((res_child) => {
                        let path_three = '';
                        for (let i = 0; i < res_child.length; i++) {
                          path_three += res_child.records[i].name;
                          i + 1 !== res_child.length
                            ? (path_three += '/')
                            : null;
                        }
                        res['records'][index]['children_path'] = path_three;
                        res['records'][index]['children'] =
                          res_child['records'];
                      });

                    //['stock.location'].search([['location_id', 'child_of', 12]])

                    if (
                      self.getQuantity('mov_int', res['records'][index].id) > -1
                    ) {
                      const cant = self.getQuantity(
                        'mov_int',
                        res['records'][index].id
                      );
                      res['records'][index]['scanned_qty'] = cant;
                      //res['records'][index]['quantity_done'] = cant;
                    } else {
                      res['records'][index]['scanned_qty'] = 0;
                    }

                    res['records'][index]['scanned_qty'] =
                      res['records'][index]['scanned_qty'] + 0;
                    //res['records'][index]['qty_done'];
                  });

                  observer.next(res);
                  observer.complete();
                });
            });
        });
    });
    return transaction$;
  }

  getMoves(leaf, storage = 'moves', get_lines = false) {
    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .searchRead(
          'stock.move',
          leaf,
          [
            'product_id',
            'name',
            'product_uom_qty',
            'product_uom', // UNIDAD DE MEDIDA ESTA EN LA ORDEN DE COMPRA
            'reserved_availability',
            'quantity_done',
            'sequence',
            'picking_id',
            'company_id',
            'location_id',
            'location_dest_id',
            'purchase_line_id',
            'move_line_ids',
            'move_line_nosuggest_ids',
            'origin',
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
                if (self.getQuantity(storage, res['records'][index].id) > -1) {
                  const cant = self.getQuantity(
                    storage,
                    res['records'][index].id
                  );
                  res['records'][index]['scanned_qty'] = cant;
                  res['records'][index]['quantity_done'] = cant;
                } else {
                  res['records'][index]['scanned_qty'] = 0;
                }
              });
              if (get_lines) {
                let move_ids = res['records'].map(function (move) {
                  return move['id'];
                });

                this.odooRPC
                  .searchRead(
                    'stock.move.line',
                    [['move_id', 'in', move_ids]],
                    [
                      'move_id',
                      'picking_id',
                      'location_id',
                      'location_dest_id',
                      'state',
                    ]
                  )
                  .then((lines) => {
                    observer.next(res);
                    observer.complete();
                  });
              } else {
                observer.next(res);
                observer.complete();
              }
            });
        })
        .catch((err) => {
          this.alertService.showAlert(err);
        });
    });
    return transaction$;
  }
  public getQuantity(storage, id) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array && scanned_qty_array[storage]) {
      let element = scanned_qty_array[storage].find((e) => id == e.id);
      if (element) {
        return element.scanned_qty;
      }
    }
    return -1;
  }

  move_products(storage, move_id, qty_done, description_picking = '') {
    //let difference = move_id.move_line_ids.filter(x => !move_id.move_line_nosuggest_ids.includes(x));

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

    this.deleteQuantity(storage, move_id.move_id);

    const transaction$ = new Observable((observer) => {
      if (move_id.move_line_ids.length) {
        if (move_id['qty_done']) {
          move_line['qty_done'] = qty_done + move_id['qty_done'];
        } else {
          move_line['qty_done'] = qty_done;
        }
        this.odooRPC
          .call(
            'stock.move.line',
            'write',
            [[move_id.move_line_ids[0]], move_line],
            {}
          )
          .then((res) => {
            observer.next(move_id.move_line_ids[0]);
            observer.complete();
          })
          .catch((err) => {
            this.alertService.showAlert(err);
          });
      } else {
        this.odooRPC
          .call('stock.move.line', 'create', [move_line], {})
          .then((res) => {
            observer.next(res);
            observer.complete();
          })
          .catch((err) => {
            this.alertService.showAlert(err);
          });
      }
    });

    return transaction$;
  }

  move_line_products(
    storage,
    move_line_id,
    scanned_qty,
    location,
    description_picking = ''
  ) {
    // Si la cantidad escaneada esta definida
    // la qty_done es la cantidad escaneada + la ya realizada
    let move_line = {
      qty_done: scanned_qty
        ? scanned_qty +
          (move_line_id['qty_done'] ? move_line_id['qty_done'] : 0)
        : move_line_id['qty_done'],
      location_dest_id: location.id,
    };
    // Verificar el local storage
    this.deleteQuantity(storage, move_line_id.id);

    const transaction$ = new Observable((observer) => {
      this.odooRPC
        .call('stock.move.line', 'write', [[move_line_id['id']], move_line], {})
        .then((res) => {
          observer.next({
            name: move_line_id.product_id[1],
            qty_done: move_line.qty_done,
          });
          observer.complete();
        })
        .catch((err) => {
          console.log(err);
          this.alertService.showAlert(err);
        });
    });
    return transaction$;
  }

  private pushObject(storage, id, scanned_qty, array) {
    const obj = {
      id,
      scanned_qty,
    };
    array.push(obj);

    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array) {
      if (scanned_qty_array && scanned_qty_array[storage]) {
        scanned_qty_array[storage] = array;
      } else {
        scanned_qty_array[storage] = array;
      }
    } else {
      scanned_qty_array = {
        [storage]: array,
      };
    }
    localStorage.setItem('scanned_qty', JSON.stringify(scanned_qty_array));
  }
  deleteQuantity(storage, id) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));

    if (scanned_qty_array && scanned_qty_array[storage]) {
      let index = scanned_qty_array[storage].findIndex((e) => id == e.id);
      if (index > -1) {
        scanned_qty_array[storage].splice(index, 1);
        localStorage.setItem('scanned_qty', JSON.stringify(scanned_qty_array));
      }
    }
  }

  setQuantity(storage, id, scanned_qty) {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array && scanned_qty_array[storage]) {
      let index = scanned_qty_array[storage].findIndex((e) => id == e.id);
      if (index > -1) {
        let element = scanned_qty_array[storage].find((e) => id == e.id);
        element.scanned_qty += scanned_qty;
        scanned_qty_array[storage][index] = element;
        localStorage.setItem('scanned_qty', JSON.stringify(scanned_qty_array));
      } else {
        this.pushObject(
          storage,
          id,
          scanned_qty,
          scanned_qty_array[storage] ? scanned_qty_array[storage] : []
        );
      }
    } else {
      this.pushObject(storage, id, scanned_qty, []);
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
          this.alertService.showAlert(err);
        });
    });

    return transaction$;
  }
}
