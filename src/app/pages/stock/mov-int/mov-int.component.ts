import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../_services/stock.service';

@Component({
  selector: 'app-mov-int',
  templateUrl: './mov-int.component.html',
  styleUrls: ['./mov-int.component.css'],
})
export class MovIntComponent implements OnInit {
  pickings: any = [];
  filter: any = [];
  constructor(public stockService: StockService) {}

  ngOnInit(): void {
    this.getPicking();
  }

  getPicking() {
    this.stockService.getPicking().subscribe((res) => {
      this.pickings = res['records'];
      console.log(this.pickings);
    });
  }

  goPicking(item) {
    console.log(item);
  }
}
