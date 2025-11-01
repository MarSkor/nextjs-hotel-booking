"use client";
import { deleteAccommodation } from "@/actions/accommodation";
import { parseDate } from "@/utils/date";
import DataTable from "./DataTable";

const AccommodationsOverview = ({ data, totalPages = 1 }) => {
  return (
    // <ScrollArea>
    //   <TableScrollContainer minWidth={380}>
    //     <Table striped highlightOnHover withRowBorders>
    //       <TableThead>
    //         <TableTr>
    //           <TableTh>Title</TableTh>
    //           <TableTh visibleFrom="sm">Price</TableTh>
    //           <TableTh visibleFrom="sm">Created</TableTh>
    //           <TableTh visibleFrom="sm">Updated</TableTh>
    //           <TableTh>Actions</TableTh>
    //         </TableTr>
    //       </TableThead>
    //       <TableTbody>
    //         {rows.length > 0 ? (
    //           rows.map((item) => (
    //             <TableTr key={item.id}>
    //               <TableTd>{item.title}</TableTd>
    //               <TableTd visibleFrom="sm">${item.pricePerNight}</TableTd>
    //               <TableTd visibleFrom="sm">
    //                 {parseDate(item.createdAt).format("DD/MM/YY")}
    //               </TableTd>
    //               <TableTd visibleFrom="sm">
    //                 {parseDate(item.updatedAt).format("DD/MM/YY")}
    //               </TableTd>
    //               <TableTd style={{ textAlign: "right" }}>
    //                 <Group>
    //                   <ActionIcon
    //                     variant="subtle"
    //                     color="blue"
    //                     aria-label="Edit"
    //                     component="a"
    //                     href={`/admin/accommodations/edit/${item.id}`}
    //                   >
    //                     <IconEdit height={18} width={18} />
    //                   </ActionIcon>
    //                   <DeleteModal
    //                     id={item.id}
    //                     resourceName="accommodation"
    //                     title="Delete Accommodation"
    //                     message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
    //                     deleteAction={deleteAccommodation}
    //                     triggerType="icon"
    //                     color="red"
    //                   />
    //                 </Group>
    //               </TableTd>
    //             </TableTr>
    //           ))
    //         ) : (
    //           <TableTr>
    //             <TableTd colSpan={5}>
    //               <Text ta="center" c="dimmed" py="md">
    //                 No accommodations found.
    //               </Text>
    //             </TableTd>
    //           </TableTr>
    //         )}
    //       </TableTbody>
    //     </Table>
    //   </TableScrollContainer>
    //   {totalPages > 1 && (
    //     <Group justify="center" mt="md">
    //       <Pagination
    //         total={totalPages}
    //         value={currentPage}
    //         onChange={handlePageChange}
    //         size="sm"
    //       />
    //     </Group>
    //   )}
    // </ScrollArea>
    <DataTable
      data={data}
      title="Accommodations"
      enableEdit={true}
      editBasePath="/admin/accommodations/edit"
      totalPages={totalPages}
      currentPage={1}
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
