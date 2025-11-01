import { IconEdit } from "@/components/icons";
import DeleteModal from "./DeleteModal";
import {
  Table,
  TableScrollContainer,
  TableThead,
  TableTr,
  TableTh,
  TableTd,
  TableTbody,
  Group,
  Text,
  ScrollArea,
  Pagination,
  ActionIcon,
} from "@mantine/core";
import { useRouter } from "next/navigation";

const DataTable = ({
  title,
  data = [],
  columns = [],
  deleteAction,
  resourceName,
  redirectAfter,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  enableEdit = false,
  editBasePath = "",
}) => {
  const router = useRouter();

  if (!Array.isArray(data)) {
    return <Text>No data found.</Text>;
  }

  const handlePageChange = (page) => {
    if (onPageChange) onPageChange(page);
    else router.push(`/admin/${resourceName}?page=${page}`);
  };

  return (
    <ScrollArea>
      <TableScrollContainer minWidth={360}>
        <Table striped highlightOnHover withRowBorders>
          <TableThead>
            <TableTr>
              {columns.map((col) => (
                <TableTh
                  key={col.key}
                  visibleFrom={col.visibleFrom}
                  hiddenFrom={col.hiddenFrom}
                >
                  {col.label}
                </TableTh>
              ))}
              <TableTh style={{ textAlign: "right" }}>Actions</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableTr key={item.id}>
                  {columns.map((col) => (
                    <TableTd
                      key={col.key}
                      visibleFrom={col.visibleFrom}
                      hiddenFrom={col.hiddenFrom}
                      style={{ verticalAlign: "middle" }}
                    >
                      {col.format
                        ? col.format(item[col.key], item)
                        : item[col.key] ?? "-"}
                    </TableTd>
                  ))}
                  {/* actions  */}
                  <TableTd style={{ textAlign: "right" }}>
                    <Group justify="flex-end">
                      {enableEdit && editBasePath && (
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          aria-label="Edit"
                          component="a"
                          href={`${editBasePath}/${item.id}`}
                        >
                          <IconEdit height={18} width={18} />
                        </ActionIcon>
                      )}

                      <DeleteModal
                        id={item.id}
                        title={`Delete ${resourceName}`}
                        resourceName={resourceName}
                        message={`Are you sure you want to delete "${
                          item.title || item.fullName || "this item"
                        }"?`}
                        confirmText="Delete"
                        deleteAction={deleteAction}
                        redirectAfter={redirectAfter}
                        triggerType="icon"
                        color="red"
                        role={item.role}
                      />
                    </Group>
                  </TableTd>
                </TableTr>
              ))
            ) : (
              <TableTr>
                <TableTd colSpan={columns.lengt + 1}>
                  <Text ta={"center"} c={"dimmed"} py={"md"}>
                    {" "}
                    No {title || resourceName}s Found.
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

export default DataTable;
