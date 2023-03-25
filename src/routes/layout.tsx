import { component$, Slot } from "@builder.io/qwik";

import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";


export default component$(() => {
  return (
    <div class="page">
      <main>
        <Header />
        <Slot />
      </main>
      <Footer />
    </div>
  );
});
