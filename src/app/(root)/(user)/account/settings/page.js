import DeleteAccountButton from "@/features/account/components/DeleteAccountButton";
import { Box, Title } from "@mantine/core";

const SettingsPage = () => {
  return (
    <Box component="section">
      <Box component="header" mb={"lg"}>
        <Title>Settings</Title>
        <Box>
          <DeleteAccountButton />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
