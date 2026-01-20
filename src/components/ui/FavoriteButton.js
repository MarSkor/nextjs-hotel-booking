"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { Box, Tooltip } from "@mantine/core";
import { IconHeart } from "../icons";
import { toggleFavoriteAction } from "@/actions/user";

const FavoriteButton = ({ initialFav, accommodationId }) => {
  const [favorite, setFavorite] = useState(initialFav);
  const [isPending, startTransition] = useTransition();
  const session = useSession();

  const userId = session?.data?.user.id;

  if (session.status === "loading") return null;

  const isLoggedIn = session.status === "authenticated" && !!session.data?.user;

  const toolTipText = isLoggedIn
    ? favorite
      ? "Remove from favorites"
      : "Save to favorites"
    : "Log in to save to favorites";

  const toggleFavorite = async () => {
    if (!isLoggedIn) return;
    startTransition(async () => {
      const res = await toggleFavoriteAction(userId, accommodationId);
      setFavorite(res.favorite);
    });
  };

  return (
    <Tooltip label={toolTipText}>
      <Box
        onClick={isLoggedIn ? toggleFavorite : undefined}
        style={{
          maxWidth: "fit-content",
          cursor: !isLoggedIn ? "not-allowed" : isPending ? "wait" : "pointer",
          opacity: isPending ? 0.6 : 1,
          pointerEvents: isPending ? "none" : "auto",
          backgroundColor: "lightgray",
          borderRadius: "4px",
          padding: "6px",
        }}
      >
        {favorite ? (
          <IconHeart height={24} width={24} color="red" fill="red" />
        ) : (
          <IconHeart height={24} width={24} color="black" />
        )}
      </Box>
    </Tooltip>
  );
};

export default FavoriteButton;
