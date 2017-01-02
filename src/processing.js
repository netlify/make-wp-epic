// @flow
import type {Post, Category, Author} from './types';
import yaml from 'js-yaml';

export function processPost(post: Object) : Post {
  return {
    title: post.post_title,
    slug: post.post_name,
    date: post.post_date,
    author: post.author.display_name,
    description: post.post_excerpt,
    categories: post.categories,
    body: post.post_content
  };
}

export function processCategory(category: Object) : Category {
  return {title: category.name, description: category.description};
}

const socialFields = ['twitter', 'facebook', 'googleplus'];
export function processAuthor(author: Object) : Author {
  return {
    title: author.display_name,
    first_name: author.first_name || null,
    last_name: author.last_name || null,
    description: author.description || '',
    avatar: author.avatar || null,
    www: author.user_url || author.url || null,
    social: socialFields.reduce((r, f) => author[f] ? Object.assign(r, {[f]: author[f]}) : r, {})
  };
}
