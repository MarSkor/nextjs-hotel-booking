import React from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="sanity">
      <body className="sanity-body">{children}</body>
    </html>
  );
}
