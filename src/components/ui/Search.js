"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionIcon, Box, Loader, rem, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  spotlight,
  SpotlightAction,
  SpotlightActionsList,
  SpotlightRoot,
  SpotlightSearch,
} from "@mantine/spotlight";
import { IconSearch } from "../icons";
import { getSearchData } from "@/actions/search";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

const Search = ({ mobile }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const hasInput = query.trim().length > 0;
  const emptyState = hasInput && !loading && results.length === 0;
  const PLACEHOLDER_IMAGE = "defaults/600x400_DxM717i9q.svg";

  useEffect(() => {
    const fetchSearchRes = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getSearchData(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.log("Search error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchRes();
  }, [debouncedQuery]);

  return (
    <>
      <ActionIcon
        variant="transparent"
        onClick={spotlight.open}
        color="var(--clr-navbar-link)"
        size={mobile ? "lg" : "md"}
      >
        <IconSearch height={16} width={16} color="var(--clr-navbar-link)" />
      </ActionIcon>
      <SpotlightRoot query={query} onQueryChange={setQuery} shortcut="">
        <SpotlightSearch
          placeholder="Search accommodations..."
          leftSection={
            loading ? (
              <Loader size="xs" />
            ) : (
              <IconSearch height={18} width={18} />
            )
          }
        />

        <Box
          style={{
            maxHeight: hasInput ? rem(400) : 0,
            overflow: "hidden",
            transition: "max-height 200ms ease",
            borderTop: hasInput
              ? "1px solid var(--mantine-color-default-border)"
              : "none",
          }}
        >
          <SpotlightActionsList>
            {results.length > 0 ? (
              results.map((item) => {
                const imagePath = item.image?.filePath || PLACEHOLDER_IMAGE;

                return (
                  <SpotlightAction
                    highlightQuery
                    key={item.id}
                    onClick={() => router.push(`/accommodation/${item.slug}`)}
                    label={item.title}
                    description={`${item.propertyType} • From ${item.price} NOK`}
                    leftSection={
                      <Box w={50} h={50} pos={"relative"} bdrs={"sm"}>
                        <IKImage
                          path={imagePath}
                          urlEndpoint={config.env.imagekit.urlEndpoint}
                          alt={item.title}
                          loading="lazy"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                          transformation={[
                            {
                              width: "1200",
                              height: "800",
                              crop: "maintain_ratio",
                            },
                          ]}
                        />
                      </Box>
                    }
                  />
                );
              })
            ) : emptyState ? (
              <Text c="dimmed" ta="center" py="xl" size="sm">
                No accommodations found...
              </Text>
            ) : null}
          </SpotlightActionsList>
        </Box>
      </SpotlightRoot>
    </>
  );
};

export default Search;
