import {Injectable, ApplicationRef } from '@angular/core';

import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
declare var cordova: any;

function _window(): any {
  // return the global native browser window object
  return window;
}
@Injectable({
  providedIn: "root",
})
export class HoneyService {
  BarcodeData = new BehaviorSubject(null); //la declaro como observable
  constructor(private ref: ApplicationRef) {}
  startBarcode() {

    let self = this;
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

  test() {
    console.log("start test");

    setTimeout(() => {

      this.BarcodeData.next("MF");
      this.test();
    }, 3000);
  }
}
