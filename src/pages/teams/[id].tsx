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

  if (team?.name == null) return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`RecRally - ${team.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-3 py-2 sm:flex-row">
        <div className="flex flex-grow flex-row items-center">
          <Link href="/teams" className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <div className="flex items-center">
            <ProfileImage src={team.image} className="flex-shrink-0" />
            <div className="ml-2">
              <h1 className="text-lg font-bold">{team.name}</h1>
              <div className="text-gray-500">
                Manager: {team.manager.name}
                {" - "}
                {team.playersCount}{" "}
                {getPlural(team.playersCount, "Player", "Players")}
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
        <div className="grid-row-3 mb-2 grid auto-rows-fr border-b p-6 sm:grid-cols-3">
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
          <li
            key={player.id}
            className="my-2 rounded-md border hover:bg-slate-100"
          >
            <div className="flex items-center justify-between p-2">
              <Link
                href={`/profiles/${player.id}`}
                className="flex flex-grow items-center pl-1"
              >
                <ProfileImage src={player.image} />
                <span className="pl-2">{player.name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// TODO: Move to utils
const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
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
