export const triggerWorkflow = async (user: string): Promise<{ txHash: string }> => {
  const url = process.env.WORKFLOW_HTTP_URL;
  if (!url) {
    throw new Error("WORKFLOW_HTTP_URL not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Workflow error: ${response.status} ${body}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
};
