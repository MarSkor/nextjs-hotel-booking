"use client";

import { SessionProvider } from "next-auth/react";

export default function ({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={true} refetchWhenOffline={true}>
      {children}
    </SessionProvider>
  );
}
