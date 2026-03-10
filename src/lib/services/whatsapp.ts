import { env } from "@/lib/config/env";
import { AppError } from "@/lib/utils/error";
import { logger } from "@/lib/utils/logger";

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
