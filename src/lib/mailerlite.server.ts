import process from "node:process";

// Adds (or updates) a subscriber in MailerLite and puts them in the waitlist
// group. Best-effort: never throws — a MailerLite hiccup must not break signup.
export async function addToMailerLite(name: string, email: string): Promise<void> {
  const key = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!key) return; // not configured — skip silently

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        fields: { name },
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[mailerlite] subscribe failed", res.status, await res.text());
    }
  } catch (e) {
    console.error("[mailerlite] subscribe error", e);
  }
}
