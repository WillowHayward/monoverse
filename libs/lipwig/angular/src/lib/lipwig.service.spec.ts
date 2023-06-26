import { TestBed } from '@angular/core/testing';

import { LipwigService } from './lipwig.service';

describe('LipwigService', () => {
  let service: LipwigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LipwigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
