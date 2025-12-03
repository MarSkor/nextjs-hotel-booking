"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Group, Pagination } from "@mantine/core";

const DataPagination = ({ totalPages, currentPage }) => {
  const router = useRouter();

  if (totalPages <= 1) return null;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      router.replace(`/account/favorites?page=${totalPages}`);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    router.push(`/account/favorites?page=${page}`);
  };

  return (
    <Group justify="center" mt="md">
      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={handlePageChange}
        siblings={1}
        boundaries={1}
        size="sm"
      />
    </Group>
  );
};

export default DataPagination;
