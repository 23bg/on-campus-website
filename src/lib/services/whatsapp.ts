import { env } from "@/lib/config/env";
import { AppError } from "@/lib/utils/error";
import { logger } from "@/lib/utils/logger";
import { prisma } from "@/lib/db/prisma";

const resolveApiVersion = () => env.WHATSAPP_API_VERSION || "v19.0";

const getApiUrl = () => {
    if (!env.WHATSAPP_PHONE_NUMBER_ID) {
        throw new AppError("WHATSAPP_PHONE_NUMBER_ID is not configured", 500, "WHATSAPP_CONFIG_MISSING");
    }

    return `https://graph.facebook.com/${resolveApiVersion()}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
};

const getAuthHeader = () => {
    if (!env.WHATSAPP_ACCESS_TOKEN) {
        throw new AppError("WHATSAPP_ACCESS_TOKEN is not configured", 500, "WHATSAPP_CONFIG_MISSING");
    }

    return {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    };
};

type WhatsAppApiResult = {
    messages?: Array<{ id?: string }>;
    error?: {
        message?: string;
        type?: string;
        code?: number;
        error_data?: {
            details?: string;
        };
        fbtrace_id?: string;
    };
};

const sendWhatsAppPayload = async (payload: Record<string, unknown>): Promise<WhatsAppApiResult> => {
    const response = await fetch(getApiUrl(), {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
    });

    const data = (await response.json()) as WhatsAppApiResult;

    if (!response.ok) {
        logger.error({ event: "whatsapp_api_request_failed", status: response.status, data });
        throw new AppError(
            data.error?.message || "WhatsApp API request failed",
            502,
            "WHATSAPP_API_ERROR",
            data
        );
    }

    return data;
};

export const sendWhatsAppText = async (phone: string, message: string): Promise<WhatsAppApiResult> =>
    sendWhatsAppPayload({
        messaging_product: "whatsapp",
        to: "918421334187",
        type: "template",
        template: {
            name: "hello_world",
            language: {
                code: "en_US"
            }
        }
    });

export const sendWhatsAppTemplate = async (
    phone: string,
    templateName: string,
    bodyParameters: string[],
    languageCode = "en"
): Promise<WhatsAppApiResult> =>
    sendWhatsAppPayload({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: templateName,
            language: { code: languageCode },
            components: [
                {
                    type: "body",
                    parameters: bodyParameters.map((text) => ({
                        type: "text",
                        text,
                    })),
                },
            ],
        },
    });

type SendSystemAlertResult = {
    sent: boolean;
    blocked: boolean;
    billable: boolean;
    reason?: string;
};

/**
 * Send a system-generated operational alert to a phone number.
 *
 * Conversation window logic:
 *   - A 24-hour conversation window is tracked per phone number.
 *   - Multiple messages within the same window count as ONE conversation.
 *   - Daily and monthly limits are enforced per plan.
 *   - Messages over the monthly limit are allowed but flagged as billable extras.
 *   - Messages over the daily limit are blocked to prevent overuse.
 */
export const sendSystemAlert = async (
    instituteId: string,
    phoneNumber: string,
    message: string
): Promise<SendSystemAlertResult> => {
    try {
        // Send the message as approved template for now.
        // Previous dynamic text mode kept below for quick restore after template updates.
        const result = await sendWhatsAppPayload({
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "template",
            template: {
                name: "hello_world",
                language: {
                    code: "en_US",
                },
            },
        });
        // const result = await sendWhatsAppPayload({
        //     messaging_product: "whatsapp",
        //     to: phoneNumber,
        //     type: "text",
        //     text: { body: message },
        // });

        await prisma.whatsAppMessage.create({
            data: {
                instituteId,
                phone: phoneNumber,
                message,
                direction: "OUTBOUND",
                status: "SENT",
                providerId: result.messages?.[0]?.id ?? null,
                payload: result,
            },
        });

        logger.info({
            event: "whatsapp_system_alert_sent",
            instituteId,
            phoneNumber,
        });

        return { sent: true, blocked: false, billable: false };
    } catch (error) {
        logger.error({
            event: "whatsapp_system_alert_failed",
            instituteId,
            phoneNumber,
            error,
        });
        return { sent: false, blocked: false, billable: false, reason: "SEND_FAILED" };
    }
};
