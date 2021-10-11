import { Injectable } from "@angular/core";

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
  constructor() {}
  startBarcode() {
    let self = this;
    cordova.plugins.honeywell.barcode.onBarcodeScanned(
      (result) => {
        self.BarcodeData.next(result.data);
        alert(result.data);
      },
      (error) => {
        alert(error);
      }
    );
  }

  test() {
    console.log("start test");

    setTimeout(() => {
      console.log("Netx");
      this.BarcodeData.next("MF");
      this.test();
    }, 3000);
  }
}
