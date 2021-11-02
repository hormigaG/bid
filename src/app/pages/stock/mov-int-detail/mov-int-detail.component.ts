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
  getMoves() {
    this.picking_id = this.route['params']['value']['picking_id'];
    let leaf = [['picking_id', '=', Number(this.picking_id)]];

    this.stockService.getMoves(leaf).subscribe((res) => {
      this.moves = res['records'];
      this.filterLocations();
    });
  }
}
