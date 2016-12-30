import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import nodefn from 'when/node';
import {processPost} from './processing';

function generateSlug(date, slug) {
  return `${date.toISOString().replace(/T.+$/,'')}-${slug}`;
}

export function setupFolders(options) {
  ['content/articles', 'categories', 'data/authors'].forEach((folder) => {
    mkdirp.sync(path.join(options.hugoPath, folder));
  });
  return options;
}

const writeFile = nodefn.lift(fs.writeFile);

export function writePost(options, post) {
  const file = path.join(options.hugoPath, 'content', 'articles', generateSlug(post.post_date, post.post_name) + '.md');
  console.log('Writing post to: ', file);
  return writeFile(file, processPost(post));
}
