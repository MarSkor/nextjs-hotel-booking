"use client";

import { deleteResourceAction, messageModeration } from "@/actions/admin";
import { Badge, Button, Group, Modal, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import DataTable from "./DataTable";
import { parseDate } from "@/utils/date";

const MessagesOverview = ({ data, totalPages, currentPage }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessage = async (message) => {
    setSelectedMessage(message);
    open();

    if (message.status === "UNREAD") {
      await messageModeration(message.id, "READ");
    }
  };

  return (
    <>
      <DataTable
        data={data}
        title="Contact Messages"
        totalPages={totalPages}
        currentPage={currentPage}
        columns={[
          {
            key: "firstName",
            label: "Sender",
            format: (_, row) => `${row.firstName} ${row.lastName}`,
          },
          { key: "email", label: "Email", visibleFrom: "sm" },
          { key: "subject", label: "Subject" },
          {
            key: "status",
            label: "Status",
            format: (v) => (
              <Badge color={v === "UNREAD" ? "blue" : "gray"} variant="light">
                {v}
              </Badge>
            ),
          },
          {
            key: "createdAt",
            label: "Date",
            visibleFrom: "md",
            format: (v) => parseDate(v).format("DD/MM/YY HH:mm"),
          },
          {
            key: "actions",
            label: "Decision",
            format: (_, row) => (
              <Button
                variant="light"
                size="xs"
                onClick={() => handleMessage(row)}
              >
                View
              </Button>
            ),
          },
        ]}
        deleteAction={deleteResourceAction}
        resourceName={"contactMessages"}
      />
      <Modal
        opened={opened}
        onClose={close}
        title="Message Details"
        size="lg"
        centered
      >
        {selectedMessage && (
          <Stack>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                From: {selectedMessage.firstName} {selectedMessage.lastName} (
                {selectedMessage.email})
              </Text>
              <Text size="sm" c="dimmed">
                {parseDate(selectedMessage.createdAt).format("LLL")}
              </Text>
            </Group>
            <Text fw={700} size="lg">
              {selectedMessage.subject}
            </Text>
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {selectedMessage.message}
            </Text>

            <Group justify="flex-end" mt="xl">
              <Button variant="outline" onClick={close}>
                Close
              </Button>
              {selectedMessage.status !== "ARCHIVED" && (
                <Button
                  color="orange"
                  onClick={() => {
                    messageModeration(selectedMessage.id, "ARCHIVED");
                    close();
                  }}
                >
                  Archive
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default MessagesOverview;
