import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../_services/log.service';
import * as moment from 'moment';
import {AlertService} from '../../../_services/alert.service'
@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
})
export class LogComponent implements OnInit {
  log: [];
  constructor(private logService: LogService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.log = this.logService.getLog();
  }
  testLog() {
    this.logService.addLog('test', 'aca va mi error');
    this.log = this.logService.getLog();
  }
  clearLog() {
    this.logService.purgeLog();
    this.log = [];
  }
  checkLog() {
    this.logService.checkLog();
    this.log = this.logService.getLog();
  }

  sendLog() {
    let log = this.logService.getLog();
    let logAux = '';
    for (let i = 0; i < log.length; i++) {
      logAux += log[i]['date'] + '\n';
      logAux += log[i]['component'] + '\n';
      logAux += log[i]['error'] + '\n';
      logAux += '-----\n';
    }
    let data = `appName=bid&date=${moment().format(
      'YYYY-MM-DD HH:mm:ss'
    )}&log=${logAux}`;
    var request = new XMLHttpRequest();
    var self = this
    request.open('POST', 'https://hormigag.ar/whm_logger/new', true);
    //request.open('POST', '/odoo/whm_logger/new', true);
    request.ontimeout = function () {
      self.alertService.showAlert('Timeout');
    };

    request.onerror = function (err) {
      console.log(err);
      self.alertService.showAlert(JSON.stringify(err));
    };

    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          self.alertService.showAlert('Log enviado ');
        } else {
          self.alertService.showAlert('error status ' + request.status);
        }
      }
    };
    console.log(data);
    request.send(data);
  }
}
