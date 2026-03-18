"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { AUTOMATION_PACK_PRICING, PLAN_CONFIG } from "@/config/plans";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Info } from "lucide-react";

export default function Pricing() {
    const t = useTranslations("pricing");
    const tCommon = useTranslations("common");

    const [yearlyBilling, setYearlyBilling] = useState(false);

    const billingSuffix = yearlyBilling
        ? t("yearlyPriceSuffix")
        : t("monthlyPriceSuffix");

    const getDisplayPrice = (monthlyPrice: number, yearlyPrice: number) => {
        const amount = yearlyBilling ? yearlyPrice : monthlyPrice;

        return amount.toLocaleString("en-IN");
    };

    const plans = [
        {
            key: "STARTER",
            priceMonthly: PLAN_CONFIG.STARTER.priceMonthly,
            priceYearly: PLAN_CONFIG.STARTER.priceYearly,
            name: t("starterPlan"),
            description: t("starterSubtext"),
            users: t("starterUsers"),
            features: [
                t("starterFeature1"),
                t("starterFeature2"),
                t("starterFeature3"),
                t("starterFeature4"),
                t("starterFeature5"),
                t("starterFeature6"),
                t("starterFeature7"),
            ],
            outcome: t("starterOutcome"),
            cta: t("startSoloTrial"),
            link: "/signup",
            variant: "outline",
        },
        {
            key: "TEAM",
            priceMonthly: PLAN_CONFIG.TEAM.priceMonthly,
            priceYearly: PLAN_CONFIG.TEAM.priceYearly,
            name: t("teamPlan"),
            description: t("teamSubtext"),
            users: t("teamUsers"),
            features: [
                t("teamFeature1"),
                t("teamFeature2"),
                t("teamFeature3"),
                t("teamFeature4"),
                t("teamFeature5"),
                t("teamFeature6"),
                t("teamFeature7"),
            ],
            outcome: t("teamOutcome"),
            cta: t("startTeamTrial"),
            link: "/signup",

            highlight: true,
        },

        {
            key: "GROWTH",
            priceMonthly: PLAN_CONFIG.GROWTH.priceMonthly,
            priceYearly: PLAN_CONFIG.GROWTH.priceYearly,
            name: t("growthPlan"),
            description: t("growthSubtext"),
            users: t("growthUsers"),
            features: [
                t("growthFeature1"),
                t("growthFeature2"),
                t("growthFeature3"),
                t("growthFeature4"),
                t("growthFeature5"),
                t("growthFeature6"),
                t("growthFeature7")
            ],
            outcome: t("growthOutcome"),
            cta: t("startGrowthTrial"),
            link: "/signup",
            variant: "outline",
        },

        {
            key: "SCALE",
            priceMonthly: PLAN_CONFIG.SCALE.priceMonthly,
            priceYearly: PLAN_CONFIG.SCALE.priceYearly,
            name: t("scalePlan"),
            description: t("scaleSubtext"),
            users: t("scaleUsers"),
            features: [
                t("scaleFeature1"),
                t("scaleFeature2"),
                t("scaleFeature3"),
                t("scaleFeature4"),
                t("scaleFeature5"),
                t("scaleFeature6"),
                t("scaleFeature7"),
                t("scaleFeature9"),
            ],
            outcome: t("scaleOutcome"),
            cta: t("startScaleCall"),
            link: "/contact",
            variant: "outline",
        },
    ];

    const faqs = [
        { q: t("faq1Question"), a: t("faq1Answer") },
        { q: t("faq2Question"), a: t("faq2Answer") },
        { q: t("faq3Question"), a: t("faq3Answer") },
        { q: t("faq4Question"), a: t("faq4Answer") },
    ];

    const trustItems = [
        t("trust1"),
        t("trust2"),
        t("trust3"),
        t("trust4"),
        t("trust5"),
        t("trust6"),
        t("trust7"),
        t("trust8"),
        t("trust9"),
    ];

    return (
        <section id="pricing" className="border-b bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 py-20">

                {/* HEADER */}

                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <h2 className="text-4xl font-semibold">{t("title")}</h2>
                    <p className="text-muted-foreground">{t("description")}</p>
                    <p className="text-sm font-medium text-foreground">
                        {t("positioningLine")}
                    </p>
                </div>

                <div className="mt-10 text-center text-sm text-muted-foreground">
                    {t("coreSystemLine")}
                </div>

                <div className="mt-2 text-center text-sm text-muted-foreground">
                    {t("whatsAppSenderModesLine")}
                </div>

                {/* BILLING TOGGLE */}

                <div className="mt-8 flex items-center justify-center gap-3">
                    <span className={`text-sm ${!yearlyBilling ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {t("monthlyToggle")}
                    </span>

                    <Switch checked={yearlyBilling} onCheckedChange={setYearlyBilling} />

                    <span className={`text-sm ${yearlyBilling ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {t("yearlyToggle")}
                    </span>

                    <Badge variant="secondary">{t("yearlyBadge")}</Badge>
                </div>

                <p className="mt-3 text-center text-sm text-muted-foreground">
                    {t("yearlyFreeLine")}
                </p>

                <p className="mt-6 text-center text-sm font-medium text-foreground rounded-md border bg-primary/5 py-3 px-4">
                    {t("trialBadge")}
                </p>

                <p className="mt-3 text-center text-sm text-muted-foreground">
                    {t("grandfatheredLine")}
                </p>

                {/* UNLIMITED USAGE */}

                <div className="mt-8 rounded-lg border bg-background p-6">

                    <div className="flex items-center justify-center gap-2">
                        <h3 className="text-xl font-semibold">
                            {t("sectionUnlimitedUsage")}
                        </h3>

                        <FeatureTooltip text="Unlimited means there are no limits on records such as leads, students, enquiries, or follow-ups." />
                    </div>

                    <p className="text-center mt-2 text-muted-foreground">
                        {t("unlimitedUsageLine")}
                    </p>

                    <p className="text-center text-sm text-muted-foreground">
                        {t("unlimitedUsageHint")}
                    </p>

                    <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
                        <p>• {t("unlimitedItem1")}</p>
                        <p>• {t("unlimitedItem2")}</p>
                        <p>• {t("unlimitedItem3")}</p>
                        <p>• {t("unlimitedItem4")}</p>
                        <p>• {t("unlimitedItem5")}</p>
                    </div>

                </div>

                <div className="mt-8 rounded-lg border bg-background p-6">
                    <h3 className="text-xl font-semibold text-center">{t("sectionAddons")}</h3>
                    <p className="text-center mt-2 text-muted-foreground">{t("addonsDescription")}</p>

                    <div className="mt-5 rounded-lg border p-5">
                        <p className="text-sm font-medium">Available Add-ons</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
                            <div className="rounded border p-3">
                                <p className="font-medium">WhatsApp Automation</p>
                                <p className="text-muted-foreground mt-1">Automated enquiry alerts and follow-up messaging workflows.</p>
                            </div>
                            <div className="rounded border p-3">
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-muted-foreground mt-1">Email alerts, reminders, and campaign communication for admissions.</p>
                            </div>
                            <div className="rounded border p-3">
                                <p className="font-medium">Razorpay Payments</p>
                                <p className="text-muted-foreground mt-1">Accept online payments and reconcile billing records quickly.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 rounded-lg border p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-lg font-semibold">{t("addonAutomationPackTitle")}</p>
                                <p className="text-sm text-muted-foreground">{t("addonAutomationPackSubtitle")}</p>
                            </div>

                            <p className="text-lg font-semibold">
                                ₹{getDisplayPrice(AUTOMATION_PACK_PRICING.monthly, AUTOMATION_PACK_PRICING.yearly)}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">{billingSuffix}</span>
                            </p>
                        </div>

                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li>• {t("addonAutomationPackItem1")}</li>
                            <li>• {t("addonAutomationPackItem2")}</li>
                            <li>• {t("addonAutomationPackItem3")}</li>
                            <li>• {t("addonAutomationPackItem4")}</li>
                        </ul>

                        <p className="mt-4 text-sm text-muted-foreground">{t("addonAutomationPackNote1")}</p>
                        <p className="text-sm text-muted-foreground">{t("addonAutomationPackNote2")}</p>
                    </div>
                </div>

                {/* PRICING CARDS */}

                <div className="mt-12 grid gap-6 xl:grid-cols-4">

                    {plans.map((plan) => (

                        <Card
                            key={plan.key}
                            className={`rounded-lg ${plan.highlight ? "border-2 border-primary shadow-lg scale-[1.03]" : "border"}`}
                        >

                            <CardHeader className="space-y-3">

                                <div className="flex justify-between">

                                    <CardTitle className="text-4xl font-semibold">
                                        ₹{getDisplayPrice(plan.priceMonthly, plan.priceYearly)}
                                    </CardTitle>

                                    {plan.highlight && (
                                        <Badge>{t("mostPopular")}</Badge>
                                    )}

                                </div>

                                <p className="text-sm text-muted-foreground">
                                    {billingSuffix}
                                </p>

                                <div className="space-y-1">
                                    <p className="text-lg font-semibold">{plan.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {plan.description}
                                    </p>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    {plan.users}
                                </p>

                                {/* <Badge variant="secondary">{plan.whatsapp}</Badge> */}

                            </CardHeader>

                            <CardContent>

                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-4 text-xs text-muted-foreground">
                                    “{plan.outcome}”
                                </p>

                            </CardContent>

                            <CardFooter>

                                <Button
                                    asChild
                                    variant={plan.variant as any}
                                    className="w-full h-11"
                                >
                                    <Link href={plan.link}>
                                        {plan.cta}
                                    </Link>
                                </Button>

                            </CardFooter>

                        </Card>

                    ))}

                </div>

                {/* COMPARISON TABLE */}

                <div className="mt-20">

                    <h3 className="text-2xl font-semibold text-center mb-8">
                        {t("comparePlans")}
                    </h3>

                    <div className="border rounded-lg overflow-hidden bg-background">

                        <table className="w-full text-sm">

                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4">{t("tableFeature")}</th>
                                    <th className="p-4">{t("tableSolo")}</th>
                                    <th className="p-4">{t("tableTeam")}</th>
                                    <th className="p-4">{t("tableGrowth")}</th>
                                    <th className="p-4">{t("tableScale")}</th>
                                </tr>
                            </thead>

                            <tbody>

                                <Row name={t("tableUsers")} solo="1" team="5" growth="20" scale="Unlimited" />
                                <Row name={t("tablePublicPage")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableUnlimitedStudents")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableUnlimitedCourses")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableUnlimitedEnquiries")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableUnlimitedFollowUps")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableUnlimitedNotes")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableLeadPipeline")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableStudentRecords")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableExcelImport")} solo="✓" team="✓" growth="✓" scale="✓" />

                                <Row
                                    name={t("tableRazorpay")}
                                    solo="✓"
                                    team="✓"
                                    growth="✓"
                                    scale="✓"
                                    tooltip="Institutes connect their Razorpay account to manage subscription billing securely."
                                />

                                <Row
                                    name={t("tableRoles")}
                                    solo="—"
                                    team="✓"
                                    growth="✓"
                                    scale="✓"
                                />

                                <Row
                                    name={t("tableLeadOwnership")}
                                    solo="—"
                                    team="✓"
                                    growth="✓"
                                    scale="✓"
                                />

                                <Row
                                    name={t("tableWhatsAppAlerts")}
                                    solo={t("tableWhatsAppOptional")}
                                    team={t("tableWhatsAppOptional")}
                                    growth={t("tableWhatsAppOptional")}
                                    scale={t("tableWhatsAppOptional")}
                                    tooltip={t("whatsAppAlertsTooltip")}
                                />

                                <Row
                                    name={t("tableCustomWhatsAppNumber")}
                                    solo="✓"
                                    team="✓"
                                    growth="✓"
                                    scale="✓"
                                />

                                <Row name={t("tableSubdomainSupport")} solo="✓" team="✓" growth="✓" scale="✓" />
                                <Row name={t("tableCustomDomainSupport")} solo="—" team="—" growth="✓" scale="✓" />
                                <Row name={t("tableFullWhiteLabel")} solo="—" team="—" growth="—" scale="✓" />

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* TRUST */}

                <div className="mt-16 rounded-lg border bg-background p-6">

                    <h3 className="text-xl font-semibold text-center">
                        {t("sectionTrust")}
                    </h3>

                    <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                        {trustItems.map((item) => (
                            <p key={item}>• {item}</p>
                        ))}
                    </div>

                </div>

                {/* FAQ */}

                <div className="mt-16">

                    <h3 className="text-2xl font-semibold mb-6">
                        {tCommon("faq")}
                    </h3>

                    <div className="space-y-4">

                        {faqs.map((f) => (

                            <div key={f.q} className="border rounded-lg p-6 bg-background">

                                <p className="font-medium">{f.q}</p>

                                <p className="text-sm text-muted-foreground mt-1">
                                    {f.a}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </section>
    );
}

function FeatureTooltip({ text }: { text: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                </TooltipTrigger>

                <TooltipContent className="max-w-xs text-sm">
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function Row({
    name,
    solo,
    team,
    growth,
    scale,
    tooltip,
}: {
    name: string;
    solo: string;
    team: string;
    growth: string;
    scale: string;
    tooltip?: string;
}) {
    return (
        <tr className="border-t hover:bg-muted/30 transition">

            <td className="p-4">
                <span className="flex items-center gap-1.5">
                    {name}
                    {tooltip && <FeatureTooltip text={tooltip} />}
                </span>
            </td>

            <td className="p-4 text-center font-medium">
                {solo}
            </td>

            <td className="p-4 text-center font-medium">
                {team}
            </td>

            <td className="p-4 text-center font-medium">
                {growth}
            </td>

            <td className="p-4 text-center font-medium">
                {scale}
            </td>

        </tr>
    );
}