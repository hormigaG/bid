import { Component, OnInit } from '@angular/core';
import { StockService } from "../../../_services/stock.service";

@Component({
  selector: 'app-ent-wh-selector',
  templateUrl: './ent-wh-selector.component.html',
  styleUrls: ['./ent-wh-selector.component.css']
})
export class EntWhSelectorComponent implements OnInit {
  wh : any = []
  constructor(
    public stockService: StockService,

    ) { }

  ngOnInit(): void {
    this.getWh();
  }

  getWh(){
        this.stockService.getWh().subscribe((wh) => {
          this.wh = wh['records'];
        });
  }

}
