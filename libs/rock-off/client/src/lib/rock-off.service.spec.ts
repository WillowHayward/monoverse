import { TestBed } from '@angular/core/testing';

import { RockOffService } from './rock-off.service';

describe('RockOffService', () => {
  let service: RockOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RockOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
