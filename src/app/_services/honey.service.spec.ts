import { TestBed } from '@angular/core/testing';

import { HoneyService } from './honey.service';

describe('HoneyService', () => {
  let service: HoneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
