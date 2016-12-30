import path from 'path';
import {all, map} from 'when';
import guard from 'when/guard';
import getOptions from './options';
import {setupFolders, writePost} from './hugo';
import {connect, selectPosts, postWithMetadata} from './db';

let db;

getOptions()
  .then(connect)
  .then(setupFolders)
  .then(selectPosts)
  .then((options) => {
    const processor = guard(guard.n(5), (post) => (
      postWithMetadata(options, post).then(writePost.bind(null, options))
    ));

    all(map(options.posts, processor))
      .then(() => {
        console.log('Done...');
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
