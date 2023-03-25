import { component$ } from "@builder.io/qwik";
import { ChapaScriptLogo } from "~/components/icons/chapascript";

export default component$(() => {
  return (
    <header class="flex items-center pt-5 px-16">
      <div class="inline-block">
        <a href="/" title="ChapaScript">
          <ChapaScriptLogo width={50} height={50} />
        </a>
      </div>
      <ul class="m-0 list-none flex-1 text-right">
        <li class="inline-block m-0 p-0">
          <input type="search" placeholder="Search" />
        </li>
      </ul>
    </header>
  );
});
