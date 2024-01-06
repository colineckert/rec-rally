import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ErrorPage from "next/error";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft } from "react-icons/hi";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/LoadingSpinner";

const TeamsPage: NextPage = (): JSX.Element => {
  const session = useSession();

  const trpcUtils = api.useUtils();
  const createTeam = api.team.create.useMutation({
    onSuccess: (newTeam) => {
      console.log("Success", newTeam);

      trpcUtils.team.getManagerTeamsByUserId.setData({ userId: user.id }, oldData => {
        if (oldData == null) return;
        return [...oldData, newTeam];
      });
    }
  });

  if (session.status === "loading") {
    return <LoadingSpinner />;
  }

  if (session.status !== "authenticated") {
    return <ErrorPage statusCode={404} />;
  }

  const { user } = session.data;

  const handleCreateTeamClick = () => {
    console.log("***Create a team click***");

    createTeam.mutate({
      name: "Arsenal - test 3",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png",
    });
  }

  return (
    <>
      <Head>
        <title>{`Pitchup - My Teams`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <HiArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={user.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{user.name}'s Teams</h1>
          <div className="text-gray-500"></div>
        </div>
        <Button onClick={handleCreateTeamClick}>
          Create Team
        </Button>
      </header>
      <main className="p-8">
        <div className="grid grid-row-3 auto-rows-fr sm:grid-cols-3">
          <ManagedTeams userId={user.id} />
          <PlayerTeams userId={user.id} />
          <div className="px-2 text-end">
            <h3 className="text-lg font-bold pb-2">Invites</h3>
            <ul>
              <li>
                <Link href={`/teams/1`}>Chelsea</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

function ManagedTeams({ userId }: { userId: string }) {
  const { data: managedTeams, isLoading, isFetching } =
    api.team.getManagerTeamsByUserId.useQuery({ userId });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col pb-4 px-2">
      <h3 className="text-lg font-bold pb-2">Managed Teams</h3>
      <ul>
        {managedTeams?.map((team) => (
          <li key={team.id} className="py-1">
            <Link href={`/teams/${team.id}`}>{team.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlayerTeams({ userId }: { userId: string }) {
  const { data: playerTeams, isLoading, isFetching } =
    api.team.getPlayerTeamsByUserId.useQuery({ userId });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col pb-4 px-2">
      <h3 className="text-lg font-bold pb-2">Player Teams</h3>
      <ul>
        {playerTeams?.length === 0 && (
          <li className="py-6 bg-red-50 text-center border rounded border-red-100 text-red-500">
            You are not a member of any teams.
          </li>
        )}
        {playerTeams?.map((team) => (
          <li key={team.id} className="py-1">
            <Link href={`/teams/${team.id}`}>{team.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamsPage;
