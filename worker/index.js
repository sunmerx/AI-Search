/**
 * Cloudflare Worker — DeepSeek API proxy for AI Search
 *
 * Environment variables (set in Cloudflare dashboard):
 *   DEEPSEEK_API_KEY  — your DeepSeek API key
 *
 * Features:
 *   - Proxies POST /v1/chat/completions to DeepSeek (streaming supported)
 *   - Per-IP rate limiting: 20 requests per hour (via CF KV)
 *   - CORS restricted to your GitHub Pages domain
 *   - Rejects non-POST, oversized bodies, and unknown paths
 */

const DEEPSEEK_BASE = "https://api.deepseek.com";
const ALLOWED_ORIGIN = "https://keyuchen-del.github.io";
const RATE_LIMIT = 20;       // max requests per window
const RATE_WINDOW = 3600;    // window in seconds (1 hour)

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin ?? ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status = 200, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function checkRateLimit(ip, env) {
  if (!env.RATE_KV) return true;
  const key = `rl:${ip}`;
  const val = await env.RATE_KV.get(key);
  const count = val ? parseInt(val, 10) : 0;
  if (count >= RATE_LIMIT) return false;
  await env.RATE_KV.put(key, String(count + 1), { expirationTtl: RATE_WINDOW });
  return true;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    // Only allow /v1/chat/completions
    const url = new URL(request.url);
    if (url.pathname !== "/v1/chat/completions") {
      return jsonResponse({ error: "Not found" }, 404, origin);
    }

    // Origin check (allow localhost for dev)
    if (origin && !origin.startsWith(ALLOWED_ORIGIN) && !origin.includes("localhost")) {
      return jsonResponse({ error: "Forbidden" }, 403, origin);
    }

    // Rate limit by IP
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const allowed = await checkRateLimit(ip, env);
    if (!allowed) {
      return jsonResponse(
        { error: "请求过于频繁，请稍后再试。每小时最多 " + RATE_LIMIT + " 次。" },
        429,
        origin,
      );
    }

    // Body size check (max 16KB)
    const body = await request.text();
    if (body.length > 16384) {
      return jsonResponse({ error: "Request too large" }, 413, origin);
    }

    // Proxy to DeepSeek
    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: "API key not configured" }, 500, origin);
    }

    const upstream = await fetch(`${DEEPSEEK_BASE}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

    // Stream the response back
    const responseHeaders = {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      ...corsHeaders(origin),
    };

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  },
};
