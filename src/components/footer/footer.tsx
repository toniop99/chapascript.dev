import { component$ } from "@builder.io/qwik";
import FooterLink from "./footerLink";

export default component$(() => {
  return (
    <footer class="py-8 px-20 text-center bg-[#323232]/70 absolute bottom-0 w-full">
      <FooterLink text="Github" url="https://github.com/toniop99" />
    </footer>
  );
});
