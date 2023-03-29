import { component$, useResource$, useSignal, useTask$ } from "@builder.io/qwik";
import { ChapaScriptLogo } from "~/components/icons/chapascript";
import Search from "~/components/header/search/search";

export default component$(() => {
  const search = useSignal("");

  useTask$(async ({ track }) => {
    track(() => search.value)

    if (search.value.length < 3) {
      return;
    }

    // Make a request to the server (algolia) to get the search results from posts
    
  });

  return (
    <header class="flex items-center pt-5 px-16">
      <div class="inline-block">
        <a href="/" title="ChapaScript">
          <ChapaScriptLogo width={50} height={50} />
        </a>
      </div>
      <ul class="m-0 list-none flex-1 text-right">
        <li class="inline-block m-0 p-0">
          <Search />
        </li>
      </ul>
    </header>
  );
});
