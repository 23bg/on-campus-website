import { DEMO_VIDEO_EMBED_URL } from "@/constants/external-links";

export type HelpCategory =
    | "Getting Started"
    | "Managing Enquiries"
    | "Students"
    | "Courses & Batches"
    | "FAQ";

export type HelpSection = {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
};

export type HelpFaqItem = {
    question: string;
    answer: string;
};

export type HelpDoc = {
    slug: string;
    title: string;
    category: HelpCategory;
    description: string;
    lastUpdated: string;
    videoUrl?: string;
    sections: HelpSection[];
    faqs?: HelpFaqItem[];
};

export const helpDocs: HelpDoc[] = [
    {
        slug: "getting-started",
        title: "Getting Started with OnCampus",
        category: "Getting Started",
        description: "Set up your institute profile, courses, and enquiry workflow in the first day.",
        lastUpdated: "2026-03-10",
        videoUrl: DEMO_VIDEO_EMBED_URL,
        sections: [
            {
                heading: "Create Your Institute",
                paragraphs: [
                    "Complete onboarding with your institute name, contact details, and public profile basics.",
                    "Your profile powers enquiry capture pages and helps your team keep records consistent.",
                ],
                bullets: [
                    "Open onboarding from your dashboard after signup",
                    "Add primary phone and WhatsApp contact",
                    "Save city, state, and address for better lead context",
                ],
            },
            {
                heading: "Set Up Courses and Batches",
                paragraphs: [
                    "Create your core courses first, then attach active batches for admissions.",
                ],
                bullets: [
                    "Create courses with clear names and durations",
                    "Create batches for each intake",
                    "Assign team members responsible for follow-ups",
                ],
            },
            {
                heading: "Start Capturing Enquiries",
                paragraphs: [
                    "Use your public institute page and forms to capture enquiries in a structured way.",
                ],
                bullets: [
                    "Add first enquiry manually to test your process",
                    "Track status updates and next follow-up date",
                    "Convert qualified enquiries into student records",
                ],
            },
        ],
    },
    {
        slug: "add-enquiry",
        title: "How to Add an Enquiry",
        category: "Managing Enquiries",
        description: "Capture new leads quickly and keep follow-ups organized.",
        lastUpdated: "2026-03-10",
        videoUrl: DEMO_VIDEO_EMBED_URL,
        sections: [
            {
                heading: "Add New Enquiry",
                paragraphs: [
                    "Open the Leads section and create a new enquiry with student and guardian details.",
                ],
                bullets: [
                    "Add name and phone number",
                    "Select interested course",
                    "Save source such as walk-in, call, or campaign",
                ],
            },
            {
                heading: "Track Follow-up",
                paragraphs: [
                    "Set a follow-up date and keep notes after each call to avoid context loss across counselors.",
                ],
                bullets: [
                    "Use lead status consistently",
                    "Record objections and next action",
                    "Update owner if your team uses role-based follow-up",
                ],
            },
            {
                heading: "Keep Pipeline Clean",
                paragraphs: [
                    "A clean pipeline improves conversion predictability and counselor accountability.",
                ],
                bullets: [
                    "Close inactive leads with reasons",
                    "Prioritize hot leads daily",
                    "Review stage-wise conversion every week",
                ],
            },
        ],
    },
    {
        slug: "convert-student",
        title: "Convert Enquiry to Student",
        category: "Students",
        description: "Move confirmed admissions into student records without duplicate data entry.",
        lastUpdated: "2026-03-10",
        sections: [
            {
                heading: "Convert at the Right Stage",
                paragraphs: [
                    "Convert leads only after admission confirmation so your student list reflects active enrollments.",
                ],
                bullets: [
                    "Confirm course and batch preference",
                    "Validate contact details",
                    "Capture admission date",
                ],
            },
            {
                heading: "Assign Course and Batch",
                paragraphs: [
                    "Attach each student to a course and optional batch to keep academic operations aligned.",
                ],
                bullets: [
                    "Choose the right course",
                    "Assign active batch",
                    "Set fee plan if required",
                ],
            },
            {
                heading: "Maintain Student Lifecycle",
                paragraphs: [
                    "After conversion, all updates should happen in student records and fee workflows.",
                ],
            },
        ],
    },
    {
        slug: "create-course",
        title: "Create Courses and Batches",
        category: "Courses & Batches",
        description: "Set up your academic structure for admissions and operations.",
        lastUpdated: "2026-03-10",
        sections: [
            {
                heading: "Create Course",
                paragraphs: [
                    "Define each course with a clear title and optional duration, fee defaults, and description.",
                ],
                bullets: [
                    "Use consistent naming (example: NEET Foundation 2026)",
                    "Add banner and description for public page",
                    "Update pricing references for counselors",
                ],
            },
            {
                heading: "Create Batch",
                paragraphs: [
                    "Batches help you organize admissions by intake, schedule, and faculty ownership.",
                ],
                bullets: [
                    "Set start date",
                    "Add schedule details",
                    "Assign teacher where needed",
                ],
            },
            {
                heading: "Assign Students",
                paragraphs: [
                    "Map students to courses and batches to keep class operations accurate.",
                ],
            },
        ],
    },
    {
        slug: "faq",
        title: "Frequently Asked Questions",
        category: "FAQ",
        description: "Common questions from institute owners and admin teams.",
        lastUpdated: "2026-03-10",
        sections: [
            {
                heading: "Account and Access",
                paragraphs: [
                    "Answers for daily account and team management concerns.",
                ],
            },
        ],
        faqs: [
            {
                question: "How do I reset my password?",
                answer: "Use the login page and choose forgot password. If email OTP is enabled, you can verify and update access quickly.",
            },
            {
                question: "How can I invite staff members?",
                answer: "Go to Team in the dashboard, create member accounts, and assign role-based permissions based on responsibility.",
            },
            {
                question: "Can I delete an enquiry?",
                answer: "Yes. You can remove an enquiry from lead records when it is invalid or duplicate, keeping your pipeline clean.",
            },
        ],
    },
];

export const helpCategories: HelpCategory[] = [
    "Getting Started",
    "Managing Enquiries",
    "Students",
    "Courses & Batches",
    "FAQ",
];

export const getHelpDocBySlug = (slug: string): HelpDoc | undefined =>
    helpDocs.find((doc) => doc.slug === slug);

export const getHelpDocIndex = (slug: string): number =>
    helpDocs.findIndex((doc) => doc.slug === slug);

export const getHelpDocsByCategory = () =>
    helpCategories.map((category) => ({
        category,
        docs: helpDocs.filter((doc) => doc.category === category),
    }));
