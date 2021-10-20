import { BrowserModule } from '@angular/platform-browser';
import { NgModule , ChangeDetectorRef} from '@angular/core';

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
import { Events } from "./_services/events.service"

import { BarcodeProvider } from "./_services/intent.service"


import { HTTP } from '@ionic-native/http/ngx';
import { PriceLabelComponent } from './main/elements/price-label/price-label.component';
import { ProductPricesComponent } from './main/elements/product-prices/product-prices.component';
import { OmniBarcodeComponent } from './main/elements/omni-barcode/omni-barcode.component';
import { LeftPadFilterPipe } from './_helpers/left-pad-filter.pipe';
import { PriceUpdateComponent } from './pages/price-update/price-update.component';
import { FilterPricePipe } from './_helpers/filter-price.pipe';
import { EntWhSelectorComponent } from './pages/stock/ent-wh-selector/ent-wh-selector.component';
import { EntLocationComponent } from './pages/stock/ent-location/ent-location.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RangePickerComponent } from './main/comunes/range-picker/range-picker.component';
import { ReadCodeComponent } from './main/comunes/read-code/read-code.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrintConfigComponent,
    PrintLabelComponent,
    MenuComponent,
    PinterStateComponent,
    DasboardComponent,
    PriceLabelComponent,
    ProductPricesComponent,
    OmniBarcodeComponent,
    LeftPadFilterPipe,
    PriceUpdateComponent,
    FilterPricePipe,
    EntWhSelectorComponent,
    EntLocationComponent,
    MainPageComponent,
    RangePickerComponent,
    ReadCodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
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



      constructor(public odooRPC:OdooRPCService,

        ) { 
        this.odooRPC.init({
            odoo_server: environment.odoo_server,
            http_auth: "username:password" // optional
        });

  
  }
}







  
