import { TestBed } from '@angular/core/testing';

import { OdooRpcService } from './odoo-rpc.service';

describe('OdooRpcService', () => {
  let service: OdooRpcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdooRpcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
