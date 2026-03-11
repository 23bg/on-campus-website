import { DEMO_VIDEO_EMBED_URL } from "@/constants/external-links";

export type HelpCategory =
    | "Getting Started"
    | "Managing Enquiries"
    | "Students"
    | "Courses & Batches"
    | "Fees & Billing"
    | "WhatsApp & Notifications"
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
        slug: "fees",
        title: "Managing Student Fees",
        category: "Fees & Billing",
        description: "Record fee plans, installments, and payment receipts for enrolled students.",
        lastUpdated: "2026-06-01",
        sections: [
            {
                heading: "How Fees Work in OnCampus",
                paragraphs: [
                    "OnCampus lets you record, structure, and track student fees manually. Fees are recorded by your admin team — the platform does not collect or transfer money.",
                    "Each student can be assigned a fee plan with one or more installments. You record each payment when it is received.",
                ],
                bullets: [
                    "Create a fee plan and attach installment dates",
                    "Record each payment received from the student",
                    "Track outstanding dues across the batch",
                ],
            },
            {
                heading: "Creating a Fee Plan",
                paragraphs: [
                    "Assign a total fee, divide it into installments, and set due dates for each.",
                ],
                bullets: [
                    "Open the student record and go to Fees",
                    "Add a fee plan with total amount",
                    "Split into installments with due dates",
                ],
            },
            {
                heading: "Recording Payments",
                paragraphs: [
                    "When a student pays, record the amount, date, and payment mode in the system.",
                ],
                bullets: [
                    "Open the student fee record",
                    "Mark the installment as paid with amount and date",
                    "Add payment mode such as cash, UPI, or bank transfer",
                ],
            },
            {
                heading: "Tracking Outstanding Dues",
                paragraphs: [
                    "Use the fees overview screen to see which students have upcoming or overdue installments.",
                ],
            },
        ],
        faqs: [
            {
                question: "Does OnCampus collect student payments?",
                answer: "No. OnCampus does not process or transfer student money. Your admin team records each payment manually after receiving it. Razorpay integration is used only for your OnCampus subscription billing.",
            },
            {
                question: "Can I add partial payments?",
                answer: "Yes. You can record partial payment amounts against any installment and update the remaining balance later.",
            },
        ],
    },
    {
        slug: "billing",
        title: "Subscription and Billing",
        category: "Fees & Billing",
        description: "Understand OnCampus plans, free trial, billing cycle, and how to manage your subscription.",
        lastUpdated: "2026-06-01",
        sections: [
            {
                heading: "Plans Overview",
                paragraphs: [
                    "OnCampus offers three plans: Starter at ₹999/month, Growth at ₹1,999/month, and Scale at ₹3,999/month.",
                    "All plans include unlimited records — students, enquiries, courses, and fee entries. The only difference is the number of team user accounts and your monthly WhatsApp system alert quota.",
                ],
                bullets: [
                    "Starter: 1 user, 1,000 WhatsApp conversations/month",
                    "Growth: up to 10 users, 2,000 WhatsApp conversations/month",
                    "Scale: unlimited users, 5,000 WhatsApp conversations/month",
                ],
            },
            {
                heading: "Free Trial",
                paragraphs: [
                    "New institutes start with a 14-day free trial with no credit card required. All features are available during the trial.",
                    "At the end of your trial, choose a plan to continue using the platform.",
                ],
            },
            {
                heading: "Annual Billing",
                paragraphs: [
                    "Choose annual billing to pay for 10 months and get 12 months of access — a 2-month saving.",
                    "Annual subscribers get priority support via WhatsApp.",
                ],
            },
            {
                heading: "Upgrading Your Plan",
                paragraphs: [
                    "You can upgrade at any time from the billing section of your dashboard. The new plan applies immediately.",
                ],
            },
        ],
        faqs: [
            {
                question: "How do I pay for my subscription?",
                answer: "Subscription payments are processed via Razorpay. You can pay using a card, UPI, or net banking after choosing your plan.",
            },
            {
                question: "Can I cancel my subscription?",
                answer: "Yes. You can cancel from the billing section. Access continues until the end of your current billing period.",
            },
        ],
    },
    {
        slug: "whatsapp-alerts",
        title: "WhatsApp Alerts in OnCampus",
        category: "WhatsApp & Notifications",
        description: "Understand how OnCampus sends operational WhatsApp alerts and how plan limits apply.",
        lastUpdated: "2026-06-01",
        sections: [
            {
                heading: "What WhatsApp Alerts Are",
                paragraphs: [
                    "WhatsApp alerts are automatic notifications sent by the system to help institutes stay updated about important events.",
                    "Examples include enquiry notifications and follow-up reminders so your team can act quickly without constantly checking the dashboard.",
                    "Alerts are system-generated. Institutes cannot manually send WhatsApp messages from OnCampus.",
                ],
            },
            {
                heading: "When Alerts Are Sent",
                paragraphs: [
                    "Alerts are triggered automatically by operational events in the system.",
                ],
                bullets: [
                    "New enquiry submission",
                    "Follow-up scheduling",
                    "Important operational updates",
                ],
            },
            {
                heading: "Alert Limits",
                paragraphs: [
                    "Each subscription plan includes a monthly number of WhatsApp alerts.",
                ],
                bullets: [
                    "Starter: 1,000 alerts",
                    "Growth: 2,000 alerts",
                    "Scale: 5,000 alerts",
                ],
            },
            {
                heading: "Daily Limits",
                paragraphs: [
                    "Daily limits also apply to help maintain reliable delivery and prevent abuse.",
                ],
            },
            {
                heading: "Extra Alerts",
                paragraphs: [
                    "If an institute exceeds its monthly alert limit, additional alerts can still be sent and are charged per message.",
                ],
            },
            {
                heading: "Future Capabilities",
                paragraphs: [
                    "Future versions of OnCampus may include advanced WhatsApp automation features.",
                    "These are not part of the current system alerts module.",
                ],
                bullets: [
                    "Automated follow-up sequences",
                    "Payment reminders",
                    "Broadcast messaging",
                ],
            },
        ],
        faqs: [
            {
                question: "Can institutes manually send WhatsApp messages from OnCampus?",
                answer: "No. Current WhatsApp alerts are system-generated operational notifications only. Manual messaging and advanced automation are planned as future modules.",
            },
        ],
    },
    {
        slug: "troubleshooting",
        title: "Troubleshooting Common Issues",
        category: "FAQ",
        description: "Quick fixes for frequent problems encountered by institute teams.",
        lastUpdated: "2026-06-01",
        sections: [
            {
                heading: "Login and Access Issues",
                bullets: [
                    "If you cannot log in, use the forgot password option on the login page",
                    "If OTP is not received, check your registered email or phone and try again after 60 seconds",
                    "If a team member cannot access a section, check their role permissions in Team settings",
                ],
            },
            {
                heading: "Data Not Saving",
                bullets: [
                    "Ensure all required fields are filled before submitting",
                    "Check your internet connection — the system needs a stable connection to save data",
                    "If the issue persists, log out and log back in, then retry",
                ],
            },
            {
                heading: "Enquiry or Student Not Showing",
                bullets: [
                    "Check if filters are applied and clear them to see all records",
                    "Verify the record was saved successfully by checking the notifications or reloading the page",
                    "Deleted records are not shown — contact support if records were deleted accidentally",
                ],
            },
            {
                heading: "Billing Issues",
                bullets: [
                    "For payment failures, retry from the billing section with a different payment method",
                    "If your subscription shows as expired after payment, contact support with your payment reference",
                    "For plan upgrade questions, see the Subscription and Billing help article",
                ],
            },
        ],
        faqs: [
            {
                question: "How do I contact support?",
                answer: "Send a message to our support WhatsApp or email listed in the contact section on the website. Annual plan subscribers get priority response.",
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
    "Fees & Billing",
    "WhatsApp & Notifications",
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
