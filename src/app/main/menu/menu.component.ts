import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isFullScreen: Boolean = false;
  constructor() {}

  ngOnInit(): void {}
  fullScreen() {
    const elem = document.documentElement;
    if (!this.isFullScreen) {
      this.isFullScreen = !this.isFullScreen;
      let methodToBeInvoked = elem.requestFullscreen;
      if (methodToBeInvoked) methodToBeInvoked.call(elem);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullScreen = !this.isFullScreen;
      console.log('ya es full screen');
    }
  }
}
