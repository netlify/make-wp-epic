# Make WP Epic

A tool for migrating from WordPress to [Victor Hugo](https://github.com/netlify/victor-hugo)

## Installation

Simply run:

```bash
yarn global add make-wp-epic
```

## Usage

Make WP Epic lets you migrate all the content from a Wordpress database, to an opinionated
structure that plays very well with [Hugo's](gohugo.io) content model.

It won't export any themes or templates from your Wordpress site, but it will export posts,
authors and categories from your Wordpress database.

To run a migration, use this command:

```bash
make-wp-epic -d database [-u user] [-h host] <path-to/my/victor-hugo>
```

Options:

* `-d` sets the name of your Wordpress database
* `-u` User to connect to MySQL with (optional, `root` by default)
* `-h` Your MySQL host (optional, `localhost` by default)
* `<path>` The path to a clone of the [Victor Hugo Boilerplate](github.com/netlify/victor-hugo)

## What will it export

After running the tool you'll get the following structure in your Victor Hugo site:

```
/site/content/articles/ # All your Wordpress articles as Markdown with YAML FrontMatter
/site/data/categories/ # All Wordpress categories and tags with descriptions as .yml files
/site/data/authors/ # All Wordpress Authors with descriptions, avatars and social links as .yml files
```

Note that this tool doesn't export Authors to the hugo site configuration but to a data collection. This
is because the tool was written with large Wordpress sites in mind. The original site migrated with the
tool had more than thousand authors, and splitting them up in individual files makes a lot more sense in
those cases.

## Custom processors for advanced users

Sometimes you might need to do extra transforms or database queries on the posts during the migration.

For example, you might want to automatically convert all the HTML post bodies from Wordpress, to Markdown.

To do this, you can supply an extra path to `make-wp-epic` for a module with your own processors. It can export any of the following functions:

* `processPost(options, post)` will get called for each post during the migration
* `processAuthor(options, author)` will get called for each author during the migration
* `processCategory(options, category)` will get called for each category during the migration

The options argument has the following structure:

```
type Post = {
  slug: string,
  title: string,
  slug: string,
  date: Date,
  author: string,
  description: string,
  categories: Array<Category>,
  body: string,
  fromDB: Object // The raw data from the DB queries
}

type Category = {
  slug: string,
  title: string,
  description: ?string,
  fromDB: Object
}

type Author = {
  title: string,
  slug: string,
  email: string,
  first_name: string,
  last_name: string,
  description: string,
  www: ?string,
  social: Object,
  fromDB: Object
}

type options = {
  connection: {query: (string) => Promise<row>},
  posts: Array<Post>,
  authors: Array<Author>,
  categories: Array<Category>
}
```

Each function

For example, a converter to change all post bodies from HTML to Markdown could be written like this:

```js
var toMarkdown = require('to-markdown');

exports.processPost = function(options, post) {
  var obj = {};
  for (var key in obj) {
    if (key === 'body') {
      obj.body = toMarkdown(post[key]);
    } else {
      obj[key] = post[key];
    }
  }
  return obj;
}
```

## TODO

We'll be preparing a ready made Victory Hugo theme that will work great out of the box with this content
structure, so you can just run `make-wp-epic` and start hacking on the front-end for your new design!
