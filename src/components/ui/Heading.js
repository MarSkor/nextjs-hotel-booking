import { Title, Text, Box } from "@mantine/core";

const Heading = ({ title, label, description, variant }) => {
  const classNames = `heading--${variant}`;
  return (
    <Box className={`heading ${classNames}`}>
      {label && (
        <Text size="sm" className="heading__label">
          {label}
        </Text>
      )}
      <Title order={2} className="heading__title">
        {title}
      </Title>
      {description && <p className="heading__description">{description}</p>}
    </Box>
  );
};

export default Heading;
