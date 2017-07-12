// @flow
import type {Options, Post, Category, Author} from './types';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import mkdirp from 'mkdirp';
import nodefn from 'when/node';
import {processPost, processCategory, processAuthor} from './processing';

export function setupFolders(options: Options) {
  ['content/articles', 'data/categories', 'data/authors'].forEach((folder) => {
    mkdirp.sync(path.join(options.hugoPath, folder));
  });
  return options;
}

const writeFile = nodefn.lift(fs.writeFile);

function without(obj: Object, ...keys: Array<string>) {
  const clone: Object = {};
  for (const key in obj) {
    if (keys.indexOf(key) === -1) {
      clone[key] = obj[key];
    }
  }
  return clone;
}

function toFrontMatterwithBody(obj: Object) {
  return `---\n${yaml.safeDump(without(obj, 'body', 'fromDB'))}---\n\n${obj.body || ''}`;
}

function toYaml(obj: Object) {
  return `---\n${yaml.safeDump(without(obj, 'fromDB'))}`;
}

export function writePost(options: Options, post: Post) {
  console.log("post date: ",post.date);
  const file = path.join(options.hugoPath, 'content', 'articles', generatePostSlug(post.date, post.slug) + '.md');
  console.log('Writing post to: ', file);
  return writeFile(file, toFrontMatterwithBody(post));
}

export function writeCategory(options: Options, category: Category) {
  const file = path.join(options.hugoPath, 'data', 'categories', category.slug + '.yml');
  console.log('Writing category to: ', file);
  return writeFile(file, toYaml(category));
}

export function writeAuthor(options: Options, author: Author) {
  const file = path.join(options.hugoPath, 'data', 'authors', author.slug + '.yml');
  console.log('Writing author to: ', file);
  return writeFile(file, toYaml(author));
}

function generatePostSlug(date: Date, slug: string) {
  // let postDate = new Date(date);
  // return `${postDate.toISOString().replace(/T.+$/,'')}-${slug}`;
  return `${slug}`;
}
