import { TestBed } from '@angular/core/testing';

import { LoginGardService } from './login-gard.service';

describe('LoginGardService', () => {
  let service: LoginGardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginGardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
