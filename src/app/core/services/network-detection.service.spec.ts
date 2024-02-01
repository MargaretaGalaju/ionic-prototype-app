import { TestBed } from '@angular/core/testing';

import { NetworkDetectionService } from './network-detection.service';

describe('NetworkDetectionService', () => {
  let service: NetworkDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
