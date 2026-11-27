/**
 * GET /health
 * Checks that the API is running.
 */
const healthHandler = async () => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "ok" }),
  };
};

export const handler = healthHandler;
