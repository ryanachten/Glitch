import { TestBed } from '@angular/core/testing';

import { GlitchService } from './glitch.service';

describe('GlitchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlitchService = TestBed.get(GlitchService);
    expect(service).toBeTruthy();
  });
});
