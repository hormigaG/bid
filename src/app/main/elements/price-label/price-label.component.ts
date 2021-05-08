import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-price-label',
  templateUrl: './price-label.component.html',
  styleUrls: ['./price-label.component.css']
})
export class PriceLabelComponent implements OnInit {

  constructor() { }
  @Output() printLabel = new EventEmitter();

  @Input() product: any;

  ngOnInit(): void {
  }

  print(){
  	this.printLabel.emit();
  }

}
