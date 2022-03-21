import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  show: boolean = false;
  msg: String = '';

  constructor() {}
  public showAlert(msg) {
    this.msg = msg;
    this.show = true;
  }
  public hiddeAlert() {
    this.show = false;
    this.msg = '';
  }
  public getStatus() {
    return this.show;
  }
  public getMsg() {
    return this.msg;
  }
}
