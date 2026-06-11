import { list, put } from "@vercel/blob";

const PRODUCTS = {
  "10617346508908": ["19001", "19002", "19003", "19004", "19005"],
  "10617317570606": ["60400", "60401", "60402", "60403", "60404"]
};

const COUNT_LIMIT = 10;
const ACCESS = "private";

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function cleanSerial(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 20);
}

function cleanCode(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

function isValidCode(serial, code) {
  return Object.prototype.hasOwnProperty.call(PRODUCTS, serial) && PRODUCTS[serial].includes(code);
}

function eventPrefix(serial, code) {
  return `swisse-query-events/${serial}/${code}/`;
}

function eventPath(serial, code) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const id = crypto.randomUUID();
  return `${eventPrefix(serial, code)}${timestamp}-${id}.json`;
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (err) {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const serial = cleanSerial(body.serial);
  const code = cleanCode(body.code);

  if (serial.length === 0 || code.length !== 5) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  if (!isValidCode(serial, code)) {
    return json({
      ok: true,
      result: "error",
      valid: false,
      count: 0
    });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return json({ ok: false, error: "blob_storage_not_configured" }, 500);
  }

  const path = eventPath(serial, code);
  const payload = JSON.stringify({
    serial,
    code,
    checkedAt: new Date().toISOString()
  });

  await put(path, payload, {
    access: ACCESS,
    addRandomSuffix: false,
    contentType: "application/json"
  });

  const queryEvents = await list({
    prefix: eventPrefix(serial, code),
    limit: COUNT_LIMIT + 1
  });
  const count = queryEvents.blobs.length;

  return json({
    ok: true,
    result: count > COUNT_LIMIT ? "high" : "genuine",
    valid: true,
    count
  });
}

export async function GET() {
  return json({
    ok: true,
    service: "swisse-verify"
  });
}
