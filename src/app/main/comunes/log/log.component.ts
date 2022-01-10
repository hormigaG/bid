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
}
