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
      name: "Arsenal - test 1",
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
        <h2 className="text-2xl pb-4">My Teams</h2>
        <div className="grid grid-cols-2">
          <ManagedTeams userId={user.id} />
          <PlayerTeams userId={user.id} />
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
    <div className="flex flex-col">
      <h3 className="text-lg font-bold pb-2">Managed Teams</h3>
      <ul>
        {managedTeams?.map((team) => (
          <li key={team.id}>
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
    <>
      <h3 className="text-lg font-bold pb-2">Player Teams</h3>
      <ul>
        {playerTeams?.map((team) => (
          <li key={team.id}>
            <Link href={`/teams/${team.id}`}>{team.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TeamsPage;
