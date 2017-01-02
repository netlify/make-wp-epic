// @flow
import type {Options, Post, Category, Author} from './types';
import path from 'path';
import {all, map} from 'when';
import guard from 'when/guard';
import getOptions from './options';
import {setupFolders, writePost, writeCategory, writeAuthor} from './hugo';
import {
  connect,
  selectPosts, postWithMetadata,
  selectCategories, categoryWithMetdata,
  selectAuthors, authorWithMetadata
} from './db';

let db;

getOptions()
  .then(connect)
  .then(setupFolders)
  .then(selectPosts)
  .then(selectCategories)
  .then(selectAuthors)
  .then(processItems('posts', postWithMetadata, writePost))
  .then(processItems('categories', categoryWithMetdata, writeCategory))
  .then(processItems('authors', authorWithMetadata, writeAuthor))
  .then(() => {
    console.log('Done...');
    process.exit(0);
  })
  .catch(onError);


function onError(err) {
  console.error(err);
  process.exit(1);
}

type Processor = (Options, Object) => Promise<Post | Category | Author>;
type Writer = (Options, Post | Category | Author) => Promise<Post | Category | Author>;
function processItems(key: string, processor: Processor, writer: Writer) {
  return (options) => {
    const fn = guard(guard.n(5), (item) => (
      processor(options, item).then(writer.bind(null, options))
    ));

    return all(map(options[key], fn)).then(() => options).catch(onError);
  };
}
