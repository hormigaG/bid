import { Component, OnInit } from '@angular/core';
import { StockService } from "../../../_services/stock.service";
import { ConfigService } from "../../../_services/config.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-ent-wh-selector',
  templateUrl: './ent-wh-selector.component.html',
  styleUrls: ['./ent-wh-selector.component.css']
})
export class EntWhSelectorComponent implements OnInit {
  wh : any = []
  constructor(
    public stockService: StockService,
    private ConfigService: ConfigService,

    private route: ActivatedRoute,

    public Router: Router,

    ) { }

  ngOnInit(): void {
    this.getWh();
    if (this.ConfigService.params.DefaultEntryLocation){
      this.Router.navigateByUrl('/stock/location-entry/' + this.ConfigService.params.DefaultEntryLocation);
    }
  }

  getWh(){
        this.stockService.getWh().subscribe((wh) => {
          this.wh = wh['records'];
        });
  }

}
