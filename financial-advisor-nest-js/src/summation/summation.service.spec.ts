import { Test, TestingModule } from '@nestjs/testing';
import { SummationService } from './summation.service';

describe('SummationService', () => {
  let service: SummationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummationService],
    }).compile();

    service = module.get<SummationService>(SummationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
