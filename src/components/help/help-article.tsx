import Link from "next/link";
import type { HelpDoc } from "@/content/help/docs";
import { DEMO_VIDEO_EMBED_URL } from "@/constants/external-links";

type HelpArticleProps = {
    doc: HelpDoc;
    previousDoc?: HelpDoc;
    nextDoc?: HelpDoc;
};

export default function HelpArticle({ doc, previousDoc, nextDoc }: HelpArticleProps) {
    return (
        <article className="rounded-xl border bg-card p-5 md:p-8">
            <header className="mb-8 space-y-2 border-b pb-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{doc.category}</p>
                <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
                <p className="text-sm text-muted-foreground">Last updated: {doc.lastUpdated}</p>
                <p className="text-muted-foreground">{doc.description}</p>
            </header>

            {doc.videoUrl ? (
                <section className="mb-8">
                    <h2 className="mb-3 text-xl font-semibold">Watch Demo</h2>
                    <div className="aspect-video overflow-hidden rounded-lg border">
                        <iframe
                            src={DEMO_VIDEO_EMBED_URL}
                            title={`${doc.title} video tutorial`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </section>
            ) : null}

            <div className="space-y-8">
                {doc.sections.map((section) => (
                    <section key={section.heading} className="space-y-3">
                        <h2 className="text-xl font-semibold">{section.heading}</h2>

                        {section.paragraphs?.map((paragraph) => (
                            <p key={paragraph} className="text-muted-foreground">
                                {paragraph}
                            </p>
                        ))}

                        {section.bullets?.length ? (
                            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                                {section.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                ))}

                {doc.faqs?.length ? (
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold">FAQ</h2>
                        {doc.faqs.map((faq) => (
                            <div key={faq.question} className="rounded-lg border p-4">
                                <h3 className="font-medium">{faq.question}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </section>
                ) : null}
            </div>

            <footer className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2">
                {previousDoc ? (
                    <Link
                        href={`/help/${previousDoc.slug}`}
                        className="rounded-md border px-4 py-3 text-sm hover:bg-muted"
                    >
                        <p className="text-xs text-muted-foreground">Previous</p>
                        <p className="font-medium">{previousDoc.title}</p>
                    </Link>
                ) : (
                    <div />
                )}

                {nextDoc ? (
                    <Link
                        href={`/help/${nextDoc.slug}`}
                        className="rounded-md border px-4 py-3 text-sm text-left sm:text-right hover:bg-muted"
                    >
                        <p className="text-xs text-muted-foreground">Next</p>
                        <p className="font-medium">{nextDoc.title}</p>
                    </Link>
                ) : null}
            </footer>
        </article>
    );
}
