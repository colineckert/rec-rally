export type Post = {
  id: string;
  content: string;
  type: "SOCIAL" | "GAME_RECAP" | "GAME_INVITE";
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  leagueId: string | null;
};
