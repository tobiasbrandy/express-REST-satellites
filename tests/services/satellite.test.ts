import { createMockCtx, MockCtx } from '../utils/mockContext'
import { AppCtx } from '../config/context';

import { Prisma, Satellite } from '@prisma/client';
import { findAll } from '../../src/services/satellite';

let mockCtx: MockCtx, ctx: AppCtx;

beforeEach(() => {
  [mockCtx, ctx] = createMockCtx();
});

test('test findAll ', async () => {
  const satellite: Satellite = {
    name: "",
    posX: new Prisma.Decimal(1.0),
    posY: new Prisma.Decimal(2.0),
  };
  mockCtx.prisma.satellite.findMany.mockResolvedValue([satellite]);

  await expect(findAll(ctx)).resolves.toEqual([satellite])
});

