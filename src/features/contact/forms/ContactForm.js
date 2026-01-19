"use client";
import { useForm } from "react-hook-form";
import { TextInput, Textarea, SimpleGrid, Button, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { sendContactMessage } from "@/actions/contact";
import { IconSent } from "@/components/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema } from "@/lib/validations";

const ContactForm = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const res = await sendContactMessage(data);
    if (res.success) {
      notifications.show({
        title: "Message Sent",
        message: "We'll get back to you as soon as possible.",
        color: "green",
      });
      reset();
    } else {
      notifications.show({
        title: "Error",
        message: res.error,
        color: "red",
      });
    }
  };

  return (
    <Flex className="contactform__container" justify={"center"}>
      <form className="contactform" onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={"column"} className="contactform__wrapper">
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            className="contactform__input-fields"
          >
            <TextInput
              label="First name"
              placeholder="First Name"
              required
              classNames={{
                input: "contactform__input",
                label: "contactform__inputLabel",
              }}
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <TextInput
              label="Last name"
              placeholder="Last name"
              required
              classNames={{
                input: "contactform__input",
                label: "contactform__inputLabel",
              }}
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </SimpleGrid>
          <TextInput
            label="Subject"
            placeholder="Subject"
            required
            classNames={{
              input: "contactform__input",
              label: "contactform__inputLabel",
            }}
            mt="md"
            {...register("subject")}
            error={errors.subject?.message}
          />
          <TextInput
            label="Your email"
            placeholder="hello@holidaze.dev"
            required
            classNames={{
              input: "contactform__input",
              label: "contactform__inputLabel",
            }}
            mt="md"
            {...register("email")}
            error={errors.email?.message}
          />
          <Textarea
            required
            label="Your message"
            placeholder="I'm having some issues with..."
            maxRows={8}
            minRows={8}
            autosize
            mt="md"
            classNames={{
              input: "contactform__input",
              label: "contactform__inputLabel",
            }}
            {...register("message")}
            error={errors.message?.message}
          />
          <Flex
            justify="center"
            direction="column"
            mt="md"
            className="contactform__button-wrap"
          >
            <Button
              size="md"
              fullWidth
              type="submit"
              className="contactform__control btn btn-primary"
              rightSection={<IconSent color="$clr-white-100" />}
              radius="xs"
              loading={isSubmitting}
            >
              Send message
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export default ContactForm;
