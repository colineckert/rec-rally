import Link from "next/link";
import type { Post } from "~/types/post";
import { api } from "~/utils/api";
import { getFormattedDate } from "~/utils/formatters";

function GameRecap({
  id,
  user,
  // homeTeamId,
  // awayTeamId,
  homeScore,
  awayScore,
  createdAt,
  likeCount,
  likedByMe,
}: Post) {
  const trpcUtils = api.useUtils();

  // TODO: get team names from id

  // TODO: try using a grid layout for this
  return (
    <li key={id} className="flex gap-4 border-b px-4 py-6">
      <div className="flex flex-grow flex-col">
        <span className="self-center text-gray-500">
          {getFormattedDate(createdAt, "long")}
        </span>
        <div className="flex flex-row justify-center gap-14 py-4">
          <Link
            href={`/`}
            className="font-bold hover:underline focus-visible:underline"
          >
            Arsenal
          </Link>
          <div />
          <Link
            href={`/`}
            className="font-bold hover:underline focus-visible:underline"
          >
            Chelsea
          </Link>
          {/* TODO: add images for teams */}
        </div>
        <div className="flex flex-row justify-center gap-20">
          <span className="font-bold">{homeScore}</span>
          <span className="text-gray-500">-</span>
          <span className="font-bold">{awayScore}</span>
        </div>
        {/* <div className="self-end"> */}
        {/*   <HeartButton */}
        {/*     onClick={handleToggleLike} */}
        {/*     isLoading={toggleLike.isLoading} */}
        {/*     likedByMe={likedByMe} */}
        {/*     likeCount={likeCount} */}
        {/*   /> */}
        {/* </div> */}
      </div>
    </li>
  );
}

export default GameRecap;
