import { DOMParser } from "xmldom";
import { NextResponse } from "next/server";

//访问 http://localhost:3000/topic?rss=https://linux.do/t/topic/13638.rss
export async function GET(request: Request) {
  // 从URL中获取RSS源
  const requestUrl = new URL(request.url);
  const rssUrl = requestUrl.searchParams.get("rss");
  const quantity = requestUrl.searchParams.get("quantity");

  if (!rssUrl || !quantity) {
    return new Response(
      JSON.stringify({
        message: "Missing 'rss' or 'quantity' query parameter",
      }),
      {
        status: 400, // 或其他适当的错误状态码
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 获取RSS源的内容
  const response = await fetch(rssUrl);
  const rssString = await response.text();
  console.log("rssString:", rssString);
  // 解析RSS源
  const recentReplies = parseRSS(rssString, quantity);
  console.log("recentReplies:", recentReplies);

  // 返回最新的counts个回答
  return NextResponse.json(recentReplies);
}

// 解析XML字符串
const parseRSS = (xmlString: string, quantity: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const items = doc.getElementsByTagName("item");
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const titleNode = item.getElementsByTagName("title")[0];
    const descriptionNode = item.getElementsByTagName("description")[0];
    const pubDateNode = item.getElementsByTagName("pubDate")[0];

    if (titleNode && descriptionNode && pubDateNode) {
      const title = titleNode.textContent || "";
      const description = descriptionNode.textContent || "";
      const pubDate = new Date(pubDateNode.textContent || "");
      results.push({ title, description, pubDate });
    }
  }

  // 按发布日期排序，时间新的在前
  results.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  // 返回最新的十个回答
  return results.slice(0, Number(quantity));
};
