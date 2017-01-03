// @flow
export type Post = {
  title: string,
  slug: string,
  date: Date,
  author: string,
  description: string,
  categories: Array<Category>,
  body: string,
  fromDB: Object
};

export type Category = {
  title: string,
  slug: string,
  description: string,
  fromDB: Object
};

export type Author = {
  title: string,
  slug: string,
  first_name: ?string,
  last_name: ?string,
  description: string,
  avatar: ?string,
  www: ?string,
  social: Object,
  fromDB: Object
};

export type PostProcessor = (Options, Post) => (Post | Promise<Post>);
export type CategoryProcessor = (Options, Category) => (Category | Promise<Category>);
export type AuthorProcessor = (Options, Author) => (Author | Promise<Author>);

export type MySQLConnection = {
  query: (string) => Promise<Row>
};
export type Row = Array<Object>;
export type Options = {
  db: {
    user: string,
    password: ?string,
    host: string,
    database: string
  },
  hugoPath: string,
  connection: MySQLConnection,
  posts: Array<Post>,
  authors: Array<Author>,
  categories: Array<Category>,
  processors: {
    post: PostProcessor,
    category: CategoryProcessor,
    author: AuthorProcessor
  }
};
