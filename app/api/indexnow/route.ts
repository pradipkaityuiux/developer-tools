export async function POST(req: Request) {
  const { urls } = await req.json();

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'zerosnippet.com',
      key: '584c657be35b4962ab0ff0c515b00d4d',
      keyLocation: 'https://zerosnippet.com/584c657be35b4962ab0ff0c515b00d4d.txt',
      urlList: urls,
    }),
  });

  return Response.json({ status: res.status });
}