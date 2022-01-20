import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from '../../_services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ConfigService } from '../../_services/config.service';
import { StockService } from '../../_services/stock.service';

@Component({
  selector: 'app-zpl-file',
  templateUrl: './zpl-file.component.html',
  styleUrls: ['./zpl-file.component.css'],
})
export class ZplFileComponent implements OnInit {
  product_id: number;
  move_id: number;
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
    public ConfigService: ConfigService,
    public StockService: StockService

  ) {}

  ngOnInit(): void {
    this.printUrl = this.ConfigService.params.printUrl;

    this.product_id = this.route['params']['value']['product_id'];
    this.move_id = this.route['params']['value']['move_id'];

    this.qty = Number(this.route['params']['value']['qty']);
    if (this.product_id){
      this.ProductService.readProduct(this.product_id).subscribe((res) => {
        this.product = res['records'][0];
        this.spinner = false;
      });      
    }
    else if (this.move_id){
      this.StockService.getMoveById(Number(this.move_id)).subscribe((res) => {
        console.log(res);
        let name = res[0]['product_id'][1];

        this.product = {
            name: name,
            default_code:name.split(']')[0].replace('[',''),
            product_uom_id:res[0]['product_uom'],
          }

        this.spinner = false;
      });      
    }

  }


  sendZPL() {
    this.spinner = true;
    let self = this;
    let data = '';
    let zpl = '^XA ~TA000 ~JSN ^LT0 ^MNW ^MTT ^PON ^PMN ^LH0,0 ^JMA ^PR8,8 ~SD15 ^JUS ^LRN ^CI27 ^PA0,1,1,0 ^XZ ^XA ^MMT ^PW609 ^LL203 ^LS0 ^FT11,36^A0N,16,16^FH^CI28^FD' + 
    'product_name' + 
    '^FS^CI27 ^BY2,2,81^FT36,142^BCN,,Y,N  ^FH^FD>:' + 
    'default_code' + '^FS^PQ1,0,1,Y' +
    '^FT11,200^A0N,28,28^FH^CI28^FDUnidad:'+ 'product_uom_id' +'^FS^CI27 ^XZ';
    zpl = zpl.replace('product_name',this.product['name'])
    zpl = zpl.replace('default_code',this.product['default_code'])
    zpl = zpl.replace('product_uom_id',this.product['product_uom_id'][1])

    console.log(zpl);
    for (let i = 0; i < this.qty; i++) {
      data = data + zpl;
    }

    var request = new XMLHttpRequest();
    request.ontimeout = function () {
      self.spinner = false;
      alert('Timeout');
    };

    request.onerror = function (err) {
      self.spinner = false;
      console.log(err);
      alert(JSON.stringify(err));
    };
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          self.spinner = false;
          self.back();
        } else {
          self.spinner = false;
          alert('error status ' + request.status);
        }
      }
    };

    request.open('POST', this.printUrl, true);
    request.send(data);
  }

  back(): void {
    this.location.back();
  }
}
