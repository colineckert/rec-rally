import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { InviteStatus } from "@prisma/client";

export const inviteRouter = createTRPCRouter({
  getPendingByUserId: protectedProcedure.query(async ({ ctx }) => {
    // only ever going to show current user's invites
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

    const pendingInvites = invites.filter(
      (invite) => invite.status === InviteStatus.PENDING,
    );

    return pendingInvites.map((invite) => ({
      id: invite.id,
      status: invite.status,
      team: {
        id: invite.team.id,
        name: invite.team.name,
      },
    }));
  }),
  getPendingByTeamId: protectedProcedure
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

      const pendingInvites = invites.filter(
        (invite) => invite.status === InviteStatus.PENDING,
      );

      return pendingInvites.map((invite) => ({
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
  update: protectedProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ input: { id, status }, ctx }) => {
      const invite = await ctx.db.playerInvite.findUnique({
        where: { id },
        select: { id: true, status: true },
      });

      if (invite == null) {
        throw new Error("Invite not found");
      }

      if (invite.status !== InviteStatus.PENDING) {
        throw new Error("Invite has already been responded to");
      }

      const updatedInvite = await ctx.db.playerInvite.update({
        where: { id },
        data: { status: status as InviteStatus },
        select: { id: true, status: true },
      });

      return updatedInvite;
    }),
});
