import { Test, TestingModule } from '@nestjs/testing';
import { SummationService } from './summation.service';
import { ISummationRepository } from '../../core';

describe('SummationService', () => {
  let service: SummationService;

  const mockSummationRepository: ISummationRepository = {
    findByDateRange: jest.fn().mockResolvedValue([]),
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummationService,
        {
          provide: 'ISummationRepository',
          useValue: mockSummationRepository,
        },
      ],
    }).compile();

    service = module.get<SummationService>(SummationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
