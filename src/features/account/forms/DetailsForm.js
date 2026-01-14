"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { IconEdit } from "@/components/icons";
import { mantineNotify } from "@/lib/mantineNotify";
import { updateEmail } from "@/actions/email";
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
} from "@mantine/core";

const DetailsForm = ({ session: initialSession }) => {
  const { data: session, update } = useSession();
  const currentSession = session || initialSession;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const isVerified =
    !!currentSession?.user.emailVerified ||
    searchParams.get("email_verified") === "true";

  const isPending = !!currentSession?.user?.pendingEmail;
  const emailVerified = searchParams.get("email_verified");
  const hasRefreshedSession = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      newEmail: session?.user?.email,
      password: "",
    },
  });

  const watchedEmail = watch("newEmail");
  const unchanged = watchedEmail === currentSession?.user?.email;

  useEffect(() => {
    if (emailVerified === "true" && !hasRefreshedSession.current) {
      hasRefreshedSession.current = true;

      update().then(() => {
        mantineNotify.success("Your email has been successfully verified!");
        router.replace("/account/account-details", { scroll: false });
      });
    }
  }, [emailVerified, update, router]);

  const onSubmit = async (data) => {
    const res = await updateEmail({ newEmail: data.newEmail });

    if (res.success) {
      setEditing(false);
      await update();
      mantineNotify.success("Verification link sent!");
    } else {
      mantineNotify.error(res.error || "Could not update. Try again later.");
    }
  };

  return (
    <Box className="accountdetails__wrapper">
      <Paper p={"sm"}>
        <TextInput
          label="Name"
          disabled
          placeholder={currentSession?.user?.name}
          mb={"sm"}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset legend="Change Email" mb={"md"}>
            <Flex direction={"column"}>
              <Flex direction={"row"} align={"center"} mb={"xs"} gap={"xs"}>
                <TextInput
                  mb={"sm"}
                  flex={1}
                  label="Email Address"
                  disabled={!editing || isSubmitting}
                  placeholder={currentSession?.user?.email}
                  {...register("newEmail", { required: true })}
                  error={errors.newEmail && "Email is required"}
                  rightSection={
                    editing ? null : (
                      <ActionIcon
                        variant="subtle"
                        onClick={() => setEditing(true)}
                      >
                        <IconEdit height={18} width={18} />
                      </ActionIcon>
                    )
                  }
                />

                <Box mt={errors.newEmail ? 0 : 20}>
                  <VerifiedIndicator
                    isVerified={isVerified}
                    isPending={isPending}
                  />
                </Box>
              </Flex>
              {currentSession?.user?.pendingEmail && !editing && (
                <Text size="xs" c="orange" mt={5}>
                  Verification pending for: {currentSession.user.pendingEmail}
                </Text>
              )}
              {editing && (
                <Group justify="flex-end">
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setEditing(false);
                      reset();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="xs"
                    loading={isSubmitting}
                    disabled={
                      unchanged ||
                      isSubmitting ||
                      !!errors.newEmail ||
                      !watchedEmail
                    }
                  >
                    Save Changes
                  </Button>
                </Group>
              )}
            </Flex>
          </Fieldset>

          <Fieldset legend="Change Password">
            <Text mb={"sm"}>Change your password here.</Text>
            <Button
              variant="light"
              component="a"
              href="/account/account-details/change-password"
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
