"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [params, setParams] = useState<Record<string, string>>({});
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse query params
    const searchParams = new URLSearchParams(window.location.search);
    const paramObj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      paramObj[key] = value;
    }
    setParams(paramObj);

    // Send requests to 15 endpoints
    const endpoints = Array.from({ length: 15 }, (_, i) => `/api/endpoint${i + 1}`);
    Promise.all(
      endpoints.map((url) =>
        fetch(url)
          .then((r) => r.json())
          .then((data) => ({ url, data }))
          .catch((e) => ({ url, data: { error: e.message } }))
      )
    ).then((results) => {
      const respObj: Record<string, any> = {};
      results.forEach(({ url, data }) => {
        respObj[url] = data;
      });
      setResponses(respObj);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ padding: 32, fontFamily: 'sans-serif', marginTop: 40 }}>
          <h1 style={{ color: '#0070f3' }}>APP LOADED</h1>
          <h2>Query Params</h2>
          <pre>{JSON.stringify(params, null, 2)}</pre>
          <h2>Endpoint Responses</h2>
          {loading ? (
            <div>Loading endpoints...</div>
          ) : (
            <ul>
              {Object.entries(responses).map(([url, data]) => (
                <li key={url}>
                  <strong>{url}:</strong> <pre>{JSON.stringify(data, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
