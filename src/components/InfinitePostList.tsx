type Post = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};

type InfinitePostListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore?: boolean;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
};

export function InfinitePostList({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore,
}: InfinitePostListProps) {
  console.log(posts);
  return <div>asdf</div>;
}
