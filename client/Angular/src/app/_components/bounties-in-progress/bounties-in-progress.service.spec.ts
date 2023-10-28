import { TestBed } from '@angular/core/testing';

import { BountiesInProgressService } from './bounties-in-progress.service';

describe('BountiesInProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BountiesInProgressService = TestBed.get(BountiesInProgressService);
    expect(service).toBeTruthy();
  });
});
