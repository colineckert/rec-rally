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
import { InfinitePostList } from "~/components/InfinitePostList";
import { LinkItemCard } from "~/components/LinkItemCard";
import { getPlural } from "~/utils/formatters";

const LeaguePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: league } = api.league.getById.useQuery({ id });
  const posts = api.post.infiniteTeamFeed.useInfiniteQuery(
    { teamId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (!league) return <ErrorPage statusCode={404} />;

  const { name, description, teams, teamsCount } = league;

  return (
    <>
      <Head>
        <title>{`RecRally - ${name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-3 py-2 sm:flex-row">
        <div className="flex flex-grow flex-row items-center">
          <Link href="/leagues" className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <div className="flex items-center">
            <div className="ml-2">
              <h1 className="text-lg font-bold">{name}</h1>
              <div className="text-gray-500">
                {teamsCount} {getPlural(teamsCount, "Team", "Teams")}
              </div>
            </div>
          </div>
        </div>
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
          </div>
          <TeamsList teams={teams} />
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

function TeamsList({
  teams,
}: {
  teams: Array<{
    id: string;
    name: string | null;
    image: string | null;
    manager: {
      name: string | null;
    };
  }>;
}) {
  if (teams.length === 0) {
    return (
      <div className="px-2">
        <h3 className="pb-2 text-lg font-bold">Teams</h3>
        <div className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
          No teams in this league.
        </div>
      </div>
    );
  }
  return (
    <div className="px-2">
      <h3 className="pb-2 text-lg font-bold">Teams</h3>
      <ul>
        {teams.map((team) => (
          <li key={team.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/teams/${team.id}`}
              image={team.image}
              imageClassName="h-8 w-8"
              title={team.name}
              subtitle={`Manager: ${team.manager?.name ?? "No manager"}`}
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
        destination: "/leagues",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.league.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default LeaguePage;
