"use client";
import { useState, useRef } from "react";
import {
  Text,
  NumberInput,
  Flex,
  Group,
  Button,
  Menu,
  Box,
} from "@mantine/core";
import { IconArrowDown } from "@/components/icons";

const BookingGuests = () => {
  const handlersAdultRef = useRef(null);
  const handlersChildrenRef = useRef(null);
  const [valueAdults, setValueAdults] = useState(1);
  const [valueChildren, setValueChildren] = useState(0);

  return (
    <Menu
      shadow="md"
      // width={250}
      position="bottom-start"
      className="booking-sf__form--menu"
    >
      <Menu.Target>
        <div className="booking-sf__form--input-wrapper-guests">
          <Box className="booking-sf__form--input-guests">
            <div className="booking-sf__form--input-guests-text">
              {valueAdults} adults · {valueChildren} children
            </div>
            <div className="booking-sf__form--input-guests-icon">
              <IconArrowDown />
            </div>
          </Box>
        </div>
      </Menu.Target>
      <Menu.Dropdown className="booking-sf__form--input-wrapper-guests-dropdown">
        <Box>
          <Flex direction="row" align="center" justify="space-between">
            <div>
              <Text size="xs">Adults</Text>
            </div>
            <Flex align="center">
              <Group>
                <Button
                  onClick={() => handlersAdultRef.current?.decrement()}
                  variant="default"
                >
                  -
                </Button>
                <NumberInput
                  w={50}
                  placeholder="Click the buttons"
                  handlersRef={handlersAdultRef}
                  hideControls
                  min={1}
                  max={8}
                  value={valueAdults}
                  onChange={setValueAdults}
                  defaultValue={1}
                  clampBehavior="strict"
                />
                <Button
                  onClick={() => handlersAdultRef.current?.increment()}
                  variant="default"
                >
                  +
                </Button>
              </Group>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex direction="row" align="center" justify="space-between">
            <div>
              <Text size="xs">Children</Text>
            </div>
            <Flex align="center">
              <Group>
                <Button
                  onClick={() => handlersChildrenRef.current?.decrement()}
                  variant="default"
                >
                  -
                </Button>
                <NumberInput
                  w={50}
                  placeholder="Click the buttons"
                  handlersRef={handlersChildrenRef}
                  hideControls
                  min={1}
                  max={8}
                  value={valueChildren}
                  onChange={setValueChildren}
                  defaultValue={0}
                  clampBehavior="strict"
                />
                <Button
                  onClick={() => handlersChildrenRef.current?.increment()}
                  variant="default"
                >
                  +
                </Button>
              </Group>
            </Flex>
          </Flex>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BookingGuests;
