import { Test, TestingModule } from '@nestjs/testing';
import { ISummationRepository } from '../../core';
import { SummationService } from './summation.service';

describe('SummationService', () => {
  let service: SummationService;
  let mockFindByDateRange: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockFindByDateRange = jest.fn().mockResolvedValue([]);

    const mockSummationRepository: ISummationRepository = {
      findByDateRange: mockFindByDateRange,
      findAll: jest.fn().mockResolvedValue([]),
    };

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

  describe('calculateSumByDuration', () => {
    it('should return an array of results', async () => {
      const result = await service.calculateSumByDuration({});
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should call repository.findByDateRange once', async () => {
      await service.calculateSumByDuration({});
      expect(mockFindByDateRange).toHaveBeenCalledTimes(1);
    });
  });
});
