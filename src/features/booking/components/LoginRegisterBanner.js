"use client";
import { useState } from "react";
import { Flex, Paper, Text } from "@mantine/core";
import LoginPromptModal from "@/features/auth/components/LoginPromptModal";

const LoginRegisterBanner = ({ session }) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // console.log("session1:", session);

  if (session?.user) return null;

  return (
    <Paper withBorder p={"md"} mb={"sm"}>
      <Flex>
        <Text size="sm">
          <Text
            span
            fw={500}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setAuthMode("login");
              setShowLoginPrompt(true);
            }}
          >
            Log in
          </Text>{" "}
          to book with your saved details or{" "}
          <Text
            span
            fw={500}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setAuthMode("signup");
              setShowLoginPrompt(true);
            }}
          >
            register
          </Text>{" "}
          to manage your bookings.
        </Text>
        {/* <Divider /> */}
      </Flex>
      <LoginPromptModal
        opened={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        initialMode={authMode}
      />
    </Paper>
  );
};

export default LoginRegisterBanner;
