export type Post = {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: any;
  tags?: string[];
  categories?: string[];
  author?: string;
};
