import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  // TODO: should this be private?
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const team = await ctx.db.team.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          _count: { select: { players: true } },
          players: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (team == null) return;

      return {
        name: team.name,
        image: team.image,
        playersCount: team._count.players,
        players: team.players.map((player) => ({
          id: player.id,
          name: player.name,
          image: player.image,
        })),
      };
    }),
  getPlayerTeamsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const teams = await ctx.db.team.findMany({
        where: {
          players: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          league: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return teams.map((team) => ({
        id: team.id,
        name: team.name,
        image: team.image,
        league: team.league,
      }));
    }),
  getManagerTeamsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const teams = await ctx.db.team.findMany({
        where: {
          managerId: userId,
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      return teams.map((team) => ({
        id: team.id,
        name: team.name,
        image: team.image,
        // league: team.league,
      }));
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ input: { name, image }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const team = await ctx.db.team.create({
        data: {
          name,
          image,
          managerId: currentUserId,
        },
      });

      return team;
    }),
});
