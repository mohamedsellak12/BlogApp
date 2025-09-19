import { TestBed } from '@angular/core/testing';

import { AdminGardService } from './admin-gard.service';

describe('AdminGardService', () => {
  let service: AdminGardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
