export interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}
