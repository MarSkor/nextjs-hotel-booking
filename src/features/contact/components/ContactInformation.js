import {
  Flex,
  Box,
  Title,
  Text,
  Stack,
  ActionIcon,
  Group,
} from "@mantine/core";
import { CONTACT_US } from "./data";
import { IconTwitter, IconFacebook, IconInstagram } from "@/components/icons";

const social = [IconTwitter, IconFacebook, IconInstagram];

const ContactIcon = ({
  contacticon__icon: Icon,
  title,
  description,
  ...others
}) => {
  return (
    <Flex {...others} className="contacticon__wrapper" align={"center"}>
      <Box mr={"md"} className="contacticon__icon-wrapper">
        <Icon
          className="contacticon__icon"
          style={{ width: "24px", height: "24px" }}
        />
      </Box>
      <Flex direction={"column"}>
        <Title order={5} className="contacticon__title">
          {title}
        </Title>
        <Text className="contacticon__description">{description}</Text>
      </Flex>
    </Flex>
  );
};

export function ContactIconsList() {
  const items = CONTACT_US.map((item, index) => (
    <ContactIcon key={index} {...item} />
  ));
  return <Stack mt={"sm"}>{items}</Stack>;
}

const ContactInformation = () => {
  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className="contactinfo__social"
      variant="transparent"
    >
      <Icon style={{ width: "24px", height: "24px" }} />
    </ActionIcon>
  ));

  return (
    <Flex direction={"column"} className="contactinformation">
      <Box mb={"xl"}>
        <Title order={1} className="contactinfo__title">
          Need help? Contact us
        </Title>
        <Text size="sm" mt="sm" mb={"xs"} className="contactinfo__description">
          We&apos;re here to help make your stay as comfortable and enjoyable as
          possible. Whether you have questions about your reservation, need
          assistance with directions, or simply want to learn more about our
          accommodation, feel free to get in touch.
        </Text>
        <Text size="sm">
          You can also fill out the contact form and a member of our team will
          get back to you as soon as possible.
        </Text>
      </Box>
      <ContactIconsList />
      <Group mt="xl">{icons}</Group>
    </Flex>
  );
};

export default ContactInformation;
