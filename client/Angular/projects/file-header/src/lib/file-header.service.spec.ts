import { TestBed } from '@angular/core/testing';

import { FileHeaderService } from './file-header.service';

describe('FileHeaderService', () => {
  let service: FileHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
