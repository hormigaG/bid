import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { HoneyService } from '../app/_services/honey.service';
//import { Plugins } from '@capacitor/core';
//import { BarcodeProvider } from "./_services/intent.service"
//import { Events } from "./_services/events.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //providers: [BarcodeProvider],
})
export class AppComponent implements OnInit {
  title = 'Zebra';

  constructor(
    //private barcodeProvider: BarcodeProvider,
    //public events: Events,
    public HoneyService: HoneyService,

    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.HoneyService.startBarcode();
  }
}
