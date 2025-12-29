"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { IconEdit } from "@/components/icons";
import { mantineNotify } from "@/lib/mantineNotify";
import { resendEmailVerification, updateEmail } from "@/actions/email";
import { useRouter, useSearchParams } from "next/navigation";
import VerifiedIndicator from "../components/VerifiedIndicator";
import { useSession } from "next-auth/react";
import {
  Box,
  Text,
  TextInput,
  Paper,
  Flex,
  Button,
  Group,
  ActionIcon,
  Fieldset,
  Alert,
  Loader,
} from "@mantine/core";

const DetailsForm = ({ session }) => {
  console.log("DETAILS session: ", session);

  const { update } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [localPendingEmail, setLocalPendingEmail] = useState(
    session.user.pendingEmail
  );
  const searchParams = useSearchParams();
  const emailVerified = searchParams.get("email_verified");
  const token = searchParams.get("token");
  const hasRefreshedSession = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      newEmail: session?.user?.email,
      password: "",
    },
  });

  useEffect(() => {
    if (emailVerified === "true" && !hasRefreshedSession.current) {
      hasRefreshedSession.current = true;

      update().then(() => {
        router.replace("/account/account-details", { scroll: false });
      });
    }
  }, [emailVerified, update, router]);

  const watchedEmail = watch("newEmail");
  const unchanged = watchedEmail === session.user.email;

  const onSubmit = async (data) => {
    const res = await updateEmail({ newEmail: data.newEmail });
    setLocalPendingEmail(data.newEmail);

    if (res.success) {
      setEditing(false);
      mantineNotify.success(
        "We have sent a verification link to your new email."
      );
    } else {
      mantineNotify.error(res.error || "Could not update. Try again later.");
      console.log(res.error);
    }
  };

  useEffect(() => {
    setLocalPendingEmail(session.user.pendingEmail);
  }, [session.user.pendingEmail]);

  return (
    <Box className="accountdetails__wrapper">
      <Paper p={"sm"}>
        <TextInput
          label="Name"
          disabled
          placeholder={session?.user.name}
          mb={"sm"}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset legend="Change Email" mb={"md"}>
            <Flex direction={"column"}>
              <Flex direction={"row"} align={"center"} mb={"xs"} gap={"xs"}>
                <TextInput
                  mb={"sm"}
                  flex={1}
                  label="Email"
                  disabled={!editing || isSubmitting}
                  placeholder={session?.user.email}
                  {...register("newEmail", { required: true })}
                  error={errors.newEmail && "Email is required"}
                  rightSection={
                    editing ? (
                      isSubmitting ? (
                        <Loader size="xs" />
                      ) : null
                    ) : (
                      <ActionIcon
                        variant="light"
                        onClick={() => setEditing(true)}
                        disabled={isSubmitting}
                      >
                        <IconEdit height={18} width={18} />
                      </ActionIcon>
                    )
                  }
                />
                <VerifiedIndicator
                  pendingEmail={localPendingEmail}
                  onResend={() =>
                    resendEmailVerification(session.user.id, localPendingEmail)
                  }
                />
              </Flex>
            </Flex>

            <Box>
              {editing && (
                <Group justify="flex-end">
                  <Button
                    variant="light"
                    onClick={() => setEditing(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={unchanged || isSubmitting}>
                    Save
                  </Button>
                </Group>
              )}
            </Box>
          </Fieldset>
          <Fieldset legend="Change Password">
            <Text mb={"sm"}>Change your password here.</Text>
            <Button
              variant="light"
              component="a"
              href="/account/reset-password"
            >
              Change Password
            </Button>
          </Fieldset>
        </form>
      </Paper>
    </Box>
  );
};

export default DetailsForm;
