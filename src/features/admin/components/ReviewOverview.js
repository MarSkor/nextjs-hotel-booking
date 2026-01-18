"use client";
import DataTable from "./DataTable";
import { Badge, rem, Text } from "@mantine/core";
import { parseDate } from "@/utils/date";
import { deleteResourceAction } from "@/actions/admin";
import ReviewModeration from "./ReviewModeration";

const ReviewOverview = ({ reviews, totalPages, currentPage }) => {
  return (
    <DataTable
      data={reviews}
      title="Reviews"
      totalPages={totalPages}
      currentPage={currentPage}
      columns={[
        {
          key: "status",
          label: "Status",
          format: (v) => {
            const colors = {
              PENDING: "yellow",
              APPROVED: "green",
              REJECTED: "red",
            };
            return <Badge color={colors[v] || "gray"}>{v}</Badge>;
          },
        },
        {
          key: "accommodation",
          label: "Accommodation",
          format: (v) => v?.title || "-",
        },
        {
          key: "comment",
          label: "Comment",
          visibleFrom: "md",
          width: 250,
          format: (v) => (
            <Text
              fz={14}
              c="dimmed"
              lineClamp={1}
              style={{ maxWidth: rem(150) }}
            >
              {v}
            </Text>
          ),
        },
        {
          key: "createdAt",
          label: "Date",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
        {
          key: "id",
          label: "Decision",
          format: (_, item) => <ReviewModeration review={item} />,
        },
      ]}
      deleteAction={deleteResourceAction}
      resourceName={"reviews"}
    />
  );
};

export default ReviewOverview;
