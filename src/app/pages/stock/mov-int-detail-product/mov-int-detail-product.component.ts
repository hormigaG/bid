import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../_services/stock.service';

@Component({
  selector: 'app-mov-int-detail-product',
  templateUrl: './mov-int-detail-product.component.html',
  styleUrls: ['./mov-int-detail-product.component.css'],
})
export class MovIntDetailProductComponent implements OnInit {
  location_id: Number = 0;
  moves: any = [];
  product_id: any = [];
  inputMethod: String = 'textBus';
  constructor(
    private route: ActivatedRoute,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.getMoves();
  }
  searchByCode(code) {
    console.log(code);
  }
  filterLocations() {
    this.product_id = this.moves.reduce((unique, o) => {
      if (!unique.some((obj) => obj.product_id[0] === o.product_id[0])) {
        unique.push(o);
      }
      return unique;
    }, []);
    console.log(this.product_id);
  }
  getMoves() {
    this.location_id = this.route['params']['value']['location_id'];
    let leaf = [['location_id', '=', Number(this.location_id)]];
    this.stockService.getMoves(leaf).subscribe((res) => {
      this.moves = res['records'];
      this.filterLocations();
    });
  }
}
