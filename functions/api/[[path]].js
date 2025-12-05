export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  
  // The path parameter comes from the filename [[path]].js
  // It will be an array of path segments, e.g. ['top-headlines']
  const path = params.path;
  
  if (!path || path.length === 0) {
    return new Response("Missing API path", { status: 400 });
  }

  // Reconstruct the path for GNews (e.g., /top-headlines)
  const apiPath = path.join('/');
  
  // Get the search parameters (query string) from the original request
  const searchParams = url.search; // e.g. "?token=...&lang=en"

  // Construct the target URL
  const targetUrl = `https://gnews.io/api/v4/${apiPath}${searchParams}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Cloudflare-Pages-News-App'
      }
    });

    // Create a new response to return to the client
    const newResponse = new Response(response.body, response);
    
    // Add CORS headers to allow the frontend to access the response
    // Since this is same-origin (served from the same domain), strictly speaking
    // we might not need * if we just fetch from /api, but it's safe to add.
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return newResponse;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
