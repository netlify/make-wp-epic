import mysql from 'promise-mysql';

export function connect(options) {
  return mysql.createConnection(options.db).then((connection) => (
    Object.assign({}, options, {connection})
  ));
}

export function selectPosts(options) {
  return options.connection.query(
    `SELECT * FROM wp_posts
     WHERE post_type = 'post'
     AND post_status = 'publish'`
  ).then((rows) => Object.assign(options, {posts: rows}));
}

export function postWithMetadata(options, post) {
  return options.connection.query(
    `SELECT * FROM wp_posts p
     JOIN wp_postmeta m
     ON m.meta_key = '_thumbnail_id'
     AND m.meta_value = p.id
     WHERE p.id = ${post.ID}`
  )
  .then((rows) => Object.assign(post, {thumbnail: rows[0]}))
  .then((post) => (
    options.connection.query(
      `SELECT * FROM wp_users WHERE id = ${post.post_author}`
    ).then((rows) => (
      options.connection.query(
        `SELECT * FROM wp_posts WHERE id = ${rows[0].ID} and post_type = 'attachment'`
      ).then((attachments) => (
        Object.assign({}, rows[0], {thumbnail: attachments[0]})
      )).then((author) => Object.assign(post, {author}))
    ))
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
