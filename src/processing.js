import yaml from 'js-yaml';

export function processPost(post) {
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
