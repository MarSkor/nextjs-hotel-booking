"use client";
import { IconEdit } from "@/components/icons";
import { deleteAccommodation } from "@/actions/accommodation";
import { parseDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import {
  Table,
  TableScrollContainer,
  TableThead,
  TableTr,
  TableTh,
  TableTd,
  TableTbody,
  Group,
  ActionIcon,
  Text,
  ScrollArea,
  Pagination,
} from "@mantine/core";
import DeleteModal from "./DeleteModal";

const AccommodationTable = ({ rows = [], totalPages = 1, currentPage = 1 }) => {
  const router = useRouter();
  if (!Array.isArray(rows)) {
    console.error("Expected rows to be an array, got:", rows);
    return <Text>No data found.</Text>;
  }

  const handlePageChange = (page) => {
    router.push(`/admin/accommodations?page=${page}`);
  };

  return (
    <ScrollArea>
      <TableScrollContainer minWidth={380}>
        <Table striped highlightOnHover withRowBorders>
          <TableThead>
            <TableTr>
              <TableTh>Title</TableTh>
              <TableTh visibleFrom="sm">Price</TableTh>
              <TableTh visibleFrom="sm">Created</TableTh>
              <TableTh visibleFrom="sm">Updated</TableTh>
              <TableTh>Actions</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {rows.length > 0 ? (
              rows.map((item) => (
                <TableTr key={item.id}>
                  <TableTd>{item.title}</TableTd>
                  <TableTd visibleFrom="sm">${item.pricePerNight}</TableTd>
                  <TableTd visibleFrom="sm">
                    {parseDate(item.createdAt).format("DD/MM/YY")}
                  </TableTd>
                  <TableTd visibleFrom="sm">
                    {parseDate(item.updatedAt).format("DD/MM/YY")}
                  </TableTd>
                  <TableTd style={{ textAlign: "right" }}>
                    <Group>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        aria-label="Edit"
                        component="a"
                        href={`/admin/accommodations/edit/${item.id}`}
                      >
                        <IconEdit height={18} width={18} />
                      </ActionIcon>
                      <DeleteModal
                        id={item.id}
                        resourceName="accommodation"
                        title="Delete Accommodation"
                        message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                        deleteAction={deleteAccommodation}
                        triggerType="icon"
                        color="red"
                      />
                    </Group>
                  </TableTd>
                </TableTr>
              ))
            ) : (
              <TableTr>
                <TableTd colSpan={5}>
                  <Text ta="center" c="dimmed" py="md">
                    No accommodations found.
                  </Text>
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>
      </TableScrollContainer>
      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            size="sm"
          />
        </Group>
      )}
    </ScrollArea>
  );
};

export default AccommodationTable;
