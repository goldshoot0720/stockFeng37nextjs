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
        setStocks(data);
        setFilteredStocks(data);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  useEffect(() => {
    const filtered = stocks.filter(stock => 
      stock.Code.includes(searchCode) && 
      stock.Name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchCode, searchName, stocks]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>台灣證券交易所股票資訊</h1>
      <h2 style={styles.subtitle}>By https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL</h2>

      {/* 搜索欄位 */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜尋股票代號"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="搜尋名稱"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* 響應式表格 - 允許橫向滾動 */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>股票代號</th>
              <th style={styles.tableHeader}>名稱</th>
              <th style={styles.tableHeader}>收盤價</th>
              <th style={styles.tableHeader}>變動</th>
              <th style={styles.tableHeader}>成交股數</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                <td style={styles.tableCell}>{stock.Code}</td>
                <td style={styles.tableCell}>{stock.Name}</td>
                <td style={styles.tableCell}>{stock.ClosingPrice}</td>
                <td style={styles.tableCell}>{stock.Change}</td>
                <td style={styles.tableCell}>{stock.TradeVolume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const styles = {
  container: {
    padding: "15px",
    maxWidth: "1000px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "24px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  },
  searchContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: "1 1 45%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minWidth: "120px",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  tableHeader: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    minWidth: "100px",
  },
  tableCell: {
    padding: "8px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableRowOdd: {
    backgroundColor: "white",
  },
};
