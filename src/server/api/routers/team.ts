import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const team = await ctx.db.team.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          description: true,
          league: {
            select: {
              id: true,
              name: true,
            },
          },
          manager: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
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
        id,
        name: team.name,
        image: team.image,
        description: team.description,
        league: team.league,
        manager: {
          id: team.manager.id,
          name: team.manager.name,
          image: team.manager.image,
        },
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
        image: z.string().nullable(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input: { name, image, description }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const team = await ctx.db.team.create({
        data: {
          name,
          image,
          description,
          managerId: currentUserId,
        },
      });

      return team;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const team = await ctx.db.team.delete({
        where: { id },
      });

      return team;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input: { id, name, image, description }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const team = await ctx.db.team.update({
        where: { id },
        data: {
          name,
          image,
          description,
          managerId: currentUserId,
        },
      });

      return team;
    }),
});
