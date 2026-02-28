import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "Is there a free trial?",
        a: "Yes. You can start a free trial before choosing a paid plan.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel subscription from billing settings any time.",
    },
    {
        q: "Is payment secure?",
        a: "Yes. Payments are processed securely using Razorpay.",
    },
    {
        q: "Will my data be safe?",
        a: "OnCampus uses authenticated access and scoped institute workspaces for data safety.",
    },
    {
        q: "Do you support multi-user teams?",
        a: "Yes. Team plans support multiple users with role-based access.",
    },
    {
        q: "Do you handle student fee payments?",
        a: "Yes. You can track fee collections and payment records inside OnCampus.",
    },
];

export default function FAQ() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-4xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">FAQ</h2>
                <Accordion type="single" collapsible className="mt-6 w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={faq.q} value={`item-${index + 1}`}>
                            <AccordionTrigger>{faq.q}</AccordionTrigger>
                            <AccordionContent>{faq.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

