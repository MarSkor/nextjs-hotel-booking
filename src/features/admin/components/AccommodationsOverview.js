"use client";
import { parseDate } from "@/utils/date";
import DataTable from "./DataTable";
import { deleteResourceAction } from "@/actions/admin";

const AccommodationsOverview = ({ data, totalPages, currentPage }) => {
  const formattedAccData = data.map((b) => ({
    ...b,
    pricePerNight: `$${Number(b.pricePerNight)}`,
  }));

  return (
    <DataTable
      data={formattedAccData}
      title="Accommodations"
      enableEdit={true}
      editBasePath="/admin/accommodations/edit"
      totalPages={totalPages}
      currentPage={currentPage}
      columns={[
        { key: "title", label: "Title" },
        {
          key: "pricePerNight",
          label: "Price",
          visibleFrom: "sm",
        },
        {
          key: "createdAt",
          label: "Created",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
        {
          key: "updatedAt",
          label: "Updated",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
      ]}
      deleteAction={deleteResourceAction}
      resourceName={"accommodations"}
    />
  );
};

export default AccommodationsOverview;
