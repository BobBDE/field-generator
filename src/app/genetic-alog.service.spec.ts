import { TestBed } from '@angular/core/testing';

import { GeneticAlgoService } from './genetic-algo.service';

describe('GeneticAlgoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneticAlgoService = TestBed.get(GeneticAlgoService);
    expect(service).toBeTruthy();
  });
});
