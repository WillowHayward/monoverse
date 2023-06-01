import { TestBed } from '@angular/core/testing';

import { GiteaService } from './gitea.service';

describe('GiteaService', () => {
  let service: GiteaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiteaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
