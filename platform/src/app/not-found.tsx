'use client';

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f5f5f7' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111' }}>404</h1>
          <p style={{ color: '#666', marginTop: '1rem' }}>页面未找到 / Page Not Found</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '10px 20px', backgroundColor: '#e52129', color: '#fff', textDecoration: 'none', borderRadius: '20px' }}>
            返回首页
          </a>
        </div>
      </body>
    </html>
  );
}
