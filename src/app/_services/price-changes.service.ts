import { Injectable } from '@angular/core';
import { OdooRPCService } from './odoo-rpc.service';
import { Observable } from 'rxjs';
import { AlertService } from '../_services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class PriceChangesService {
  constructor(
    public odooRPC: OdooRPCService,
    private alertService: AlertService
  ) {}

  getPriceHistory(fromDate, location_ids = []) {
    const transaction$ = new Observable((observer) => {
      const leaf = [['last_change', '>=', fromDate]];

      this.odooRPC
        .searchRead(
          'watch.products.price.changes',
          leaf,
          ['product_tmpl_id', 'last_change'],
          300,
          0,
          { lang: 'es_AR' },
          'last_change asc'
        )
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
