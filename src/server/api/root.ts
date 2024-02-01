import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";
import { profileRouter } from "./routers/profile";
import { teamRouter } from "./routers/team";
import { leagueRouter } from "./routers/league";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter,
  team: teamRouter,
  league: leagueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
