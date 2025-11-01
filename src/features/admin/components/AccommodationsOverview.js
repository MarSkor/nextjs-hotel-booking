"use client";
import { deleteAccommodation } from "@/actions/accommodation";
import { parseDate } from "@/utils/date";
import DataTable from "./DataTable";

const AccommodationsOverview = ({ data, totalPages, currentPage }) => {
  return (
    <DataTable
      data={data}
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
      deleteAction={deleteAccommodation}
      resourceName={"accommodations"}
    />
  );
};

export default AccommodationsOverview;
