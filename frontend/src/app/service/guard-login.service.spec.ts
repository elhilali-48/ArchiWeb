import { TestBed } from '@angular/core/testing';

import { GuardLoginService } from './guard-login.service';

describe('GuardLoginService', () => {
  let service: GuardLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
