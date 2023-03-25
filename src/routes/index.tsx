import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
    </>
  );
});

export const head: DocumentHead = {
  title: "ChapaScript",
  meta: [
    {
      name: "description",
      content: "Posts y artículos sobre el desarrollo web ⚡️",
    },
  ],
};
