"use client";
import { parseDate } from "@/utils/date";
import { deleteResourceAction } from "@/actions/admin";
import DataTable from "./DataTable";

const UsersOverview = ({ users, totalPages, currentPage }) => {
  return (
    <DataTable
      data={users}
      title="Users"
      enableEdit={false}
      totalPages={totalPages}
      currentPage={currentPage}
      columns={[
        { key: "fullName", label: "Name" },
        {
          key: "email",
          label: "Email",
          visibleFrom: "sm",
        },
        {
          key: "createdAt",
          label: "Created",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
        {
          key: "lastActivityDate",
          label: "Last Active",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
      ]}
      deleteAction={deleteResourceAction}
      resourceName={"users"}
    />
  );
};

export default UsersOverview;
