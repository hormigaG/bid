import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OdooRPCService } from "../../_services/odoo-rpc.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-select-db',
  templateUrl: './select-db.component.html',
  styleUrls: ['./select-db.component.css']
})
export class SelectDbComponent implements OnInit {
  authForm: FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public odooRPC: OdooRPCService
    ) { }


  ngOnInit(): void {
      this.authForm = this.formBuilder.group({
      url: [localStorage.getItem('url'), Validators.required],
      dbName: [localStorage.getItem('dbName'), Validators.required],
    }); 
  }
  get formControls() {
    return this.authForm.controls;
  }  
  configure() {
    this.isSubmitted = true;
    if (this.authForm.invalid) {
      return;
    }
    const url = this.authForm.controls.url.value;
    const dbName = this.authForm.controls.dbName.value;
    localStorage.setItem('url',url)
    localStorage.setItem('dbName',dbName)
    this.odooRPC.init({
        odoo_server: url,
        http_auth: "username:password" // optional
    });
    this.router.navigate(["/login"]);

  }

}
