// functions/api/laptops.js

export async function onRequestGet({ env, request }) {
  try {
    // 注意：你 dashboard 绑的变量是 laptop-db → 代码里自动变成 laptop_db (下划线)
    const db = env.laptop_db;  // ← 这里用下划线！不是 laptop-db

    if (!db) {
      return new Response(JSON.stringify({ error: "Database binding not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 准备语句：SELECT 所有数据（可以加 LIMIT / ORDER BY 根据需要）
    const stmt = db.prepare("SELECT * FROM laptops ORDER BY year DESC");  // 按年份降序示例

    const { results } = await stmt.all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        // 可选：允许跨域（如果前端是其他域名访问）
        // "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch laptops", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
