import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ProductService } from "../../_services/product.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { ConfigService } from "../../_services/config.service";

@Component({
  selector: "app-zpl-file",
  templateUrl: "./zpl-file.component.html",
  styleUrls: ["./zpl-file.component.css"],
})
export class ZplFileComponent implements OnInit {
  product_id: number;
  qty: number = 3;
  product: any = {};
  spinner: boolean = true;
  fileUrl;
  printUrl: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ProductService,
    private sanitizer: DomSanitizer,
    private location: Location,
    public ConfigService: ConfigService
  ) {}

  ngOnInit(): void {
    this.printUrl = this.ConfigService.params.printUrl;

    this.product_id = this.route["params"]["value"]["product_id"];
    this.qty = Number(this.route["params"]["value"]["qty"]);
    this.ProductService.readProduct(this.product_id).subscribe((res) => {
      this.product = res["records"][0];
      this.spinner = false;
      this.createZPL();
    });
  }
  createZPL() {
    this.spinner = true;

    let data = "";
    for (let i = 0; i < this.qty; i++) {
      data =
        data +
        "^XA ~TA000 ~JSN ^LT0 ^MNW ^MTT ^PON ^PMN ^LH0,0 ^JMA ^PR8,8 ~SD15 ^JUS ^LRN ^CI27 ^PA0,1,1,0 ^XZ ^XA ^MMT ^PW609 ^LL203 ^LS0 ^FT11,36^A0N,28,28^FH^CI28^FD" +
        this.product["name"] +
        "^FS^CI27 ^BY3,3,81^FT36,142^BCN,,Y,N  ^FH^FD>:" +
        this.product["default_code"] +
        "^FS^PQ1,0,1,Y ^XZ ";
    }
    const blob = new Blob([data], { type: "application/octet-stream" });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    this.spinner = false;
    // https://esstudio.site/2019/02/16/downloading-saving-and-opening-files-with-cordova.html
    //let storageLocation = cordova.file.externalDataDirectory;
  }

  saveZPL() {
    this.spinner = true;

    let data = "";
    for (let i = 0; i < this.qty; i++) {
      data =
        data +
        "^XA ~TA000 ~JSN ^LT0 ^MNW ^MTT ^PON ^PMN ^LH0,0 ^JMA ^PR8,8 ~SD15 ^JUS ^LRN ^CI27 ^PA0,1,1,0 ^XZ ^XA ^MMT ^PW609 ^LL203 ^LS0 ^FT11,36^A0N,28,28^FH^CI28^FD" +
        this.product["name"] +
        "^FS^CI27 ^BY3,3,81^FT36,142^BCN,,Y,N  ^FH^FD>:" +
        this.product["default_code"] +
        "^FS^PQ1,0,1,Y ^XZ ";
    }
    // https://esstudio.site/2019/02/16/downloading-saving-and-opening-files-with-cordova.html
    var blob = new Blob([data], {
      type: "text/plain",
    });
    //let storageLocation = cordova.file.externalDataDirectory;
    //var folderPath = storageLocation;
    this.spinner = false;
  }

  sendZPL() {
    this.spinner = true;
    let self = this;
    let data = "";
    for (let i = 0; i < this.qty; i++) {
      data =
        data +
        "^XA ~TA000 ~JSN ^LT0 ^MNW ^MTT ^PON ^PMN ^LH0,0 ^JMA ^PR8,8 ~SD15 ^JUS ^LRN ^CI27 ^PA0,1,1,0 ^XZ ^XA ^MMT ^PW609 ^LL203 ^LS0 ^FT11,36^A0N,28,28^FH^CI28^FD" +
        this.product["name"] +
        "^FS^CI27 ^BY3,3,81^FT36,142^BCN,,Y,N  ^FH^FD>:" +
        this.product["default_code"] +
        "^FS^PQ1,0,1,Y ^XZ ";
    }

    var request = new XMLHttpRequest();
      console.log(request);
    request.ontimeout= function() {
          self.spinner = false;
          alert("Timeout");
    }

    request.onerror= function() {
          self.spinner = false;
          alert("error");
    }
    request.onreadystatechange = function() {

      if (request.readyState == 4) {
        if (request.status == 200) {
          self.spinner = false;
          self.back();
        } else {
          self.spinner = false;
          alert("error");
        }
      }
    };

    request.open("POST", this.printUrl, true);
    request.send(data);
  }

  back(): void {
    this.location.back();
  }
}
