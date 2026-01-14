"use client";

import { useEffect, useState } from "react";
import { Group, Tooltip, ActionIcon, Box, Text } from "@mantine/core";
import { IconAlert, IconCheckmark, IconSent } from "@/components/icons";
import { resendEmailVerification } from "@/actions/email";
import { mantineNotify } from "@/lib/mantineNotify";

const COOLDOWN_TIME = 30;

const VerifiedIndicator = ({ isVerified, isPending, loading }) => {
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const lastSent = localStorage.getItem("email_cooldown_expiry");
    if (lastSent) {
      const remaining = Math.round((parseInt(lastSent) - Date.now()) / 1000);
      if (remaining > 0) {
        setCountdown(remaining);
      }
    }
  }, []);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    setResending(true);
    try {
      const res = await resendEmailVerification();
      setResending(false);

      if (res.success) {
        mantineNotify.success("Verification email resent!");

        const expiry = Date.now() + COOLDOWN_TIME * 1000;
        localStorage.setItem("email_cooldown_expiry", expiry.toString());
        setCountdown(COOLDOWN_TIME);
      } else {
        mantineNotify.error(res.error);
      }
    } catch (error) {
      mantineNotify.error("An unexpected error occurred.");
    } finally {
      setResending(false);
    }
  };

  if (isPending) {
    return (
      <Group gap={5} wrap="nowrap" align="center">
        <Tooltip label="Verification pending">
          <Box style={{ display: "flex" }}>
            <IconAlert size={18} color="var(--mantine-color-orange-6)" />
          </Box>
        </Tooltip>

        <Tooltip
          label={
            countdown > 0
              ? `Wait ${countdown}s to resend`
              : "Resend verification email"
          }
        >
          <Group gap={4} wrap="nowrap">
            <ActionIcon
              variant="subtle"
              color="orange"
              onClick={handleResend}
              loading={loading}
              disabled={countdown > 0}
              size="sm"
            >
              <IconSent size={14} />
            </ActionIcon>
            {countdown > 0 && (
              <Text size="xs" c="orange" fw={700} style={{ minWidth: "15px" }}>
                {countdown}
              </Text>
            )}
          </Group>
        </Tooltip>
      </Group>
    );
  }

  if (isVerified) {
    return (
      <Tooltip label="Email verified">
        <Box style={{ display: "flex" }}>
          <IconCheckmark
            size={18}
            color="var(--mantine-color-green-6)"
            stroke={3}
          />
        </Box>
      </Tooltip>
    );
  }

  return null;
  // if (isVerified && !isPending) {
  //   return (
  //     <Tooltip label="Email verified">
  //       <IconCheckmark
  //         size={18}
  //         color="var(--mantine-color-green-6)"
  //         stroke={3}
  //       />
  //     </Tooltip>
  //   );
  // }

  // if (isPending) {
  //   return (
  //     <Group gap={5}>
  //       <Tooltip label="Verification pending">
  //         <IconAlert size={18} color="var(--mantine-color-orange-6)" />
  //       </Tooltip>
  //       <Tooltip
  //         label={
  //           cooldown > 0
  //             ? `Wait ${cooldown}s to resend`
  //             : "Resend verification email"
  //         }
  //       >
  //         <ActionIcon
  //           variant="subtle"
  //           color="orange"
  //           onClick={onResend}
  //           loading={loading}
  //           disabled={cooldown > 0}
  //           size="sm"
  //         >
  //           <IconSent size={14} />
  //         </ActionIcon>
  //         {cooldown > 0 && (
  //           <Text size="xs" c="dimmed" w={18}>
  //             {cooldown}
  //           </Text>
  //         )}
  //       </Tooltip>
  //     </Group>
  //   );
  // }
};

// const VerifiedIndicator = ({ pendingEmail, onResend }) => {
//   const [cooldown, setCooldown] = useState(false);

//   const handleResend = async () => {
//     if (!onResend) return;

//     setCooldown(true);
//     await onResend();

//     setTimeout(() => {
//       setCooldown(false);
//     }, COOLDOWN);
//   };

//   useEffect(() => {
//     setCooldown(false);
//   }, [pendingEmail]);

//   return (
//     <>
//       <Transition
//         mounted={!pendingEmail}
//         transition="scale"
//         duration={300}
//         timingFunction="ease-out"
//       >
//         {(styles) => (
//           <ThemeIcon style={styles} color="green" variant="light">
//             <IconCheckmark color="green" height={18} width={18} />
//           </ThemeIcon>
//         )}
//       </Transition>
//       <Transition
//         mounted={!!pendingEmail}
//         transition="scale"
//         duration={300}
//         timingFunction="ease-out"
//       >
//         {(styles) => (
//           <Group style={styles} gap={4}>
//             <Tooltip label={`Verify ${pendingEmail}`} withArrow>
//               <ThemeIcon color="yellow" variant="light">
//                 <IconAlert height={18} width={18} />
//               </ThemeIcon>
//             </Tooltip>

//             {onResend && (
//               <Button
//                 size="xs"
//                 variant="light"
//                 disabled={cooldown}
//                 onClick={handleResend}
//               >
//                 {cooldown ? "Sent" : "Resend"}
//               </Button>
//             )}
//           </Group>
//         )}
//       </Transition>
//     </>
//   );
// };

export default VerifiedIndicator;
