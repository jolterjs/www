import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, rating, comment, turnstileToken } = body;

    if (!slug || !rating) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (slug, rating)." },
        { status: 400 },
      );
    }

    const secretKey =
      process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

    // Verify Cloudflare Turnstile token if secret key is present
    if (turnstileToken) {
      try {
        const formData = new URLSearchParams();
        formData.append("secret", secretKey);
        formData.append("response", turnstileToken);

        const verifyRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: formData,
          },
        );

        const verifyResult = await verifyRes.json();
        if (
          !verifyResult.success &&
          process.env.NODE_ENV === "production" &&
          process.env.TURNSTILE_SECRET_KEY
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Turnstile CAPTCHA verification failed.",
            },
            { status: 400 },
          );
        }
      } catch (err) {
        console.error("Turnstile verification error:", err);
      }
    }

    // Determine Discord Embed details
    const emojiMap: Record<string, string> = {
      yes: "👍 Yes (Helpful)",
      no: "👎 No (Needs Work)",
      happy: "👍 Yes (Helpful)",
      mid: "😐 Neutral",
      sad: "👎 No (Needs Work)",
    };

    const colorMap: Record<string, number> = {
      yes: 0x10b981, // Emerald Green
      no: 0xf43f5e, // Rose Red
      happy: 0x10b981,
      mid: 0xf59e0b,
      sad: 0xf43f5e,
    };

    const ratingLabel = emojiMap[rating] || rating;
    const embedColor = colorMap[rating] || 0x5b46f8;
    const pageUrl = `https://jolter.dev/docs/${slug === "index" ? "" : slug}`;

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (discordWebhookUrl) {
      const discordPayload = {
        embeds: [
          {
            title: `Docs Feedback: ${title || slug}`,
            url: pageUrl,
            color: embedColor,
            fields: [
              {
                name: "Rating",
                value: ratingLabel,
                inline: true,
              },
              {
                name: "Page Slug",
                value: `\`${slug}\``,
                inline: true,
              },
              {
                name: "Feedback",
                value: comment?.trim()
                  ? comment.trim()
                  : "*No additional comment provided*",
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: "Jolter Documentation Feedback System",
            },
          },
        ],
      };

      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      });
    } else {
      console.log("[Docs Feedback Received]", {
        slug,
        title,
        rating,
        comment,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully.",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
