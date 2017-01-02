// @flow
export type Post = {
  title: string,
  slug: string,
  date: Date,
  author: string,
  description: string,
  categories: Array<Category>,
  body: string
};

export type Category = {
  title: string,
  description: ?string
};

export type Author = {
  title: string,
  first_name: string,
  last_name: string,
  description: string,
  avatar: ?string,
  www: ?string,
  social: Object
};

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
  categories: Array<Category>
};
