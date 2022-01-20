import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../_services/log.service';
import * as moment from 'moment';
@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
})
export class LogComponent implements OnInit {
  log: [];
  constructor(private logService: LogService) {}

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
      logAux += JSON.stringify(log[i]) + '\n';
    }
    let data = `appName=bid&date=${moment().format(
      'YYYY-MM-DD HH:mm:ss'
    )}%log=${logAux}`;
    var request = new XMLHttpRequest();
    request.open('POST', 'https://hormigag.ar/whm_logger/new', true);
    request.ontimeout = function () {
      alert('Timeout');
    };

    request.onerror = function (err) {
      console.log(err);
      alert(JSON.stringify(err));
    };

    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          alert('Log enviado ');
        } else {
          alert('error status ' + request.status);
        }
      }
    };
    console.log(data);
    request.send(data);
  }
}
