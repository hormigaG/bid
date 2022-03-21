import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../_services/alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'Alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  constructor(public alertService: AlertService) {}
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    this.blockUI.start(); // "Default Message" will display
    console.log(this.blockUI);

  }
}
