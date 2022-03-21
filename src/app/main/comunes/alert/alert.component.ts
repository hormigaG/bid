import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../_services/alert.service';
@Component({
  selector: 'Alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  constructor(public alertService: AlertService) {}

  ngOnInit(): void {}
}
