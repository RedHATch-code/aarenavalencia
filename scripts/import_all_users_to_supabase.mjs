#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CSV_PATH = process.env.CSV_PATH || "c:/Users/tiago/Downloads/users_supabase_clean.csv";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length !== header.length) continue;
    const obj = {};
    for (let j = 0; j < header.length; j++) obj[header[j]] = (cols[j] || "").trim();
    rows.push(obj);
  }
  return rows;
}

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

async function createUser(email, firstName, lastName) {
  const password = `Tmp#${crypto.randomBytes(8).toString("hex")}`;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: [firstName, lastName].filter(Boolean).join(" ").trim() || null,
        source: "ggcircuit_portal"
      }
    })
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function loadExistingUsersByEmail() {
  const byEmail = new Map();
  const perPage = 1000;
  let page = 1;

  while (true) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=${perPage}`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(`Failed to load existing users page=${page}: ${res.status} ${JSON.stringify(data)}`);
    }

    const data = await res.json().catch(() => ({}));
    const users = Array.isArray(data?.users) ? data.users : [];

    for (const u of users) {
      const email = String(u?.email || "").toLowerCase();
      const id = u?.id || null;
      if (email && id && !byEmail.has(email)) byEmail.set(email, id);
    }

    if (users.length < perPage) break;
    page++;
  }

  return byEmail;
}

async function upsertProfile(id, username, firstName, lastName) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([{
      id,
      username: username || null,
      full_name: fullName,
      role: "player",
      source: "ggcircuit_portal"
    }])
  });

  return res.ok;
}

async function main() {
  const csv = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(csv);
  const usersByEmail = await loadExistingUsersByEmail();

  const unique = new Map();
  for (const r of rows) {
    const email = (r.email || "").toLowerCase();
    if (!email || !isValidEmail(email)) continue;
    if (!unique.has(email)) unique.set(email, r);
  }

  let created = 0;
  let exists = 0;
  let failed = 0;
  let profOk = 0;
  let profFail = 0;

  for (const [email, r] of unique) {
    const result = await createUser(email, r.first_name, r.last_name);
    let userId = null;

    if (result.ok && result.data?.user?.id) {
      created++;
      userId = result.data.user.id;
      usersByEmail.set(email, userId);
    } else if (result.status === 422 || result.status === 400) {
      exists++;
      userId = usersByEmail.get(email) || null;
      if (!userId) {
        profFail++;
        console.log("PROFILE_ID_NOT_FOUND", email);
      }
    } else {
      failed++;
      console.log("FAIL", email, result.status, JSON.stringify(result.data));
    }

    if (userId) {
      const ok = await upsertProfile(userId, r.username, r.first_name, r.last_name);
      if (ok) profOk++;
      else profFail++;
    }

    if ((created + exists + failed) % 100 === 0) {
      console.log(`Processed: ${created + exists + failed}/${unique.size}`);
    }
  }

  console.log("DONE");
  console.log({
    totalUniqueValidEmails: unique.size,
    created,
    exists,
    failed,
    profilesUpserted: profOk,
    profilesUpsertFailed: profFail
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
