import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const leagueRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string().nullable() }))
    .query(async ({ input: { id }, ctx }) => {
      if (id == null) return;

      const league = await ctx.db.league.findUnique({
        where: { id },
        select: {
          name: true,
          description: true,
          _count: { select: { teams: true } },
          teams: {
            select: {
              id: true,
              name: true,
              image: true,
              manager: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          players: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (league == null) return;

      return {
        id,
        name: league.name,
        description: league.description,
        teamsCount: league._count.teams,
        teams: league.teams.map((team) => ({
          id: team.id,
          name: team.name,
          image: team.image,
          manager: {
            id: team.manager.id,
            name: team.manager.name,
            image: team.manager.image,
          },
        })),
        players: league.players.map((player) => ({
          id: player.id,
          name: player.name,
          image: player.image,
        })),
      };
    }),

  getByPlayerId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const leagues = await ctx.db.league.findMany({
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
          description: true,
          _count: { select: { teams: true } },
          teams: {
            select: {
              id: true,
              name: true,
              image: true,
              manager: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          players: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!leagues || leagues.length === 0) return [];

      return leagues.map((league) => ({
        id: league.id,
        name: league.name,
        description: league.description,
        teamsCount: league._count.teams,
        teams: league.teams.map((team) => ({
          id: team.id,
          name: team.name,
          image: team.image,
          manager: {
            id: team.manager.id,
            name: team.manager.name,
            image: team.manager.image,
          },
        })),
        players: league.players.map((player) => ({
          id: player.id,
          name: player.name,
          image: player.image,
        })),
      }));
    }),
});
