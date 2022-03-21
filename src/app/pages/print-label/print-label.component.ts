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
//import { BarcodeProvider } from "../../_services/intent.service";
import { ConfigService } from "../../_services/config.service";
import { AlertService } from "../../_services/alert.service";

function _window(): any {
  // return the global native browser window object
  return window;
}

@Component({
  selector: "app-print-label",
  templateUrl: "./print-label.component.html",
  styleUrls: ["./print-label.component.css"],
  providers: [],
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
  printAuto: boolean = false;
  printAutoDelay: number = 300;
  spinner: boolean = false;
  log: string = "";
  showLog: boolean = false;



  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("search") searchElement: ElementRef;


  constructor(
    public productService: ProductService,
    protected sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public PrinterService: PrinterService,
    public events: Events,
    private changeDetectorRef: ChangeDetectorRef,
    public ConfigService: ConfigService,
    private alertService: AlertService
  ) {

    
  }

  ngOnInit(): void {
    this.printAuto = this.ConfigService.params.printAuto;
    this.printAutoDelay = this.ConfigService.params.printAutoDelay;
    this.inputMethod = this.ConfigService.params.scanMethod;
    this.showLog = this.ConfigService.params.showLog;

    this.searchForm = this.formBuilder.group({
      search: ["", Validators.required],
    });

    //this.connected();
    this.get_pricelist();

    this.textBus = "";
    if (this.inputMethod == "form") {
      this.searchElement.nativeElement.focus();
    }


    let parent = this;

    if(this.ConfigService.params.PrinterName){
      this.conectPrinter();      
    }
  }

   //  

  conectPrinter(){
    this.PrinterService.connected().subscribe(
      (res: any) => {
        if (res){
          console.log('impresora conectada');
        } else {
          this.PrinterService.connectPrinter(this.ConfigService.params.PrinterName).subscribe();

          //PrinterName
        }
      }
    );
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
    //alert('searchSting' + searchSting);
    let parent= this; 

    this.log += '|' + searchSting + "|";
    this.product = false;
    this.spinner = true;
    this.changeDetectorRef.detectChanges();
    this.productService.searchByCode(searchSting).subscribe((res) => {
      if (res["length"] > 0) {
        parent.product = res["records"][0];
        parent.log = parent.log + res["records"][0]["name"] + "|";
        parent.product['prices'] = [];
        parent.load_price(res["records"][0]["id"]);
      } else {
        this.alertService.showAlert("Codigo invalido");
        this.spinner = false;
      }
    });
    this.textBus = "";
  }

  load_price(product_id) {
    let printAutoDelay: number = this.printAutoDelay;
    let parent = this; 
    this.productService
      .load_price(product_id, this.selected_pricelist_id)
      .subscribe({
        next(price) {
          parent.log = parent.log + JSON.stringify(price) + "|";
          parent.product["prices"].push(price);
        },
        complete() {
          parent.spinner = false;
          if(parent){

            parent.changeDetectorRef.detectChanges();
          }

          if (parent.printAuto) {
            setTimeout(() => {
              parent.printTag();
            }, parent.printAutoDelay);
          }
        },
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
    //  this.load_price(this.product.id);
  }
  printTag() {
    if (this.product) {
      html2canvas(document.querySelector(".etiqueta"), {
        width: this.ConfigService.params.labelWidth,
        height: this.ConfigService.params.labelHeight,
        windowWidth: this.ConfigService.params.labelWidth,
        windowHeight: this.ConfigService.params.labelHeight,
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

  toglePrintAuto() {
    this.printAuto = !this.printAuto;
  }
}
