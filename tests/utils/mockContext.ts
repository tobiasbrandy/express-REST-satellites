import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { AppCtx } from '../../src/config/context';

import { PrismaClient } from '@prisma/client';
import { SatelliteService } from '../services/satellite';
import { SatelliteComService } from '../services/satelliteCom';

export type MockCtx = {
  prisma: DeepMockProxy<PrismaClient>,
  satelliteService: MockProxy<SatelliteService>,
  satelliteComService: MockProxy<SatelliteComService>
}

export function createMockCtx() {
  const mockCtx: MockCtx = {
    prisma: mockDeep<PrismaClient>(),
    satelliteService: mock<SatelliteService>(),
    satelliteComService: mock<SatelliteComService>(),
  };
  return [mockCtx, mockCtx as unknown as AppCtx] as const;
}
