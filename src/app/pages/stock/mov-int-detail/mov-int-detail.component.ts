import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  isValid: Boolean = false;
  forceLocation: Boolean = false;
  products = [];
  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private changeDetectorRef: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.getMoves();
  }
  selectLocation() {
    this.action = 'select_location';
  }
  leaveProduct() {
    this.done_log = '';
    this.action = 'leave';
  }

  getLocationDest() {
    const location_dest_id = this.moves.reduce((unique, o) => {
      if (
        !unique.some(
          (obj) => obj.location_dest_id[0] === o.location_dest_id[0]
        ) &&
        o.scanned_qty > 0
      ) {
        unique.push(o);
      }
      return unique;
    }, []);
    return location_dest_id;
  }
  filterLocations() {
    const moves_filter = this.moves.filter(
      (e) => e.product_uom_qty > e.qty_done && e.state != 'done'
    );
    this.location_id = moves_filter.reduce((unique, o) => {
      if (!unique.some((obj) => obj.location_id[0] === o.location_id[0])) {
        unique.push(o);
      }
      return unique;
    }, []);
  }
  searchByCode(code) {
    switch (this.action) {
      case 'select_location':
        this.changeDetectorRef.detectChanges();

        this.select_location_product(code);
        break;
      case 'get':
        break;
      case 'leave':
       this.changeDetectorRef.detectChanges();

        this.leave_pruduct_location(code);
        break;
    }
  }
  leave_pruduct_location(code) {
    let i = 0;
    let childrens;
    let location = null;
    if (this.forceLocation){
      // is valid location
      location = {'id':1, 'name':'code'};
    } else {
      while (i < this.getLocationDest().length && !location) {
        childrens = this.getLocationDest()[i].children;
        location = childrens.find((e) => e.name === code);
        if (!location) {
          i += 1;
        }
      }

    }
    if (location) {
      this.changeDetectorRef.detectChanges();
 
      this.moverProductos(location);
      this.isValid = true;
    } else {
      alert('Escaneo ubicación incorrecta');
    }
    return;
  }
  back() {
    this.isValid = false;
    this.selected_location = true;
    this.action = 'select_location';
    this.filterLocations();
  }
  select_location_product(code) {
    const index = this.moves.findIndex((e) => e.location_name === code);
    this.moves[index];
    this.select_location(this.moves[index].location_id[0]);
  }
  moverProductos(location) {
    this.changeDetectorRef.detectChanges();

    let scanned_qty_array = JSON.parse(localStorage.getItem('scanned_qty'));
    if (scanned_qty_array && scanned_qty_array['mov_int']) {
      const len = scanned_qty_array['mov_int'].length;
      for (let i = 0; i < len; i++) {
        let selected_move: any = {};
        selected_move = this.moves.find(
          (e) => e.id === scanned_qty_array['mov_int'][i]['id']
        );
        if (!selected_move) {
          continue;
        }
        this.changeDetectorRef.detectChanges();

        this.stockService
          .move_line_products(
            'mov_int',
            selected_move,
            scanned_qty_array['mov_int'][i]['scanned_qty'],
            location
          )
          .subscribe((r) => {
            selected_move['qty_done'] = r['qty_done'];
            selected_move['scanned_qty'] = 0;
            this.done_log += '\n' + r['name'] + '  ' + r['qty_done'];
            this.changeDetectorRef.detectChanges();

          });
      }
    }
  }
  validate() {
    this.stockService
      .button_validate(this.moves[0]['picking_id'][0])
      .subscribe((r) => {
        if (r) {
          alert('No se pudo validar el picking');
        } else {
          alert('Exito al validar el picking');
        }
      });
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
    this.filterLocations();
  }
  select_location(location_id) {
    this.products = this.getProductsByLocation(location_id);
  }
  refresh() {}
}
