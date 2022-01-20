import { Injectable, ApplicationRef } from '@angular/core';
import { LogService } from '../_services/log.service';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

declare var cordova: any;

function _window(): any {
  // return the global native browser window object
  return window;
}
@Injectable({
  providedIn: 'root',
})
export class HoneyService {
  BarcodeData = new BehaviorSubject(null); //la declaro como observable
  constructor(
    private ref: ApplicationRef,

    private logService: LogService
  ) {}

  startBarcode() {
    let self = this;
    console.log('startBarcode');
    if (typeof cordova !== 'undefined') {
      cordova.plugins.honeywell.barcode.onBarcodeScanned(
        (result) => {
          self.BarcodeData.next(result.data);
          self.ref.tick();
        },
        (error) => {
          alert(error);
        }
      );
    }
  }

  /* stopBarcode() {
    console.log('STOP BARCODE');
    const barcode = cordova.plugins.honeywell.barcode.onBarcodeScanned();
    const barcodePlugin =
      cordova.plugins.honeywell.barcode.HoneywellBarcodeScannerPlugin();

    this.logService.addLog('barcode', barcode);
    this.logService.addLog('plugin', barcodePlugin);
  } */

  testInput() {
    console.log('start test');

    setTimeout(() => {
      this.BarcodeData.next('Input');
      this.test();
    }, 3000);
  }

  test() {
    console.log('start test');

    setTimeout(() => {
      this.BarcodeData.next('896');
      this.test();
    }, 3000);
  }
}
