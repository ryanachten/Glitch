import { TestBed } from '@angular/core/testing';

import { EncodingService } from './encoding.service';

describe('EncodingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncodingService = TestBed.get(EncodingService);
    expect(service).toBeTruthy();
  });
});
