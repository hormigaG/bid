import { Component, OnInit } from '@angular/core';
import { PrinterService } from "../../_services/printer.service";

@Component({
  selector: 'app-pinter-state',
  templateUrl: './pinter-state.component.html',
  styleUrls: ['./pinter-state.component.css']
})
export class PinterStateComponent implements OnInit {


 constructor(public PrinterService: PrinterService) {}

  ngOnInit(): void {
  }

}
