import { component$ } from "@builder.io/qwik";
import path from "path";
import * as fs from "fs";
import type {
  DocumentHead,
  StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import matter from "gray-matter";
import { marked } from "marked";
import hljs from "highlight.js";
import Header from "~/components/post/header";

import "./post.css";

interface TOCItem {
  level: number;
  slug: string;
  title: string;
  parent: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

export default component$(() => {
  const location = useLocation();
  const postContent = useGetPostContent(location.params.post);

  if (!postContent) {
    return <div>Not found</div>;
  }

  const renderer = new marked.Renderer();
  const toc: TOCItem[] = [];

  renderer.heading = function (text, level, raw, slugger) {
    const slug = slugger.slug(raw);
    
    if (level === 2) {
      toc.push({
        level: level,
        slug: slug,
        title: text,
        parent: ''
      });
    } else if (level === 3) {
      const parent = toc.filter((h) => h.level === 2).pop();

    
      toc.push({
        level: level,
        slug: slug,
        title: text,
        parent: parent?.slug ?? ''
      });
    }
    

    return `
      <h${level} id="${slug}">
        ${text}
      </h${level}>
    `;
  }

  const contentHtml = marked(postContent.content, {
    renderer: renderer,
    pedantic: false,
    gfm: true,
    breaks: false,
    headerIds: true,
    langPrefix: "hljs language-",
    highlight: function (code: string, lang: string): string | void {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  });

  return (
    <>
      <div class="flex max-w-full my-0 mx-auto pt-0 pb-8 px-8">
        <article
          id="article"
          itemType="http://schema.org/Article"
          class="max-w-4xl w-full my-0 mx-auto"
        >
          <div class="flex">
            <div class="flex-1 pb-8">
              <Header
                date={postContent.frontmatter?.date}
                title={postContent.frontmatter?.title}
                tags={postContent.frontmatter?.tags}
              />
              <div
                itemProp="articleBody"
                dangerouslySetInnerHTML={contentHtml}
              ></div>
            </div>
          </div>
        </article>

        <div id="toc-container">
          <h3>Contenido del post</h3>
          <nav id="toc" dangerouslySetInnerHTML={generateTOC(toc)}>
          </nav>
        </div>
      </div>
    </>
  );
});

export const useGetPostContent = (post: string) => {
  // check if the post file exists.
  const fileNames = fs.readdirSync(postsDirectory);

  if (!fileNames.includes(post + ".md")) {
    return null;
  }

  const fileContents = fs.readFileSync(
    path.join(postsDirectory, post + ".md"),
    "utf8"
  );

  const matterResult = matter(fileContents);

  return {
    frontmatter: matterResult.data,
    content: matterResult.content,
  };
};

export const useGetHeadData = routeLoader$((ev) => {
  const post = ev.params.post;
  const postContent = useGetPostContent(post);

  if (!postContent) {
    return {
      title: "Not found",
      meta: [
        {
          name: "description",
          content: "Not found",
        },
      ],
    };
  }

  return {
    title: postContent.frontmatter?.title ?? "Post",
    meta: [
      {
        name: "description",
        content: postContent.frontmatter?.description ?? "Post",
      },
    ],
  };
});

export const head: DocumentHead = ({ resolveValue }) => {
  const headData = resolveValue(useGetHeadData);
  return {
    title: headData.title,
    meta: headData.meta,
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

const generateTOC = (headings: TOCItem[], level = 2, parent?: string) => {

  let filteredHeadings = [];
  
  if(parent) {
    filteredHeadings = headings.filter((h) => h.parent === parent);
  } else {
    filteredHeadings = headings.filter((h) => h.level === level);
  }

  if (filteredHeadings.length === 0) {
    return '';
  }
  
  let html = `<ul>`;
  for (const heading of filteredHeadings) {
    html += `<li><a href="#${heading.slug}">${heading.title}</a>`;
    html += generateTOC(headings, level + 1, heading.slug);
    html += `</li>`;
  }
  html += `</ul>`;

  return html;
}