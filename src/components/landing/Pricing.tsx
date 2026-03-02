"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PLAN_CONFIG } from "@/config/plans";
import { useTranslations } from "next-intl";

export default function Pricing() {
    const t = useTranslations("pricing");
    const tCommon = useTranslations("common");
    const [yearlyBilling, setYearlyBilling] = useState(false);

    const yearlyMonthsCharged = 11;
    const scaleMonthlyPrice = Number(t("scalePrice"));
    const billingSuffix = yearlyBilling ? t("yearlyPriceSuffix") : t("monthlyPriceSuffix");

    const getDisplayPrice = (monthlyPrice: number) => {
        const amount = yearlyBilling ? monthlyPrice * yearlyMonthsCharged : monthlyPrice;
        return amount.toLocaleString("en-IN");
    };

    const starterFeatures = [
        t("starterFeature1"),
        t("starterFeature2"),
        t("starterFeature3"),
        t("starterFeature4"),
        t("starterFeature5"),
        t("starterFeature6"),
        t("starterFeature7"),
    ];

    const growthFeatures = [
        t("growthFeature1"),
        t("growthFeature2"),
        t("growthFeature3"),
        t("growthFeature4"),
        t("growthFeature5"),
        t("growthFeature6"),
    ];

    const scaleFeatures = [
        t("scaleFeature1"),
        t("scaleFeature2"),
        t("scaleFeature3"),
        t("scaleFeature4"),
        t("scaleFeature5"),
        t("scaleFeature6"),
    ];

    const faqs = [
        { q: t("faq1Question"), a: t("faq1Answer") },
        { q: t("faq2Question"), a: t("faq2Answer") },
        { q: t("faq3Question"), a: t("faq3Answer") },
    ];

    const trustItems = [
        t("trust1"),
        t("trust2"),
        t("trust3"),
        t("trust4"),
        t("trust5"),
        t("trust6"),
    ];

    return (
        <section id="pricing" className="border-b bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 py-20">
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-semibold">
                        {t("title")}
                    </h2>

                    <p className="text-muted-foreground">
                        {t("description")}
                    </p>

                    <p className="text-sm font-medium text-foreground">
                        {t("positioningLine")}
                    </p>
                </div>

                <div className="mt-14 text-center text-sm text-muted-foreground">
                    {t("coreSystemLine")}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <span className={`text-sm ${!yearlyBilling ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {t("monthlyToggle")}
                    </span>
                    <Switch
                        checked={yearlyBilling}
                        onCheckedChange={setYearlyBilling}
                        aria-label={t("billingSwitchAria")}
                    />
                    <span className={`text-sm ${yearlyBilling ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {t("yearlyToggle")}
                    </span>
                    <Badge variant="secondary">{t("yearlyBadge")}</Badge>
                </div>

                <div className="mt-8 rounded-lg border bg-background p-6">
                    <h3 className="text-xl font-semibold text-center">{t("sectionUnlimitedUsage")}</h3>
                    <p className="mt-2 text-center text-muted-foreground">{t("unlimitedUsageLine")}</p>
                    <p className="mt-1 text-center text-sm text-muted-foreground">{t("unlimitedUsageHint")}</p>
                    <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
                        <p>• {t("unlimitedItem1")}</p>
                        <p>• {t("unlimitedItem2")}</p>
                        <p>• {t("unlimitedItem3")}</p>
                        <p>• {t("unlimitedItem4")}</p>
                        <p>• {t("unlimitedItem5")}</p>
                        <p>• {t("unlimitedItem6")}</p>
                    </div>
                </div>

                <div className="mt-14 grid gap-8 lg:grid-cols-3">
                    <Card className="border rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-4xl font-semibold">
                                ₹{getDisplayPrice(PLAN_CONFIG.STARTER.priceMonthly)}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">
                                {billingSuffix}
                            </p>
                            <p className="text-lg font-semibold">{t("starterPlan")}</p>
                            <p className="text-muted-foreground text-sm">{t("starterSubtext")}</p>
                            <p className="text-xs text-muted-foreground">{t("starterUsers")}</p>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {starterFeatures.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-center gap-2"
                                    >
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground">“{t("starterOutcome")}”</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full h-11"
                            >
                                <Link href="/signup">
                                    {t("startSoloTrial")}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-2 border-primary rounded-lg shadow-lg scale-[1.03]">
                        <CardHeader>
                            <div className="flex justify-between">
                                <CardTitle className="text-4xl font-semibold">
                                    ₹{getDisplayPrice(PLAN_CONFIG.GROWTH.priceMonthly)}
                                </CardTitle>
                                <Badge>
                                    {t("mostPopular")}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {billingSuffix}
                            </p>
                            <p className="text-lg font-semibold">{t("growthPlan")}</p>
                            <p className="text-muted-foreground text-sm">{t("growthSubtext")}</p>
                            <p className="text-xs text-muted-foreground">{t("growthUsers")}</p>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {growthFeatures.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-center gap-2"
                                    >
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground">“{t("growthOutcome")}”</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                asChild
                                className="w-full h-11"
                            >
                                <Link href="/signup">
                                    {t("startTeamTrial")}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-4xl font-semibold">₹{getDisplayPrice(scaleMonthlyPrice)}</CardTitle>
                            <p className="text-muted-foreground text-sm">{billingSuffix}</p>
                            <p className="text-lg font-semibold">{t("scalePlan")}</p>
                            <p className="text-muted-foreground text-sm">{t("scaleSubtext")}</p>
                            <p className="text-xs text-muted-foreground">{t("scaleUsers")}</p>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {scaleFeatures.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground">“{t("scaleOutcome")}”</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full h-11">
                                <Link href="/contact">{t("startScaleCall")}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-semibold text-center mb-8">
                        {t("comparePlans")}
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4">
                                        {t("tableFeature")}
                                    </th>
                                    <th className="p-4">
                                        {t("tableSolo")}
                                    </th>
                                    <th className="p-4">
                                        {t("tableTeam")}
                                    </th>
                                    <th className="p-4">{t("tableScale")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Row
                                    name={t("tableUsers")}
                                    solo="1"
                                    team="10"
                                    scale="Unlimited"
                                />
                                <Row name={t("tablePublicPage")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableUnlimitedLeads")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableUnlimitedStudents")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableUnlimitedCourses")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableUnlimitedEnquiries")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableUnlimitedFollowUps")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableUnlimitedNotes")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableLeadPipeline")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableStudentRecords")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableExcelImport")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableRazorpay")} solo="✓" team="✓" scale="✓" />
                                <Row name={t("tableRoles")} solo="—" team="✓" scale="✓" />
                                <Row name={t("tableLeadOwnership")} solo="—" team="✓" scale="✓" />
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-16 rounded-lg border bg-background p-6 text-center">
                    <h3 className="text-xl font-semibold">{t("sectionAnnual")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("annualLine1")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("annualLine2")}</p>
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-semibold text-center mb-6">{t("sectionAddons")}</h3>
                    <p className="text-center text-muted-foreground mb-8">{t("addonsDescription")}</p>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{t("addonWhatsAppTitle")}</CardTitle>
                                <p className="text-sm text-muted-foreground">{t("addonWhatsAppPrice")}</p>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>• {t("addonWhatsAppItem1")}</p>
                                <p>• {t("addonWhatsAppItem2")}</p>
                                <p>• {t("addonWhatsAppItem3")}</p>
                                <p>• {t("addonWhatsAppItem4")}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{t("addonAnalyticsTitle")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>• {t("addonAnalyticsItem1")}</p>
                                <p>• {t("addonAnalyticsItem2")}</p>
                                <p>• {t("addonAnalyticsItem3")}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{t("addonOnboardingTitle")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>• {t("addonOnboardingItem1")}</p>
                                <p>• {t("addonOnboardingItem2")}</p>
                                <p>• {t("addonOnboardingItem3")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-16 rounded-lg border bg-background p-6">
                    <h3 className="text-xl font-semibold text-center">{t("sectionTrust")}</h3>
                    <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                        {trustItems.map((item) => (
                            <p key={item}>• {item}</p>
                        ))}
                    </div>
                </div>

                <div className="mt-16 rounded-lg border bg-background p-6 text-center">
                    <h3 className="text-xl font-semibold">{t("sectionRoi")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("roiLine1")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("roiLine2")}</p>
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-semibold mb-6">
                        {tCommon("faq")}
                    </h3>
                    <div className="space-y-4">
                        {faqs.map((f) => (
                            <div
                                key={f.q}
                                className="border rounded-lg p-6 bg-background"
                            >
                                <p className="font-medium">
                                    {f.q}
                                </p>
                                <p className="text-muted-foreground text-sm mt-1">
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



function Row({
    name,
    solo,
    team,
    scale,
}: {
    name: string;
    solo: string;
    team: string;
    scale: string;
}) {
    return (
        <tr className="border-t">
            <td className="p-4">
                {name}
            </td>
            <td className="p-4 text-center">
                {solo}
            </td>
            <td className="p-4 text-center">
                {team}
            </td>
            <td className="p-4 text-center">{scale}</td>
        </tr>
    );
}