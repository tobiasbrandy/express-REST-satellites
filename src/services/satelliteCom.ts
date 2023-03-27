import { AppCtx } from "../config/context";
import { Satellite, SatelliteCom } from "@prisma/client";

export type SatelliteComServiceCtx = Pick<AppCtx, 'prisma'>;
type Ctx = SatelliteComServiceCtx;

export type SatelliteComService = {

  findAll(ctx: Ctx): Promise<SatelliteCom[]>,

  deleteAll(ctx: Ctx): Promise<number>,

  findBySatellite(name: string, ctx: Ctx): Promise<SatelliteCom>,

  upsertBySatellite(satelliteName: string, com: Omit<SatelliteCom, 'satelliteName' | 'receivedAt'>, ctx: Ctx): Promise<SatelliteCom>,

  deleteBySatellite(satellite: string, ctx: Ctx): void,
};

export async function findAll(ctx: Ctx) {
  return await ctx.prisma.satelliteCom.findMany();
}

export async function deleteAll(ctx: Ctx) {
  const { count } = await ctx.prisma.satelliteCom.deleteMany();
  return count;
}

export async function findBySatellite(satellite: string, ctx: Ctx) {
  return await ctx.prisma.satelliteCom.findUniqueOrThrow({
    where: {
      satelliteName: satellite,
    }
  });
}

export async function upsertBySatellite(satelliteName: string, com: Omit<SatelliteCom, 'satelliteName' | 'receivedAt'>, ctx: Ctx) {
  return await ctx.prisma.satelliteCom.upsert({
    where: {
      satelliteName: satelliteName,
    },
    create: {
      satelliteName: satelliteName,
      distance: com.distance,
      message: com.message,
    },
    update: {
      distance: com.distance,
      message: com.message,
    },
    include: {
      satellite: true,
    }
  });
}

export async function deleteBySatellite(satellite: string, ctx: Ctx) {
  try {
    await ctx.prisma.satelliteCom.delete({
      where: {
        satelliteName: satellite,
      }
    });
  } catch(_) {
    // Ignore if com not found
  }
}
