import { Satellite } from "@prisma/client";
import { AppCtx } from "../config/context";

export type SatelliteServiceCtx = Pick<AppCtx, 'prisma'>;
type Ctx = SatelliteServiceCtx;

export type SatelliteService = {

  findAll(ctx: Ctx): Promise<Satellite[]>,

  deleteAll(ctx: Ctx): Promise<number>,

  findByName(name: string, ctx: Ctx): Promise<Satellite>,

  create(sat: Satellite, ctx: Ctx): Promise<Satellite>,

  updateByName(name: string, newSat: Omit<Satellite, 'name'>, ctx: Ctx): Promise<Satellite>,

  deleteByName(name: string, ctx: Ctx): void,
};

export async function findAll(ctx: Ctx) {
  return await ctx.prisma.satellite.findMany();
}

export async function deleteAll(ctx: Ctx) {
  const { count } = await ctx.prisma.satellite.deleteMany();
  return count;
}

export async function findByName(name: string, ctx: Ctx) {
  return await ctx.prisma.satellite.findUniqueOrThrow({
    where: {
      name: name,
    },
    include: {
      com: true,
    }
  });
}

export async function create(sat: Satellite, ctx: Ctx) {
  return await ctx.prisma.satellite.create({
    data: sat,
    include: {
      com: true,
    }
  });
}

export async function updateByName(name: string, newSat: Omit<Satellite, 'name'>, ctx: Ctx) {
  return await ctx.prisma.satellite.update({
    where: {
      name: name,
    },
    data: newSat,
  });
}

export async function deleteByName(name: string, ctx: Ctx) {
  try {
    await ctx.prisma.satellite.delete({
      where: {
        name: name,
      }
    });
  } catch(_) {
    // Ignore if satellite not found
  }
}
