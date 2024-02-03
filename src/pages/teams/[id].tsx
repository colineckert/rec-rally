import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft } from "react-icons/hi";
import { ProfileImage } from "~/components/ProfileImage";
import { InfinitePostList } from "~/components/InfinitePostList";
import { useSession } from "next-auth/react";
import ManageTeamDropdown from "~/components/ManageTeamDropdown";
import { LinkItemCard } from "~/components/LinkItemCard";
import { getPlural } from "~/utils/formatters";

const TeamPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const session = useSession();
  const currentUserId = session.data?.user?.id;
  const { data: team } = api.team.getById.useQuery({ id });
  const posts = api.post.infiniteTeamFeed.useInfiniteQuery(
    { teamId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (!team) return <ErrorPage statusCode={404} />;

  const { name, image, description, manager, playersCount, league } = team;

  return (
    <>
      <Head>
        <title>{`RecRally - ${name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-3 py-2 sm:flex-row">
        <div className="flex flex-grow flex-row items-center">
          <Link href="/teams" className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <div className="flex items-center">
            <ProfileImage src={image} className="flex-shrink-0" />
            <div className="ml-2">
              <h1 className="text-lg font-bold">{team.name}</h1>
              <div className="text-gray-500">
                Manager: {manager.name}
                {" - "}
                {playersCount} {getPlural(playersCount, "Player", "Players")}
              </div>
            </div>
          </div>
        </div>
        {currentUserId === team.manager.id && (
          <div className="py-3 sm:py-0">
            <ManageTeamDropdown team={team} />
          </div>
        )}
      </header>
      <main>
        <div className="grid-row-3 mb-2 grid auto-rows-fr gap-6 border-b p-6 sm:grid-cols-3">
          <div className="px-2">
            {description ? (
              <div className="pb-4">
                <h3 className="pb-2 text-lg font-bold">About</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ) : null}
            <div className="pb-4">
              <h3 className="pb-2 text-lg font-bold">Manager</h3>
              <LinkItemCard
                href={`/profiles/${manager.id}`}
                image={manager.image}
                title={manager.name}
              />
            </div>
            <div>
              <h3 className="pb-2 text-lg font-bold">League</h3>
              {league ? (
                <Link href={`/leagues/${league.id}`}>
                  <span className="text-gray-600">{league.name}</span>
                </Link>
              ) : (
                <span className="text-gray-600">No league</span>
              )}
            </div>
          </div>
          <TeamPlayers players={team.players} />
        </div>
        <InfinitePostList
          posts={posts.data?.pages?.flatMap((page) => page.posts) ?? []}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage}
          fetchNewPosts={posts.fetchNextPage}
        />
      </main>
    </>
  );
};

function TeamPlayers({
  players,
}: {
  players: Array<{ id: string; name: string | null; image: string | null }>;
}) {
  if (players.length === 0) {
    return (
      <div className="px-2">
        <h3 className="pb-2 text-lg font-bold">Players</h3>
        <div className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
          No players on this team yet.
        </div>
      </div>
    );
  }
  return (
    <div className="px-2">
      <h3 className="pb-2 text-lg font-bold">Players</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/profiles/${player.id}`}
              image={player.image}
              title={player.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/teams",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.team.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default TeamPage;
