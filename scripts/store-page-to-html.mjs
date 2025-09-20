import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import fs from "node:fs";
import { parse } from "yaml";
import meta from "../package.json" with { type: "json" };

function parseFrontMatter(input) {
  if (!input.startsWith("---")) {
    throw new Error("missing YAML front matter");
  }

  const end = input.indexOf("---", 1);
  if (end === -1) {
    throw new Error("missing end of YAML front matter");
  }

  const frontMatter = parse(input.substring(3, end));
  const markdown = `![Screenshot: ${frontMatter.title}](${frontMatter.image})
  
  ${input.substring(end + 3)}`;

  return [frontMatter, markdown];
}

const plugin = gfmHeadingId();
marked.use(plugin);

let frontMatter;
let markdown;

const defaultRenderer = new marked.Renderer();

function isExternalLink(href) {
  return href.startsWith("http://") || href.startsWith("https://");
}

const renderer = {
  image(image) {
    defaultRenderer.parser = this.parser;
    if (image.href.length === 0) {
      return defaultRenderer.image(image);
    }

    return `<a href="${image.href}" target="_blank">${defaultRenderer.image(image)}</a>`;
  },
  link(link) {
    const target = isExternalLink(link.href) ? "_blank" : null;
    if (target === null) {
      return false;
    }

    return `<a href="${link.href}" target="${target}">${link.text}</a>`;
  },
};

marked.use({
  hooks: {
    preprocess(input) {
      [frontMatter, markdown] = parseFrontMatter(input);
      return markdown;
    },
    postprocess(html) {
      return `<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>${frontMatter.title}</title>
        <link rel="stylesheet" href="./store.css"/>
        <link rel="icon" href="${frontMatter.icon}"/>
        <script src="./store.js"></script>
    </head>
    <body>
${html}
    </body>
</html>`
        .replaceAll(meta.config.GITLAB_PAGES, "../")
        .replaceAll(">../manifest.json<", `>${frontMatter.manifest}<`);
    },
  },
  renderer,
});

const input = fs.readFileSync(0, "utf-8");
const html = marked.parse(input);
if (typeof html !== "string") {
  throw new Error("output can only handle string");
}

fs.writeFileSync(1, html);
