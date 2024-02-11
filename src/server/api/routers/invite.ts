import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { InviteStatus } from "@prisma/client";

export const inviteRouter = createTRPCRouter({
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session?.user?.id;

    const invites = await ctx.db.playerInvite.findMany({
      where: { playerId: currentUserId },
      select: {
        id: true,
        status: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return invites.map((invite) => ({
      id: invite.id,
      team: {
        id: invite.team.id,
        name: invite.team.name,
        status: invite.status,
      },
    }));
  }),
  getByTeamId: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input: { teamId }, ctx }) => {
      const currentUserId = ctx.session?.user?.id;

      const team = await ctx.db.team.findUnique({
        where: { id: teamId },
        select: {
          id: true,
          managerId: true,
        },
      });

      if (team == null) {
        throw new Error("Team not found");
      }

      if (team.managerId !== currentUserId) {
        throw new Error("You are not the manager of this team");
      }

      const invites = await ctx.db.playerInvite.findMany({
        where: { teamId },
        select: {
          id: true,
          status: true,
          player: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return invites.map((invite) => ({
        id: invite.id,
        status: invite.status,
        player: {
          id: invite.player.id,
          name: invite.player.name,
          image: invite.player.image,
        },
      }));
    }),
  create: protectedProcedure
    .input(z.object({ teamId: z.string(), playerIds: z.array(z.string()) }))
    .mutation(async ({ input: { teamId, playerIds }, ctx }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: teamId },
        select: { id: true },
      });

      if (team == null) {
        throw new Error("Team not found");
      }

      const invites = await Promise.all(
        playerIds.map((playerId) =>
          ctx.db.playerInvite.create({
            data: {
              teamId,
              playerId,
              status: InviteStatus.PENDING,
            },
          }),
        ),
      );

      return invites;
    }),
});
