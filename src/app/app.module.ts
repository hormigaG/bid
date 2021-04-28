import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { OdooRPCService } from './_services/odoo-rpc.service';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrintConfigComponent } from './pages/print-config/print-config.component';
import { PrintLabelComponent } from './pages/print-label/print-label.component';
import { MenuComponent } from './main/menu/menu.component';
import { PinterStateComponent } from './main/pinter-state/pinter-state.component';
import { DasboardComponent } from './main/dasboard/dasboard.component';


import { HTTP } from '@ionic-native/http/ngx';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrintConfigComponent,
    PrintLabelComponent,
    MenuComponent,
    PinterStateComponent,
    DasboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [HTTP, OdooRPCService],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
      constructor(public odooRPC:OdooRPCService) { 
        this.odooRPC.init({
            odoo_server: environment.odoo_server,
            http_auth: "username:password" // optional
        });

  }
}
