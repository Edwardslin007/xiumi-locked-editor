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

    if (request.method === 'GET') {
      return json({
        ok: true,
        service: 'xiumi-qiniu-token-service',
        provider: 'qiniu',
        bucket: env.QINIU_BUCKET || '',
        uploadUrl: getUploadUrl(env),
        publicDomain: getPublicDomain(env)
      }, env);
    }

    if (request.method === 'POST' && url.pathname === '/token') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, env, 401);
      try {
        const payload = await request.json();
        return json(await createUploadToken(payload, env), env);
      } catch (error) {
        return json({ error: error.message || 'Token failed' }, env, 400);
      }
    }

    if (request.method === 'POST' && url.pathname === '/fetch-upload') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, env, 401);
      try {
        const payload = await request.json();
        return json(await fetchAndUpload(payload, env), env);
      } catch (error) {
        return json({ error: error.message || 'Fetch upload failed' }, env, 400);
      }
    }

    return json({ error: 'Not found' }, env, 404);
  }
};

async function createUploadToken(payload, env) {
  ensureQiniuConfig(env);
  const name = payload.name || payload.fileName || 'image.png';
  const mimeType = payload.mimeType || 'application/octet-stream';
  if (!String(mimeType).startsWith('image/')) throw new Error('Only image files are allowed');

  const size = Number(payload.size || 0);
  const maxBytes = Number(env.MAX_BYTES || 20 * 1024 * 1024);
  if (size && size > maxBytes) throw new Error(`Image is larger than ${maxBytes} bytes`);

  const prefix = cleanPrefix(payload.prefix || env.DEFAULT_PREFIX || 'xiumi');
  const key = makeObjectKey(prefix, name, mimeType);
  const deadline = Math.floor(Date.now() / 1000) + Number(env.TOKEN_TTL_SECONDS || 3600);
  const putPolicy = {
    scope: `${env.QINIU_BUCKET}:${key}`,
    deadline,
    insertOnly: 1,
    fsizeLimit: maxBytes,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fname":"$(fname)","mimeType":"$(mimeType)"}'
  };

  const token = await makeUploadToken(putPolicy, env);
  return {
    ok: true,
    token,
    key,
    uploadUrl: getUploadUrl(env),
    url: makePublicUrl(env, key),
    deadline
  };
}

async function fetchAndUpload(payload, env) {
  const sourceUrl = String(payload.sourceUrl || '').trim();
  if (!/^https?:\/\//i.test(sourceUrl)) throw new Error('Invalid sourceUrl');

  const response = await fetch(sourceUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 Xiumi Qiniu Image Host' }
  });
  if (!response.ok) throw new Error(`Fetch source failed: HTTP ${response.status}`);

  const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
  if (!contentType.startsWith('image/')) throw new Error(`Source is not an image: ${contentType}`);

  const bytes = await response.arrayBuffer();
  const tokenData = await createUploadToken({
    name: payload.name || sourceUrl.split('/').pop() || 'image',
    mimeType: contentType,
    size: bytes.byteLength,
    prefix: payload.prefix || ''
  }, env);

  const form = new FormData();
  form.append('token', tokenData.token);
  form.append('key', tokenData.key);
  form.append('file', new Blob([bytes], { type: contentType }), payload.name || 'image');

  const upload = await fetch(tokenData.uploadUrl, { method: 'POST', body: form });
  const text = await upload.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!upload.ok) throw new Error(data.error || data.message || text || `Qiniu HTTP ${upload.status}`);

  return {
    ok: true,
    key: tokenData.key,
    url: tokenData.url,
    hash: data.hash || '',
    provider: 'qiniu'
  };
}

async function makeUploadToken(putPolicy, env) {
  const encodedPolicy = urlSafeBase64(JSON.stringify(putPolicy));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.QINIU_SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPolicy));
  const encodedSign = urlSafeBase64(new Uint8Array(signature));
  return `${env.QINIU_ACCESS_KEY}:${encodedSign}:${encodedPolicy}`;
}

function ensureQiniuConfig(env) {
  for (const name of ['QINIU_ACCESS_KEY', 'QINIU_SECRET_KEY', 'QINIU_BUCKET', 'QINIU_PUBLIC_DOMAIN']) {
    if (!String(env[name] || '').trim()) throw new Error(`Missing env: ${name}`);
  }
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

function getUploadUrl(env) {
  return String(env.QINIU_UPLOAD_URL || 'https://up-z2.qiniup.com').trim().replace(/\/+$/, '');
}

function getPublicDomain(env) {
  const domain = String(env.QINIU_PUBLIC_DOMAIN || '').trim().replace(/\/+$/, '');
  if (!domain) return '';
  return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
}

function makePublicUrl(env, key) {
  return `${getPublicDomain(env)}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

function cleanPrefix(prefix) {
  return String(prefix || 'xiumi')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/\/+/g, '/') || 'xiumi';
}

function urlSafeBase64(value) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_');
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
  for (const [key, value] of Object.entries(CORS_HEADERS)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
