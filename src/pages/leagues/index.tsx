import { useState } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ErrorPage from "next/error";
import { ProfileImage } from "~/components/ProfileImage";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft } from "react-icons/hi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { MyTeamsPosts } from "..";
import { getPlural } from "~/utils/formatters";
import { LinkItemCard } from "~/components/LinkItemCard";
import CreateLeagueModal from "~/components/league-modal/Create";
import { Button } from "~/components/Button";

const LeaguesPage: NextPage = (): JSX.Element => {
  const session = useSession();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (session.status === "loading") {
    return <LoadingSpinner />;
  }

  if (session.status !== "authenticated") {
    return <ErrorPage statusCode={404} />;
  }

  const { user } = session.data;

  return (
    <>
      <Head>
        <title>{`RecRally - Leagues`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-3 py-2 sm:flex-row">
        <div className="flex flex-grow flex-row items-center">
          <Link href=".." className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <div className="flex items-center">
            <ProfileImage src={user.image} className="flex-shrink-0" />
            <div className="ml-2">
              <h1 className="text-lg font-bold">{user.name}'s Leagues</h1>
            </div>
          </div>
        </div>
        <div className="py-3 sm:py-0">
          <Button onClick={() => setCreateModalOpen(true)}>
            Create League
          </Button>
        </div>
      </header>
      <main>
        <div className="grid-row-2 mb-2 grid auto-rows-fr gap-6 border-b p-6 sm:grid-cols-2">
          <PlayerLeagues userId={user.id} />
        </div>
        {/* TODO: implement league posts */}
        <MyTeamsPosts />
      </main>
      <CreateLeagueModal
        managerId={user.id}
        isOpen={createModalOpen}
        closeModal={() => setCreateModalOpen(false)}
      />
    </>
  );
};

function PlayerLeagues({ userId }: { userId: string }) {
  const {
    data: playerLeagues,
    isLoading,
    isFetching,
  } = api.league.getByPlayerId.useQuery({ userId });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col px-2 pb-4">
      <h3 className="pb-2 text-lg font-bold">My Leagues</h3>
      <ul role="list">
        {playerLeagues?.length === 0 && (
          <li className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
            You are not a member of any leagues.
          </li>
        )}
        {playerLeagues?.map((league) => (
          <li key={league.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/leagues/${league.id}`}
              icon={
                <HiClipboardDocumentList className="h-8 w-8 text-slate-500" />
              }
              title={league.name}
              subtitle={`${league.teams.length} ${getPlural(
                league.teams.length,
                "team",
                "teams",
              )}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaguesPage;
