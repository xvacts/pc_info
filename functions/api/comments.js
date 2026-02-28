// functions/api/comments.js
export async function onRequest({ env, request }) {
  const db = env.DB;
  if (!db) return Response.json({ error: "DB not found" }, { status: 500 });

  const url = new URL(request.url);
  const model = url.searchParams.get('model');

  if (request.method === 'GET') {
    // 取得某型號的所有評論
    if (!model) return Response.json({ error: "缺少 model 參數" }, { status: 400 });

    const { results } = await db.prepare(
      "SELECT username, comment, created_at FROM comments WHERE model = ? ORDER BY created_at DESC"
    ).bind(model).all();

    return Response.json(results);
  }

  if (request.method === 'POST') {
    // 新增評論
    const body = await request.json();
    const { model: postModel, comment, username = '匿名' } = body;

    if (!postModel || !comment) {
      return Response.json({ error: "缺少 model 或 comment" }, { status: 400 });
    }

    await db.prepare(
      "INSERT INTO comments (model, comment, username) VALUES (?, ?, ?)"
    ).bind(postModel, comment, username).run();

    return Response.json({ success: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
