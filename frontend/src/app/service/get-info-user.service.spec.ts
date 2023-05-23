import { TestBed } from '@angular/core/testing';

import { GetInfoUserService } from './get-info-user.service';

describe('GetInfoUserService', () => {
  let service: GetInfoUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetInfoUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
