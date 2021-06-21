import { Injectable } from "@angular/core";
import { OdooRPCService } from "./odoo-rpc.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PriceChangesService {

  constructor(public odooRPC: OdooRPCService) {}

  getPriceHistory(fromDate, location_ids=[]) {
    const transaction$ = new Observable((observer) => {
      const leaf = [['last_change', '>=',fromDate]];

      this.odooRPC
        .searchRead(
          "watch.products.price.changes",
          leaf,
          ['product_tmpl_id','last_change'],
          300,0,{"lang": "es_AR"}, 'last_change asc'
        )
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
