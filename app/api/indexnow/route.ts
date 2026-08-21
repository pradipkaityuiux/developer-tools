export async function POST(req: Request) {
  const { urls } = await req.json();

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'zerosnippet.com',
      key: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      keyLocation: 'https://zerosnippet.com/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.txt',
      urlList: urls,
    }),
  });

  return Response.json({ status: res.status });
}