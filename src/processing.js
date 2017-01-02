// @flow
import yaml from 'js-yaml';

export function processPost(post: Object) {
  const frontMatter = yaml.safeDump({
    title: post.post_title,
    slug: post.post_name,
    date: post.post_date,
    author: post.author.display_name,
    description: post.post_excerpt,
    categories: post.categories
  });
  return `---\n${frontMatter}---\n\n${post.post_content}`;
}

export function processCategory(category: Object) {
  const yml =  yaml.safeDump({
    title: category.name,
    description: category.description || null
  });
  return `---\n${yml}`;
}

const socialFields = ['twitter', 'facebook', 'googleplus'];
export function processAuthor(author: Object) {
  const yml = yaml.safeDump({
    title: author.display_name,
    first_name: author.first_name || null,
    last_name: author.last_name || null,
    description: author.description || null,
    avatar: author.avatar || null,
    www: author.user_url || author.url || null,
    social: socialFields.reduce((r, f) => author[f] ? Object.assign(r, {[f]: author[f]}) : r, {})
  });
  return `---\n${yml}`;
}
