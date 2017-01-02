// @flow
import type {Options, Post, Category, Author} from './types';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import mkdirp from 'mkdirp';
import nodefn from 'when/node';
import {urlize} from './urlize';
import {processPost, processCategory, processAuthor} from './processing';

export function setupFolders(options: Options) {
  ['content/articles', 'data/categories', 'data/authors'].forEach((folder) => {
    mkdirp.sync(path.join(options.hugoPath, folder));
  });
  return options;
}

const writeFile = nodefn.lift(fs.writeFile);

function toFrontMatterwithBody(obj: Object) {
  let body = '';
  const frontMatter: Object = {};
  for (const key in obj) {
    if (key !== 'body') {
      frontMatter[key] =  obj[key];
    }
  }
  return `---\n${yaml.safeDump(frontMatter)}---\n\n${obj.body || ''}`;
}

function toYaml(obj: Object) {
  return `---\n${yaml.safeDump(obj)}`;
}

export function writePost(options: Options, post: Object) {
  const file = path.join(options.hugoPath, 'content', 'articles', generatePostSlug(post.post_date, post.post_name) + '.md');
  console.log('Writing post to: ', file);
  return writeFile(file, toFrontMatterwithBody(processPost(post)));
}

export function writeCategory(options: Options, category: Object) {
  const file = path.join(options.hugoPath, 'data', 'categories', urlize(category.name) + '.yml');
  console.log('Writing category to: ', file);
  return writeFile(file, toYaml(processCategory(category)));
}

export function writeAuthor(options: Options, author: Object) {
  const file = path.join(options.hugoPath, 'data', 'authors', urlize(author.display_name) + '.yml');
  console.log('Writing author to: ', file);
  return writeFile(file, toYaml(processAuthor(author)));
}

function generatePostSlug(date: Date, slug: string) {
  return `${date.toISOString().replace(/T.+$/,'')}-${slug}`;
}
