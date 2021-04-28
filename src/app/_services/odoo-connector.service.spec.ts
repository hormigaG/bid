import { TestBed } from '@angular/core/testing';

import { OdooConnectorService } from './odoo-connector.service';

describe('OdooConnectorService', () => {
  let service: OdooConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdooConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
