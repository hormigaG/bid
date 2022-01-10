import { Injectable, ErrorHandler } from '@angular/core';
import { LogService } from './log.service';
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private logService: LogService) {}

  handleError(error) {
    console.log(error);
    this.logService.checkLog();
    this.logService.addLog('general', error.message);
  }
}
