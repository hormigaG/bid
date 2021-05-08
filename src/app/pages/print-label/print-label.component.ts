import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { HostListener } from "@angular/core";
import { ProductService } from "../../_services/product.service";
import { PrinterService } from "../../_services/printer.service";
import html2canvas from "html2canvas";
import { environment } from "../../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Events } from "../../_services/events.service";
import { BarcodeProvider } from "../../_services/intent.service";

function _window(): any {
  // return the global native browser window object
  return window;
}

@Component({
  selector: "app-print-label",
  templateUrl: "./print-label.component.html",
  styleUrls: ["./print-label.component.css"],
  providers: [BarcodeProvider],
})
export class PrintLabelComponent implements OnInit {
  textBus: string = "";
  keyboardDisable: boolean = true;
  intefaceBlocked: boolean = false;
  product: any;
  pricelist_ids: any;
  selected_pricelist_id: any;
  printer_status: boolean;
  prices: any;
  capturedImage;
  searchForm: FormGroup;
  inputMethod = "textBus";
  printAuto: boolean = true;

  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("search") searchElement: ElementRef;

  private scans = [];
  private uiDatawedgeVersionAttention = true;

  constructor(
    public productService: ProductService,
    protected sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public PrinterService: PrinterService,
    public barcodeProvider: BarcodeProvider,
    public events: Events,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    events.subscribe("data:scan", (data: any) => {
      //  Update the list of scanned barcodes
      let scannedData =
        data.scanData.extras["com.symbol.datawedge.data_string"];
      let scannedType = data.scanData.extras["com.symbol.datawedge.label_type"];
      this.textBus = scannedData;
      this.searchByCode(scannedData);

      this.scans.unshift({
        data: scannedData,
        type: scannedType,
        timeAtDecode: data.time,
      });

      //  On older devices, if a scan is received we can assume the profile was correctly configured manually
      //  so remove the yellow highlight.
      this.uiDatawedgeVersionAttention = false;

      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ["", Validators.required],
    });

    this.connected();
    this.get_pricelist();

    this.textBus = "";
    if (this.inputMethod == "form") {
      this.searchElement.nativeElement.focus();
    }

    if (environment.production == false) {
      //this.printer_status = true;
    }

    this.barcodeProvider.BarcodeData.subscribe({
      next(barcode) {
        this.textBus = barcode;
        this.searchByCode(this.textBus);
      },
      complete() {
        console.log("sequence finished.");
      },
    });
  }

  connected() {
    this.PrinterService.connected().subscribe((res: any) => {
      this.printer_status = res;
    });
  }

  @HostListener("document:keypress", ["$event"])
  handleKeyboardpressEvent(event: KeyboardEvent) {
    if (this.inputMethod == "form" && event.keyCode == 13) {
      this.formSearch();
    }
    if (this.inputMethod != "textBus") {
      return;
    }
    if (event.keyCode == 13) {
      this.searchByCode(this.textBus);
    } else {
      this.textBus += event.key;
      event.stopPropagation();
    }
  }
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.inputMethod != "textBus") {
      return;
    }
    if (event.keyCode == 27) {
      this.textBus = "";
    } else if (event.keyCode == 8) {
      this.textBus = this.textBus.substring(0, this.textBus.length - 1);
    }
  }

  formSearch() {
    const search = this.searchForm.controls.search.value;
    this.searchByCode(search);
    this.searchForm.controls.search.patchValue("");
    this.searchElement.nativeElement.focus();
  }
  searchByCode(searchSting) {
    this.product = [];
    this.productService.searchByCode(searchSting).subscribe((res) => {
      if (res["length"] > 0) {
        this.product = res["records"][0];
        this.product.prices = [];
        this.load_price(res["records"][0].id);
      }
    });
    this.textBus = "";
  }

  load_price(product_id) {
    this.productService
      .load_price(product_id, this.selected_pricelist_id)
      .subscribe((res) => {
        this.product.prices.push(res);
        if (this.printAuto) {
          setTimeout(() => {
            this.printTag();
          }, 500);
        }
      });
  }
  get_pricelist() {
    this.productService.get_pricelists().subscribe((res) => {
      if (res["length"] > 0) {
        this.pricelist_ids = res["records"];
        this.selected_pricelist_id = res["records"];
      }
    });
  }
  setPriceList(pricelist_id) {
    this.selected_pricelist_id = pricelist_id;
    this.load_price(this.product.id);
  }
  printTag() {
    if (this.product) {
      html2canvas(document.querySelector(".etiqueta"), {
        width: 300,
        height: 200,
        windowWidth: 300,
        windowHeight: 200,
        backgroundColor: "#FFFFFF",
      }).then((canvas) => {
        let b64 = canvas.toDataURL();
        this.capturedImage = this.sanitizer.bypassSecurityTrustResourceUrl(
          b64.replace(/\n/g, "")
        );
        this.PrinterService.printBase64(b64).subscribe((res: any) => {
          //console.log(res);
          this.capturedImage = "";
        });
      });
    }
  }

  toglePrintAuto(){
    this.printAuto = !this.printAuto;

  }
}
