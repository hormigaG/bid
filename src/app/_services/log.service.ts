import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  log: any[];
  constructor() {}

  pushToArray(array, obj) {
    array.push(obj);
    return array;
  }
  addLog(component, error) {
    const obj = {
      date: moment().format('DD/MM/YYYY HH:mm:ss'),
      component,
      error,
    };
    let log = localStorage.getItem('log');
    if (log) {
      log = JSON.parse(log);
      let arr = this.pushToArray(log, obj);
      localStorage.setItem('log', JSON.stringify(arr));
    } else {
      let log = [];
      log.push(obj);
      localStorage.setItem('log', JSON.stringify(log));
    }
  }
  private checkDate(date) {
    const today = moment().format('DD/MM/YYYY HH:mm:ss');
    const dif = moment(date).diff(today, 'days');
    return dif;
  }

  private checkArray(array) {
    return array.filter((e) => this.checkDate(e.date) < 1);
  }

  checkLog() {
    let log = localStorage.getItem('log');
    if (log) {
      log = JSON.parse(log);
      let arr = this.checkArray(log);
      localStorage.setItem('log', JSON.stringify(arr));
    }
  }
  purgeLog() {
    localStorage.setItem('log', JSON.stringify([]));
  }
  getLog() {
    const log = localStorage.getItem('log');
    if (log) {
      return JSON.parse(log);
    } else {
      return [];
    }
  }
}
