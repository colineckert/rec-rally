import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const leagueRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const leagues = await ctx.db.league.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return leagues.map((league) => ({
      id: league.id,
      name: league.name,
    }));
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string().nullable() }))
    .query(async ({ input: { id }, ctx }) => {
      if (id == null) return;

      const league = await ctx.db.league.findUnique({
        where: { id },
        select: {
          name: true,
          description: true,
          managerId: true,
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
        },
      });

      if (league == null) return;

      return {
        id,
        name: league.name,
        description: league.description,
        managerId: league.managerId,
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
      };
    }),
  getByManagerId: protectedProcedure
    .input(z.object({ managerId: z.string() }))
    .query(async ({ input: { managerId }, ctx }) => {
      const leagues = await ctx.db.league.findMany({
        where: { managerId },
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
        },
      });

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
      }));
    }),
  getByPlayerId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const playerTeamIds = await ctx.db.team.findMany({
        where: {
          players: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const managerTeamIds = await ctx.db.team.findMany({
        where: {
          managerId: userId,
        },
        select: {
          id: true,
        },
      });

      const userTeamIds = [...playerTeamIds, ...managerTeamIds];

      const leagues = await ctx.db.league.findMany({
        where: {
          teams: {
            some: {
              id: {
                in: userTeamIds.map((team) => team.id),
              },
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
      }));
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        managerId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description, managerId } = input;

      const newLeague = await ctx.db.league.create({
        data: {
          name,
          description,
          managerId,
        },
      });

      return newLeague;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, description } = input;

      const updatedLeague = await ctx.db.league.update({
        where: { id },
        data: {
          name,
          description,
        },
      });

      return updatedLeague;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const deletedLeague = await ctx.db.league.delete({
        where: { id },
      });

      return deletedLeague;
    }),
  getTeams: protectedProcedure
    .input(z.object({ leagueId: z.string() }))
    .query(async ({ input: { leagueId }, ctx }) => {
      const league = await ctx.db.league.findUnique({
        where: { id: leagueId },
        select: {
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
        },
      });

      if (league == null) return [];

      return league.teams.map((team) => ({
        id: team.id,
        name: team.name,
        image: team.image,
        manager: {
          id: team.manager.id,
          name: team.manager.name,
          image: team.manager.image,
        },
      }));
    }),
  getTeamsAvailabletoAdd: protectedProcedure
    .input(z.object({ leagueId: z.string() }))
    .query(async ({ input: { leagueId }, ctx }) => {
      const league = await ctx.db.league.findUnique({
        where: { id: leagueId },
        select: {
          teams: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (league == null) return [];

      const allTeams = await ctx.db.team.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const teamsToAdd = allTeams.filter(
        (team) => !league.teams.some((leagueTeam) => leagueTeam.id === team.id),
      );

      return teamsToAdd;
    }),
  addTeams: protectedProcedure
    .input(
      z.object({
        leagueId: z.string(),
        teamIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { leagueId, teamIds } = input;

      const updatedLeague = await ctx.db.league.update({
        where: { id: leagueId },
        data: {
          teams: {
            connect: teamIds.map((id) => ({ id })),
          },
        },
      });

      return updatedLeague;
    }),
  removeTeams: protectedProcedure
    .input(
      z.object({
        leagueId: z.string(),
        teamIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { leagueId, teamIds } = input;

      const updatedLeague = await ctx.db.league.update({
        where: { id: leagueId },
        data: {
          teams: {
            disconnect: teamIds.map((id) => ({ id })),
          },
        },
      });

      return updatedLeague;
    }),
});
