import * as z from "zod";
import {  ORPCError, os } from '@orpc/server'
import { auth } from "@/lib/auth";


export const base = os.$context<{ headers: Headers }>()


export const authMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers, // or reqHeaders if you're using the plugin
  })

  if (!sessionData?.session || !sessionData?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  // Adds session and user to the context
  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user
    },
  })
})


export const authorized = base.use(authMiddleware)
 
const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

type Planet = z.infer<typeof PlanetSchema>;

// In-memory storage for demo purposes
const planets: Planet[] = [
  { id: 1, name: "Earth", description: "Our home planet" },
  { id: 2, name: "Mars", description: "The red planet" },
  { id: 3, name: "Jupiter", description: "The largest planet" },
];

let nextId = 4;

export const listPlanet = base
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    const limit = input.limit ?? 10;
    const start = input.cursor;
    return planets.slice(start, start + limit);
  });

export const findPlanet = base
  .input(PlanetSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    const planet = planets.find((p) => p.id === input.id);
    if (!planet) {
      throw new Error("Planet not found");
    }
    return planet;
  });

export const createPlanet = authorized
  .input(PlanetSchema.omit({ id: true }))
  .handler(async ({ input }) => {
    const newPlanet: Planet = {
      id: nextId++,
      ...input,
    };
    planets.push(newPlanet);
    return newPlanet;
  });

export const router = {
  listPlanet,
  findPlanet,
  createPlanet
}
