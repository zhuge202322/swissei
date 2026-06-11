const PRODUCTS = {
  "10617346508908": ["19001", "19002", "19003", "19004", "19005"],
  "10617317570606": ["60400", "60401", "60402", "60403", "60404"]
};

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function cleanCode(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

function resolveCode(code) {
  const productMatch = Object.entries(PRODUCTS).find(([, codes]) => codes.includes(code));

  if (productMatch) {
    return {
      valid: true,
      serial: productMatch[0]
    };
  }

  return {
    valid: false,
    serial: "",
  };
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (err) {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const code = cleanCode(body.code);

  if (code.length !== 5) {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  const resolved = resolveCode(code);

  if (!resolved.valid) {
    return json({
      ok: true,
      result: "error",
      valid: false,
      count: 0
    });
  }

  return json({
    ok: true,
    result: "genuine",
    valid: true,
    serial: resolved.serial,
    count: 1
  });
}

export async function GET() {
  return json({
    ok: true,
    service: "swisse-verify"
  });
}
