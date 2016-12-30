#!/usr/bin/env node

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
  .then(processItems('posts', postWithMetadata, writePost))
  .then(selectCategories)
  .then(processItems('categories', categoryWithMetdata, writeCategory))
  .then(selectAuthors)
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

function processItems(key, processor, writer) {
  return (options) => {
    const fn = guard(guard.n(5), (item) => (
      processor(options, item).then(writer.bind(null, options))
    ));

    return all(map(options[key], fn)).then(() => options).catch(onError);
  };
}
