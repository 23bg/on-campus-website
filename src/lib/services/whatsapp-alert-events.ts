import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/utils/logger";
import { sendSystemAlert } from "@/lib/services/whatsapp";

export type WhatsAppAlertEvent =
    | "LEAD_CREATED"
    | "LEAD_CONVERTED_TO_STUDENT"
    | "STUDENT_CREATED"
    | "STUDENT_PORTAL_CREDENTIALS_SET"
    | "TEAM_MEMBER_ADDED"
    | "INSTITUTE_ONBOARDING_COMPLETED"
    | "INSTITUTE_PROFILE_UPDATED";

const WHATSAPP_SAMPLE_MESSAGE = [
    "Hello World",
    "Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.",
    "WhatsApp Business Platform sample message",
].join("\n");

const normalizePhoneForWhatsApp = (phone?: string | null): string | null => {
    if (!phone) return null;

    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return digits;

    return null;
};

const resolveInstituteDestination = async (instituteId: string): Promise<string | null> => {
    const institute = await prisma.institute.findUnique({
        where: { id: instituteId },
        select: { whatsapp: true, phone: true },
    });

    return normalizePhoneForWhatsApp(institute?.whatsapp) ?? normalizePhoneForWhatsApp(institute?.phone);
};

export const sendEventBasedWhatsAppAlert = async (input: {
    event: WhatsAppAlertEvent;
    instituteId: string;
    message: string;
    phoneNumber?: string | null;
}): Promise<{ sent: boolean; blocked: boolean; billable: boolean; reason?: string } | null> => {
    const destination = normalizePhoneForWhatsApp(input.phoneNumber) ?? (await resolveInstituteDestination(input.instituteId));

    if (!destination) {
        logger.info({
            event: "whatsapp_event_alert_skipped_no_destination",
            alertEvent: input.event,
            instituteId: input.instituteId,
        });
        return null;
    }

    try {
        // Current behavior (event-specific dynamic message):
        // const result = await sendSystemAlert(input.instituteId, destination, input.message);
        const result = await sendSystemAlert(input.instituteId, destination, WHATSAPP_SAMPLE_MESSAGE);

        logger.info({
            event: "whatsapp_event_alert_dispatched",
            alertEvent: input.event,
            instituteId: input.instituteId,
            destination,
            sent: result.sent,
            blocked: result.blocked,
            billable: result.billable,
            reason: result.reason,
        });

        return result;
    } catch (error) {
        logger.error({
            event: "whatsapp_event_alert_failed",
            alertEvent: input.event,
            instituteId: input.instituteId,
            destination,
            error,
        });
        return null;
    }
};
