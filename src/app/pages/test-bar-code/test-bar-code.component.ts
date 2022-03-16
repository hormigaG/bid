import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-bar-code',
  templateUrl: './test-bar-code.component.html',
  styleUrls: ['./test-bar-code.component.css'],
})
export class TestBarCodeComponent implements OnInit {
  text: any = 'ESTO SE REMPLAZA POR LO ESCANEADO';
  inputMethod: any = 'textBus';
  constructor() {}

  ngOnInit(): void {}
  searchByCode(event) {
    this.text = event;
  }
}
