import { auth } from "../../../../../../auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Box, Text, Grid, Title } from "@mantine/core";
import { FAVORITES_PER_PAGE } from "@/utils/constants";
import { fetchAllFavorites, getFavoritesPages } from "@/actions/user";
import DataPagination from "@/components/ui/Pagination";
import FavoriteItem from "@/features/account/components/FavoriteItem";

const FavoritesPage = async ({ searchParams }) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    redirect("/login");
  }

  const params = await searchParams;
  const currentPage = Number(params?.page) ?? 1;
  const offset = FAVORITES_PER_PAGE * (currentPage - 1);
  const totalPages = await getFavoritesPages(userId);
  const result = await fetchAllFavorites(userId, offset);

  if (result.length === 0 && currentPage > 1) {
    redirect(`/account/favorites?page=${currentPage - 1}`);
  }

  return (
    <Box component="section">
      <Box component="header" mb={"lg"}>
        <Title>Favorites</Title>
      </Box>
      <Box>
        {!result.length && <Text>You have no saved favorites yet.</Text>}
      </Box>

      <Grid gutter={{ base: 16, xs: "sm", md: "md" }} mb={"md"}>
        {result.map((favorite, i) => (
          <FavoriteItem key={favorite.id} {...favorite} />
        ))}
      </Grid>

      <Suspense fallback={<>Loading...</>}>
        <DataPagination totalPages={totalPages} currentPage={currentPage} />
      </Suspense>
    </Box>
  );
};

export default FavoritesPage;
