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
          "picking_id"
          ], 0,0)
        .then((res) => {
          let product_ids = res['records'].map( function(move){
            return move['product_id'][0]
          });
          this.odooRPC
            .read("product.product",product_ids,['barcode','default_code', 'modelo_articulo']).then((products) =>{
              let product_dict:any = {}; 
              products.map(function(p){
                product_dict[p['id']] = p; 
              })
              res["records"].forEach(function(part, index, theArray) {

                res["records"][index]['barcode'] = product_dict[part['product_id'][0]]['barcode'];
                res["records"][index]['default_code'] = product_dict[part['product_id'][0]]['default_code'];
                res["records"][index]['modelo_articulo'] = product_dict[part['product_id'][0]]['modelo_articulo'];

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

}
