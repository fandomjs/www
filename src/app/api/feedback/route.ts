import { url } from "inspector";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { opinion, message, url: pagePath } = body ?? {};

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) {
      return new Response(
        JSON.stringify({ error: "Missing DISCORD_WEBHOOK_URL env var" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const siteOrigin = process.env.SITE_ORIGIN;
    const pageUrl = pagePath
      ? pagePath.startsWith("http")
        ? pagePath
        : new URL(pagePath, siteOrigin).toString()
      : siteOrigin;
    const formattedOpinion = opinion === "good" ? "Good" : "Bad";

    const embed = {
      title: `Feedback — ${formattedOpinion}`,
      description: message || "_(no message)_",
      url: pageUrl,
      color: opinion === "good" ? 0x00ff00 : 0xff0000,
      timestamp: new Date().toISOString(),
    };

    const resp = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return new Response(
        JSON.stringify({
          error: "Discord webhook failed",
          status: resp.status,
          detail: text,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ message: "Feedback forwarded to Discord" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
