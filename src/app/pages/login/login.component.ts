import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OdooRPCService } from '../../_services/odoo-rpc.service';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../_services/alert.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  isSubmitted = false;
  usernamestorage = null;
  uid: number;
  username: string;
  password: string;

  isLogged: boolean;
  server_url: string;
  server_db: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public odooRPC: OdooRPCService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.server_url = localStorage.getItem('url');
    this.server_db = localStorage.getItem('dbName');
    if (!localStorage.getItem('url') || !localStorage.getItem('dbName')) {
      this.router.navigate(['/db']);
    }
    this.odooRPC.isLoggedIn().then((res) => {
      this.isLogged = res;
    });
  }

  logout() {
    this.odooRPC.logout();
    this.isLogged = false;
  }

  get formControls() {
    return this.authForm.controls;
  }
  signIn() {
    this.isSubmitted = true;
    if (this.authForm.invalid) {
      return;
    }
    const username = this.authForm.controls.email.value;
    const password = this.authForm.controls.password.value;
    this.odooRPC
      .login(localStorage.getItem('dbName'), username, password)
      .then((res) => {
        this.isLogged = res;
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.log(err);
        this.alertService.showAlert(err.message);
      });
  }
}
