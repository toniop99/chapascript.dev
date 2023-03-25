import { component$ } from "@builder.io/qwik";

interface Props {
  text: string;
  url: string;
  spacer?: boolean;
}
export default component$((props: Props) => {
  return (
    <a 
      href={props.url}
      target="_blank"
      class="text-white text-xl text-center mr-4"
    >
      {props.text}

      {props.spacer && <span class="py-4">|</span>}
    </a>
  );
});
