// app/api/stocks/route.js

export async function GET() {
  try {
    const response = await fetch("https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL");

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
