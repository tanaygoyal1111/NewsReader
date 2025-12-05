export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Get the path from the request URL (e.g., /search?q=...)
    // We want to forward this path to the GNews API
    // Example: https://my-worker.workers.dev/search?q=test -> https://gnews.io/api/v4/search?q=test
    
    // The path includes the leading slash, e.g. "/search" or "/top-headlines"
    const apiPath = url.pathname; 
    const searchParams = url.search; // e.g. "?q=test&lang=en"

    // Construct the target URL
    const targetUrl = `https://gnews.io/api/v4${apiPath}${searchParams}`;

    // Fetch data from GNews
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Cloudflare-Worker-News-App'
      }
    });

    // Create a new response with CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return newResponse;
  },
};
