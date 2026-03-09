import fs from "node:fs";
import path from "node:path";

const csvPath = path.join(process.cwd(), "docs", "release", "SEO_PROGRAMMATIC_170_PAGES.csv");
const sitemapPath = path.join(process.cwd(), "src", "app", "sitemap.ts");

function parseCsvLine(line) {
    const out = [];
    let cur = "";
    let q = false;

    for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];

        if (ch === '"') {
            if (q && line[i + 1] === '"') {
                cur += '"';
                i += 1;
            } else {
                q = !q;
            }
        } else if (ch === "," && !q) {
            out.push(cur);
            cur = "";
        } else {
            cur += ch;
        }
    }

    out.push(cur);
    return out;
}

const csvRaw = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const header = parseCsvLine(csvRaw[0]);
const idx = {
    urlSlug: header.indexOf("urlSlug"),
    pageType: header.indexOf("pageType"),
};

const rows = csvRaw.slice(1).map(parseCsvLine);
const generatedSlugs = rows.map((r) => (r[idx.urlSlug] || "").trim()).filter(Boolean);
const generatedSet = new Set(generatedSlugs);

const sitemapRaw = fs.readFileSync(sitemapPath, "utf8");
const sitemapPaths = [
    ...sitemapRaw.matchAll(/\$\{BASE_URL\}(\/[^`"'\s,}]+)/g),
].map((m) => m[1]);
const sitemapSet = new Set(sitemapPaths);

const present = [...generatedSet].filter((slug) => sitemapSet.has(slug));
const missing = [...generatedSet].filter((slug) => !sitemapSet.has(slug));

const missingByType = {};
for (const row of rows) {
    const slug = (row[idx.urlSlug] || "").trim();
    const type = (row[idx.pageType] || "unknown").trim();
    if (!sitemapSet.has(slug)) {
        missingByType[type] = (missingByType[type] || 0) + 1;
    }
}

console.log(`generated=${generatedSet.size}`);
console.log(`sitemapStatic=${sitemapSet.size}`);
console.log(`present=${present.length}`);
console.log(`missing=${missing.length}`);
console.log(`presentSample=${present.slice(0, 20).join(",")}`);
console.log(`missingSample=${missing.slice(0, 20).join(",")}`);
console.log(`missingByType=${JSON.stringify(missingByType)}`);
