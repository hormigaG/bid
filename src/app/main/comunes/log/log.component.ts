import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../_services/log.service';
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
    let self = this;
    let data = '';
    let log = this.logService.getLog();
    var request = new XMLHttpRequest();
    request.ontimeout = function () {
      alert('Timeout');
    };

    request.onerror = function (err) {
      console.log(err);
      alert(JSON.stringify(err));
    };
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          alert('Log enviado ');

        } else {
          alert('error status ' + request.status);
        }
      }
    };

    request.open('POST', 'erroURL', true);
    request.send(data);
  }  
}
