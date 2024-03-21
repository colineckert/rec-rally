import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user?.id;
        return await getInfinitePosts({
          limit,
          ctx,
          cursor,
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : {
                  user: {
                    followers: { some: { id: currentUserId } },
                  },
                },
        });
      },
    ),
  infiniteMyTeamsFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user?.id;
      if (currentUserId == null) {
        throw new Error("Not logged in");
      }

      const teams = await ctx.db.team.findMany({
        where: {
          OR: [
            { managerId: currentUserId },
            { players: { some: { id: currentUserId } } },
          ],
        },
      });

      const whereClause = {
        OR: teams.map((team) => ({
          OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
        })),
      };

      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause,
      });
    }),
  infiniteTeamFeed: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, teamId, cursor }, ctx }) => {
      const team = await ctx.db.team.findUnique({ where: { id: teamId } });
      const players = await ctx.db.user.findMany({
        where: { playerTeams: { some: { id: teamId } } },
      });

      const whereClause = {
        OR: [
          { homeTeamId: teamId },
          { awayTeamId: teamId },
          { userId: { in: players.map((player) => player.id) } },
          { userId: team?.managerId },
        ],
      };

      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause,
      });
    }),
  infiniteMyLeaguesFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user?.id;
      if (currentUserId == null) {
        throw new Error("Not logged in");
      }

      const leagues = await ctx.db.league.findMany({
        where: {
          OR: [
            { managerId: currentUserId },
            { teams: { some: { players: { some: { id: currentUserId } } } } },
          ],
        },
      });

      const whereClause = {
        OR: leagues.map((league) => ({ leagueId: league.id })),
      };

      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause,
      });
    }),
  infiniteLeagueFeed: publicProcedure
    .input(
      z.object({
        leagueId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, leagueId, cursor }, ctx }) => {
      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause: { leagueId },
      });
    }),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const post = await ctx.db.post.create({
        data: { content, userId: ctx.session.user.id },
      });

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);

      return post;
    }),
  createGameRecap: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        homeTeamId: z.string(),
        awayTeamId: z.string(),
        homeScore: z.number(),
        awayScore: z.number(),
        leagueId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session?.user?.id;
      const post = await ctx.db.post.create({
        data: {
          content: input.content,
          userId: currentUserId,
          type: "GAME_RECAP",
          homeTeamId: input.homeTeamId,
          awayTeamId: input.awayTeamId,
          homeScore: input.homeScore,
          awayScore: input.awayScore,
          leagueId: input.leagueId,
        },
      });

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);

      return post;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { postId: id, userId: ctx.session.user.id };
      const existingLike = await ctx.db.like.findUnique({
        where: { userId_postId: data },
      });

      if (existingLike == null) {
        await ctx.db.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.db.like.delete({ where: { userId_postId: data } });
        return { addedLike: false };
      }
    }),
});

async function getInfinitePosts({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.PostWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user?.id;

  const data = await ctx.db.post.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      type: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: {
        select: { name: true, id: true, image: true },
      },
      homeTeamId: true,
      awayTeamId: true,
      homeScore: true,
      awayScore: true,
      leagueId: true,
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    posts: data.map((post) => {
      return {
        id: post.id,
        content: post.content,
        type: post.type,
        createdAt: post.createdAt,
        likeCount: post._count.likes,
        user: post.user,
        likedByMe: post.likes?.length > 0,
        homeTeamId: post.homeTeamId,
        awayTeamId: post.awayTeamId,
        homeScore: post.homeScore,
        awayScore: post.awayScore,
        leagueId: post.leagueId,
      };
    }),
    nextCursor,
  };
}
