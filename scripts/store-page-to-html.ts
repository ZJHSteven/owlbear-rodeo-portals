import {marked, Tokens} from "marked";
import {gfmHeadingId} from "marked-gfm-heading-id";
import * as fs from "node:fs";
import {parse} from 'yaml'
import * as meta from "../package.json";

marked.use(gfmHeadingId());

function parseFrontMatter(input: string): [FrontMatter, string] {
  if (!input.startsWith("---")) {
    throw "missing YAML front matter";
  }

  const end: number = input.indexOf("---", 1);
  if (end === -1) {
    throw "missing end of YAML front matter";
  }

  const frontMatter: FrontMatter = parse(input.substring(3, end));
  const markdown: string = `![Screenshot: ${frontMatter.title}](${frontMatter.image})
  
  ${input.substring(end + 3)}`;

  return [frontMatter, markdown];
}

type FrontMatter = {
  title: string,
  description: string,
  author: string,
  image: string,
  icon: string,
  tags: string[],
  manifest: string,
  "learn-more": string,
};

let frontMatter: FrontMatter;
let markdown: string;

const defaultRenderer = new marked.Renderer();

function isExternalLink(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

const renderer = {
  image(image: Tokens.Image): string {
    if (image.href.length === 0) {
      return defaultRenderer.image(image);
    }

    return `<a href="${image.href}" target="_blank">${defaultRenderer.image(image)}</a>`;
  },
  link(link: Tokens.Link): string | false {
    const target = isExternalLink(link.href) ? "_blank" : null;
    if (target === null) {
      return false;
    }

    return `<a href="${link.href}" target="${target}">${link.text}</a>`;
  }
};

marked.use({
  hooks: {
    preprocess(input): string {
      [frontMatter, markdown] = parseFrontMatter(input);
      return markdown;
    },
    postprocess(html) {
      return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${frontMatter.title}</title>
        <link rel="stylesheet" href="./store.css"/>
        <link rel="icon" href="${frontMatter.icon}"/>
    </head>
    <body>
${html}
    </body>
</html>`.replaceAll(meta.config.GITLAB_PAGES, "../")
    }
  },
  useNewRenderer: true,
  renderer,
})

const input = fs.readFileSync(0, 'utf-8');
const html = marked.parse(input);
if (typeof html !== "string") {
  throw "output can only handle string"
}

fs.writeFileSync(1, html);
