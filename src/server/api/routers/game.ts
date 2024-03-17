import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getByLeagueId: publicProcedure
    .input(z.object({ leagueId: z.string() }))
    .query(async ({ input: { leagueId }, ctx }) => {
      const games = await ctx.db.game.findMany({
        where: { leagueId },
        select: {
          id: true,
          date: true,
          homeTeamId: true,
          awayTeamId: true,
          homeScore: true,
          awayScore: true,
          friendly: true,
        },
      });

      return games.map((game) => ({
        id: game.id,
        date: game.date,
        homeTeamId: game.homeTeamId,
        awayTeamId: game.awayTeamId,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        friendly: game.friendly,
      }));
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: { id },
        select: {
          id: true,
          date: true,
          homeTeamId: true,
          awayTeamId: true,
          homeScore: true,
          awayScore: true,
          friendly: true,
        },
      });

      return game;
    }),
  create: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        homeTeamId: z.string(),
        awayTeamId: z.string(),
        leagueId: z.string().optional(),
        friendly: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.create({
        data: {
          date: input.date,
          homeTeamId: input.homeTeamId,
          awayTeamId: input.awayTeamId,
          leagueId: input.leagueId,
          friendly: input.friendly,
        },
      });

      return game;
    }),
});
