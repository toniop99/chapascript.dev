import { component$ } from "@builder.io/qwik";
import path from "path";
import * as fs from "fs";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import matter from "gray-matter";
import { marked } from "marked";
import hljs from "highlight.js";

import "../../code.css"

interface PostParams extends Readonly<Record<string, string>> {
  post: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

export default component$(() => {
  const postContent = useGetPostContent();

  if (!postContent) {
    return <div>Not found</div>;
  }

  const processedContent = marked(postContent.content, {
    pedantic: false,
    gfm: true,
    breaks: false,
    headerIds: true,
    langPrefix: 'hljs language-',
    highlight: function(code: string, lang: string): string | void {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, {language}).value;
    },
  });

  const contentHtml = processedContent;

  return (
    <>
      <article dangerouslySetInnerHTML={contentHtml}></article>
    </>
  );
});

export const useGetPostContent = () => {
  const location = useLocation();
  const params = location.params as PostParams;

  // check if the post file exists.
  const fileNames = fs.readdirSync(postsDirectory);

  if (!fileNames.includes(params.post + ".md")) {
    return null;
  }

  const fileContents = fs.readFileSync(
    path.join(postsDirectory, params.post + ".md"),
    "utf8"
  );

  const matterResult = matter(fileContents);

  return {
    frontmatter: matterResult.data,
    content: matterResult.content
  };
};

export const onStaticGenerate: StaticGenerateHandler = () => {
  const fileNames = fs.readdirSync(postsDirectory);

  const result = fileNames.map((fileName) => {
    return {
      post: fileName.replace(/\.md$/, ""),
    };
  });

  return {
    params: result,
  };
};
