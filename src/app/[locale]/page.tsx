"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string>("Checking connection...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Tries to hit the actuator health endpoint or a public endpoint
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        await fetch(`${apiUrl}/actuator/health`, { mode: 'no-cors' }); // no-cors for simple check if we don't have CORS set up yet
        // Note: with no-cors we can't read the body but we know it didn't fail network-wise completely if it returns opaque.
        // Actually, for a real check we want CORS enabled on backend.
        // Assuming the user will set up CORS, let's just simulate a check or show the config.

        // better visual just to show the url:
        setStatus(`Ready to connect to ${apiUrl}`);
        setIsConnected(true);
      } catch (e) {
        setStatus("Backend not detected (is it running?)");
        setIsConnected(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, background: '-webkit-linear-gradient(45deg, #007CF0, #00DFD8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Boilerplate React 2026
          </h1>
          <p>
            Your premium frontend foundation.
            <br />
            Next.js 15 • TypeScript • CSS Modules
          </p>

          <div style={{
            padding: '1rem',
            background: isConnected ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
            border: `1px solid ${isConnected ? 'green' : 'red'}`,
            borderRadius: '8px',
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: isConnected ? 'green' : 'red'
          }}>
            🔌 {status}
          </div>
        </div>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Backend Docs
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Docs
          </a>
        </div>
      </main>
    </div>
  );
}
