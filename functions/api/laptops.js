export async function onRequestGet({ env }) {
  const db = env.DB;  // ← 这里改成 env.DB（大写）

  if (!db) {
    return new Response(JSON.stringify({ error: "Database binding not found" }), { status: 500 });
  }

  try {
    const { results } = await db.prepare('SELECT * FROM laptops ORDER BY year DESC').all();
    return Response.json(results);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
