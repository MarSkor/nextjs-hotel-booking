import { Text, Title, Box, ActionIcon, Stack, Group } from "@mantine/core";
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
    <Box className="contacticon__wrapper" {...others}>
      <Box mr="md" className="contacticon__icon-wrapper">
        <Icon
          className="contacticon__icon"
          style={{ width: "24px", height: "24px" }}
        />
      </Box>
      <Box>
        <Title order={5} className="contacticon__title">
          {title}
        </Title>
        <Text className="contacticon__description">{description}</Text>
      </Box>
    </Box>
  );
};

export function ContactIconsList() {
  const items = CONTACT_US.map((item, index) => (
    <ContactIcon key={index} {...item} />
  ));
  return <Stack>{items}</Stack>;
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
    <Box>
      <Title order={1} className="contactinfo__title">
        Need help? <br /> Contact us
      </Title>
      <Text className="contactinfo__description">
        Leave your email and we will get back to you within 24 hours
      </Text>

      <ContactIconsList />

      <Group mt="xl">{icons}</Group>
    </Box>
  );
};

export default ContactInformation;
