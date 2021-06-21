import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


import { OdooRPCService } from "../_services/odoo-rpc.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    public odooRPC: OdooRPCService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const session_act :  Observable<boolean> | Promise<boolean> | boolean = new Observable((observer) => {
      /*this.odooRPC.getSessionInfo().then((res) =>{
        observer.next(true);
      }).catch((err) => {
          observer.next(false);
          observer.complete();
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

        });*/
                  observer.next(true);
          observer.complete();


    });
    return session_act
}

  
}
