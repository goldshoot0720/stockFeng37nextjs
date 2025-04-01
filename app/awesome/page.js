'use client';

import { useEffect, useState } from "react";

export default function AwesomePage() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await fetch("/api/stocks");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStocks(data); // 假設您的 API 返回的是一個陣列
        setFilteredStocks(data); // 初始時顯示所有資料
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
        setError(error.message);  // 儲存錯誤信息
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  useEffect(() => {
    // 過濾邏輯
    const filtered = stocks.filter(stock => {
      return (
        stock.Code.includes(searchCode) &&
        stock.Name.toLowerCase().includes(searchName.toLowerCase())
      );
    });
    setFilteredStocks(filtered);
  }, [searchCode, searchName, stocks]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>台灣證券交易所股票資訊</h1>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>By https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL</h2>

      {/* 搜索欄位 */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="搜尋股票代號"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="搜尋名稱"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* 表格 */}
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 auto" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "center" }}>
            <th style={tableHeaderStyle}>股票代號</th>
            <th style={tableHeaderStyle}>名稱</th>
            <th style={tableHeaderStyle}>成交股數</th>
            <th style={tableHeaderStyle}>成交金額</th>
            <th style={tableHeaderStyle}>開盤價</th>
            <th style={tableHeaderStyle}>最高價</th>
            <th style={tableHeaderStyle}>最低價</th>
            <th style={tableHeaderStyle}>收盤價</th>
            <th style={tableHeaderStyle}>變動</th>
            <th style={tableHeaderStyle}>成交筆數</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((stock, index) => (
            <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : {}}>
              <td style={tableCellStyle}>{stock.Code}</td>
              <td style={tableCellStyle}>{stock.Name}</td>
              <td style={tableCellStyle}>{stock.TradeVolume}</td>
              <td style={tableCellStyle}>{stock.TradeValue}</td>
              <td style={tableCellStyle}>{stock.OpeningPrice}</td>
              <td style={tableCellStyle}>{stock.HighestPrice}</td>
              <td style={tableCellStyle}>{stock.LowestPrice}</td>
              <td style={tableCellStyle}>{stock.ClosingPrice}</td>
              <td style={tableCellStyle}>{stock.Change}</td>
              <td style={tableCellStyle}>{stock.Transaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const tableHeaderStyle = {
  padding: "10px 15px",
  border: "1px solid #ddd",
  textAlign: "center",
  backgroundColor: "#4CAF50",
  color: "white",
};

const tableCellStyle = {
  padding: "10px 15px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const inputStyle = {
  margin: "5px",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  width: "200px",
};
