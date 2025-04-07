import { Breadcrumbs, Anchor } from "@mantine/core";
const BreadCrumb = (props) => {
  return (
    <Breadcrumbs separator="/" separatorMargin="md" mt="xs">
      <Anchor
        size="xs"
        href={props.firstLevelHref}
        key={props.firstLevelHrefText}
        c="blue"
      >
        {props.firstLevelHrefText}
      </Anchor>
      <Anchor size="xs" c="gray" underline="never">
        {props.secondLevelHrefText}
      </Anchor>
    </Breadcrumbs>
  );
};

export default BreadCrumb;
