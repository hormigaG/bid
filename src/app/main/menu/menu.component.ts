import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  fullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked =
      elem.requestFullscreen ||
      elem['mozRequestFullscreen'] ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

}
