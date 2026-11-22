import assert from "node:assert";
import http from "node:http";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${BASE_URL}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: data, headers: res.headers })
        );
      })
      .on("error", reject);
  });
}

async function run() {
  console.log("Running NewCare Route & Content Verification...\n");

  const routes = [
    "/",
    "/doctors",
    "/doctors/doc-1",
    "/appointment/doc-1",
    "/dashboard",
    "/dashboard/patient",
    "/dashboard/doctor",
    "/dashboard/admin",
    "/about",
    "/contact",
    "/login",
    "/my-appointments",
  ];

  for (const route of routes) {
    const res = await fetchRoute(route);
    assert.strictEqual(res.status, 200, `${route} must return HTTP 200`);
    assert(!res.body.includes("about:invalid"), `${route} contains about:invalid`);
    assert(!res.body.includes("(800) 123-4567"), `${route} contains placeholder phone`);
    assert(!/\bBMDC\b/.test(res.body), `${route} contains BMDC contradiction`);
    assert(!/\bMBBS\b/.test(res.body), `${route} contains MBBS contradiction`);
    console.log(`  OK  ${route} (200)`);
  }

  console.log("\nAll 12 routes verified cleanly.");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
