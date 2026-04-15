const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const postsPath = path.join(__dirname, 'data', 'posts.json');

function loadPosts() {
  try {
    const raw = fs.readFileSync(postsPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading posts.json:', err);
    return [];
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  res.setHeader('Content-Type', 'application/json');
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/posts
  if (url.pathname === '/api/posts' && req.method === 'GET') {
    const posts = loadPosts();
    const tag = url.searchParams.get('tag');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = 6;

    let filtered = posts;
    if (tag) {
      filtered = filtered.filter(p => p.tag === tag);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    res.writeHead(200);
    res.end(JSON.stringify({
      posts: paged,
      total: filtered.length,
      page,
      pageSize
    }));
    return;
  }

  // GET /api/posts/:slug
  if (url.pathname.startsWith('/api/posts/') && req.method === 'GET') {
    const slug = url.pathname.replace('/api/posts/', '');
    const posts = loadPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify(post));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Blog API running on port ${PORT}`);
});
