import { Injectable } from '@angular/core';
//declare let _window().BTPrinter: any;
declare let cordova: any;
declare let BTPrinter: any;

import { Observable } from 'rxjs';
//https://medium.com/@EliaPalme/how-to-wrap-an-angular-app-with-apache-cordova-909024a25d79
function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  printers: any = [];
  selected_printer: string;

  constructor() {}

  searchPrinters() {
    const printOBS = new Observable((observer) => {
      var printersList: any = [];
      _window().BTPrinter.list((data: any) => {
        data.forEach((part: any, index: number, array_data: any) => {
          if (index % 3 === 0) {
            observer.next({
              MAC: array_data[index + 1],
              name: array_data[index],
            });
          }
        });
        observer.complete();
      });
    });
    return printOBS;
  }

  connectPrinter(PrinterName) {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.connect(
        function (data) {
          this.selected_printer = PrinterName;

          observer.next(data);
          observer.complete();
        },
        function (err) {
          alert('Err:' + err);
          observer.error(err);
        },
        PrinterName
      );
    });
    return printOBS;
  }
  connected() {
    const printOBS = new Observable((observer) => {
      if (_window().BTPrinter) {
        _window().BTPrinter.connected(
          function (data) {
            observer.next(data);
            observer.complete();
          },
          function (err) {
            console.log('Err:', err);
            observer.error(err);
          }
        );
      }
    });
    return printOBS;
  }
  status() {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.status(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        }
      );
    });
    return printOBS;
  }

  disconnect() {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.disconnect(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          alert('Err:' + err);
          observer.error(err);
        }
      );
    });
    return printOBS;
  }

  printTemplate(template: string) {
    var lines = template.split('\n');
    lines.forEach((line: string, index: number) => {
      var instuction = line.split('|');
      if (instuction[0] == 'text') {
        this.printText(instuction[1]);
      } else if (instuction[0] == 'barcode') {
        this.printBarcode(instuction[1], instuction[2]);
      } else if (instuction[0] == 'qr') {
        this.printQRCode(instuction[1], Number(instuction[2]));
      } else if (instuction[0] == 'linefeed') {
        this.lineFeed();
      }
    }, this);
  }

  printPOSCommand(command) {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.printPOSCommand(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        },
        command
      );
    });
    return printOBS;
  }

  lineFeed() {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.printPOSCommand(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        },
        '0A'
      );
    });
    return printOBS;
  }
  printBase64(base64: string, align: string = '0') {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.printBase64(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        },
        base64,
        align
      );
    });
    return printOBS;
  }

  printText(
    stringToPrint: string = 'String to Print',
    size: string = '0',
    align: string = '0'
  ) {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.printText(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        },
        stringToPrint,
        size,
        align
      );
    });
    return printOBS;
  }

  printBarcode(
    system: string,
    data: string,
    align: string = '1',
    position: string = '2',
    font: string = '0',
    height: string = '64'
  ) {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.printBarcode(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        },
        system,
        data,
        align,
        position,
        font,
        height
      );
    });
    return printOBS;
  }

  printQRCode(
    data: string,
    align: number,
    model: number = 49,
    size: number = 32,
    eclevel: number = 50
  ) {
    const printOBS = new Observable((observer) => {
      _window().BTPrinter.printQRCode(
        function (data) {
          observer.next(data);
          observer.complete();
        },
        function (err) {
          console.log('Err:', err);
          observer.error(err);
        },
        data,
        align,
        model,
        size,
        eclevel
      );
    });
    return printOBS;
  }

  testsPrinters() {
    const printOBS = new Observable((observer) => {
      var printersList: any = [];
      var printers: any = [
        'nombre 1',
        'MAC 1',
        0,
        'nombre 2',
        'MAC 2',
        0,
        'nombre 3',
        'MAC 3',
        0,
      ];

      printers.forEach((part: any, index: number, array_data: any) => {
        if (index % 3 === 0) {
          observer.next({
            MAC: array_data[index + 1],
            name: array_data[index],
          });
        }
      });
      observer.complete();
    });
    return printOBS;
  }
}
