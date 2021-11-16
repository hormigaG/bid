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
  done_log: String = '';
  moves: any = [];
  location_id: any = [];
  inputMethod: String = 'textBus';
  moves_int: any = [];
  action: String = 'select_location';
  selected_location = true;
  products = [];
  constructor(
    private route: ActivatedRoute,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.getMoves();
  }
  selectLocation() {
    this.action = 'select_location';
  }
  leaveProduct() {
    this.action = 'leave';
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
      case 'select_location':
        this.select_location_product(code);
      case 'get':
        console.log('get_products');
      case 'leave':
        this.leave_pruduct_location(code);
    }
  }
  leave_pruduct_location(code) {
    if (code === this.moves[0].location_dest_name) {
      console.log(code)
      this.moverProductos();
    } else {
      alert('Error, escaneo una ubicación erronea');
    }
  }
  select_location_product(code) {
    const index = this.moves.findIndex((e) => e.location_name === code);
    this.moves[index];
    this.select_location(this.moves[index].location_id[0]);
  }
  moverProductos() {
    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));

    if (scanned_qty_array && scanned_qty_array['mov_int']) {
      const len = scanned_qty_array['mov_int'].length;
      for (let i = 0; i < len; i++) {
        let selected_move:any = {}
        selected_move = this.moves.find(e => e.id = scanned_qty_array['mov_int'][i]['id']); 
         this.stockService.move_line_products(
          'mov_int',
          selected_move,
          scanned_qty_array['mov_int'][i]['scanned_qty']
        ).subscribe(r => {
              selected_move['qty_done'] = r['qty_done'] ; 
              selected_move['scanned_qty'] = 0;
              this.done_log += r['name'] + ' ' + r['qty_done'] + '\n'; 
          });
      }
    }
  }
  getProductsByLocation(id) {
    let products;
    products = this.moves.filter((e) => e.location_id[0] == id);
    this.selected_location = !this.selected_location;
    return products;
  }
  getMoves() {
    this.picking_id = this.route['params']['value']['picking_id'];
    let leaf = [['picking_id', '=', Number(this.picking_id)]];

    this.stockService.getMovesLines(leaf).subscribe((res) => {
      this.moves = res['records'];
      this.filterLocations();
    });
  }
  volver() {
    this.selected_location = true;
  }
  select_location(location_id) {
    this.products = this.getProductsByLocation(location_id);
  }
  refresh() {}
}
