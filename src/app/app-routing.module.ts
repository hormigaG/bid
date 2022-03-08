import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PrintConfigComponent } from './pages/print-config/print-config.component';
import { PrintLabelComponent } from './pages/print-label/print-label.component';
import { DasboardComponent } from './main/dasboard/dasboard.component';
import { AuthGuard } from './_helpers/auth.guard';
import { PriceUpdateComponent } from './pages/price-update/price-update.component';
import { EntWhSelectorComponent } from './pages/stock/ent-wh-selector/ent-wh-selector.component';
import { EntLocationComponent } from './pages/stock/ent-location/ent-location.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SelectDbComponent } from './pages/select-db/select-db.component';
import { MovIntComponent } from './pages/stock/mov-int/mov-int.component';
import { MovIntDetailComponent } from './pages/stock/mov-int-detail/mov-int-detail.component';
import { StockInventoryComponent } from './pages/stock/stock-inventory/stock-inventory.component';
import { StockInventoryLinesComponent } from './pages/stock/stock-inventory-lines/stock-inventory-lines.component';
import { StockInventoryLinesProductComponent } from './pages/stock/stock-inventory-lines-product/stock-inventory-lines-product.component';
import { MovIntDetailProductComponent } from './pages/stock/mov-int-detail-product/mov-int-detail-product.component';
import { ZplFileComponent } from './pages/zpl-file/zpl-file.component';
import {TestBarCodeComponent} from './pages/test-bar-code/test-bar-code.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestBarCodeComponent },

  { path: 'db', component: SelectDbComponent },
  {
    path: '',
    component: DasboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'user', component: LoginComponent, canActivate: [AuthGuard] },
      { path: '', component: MainPageComponent, canActivate: [AuthGuard] },
      {
        path: 'print-config',
        component: PrintConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'label',
        component: PrintLabelComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'prices',
        component: PriceUpdateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stock-entry/wh-selector',
        component: EntWhSelectorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stock/:op/:lot_stock_id',
        component: EntLocationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'zpl/:product_id/:qty',
        component: ZplFileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'move_zpl/:move_id/:qty',
        component: ZplFileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'picking-selector',
        component: MovIntComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'picking-selector/:picking_code',
        component: MovIntComponent,
        canActivate: [AuthGuard],
      },


      {
        path: 'picking-selector/:picking_code/:picking_id',
        component: MovIntDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stock-inventory',
        component: StockInventoryComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'stock-inventory/:stock_inventory_id',
        component: StockInventoryLinesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stock-inventory/:stock_inventory_id/:location_id',
        component: StockInventoryLinesProductComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
