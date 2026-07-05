const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Upload-Token',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), env);
    }

    if (request.method === 'GET' && url.pathname.startsWith('/file/')) {
      return withCors(await serveFile(url, env), env);
    }

    if (request.method === 'GET') {
      return json({
        ok: true,
        service: 'xiumi-r2-image-host',
        upload: `${url.origin}/upload`
      }, env);
    }

    if (request.method === 'POST' && url.pathname === '/upload') {
      if (!isAuthorized(request, env)) {
        return json({ error: 'Unauthorized' }, env, 401);
      }
      try {
        return withCors(await uploadImage(request, env, url), env);
      } catch (error) {
        return json({ error: error.message || 'Upload failed' }, env, 400);
      }
    }

    return json({ error: 'Not found' }, env, 404);
  }
};

async function uploadImage(request, env, url) {
  if (!env.IMAGES_BUCKET) {
    return new Response(JSON.stringify({ error: 'Missing R2 binding: IMAGES_BUCKET' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const contentType = request.headers.get('Content-Type') || '';
  let source;

  if (contentType.includes('multipart/form-data')) {
    source = await readMultipartImage(request);
  } else if (contentType.includes('application/json')) {
    const payload = await request.json();
    source = await readRemoteImage(payload);
  } else {
    return new Response(JSON.stringify({ error: 'Use multipart/form-data or application/json' }), {
      status: 415,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const maxBytes = Number(env.MAX_BYTES || 20 * 1024 * 1024);
  if (source.bytes.byteLength > maxBytes) {
    return new Response(JSON.stringify({ error: `Image is larger than ${maxBytes} bytes` }), {
      status: 413,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const prefix = cleanPrefix(source.prefix || env.DEFAULT_PREFIX || 'xiumi');
  const key = makeObjectKey(prefix, source.name, source.type);

  await env.IMAGES_BUCKET.put(key, source.bytes, {
    httpMetadata: {
      contentType: source.type || 'application/octet-stream',
      cacheControl: 'public, max-age=31536000, immutable'
    },
    customMetadata: {
      originalName: source.name || ''
    }
  });

  const publicUrl = makePublicUrl(env, url, key);
  return new Response(JSON.stringify({
    ok: true,
    key,
    url: publicUrl,
    size: source.bytes.byteLength,
    contentType: source.type
  }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

async function readMultipartImage(request) {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Missing file');
  }
  const type = file.type || 'application/octet-stream';
  if (!type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  return {
    bytes: await file.arrayBuffer(),
    type,
    name: file.name || 'image',
    prefix: form.get('prefix') || ''
  };
}

async function readRemoteImage(payload) {
  const sourceUrl = String(payload.sourceUrl || '').trim();
  if (!/^https?:\/\//i.test(sourceUrl)) {
    throw new Error('Invalid sourceUrl');
  }

  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 Xiumi R2 Image Host'
    }
  });
  if (!response.ok) {
    throw new Error(`Fetch source failed: HTTP ${response.status}`);
  }

  const type = response.headers.get('Content-Type') || 'application/octet-stream';
  if (!type.startsWith('image/')) {
    throw new Error(`Source is not an image: ${type}`);
  }

  return {
    bytes: await response.arrayBuffer(),
    type,
    name: payload.name || sourceUrl.split('/').pop() || 'image',
    prefix: payload.prefix || ''
  };
}

async function serveFile(url, env) {
  if (!env.IMAGES_BUCKET) {
    return new Response('Missing R2 binding: IMAGES_BUCKET', { status: 500 });
  }
  const key = decodeURIComponent(url.pathname.slice('/file/'.length));
  const object = await env.IMAGES_BUCKET.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Cache-Control', headers.get('Cache-Control') || 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}

function makeObjectKey(prefix, name, type) {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const ext = getExtension(name, type);
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}/${yyyy}/${mm}/${dd}/${Date.now()}-${id}.${ext}`;
}

function makePublicUrl(env, requestUrl, key) {
  const base = String(env.PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');
  if (base) return `${base}/${key}`;
  return `${requestUrl.origin}/file/${encodeURIComponent(key).replaceAll('%2F', '/')}`;
}

function getExtension(name, type) {
  const fromName = String(name || '').split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  if (fromName) return fromName[1].toLowerCase().replace('jpeg', 'jpg');
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif'
  };
  return map[String(type || '').toLowerCase()] || 'png';
}

function cleanPrefix(prefix) {
  return String(prefix || 'xiumi')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/\/+/g, '/') || 'xiumi';
}

function isAuthorized(request, env) {
  const token = String(env.UPLOAD_TOKEN || '').trim();
  if (!token) return true;
  const auth = request.headers.get('Authorization') || '';
  const headerToken = request.headers.get('X-Upload-Token') || '';
  return auth === `Bearer ${token}` || headerToken === token;
}

function json(data, env, status = 200) {
  return withCors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  }), env);
}

function withCors(response, env) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', env.ALLOWED_ORIGIN || '*');
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
