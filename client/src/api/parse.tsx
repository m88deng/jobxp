export async function parseWithGemini(text: string) {
  const res = await fetch("http://localhost:3000/parse-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to parse text");
  return res.json();
}
