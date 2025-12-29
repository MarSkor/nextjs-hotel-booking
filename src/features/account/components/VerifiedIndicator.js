"use client";

import { useEffect, useState } from "react";
import { Group, Transition, ThemeIcon, Button, Tooltip } from "@mantine/core";
import { IconAlert, IconCheckmark } from "@/components/icons";

const COOLDOWN = 30000;

const VerifiedIndicator = ({ pendingEmail, onResend }) => {
  const [cooldown, setCooldown] = useState(false);

  const handleResend = async () => {
    if (!onResend) return;

    setCooldown(true);
    await onResend();

    setTimeout(() => {
      setCooldown(false);
    }, COOLDOWN);
  };

  useEffect(() => {
    setCooldown(false);
  }, [pendingEmail]);

  return (
    <>
      <Transition
        mounted={!pendingEmail}
        transition="scale"
        duration={300}
        timingFunction="ease-out"
      >
        {(styles) => (
          <ThemeIcon style={styles} color="green" variant="light">
            <IconCheckmark color="green" height={18} width={18} />
          </ThemeIcon>
        )}
      </Transition>
      <Transition
        mounted={!!pendingEmail}
        transition="scale"
        duration={300}
        timingFunction="ease-out"
      >
        {(styles) => (
          <Group style={styles} gap={4}>
            <Tooltip label={`Verify ${pendingEmail}`} withArrow>
              <ThemeIcon color="yellow" variant="light">
                <IconAlert height={18} width={18} />
              </ThemeIcon>
            </Tooltip>

            {onResend && (
              <Button
                size="xs"
                variant="light"
                disabled={cooldown}
                onClick={handleResend}
              >
                {cooldown ? "Sent" : "Resend"}
              </Button>
            )}
          </Group>
        )}
      </Transition>
    </>
  );
};

export default VerifiedIndicator;
