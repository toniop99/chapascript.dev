import { component$, useSignal, useTask$ } from "@builder.io/qwik";


export default component$(() => {
  const search = useSignal("");

  useTask$(async ({ track }) => {
    track(() => search.value);

    if (search.value.length < 3) {
      return;
    }

    // Make a request to the server (algolia) to get the search results from posts
  });

  return (
    <input type="search" placeholder="Search" onInput$={(ev) => (search.value = (ev.target as HTMLInputElement).value)} />
  )
});
