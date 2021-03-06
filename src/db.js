// @flow
import type {Options} from './types';
import mysql from 'promise-mysql';

export function connect(options: Options) {
  return mysql.createConnection(options.db).then((connection) => (
    Object.assign({}, options, {connection})
  ));
}

export function selectPosts(options: Options) {
  return options.connection.query(
    `SELECT * FROM wp_posts
     WHERE post_type = 'post'
     AND post_status = 'publish'`
  ).then((rows) => Object.assign(options, {posts: rows}));
}

export function selectPages(options: Options) {
  return options.connection.query(
    `SELECT * FROM wp_posts
     WHERE post_type = 'page'
     AND post_status = 'publish'`
  ).then((rows) => Object.assign(options, {pages: rows}));
}

export function selectCategories(options: Options) {
  return options.connection.query(
    `SELECT * FROM wp_term_taxonomy tax
     JOIN wp_terms terms
     ON tax.term_id = terms.term_id
     WHERE tax.taxonomy IN ('category', 'post_tag')`
  ).then((rows) => Object.assign(options, {categories: rows.filter(r => !r.name.match(/^_/))}));
}

export function selectAuthors(options: Options) {
  return options.connection.query(
    `SELECT authors.* FROM wp_users authors
     JOIN wp_posts p ON p.post_author = authors.id
     GROUP BY authors.id
     `
  ).then((rows) => Object.assign(options, {authors: rows}));
}

export function postWithMetadata(options: Options, post: Object) {
  return options.connection.query(
    `SELECT p.guid FROM wp_posts p
     JOIN wp_postmeta m
     ON m.meta_key = '_thumbnail_id'
     AND m.post_id = ${post.ID}
     AND m.meta_value = p.ID`
  )
  .then((rows) => Object.assign(post, {thumbnail: rows[0] && rows[0].guid}))
  .then((post) => (
    options.connection.query(
      `SELECT * FROM wp_users WHERE id = ${post.post_author}`
    ).then((rows) => Object.assign(post, {author: rows[0]}))
  ))
  .then((post) => (
    options.connection.query(
      `SELECT * FROM wp_term_relationships r
       JOIN wp_term_taxonomy tax
       ON r.term_taxonomy_id = tax.term_taxonomy_id
       JOIN wp_terms term
       ON tax.term_id = term.term_id
       WHERE object_id = ${post.ID}
       ORDER BY r.term_order;`
    ).then((rows) => (
      Object.assign(post, {categories: rows.map(row => row.name)})
    ))
  ));
}

export const pageWithMetadata = postWithMetadata;

export function categoryWithMetdata(options: Options, category: Object) {
  return Promise.resolve(category);
}

export function authorWithMetadata(options: Options, author: Object) {
  return options.connection.query(
    `SELECT * FROM wp_usermeta WHERE user_id = ${author.ID}`
  ).then((rows) => Object.assign(author, rows.reduce((data, row) => (
    Object.assign(data, {[row.meta_key]: row.meta_value})
  ), {})));
}
