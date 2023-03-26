import { component$ } from "@builder.io/qwik";

interface Props {
    tags?: string[];
    title?: string;
    date?: string;
}

export default component$((props: Props) => {
    const tag = props.tags && props.tags[0];
    const date = props.date && new Date(props.date);
    const formatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <header class="items-center flex mb-5 relative">
            {
                tag && (
                    <picture class="h-24 w-24 mr-4 object-contain static">
                        <img 
                            decoding="async" 
                            itemProp="image" 
                            alt="Tag Image" 
                            src={"/images/tags/" + tag + ".png"}
                        />
                    </picture>
                )
            }

            {
                props.title && (
                    <div class="article-header-meta">
                        <h1 itemProp="name">{props.title}</h1>
                        {
                            date && (
                                <div class="article-meta">
                                    <time 
                                        itemProp="datePublished" 
                                        dateTime={date.toISOString()}>{formatter.format(date)}</time>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </header>
    );
});