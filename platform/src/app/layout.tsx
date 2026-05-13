import './globals.css';

// 使用系统字体替代 Google Fonts
const inter = { className: 'font-sans' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}