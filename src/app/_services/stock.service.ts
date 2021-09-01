import { Injectable } from "@angular/core";
import { OdooRPCService } from "./odoo-rpc.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(public odooRPC: OdooRPCService) {}

  getWh() {
    const transaction$ = new Observable((observer) => {
      var prlsIds: any = [];


      this.odooRPC
        .searchRead("stock.warehouse", [], ["name","lot_stock_id","wh_input_stock_loc_id"], 0,0)
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
        .searchRead("stock.move", leaf, [
          "product_id",
          "name",
          "product_uom_qty",
          "reserved_availability",
          "quantity_done",
          "sequence",
          "picking_id",
          "company_id",
          "location_id",
          "location_dest_id"
          ], 0,0)
        .then((res) => {
          let product_ids = res['records'].map( function(move){
            return move['product_id'][0]
          });
          this.odooRPC
            .read("product.product",product_ids,['uom_id','barcode','default_code', 'modelo_articulo']).then((products) =>{
              let product_dict:any = {}; 
              products.map(function(p){
                product_dict[p['id']] = p; 
              })
              res["records"].forEach(function(part, index, theArray) {

                res["records"][index]['barcode'] = product_dict[part['product_id'][0]]['barcode'];
                res["records"][index]['default_code'] = product_dict[part['product_id'][0]]['default_code'];
                res["records"][index]['modelo_articulo'] = product_dict[part['product_id'][0]]['modelo_articulo'];
                res["records"][index]['uom_id'] = product_dict[part['product_id'][0]]['uom_id'];
                res["records"][index]['scanned_qty'] = 0;

              })

              observer.next(res);
              observer.complete();
            })

        })
        .catch((err) => {
          alert(err);
        });
    });
    return transaction$;
  }

  move_products(move_id, qty_done, description_picking='') {
      let move_line = {
        picking_id : move_id.picking_id[0],
        move_id : move_id.id,
        company_id: move_id.company_id[0],
        product_id: move_id.product_id[0],
        product_uom_id: move_id.uom_id[0],
        location_id: move_id.location_id[0],
        location_dest_id: move_id.location_dest_id[0],
        description_picking:description_picking,
        qty_done: qty_done || move_id['qty_done']

      }
      console.info(move_line);

    const transaction$ = new Observable((observer) => {
      this.odooRPC
         .call('stock.move.line', 'create', [move_line], {}).then((res) =>{

              observer.next(res);
              observer.complete();

         }).catch((err) => {
           alert(err);
         });
        
    });

    return transaction$;
    }

}
