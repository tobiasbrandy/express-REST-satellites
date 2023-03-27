import { Prisma } from "@prisma/client";
import { z } from "zod";

export const SatelliteComSchema = z.object({
  receivedAt: z.date(),
  distance: z.number().transform(n => new Prisma.Decimal(n)),
  message: z.array(z.string()).nonempty(),
});

export const SatelliteSchema = z.object({
  name: z.string().nonempty(),
  posX: z.number().transform(n => new Prisma.Decimal(n)),
  posY: z.number().transform(n => new Prisma.Decimal(n)),
  satelliteCom: SatelliteComSchema.optional(),
});