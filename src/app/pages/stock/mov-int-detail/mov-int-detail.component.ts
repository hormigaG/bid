import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StockService } from '../../../_services/stock.service';
@Component({
  selector: 'app-mov-int-detail',
  templateUrl: './mov-int-detail.component.html',
  styleUrls: ['./mov-int-detail.component.css'],
})
export class MovIntDetailComponent implements OnInit {
  picking_id: Number = 0;
  moves: any = [];
  location_id: any = [];
  inputMethod: String = 'textBus';
  moves_int: any = [];
  action: String ="select_location"
  constructor(
    private route: ActivatedRoute,
    private stockService: StockService
  ) {}


  ngOnInit(): void {
    this.getMoves();
  }
  filterLocations() {
    this.location_id = this.moves.reduce((unique, o) => {
      if (!unique.some((obj) => obj.location_id[0] === o.location_id[0])) {
        unique.push(o);
      }
      return unique;
    }, []);
  }
  searchByCode(code) {
    switch (this.action) {
      case "select_location":
        console.log("select_location");
      case "get":
        console.log("get_products");
      case "leave":        
        console.log("leave_products");
     }
  }
  async moverProductos() {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array && scanned_qty_array['mov_int']) {
      const len = scanned_qty_array['mov_int'].length;
      for (let i = 0; i < len; i++) {
        await this.stockService.move_products(
          'mov_int',
          scanned_qty_array['mov_int'][i]['id'],
          scanned_qty_array['mov_int'][i]['scanned_qty']
        );
      }
    }
  }
  getMoves() {
    this.picking_id = this.route['params']['value']['picking_id'];
    let leaf = [['picking_id', '=', Number(this.picking_id)]];

    this.stockService.getMoves(leaf, 'internal', true).subscribe((res) => {
      this.moves = res['records'];
      console.log(res);
      this.filterLocations();
    });
  }
  refresh(){}
}
