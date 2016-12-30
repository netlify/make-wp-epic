import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import nodefn from 'when/node';
import {urlize} from './urlize';
import {processPost, processCategory, processAuthor} from './processing';

export function setupFolders(options) {
  ['content/articles', 'data/categories', 'data/authors'].forEach((folder) => {
    mkdirp.sync(path.join(options.hugoPath, folder));
  });
  return options;
}

const writeFile = nodefn.lift(fs.writeFile);

export function writePost(options, post) {
  const file = path.join(options.hugoPath, 'content', 'articles', generatePostSlug(post.post_date, post.post_name) + '.md');
  console.log('Writing post to: ', file);
  return writeFile(file, processPost(post));
}

export function writeCategory(options, category) {
  const file = path.join(options.hugoPath, 'data', 'categories', urlize(category.name) + '.yml');
  console.log('Writing category to: ', file);
  return writeFile(file, processCategory(category));
}

export function writeAuthor(options, author) {
  const file = path.join(options.hugoPath, 'data', 'authors', urlize(author.display_name) + '.yml');
  console.log('Writing author to: ', file);
  return writeFile(file, processAuthor(author));
}

function generatePostSlug(date, slug) {
  return `${date.toISOString().replace(/T.+$/,'')}-${slug}`;
}
