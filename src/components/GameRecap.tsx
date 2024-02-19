import Link from "next/link";
import Image from "next/image";
import type { Post } from "~/types/post";
import { api } from "~/utils/api";
import { getFormattedDate } from "~/utils/formatters";
import { LoadingSpinner } from "./LoadingSpinner";

export function GameRecap({
  id,
  homeTeamId,
  awayTeamId,
  homeScore,
  awayScore,
  createdAt,
  leagueId,
}: Post) {
  if (homeTeamId == null || awayTeamId == null) {
    return null;
  }

  const team1 = api.team.getById.useQuery({ id: homeTeamId });
  const team2 = api.team.getById.useQuery({ id: awayTeamId });
  const league = api.league.getById.useQuery({ id: leagueId });

  return (
    <li key={id} className="border-b px-2 pb-4 pt-3">
      <div className="max-w-8 flex flex-grow flex-col">
        <span className="self-center">
          {getFormattedDate(createdAt, "long")}
        </span>
        <span className="self-center pb-3 text-sm text-gray-500">
          {league.data?.name}
        </span>
        <div>
          <div className="flex items-end justify-around self-center">
            <TeamCard
              id={homeTeamId}
              name={team1.data?.name}
              logo={team1.data?.image}
            />
            <div className="flex grow-0 flex-row items-center gap-4 self-center sm:gap-16">
              <span className="text-2xl font-bold">{homeScore}</span>
              <span className="text-sm text-gray-500">-</span>
              <span className="text-2xl font-bold">{awayScore}</span>
            </div>
            <TeamCard
              id={awayTeamId}
              name={team2.data?.name}
              logo={team2.data?.image}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

type TeamCardProps = {
  id: string;
  name?: string;
  logo?: string | null;
};

function TeamCard({ id, name, logo }: TeamCardProps) {
  if (name == null) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-grow flex-col items-center">
      <Link href={`/teams/${id}`} className="flex flex-col items-center">
        <Image src={logo ?? ""} alt={name} width={36} height={36} />
        <span className="pt-2 font-bold">{name}</span>
      </Link>
    </div>
  );
}
