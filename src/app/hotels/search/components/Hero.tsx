"use client";

import SelectFormInput from "@/components/form/SelectFormInput";
import { useState } from "react";
import { Button, Col, Dropdown, DropdownDivider, DropdownMenu, DropdownToggle, FormLabel, Row } from "react-bootstrap";
import DatePicker from "react-flatpickr";
import { BsCalendar, BsDashCircle, BsGeoAlt, BsPerson, BsPlusCircle, BsSearch } from "react-icons/bs";

type AvailabilityFormType = {
  location: string;
  stayFor: Date | Array<Date>;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
};

const Hero = ({ location: initialLocation, checkIn, checkOut, adults, rooms }: { location: string; checkIn: string; checkOut: string; adults: string; rooms: string }) => {
  const initialValue: AvailabilityFormType = {
    location: initialLocation || "Rio de Janeiro",
    stayFor: [
      checkIn ? new Date(checkIn) : new Date(),
      checkOut ? new Date(checkOut) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    ],
    guests: {
      adults: parseInt(adults) || 2,
      children: 0,
      rooms: parseInt(rooms) || 1,
    },
  };

  const [formValue, setFormValue] = useState<AvailabilityFormType>(initialValue);

  const updateGuests = (type: keyof AvailabilityFormType["guests"], increase: boolean = true) => {
    const val = formValue.guests[type];
    setFormValue({
      ...formValue,
      guests: {
        ...formValue.guests,
        [type]: increase ? val + 1 : val > 1 ? val - 1 : 0,
      },
    });
  };

  const getGuestsValue = (): string => {
    let value = "";
    const guests = formValue.guests;
    if (guests.adults) {
      value += guests.adults + (guests.adults > 1 ? " Adults " : " Adult ");
    }
    if (guests.children) {
      value += guests.children + (guests.children > 1 ? " Children " : " Child ");
    }
    if (guests.rooms) {
      value += guests.rooms + (guests.rooms > 1 ? " Rooms " : " Room ");
    }
    return value.trim();
  };

  return (
    <section className="pt-0 bg-gray-50 dark:bg-[#222529]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-[#2a2c31] shadow rounded-3 position-relative p-4 pe-md-5 pb-5 pb-md-4 mb-4 text-gray-900 dark:text-white">
          <Row className="g-4 align-items-center">
            <Col lg={4}>
              <div className="form-control-border form-control-transparent form-fs-md flex-centered gap-2">
                <BsGeoAlt size={37} />
                <div className="flex-grow-1">
                  <FormLabel className="form-label">Location</FormLabel>
                  <SelectFormInput>
                    <option value={-1}>Select location</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Amsterdam">Amsterdam</option>
                    <option value="Paris">Paris</option>
                  </SelectFormInput>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="flex-centered">
                <div>
                  <BsCalendar size={37} className="me-2" />
                </div>
                <div className="form-control-border form-control-transparent form-fs-md">
                  <FormLabel className="form-label">Check in - out</FormLabel>
                  <DatePicker
                    value={formValue.stayFor}
                    onChange={(val) => setFormValue({ ...formValue, stayFor: val })}
                    options={{
                      mode: "range",
                      dateFormat: "Y-m-d",
                    }}
                    className="form-control flatpickr bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </Col>
            <Col lg={4}>
              <div className="form-control-border form-control-transparent form-fs-md flex-centered">
                <div>
                  <BsPerson size={37} className="me-2" />
                </div>
                <div className="w-100">
                  <label className="form-label">Guests &amp; rooms</label>
                  <Dropdown className="guest-selector me-2">
                    <DropdownToggle
                      as="input"
                      className="form-guest-selector form-control selection-result bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={getGuestsValue()}
                      readOnly
                    />
                    <DropdownMenu className="guest-selector-dropdown bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <li className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">Adults</h6>
                          <small>Ages 13 or above</small>
                        </div>
                        <div className="hstack gap-1 align-items-center">
                          <Button
                            variant="link"
                            className="adult-remove p-0 mb-0 text-gray-900 dark:text-white"
                            onClick={() => updateGuests("adults", false)}
                          >
                            <BsDashCircle className="fs-5 fa-fw" />
                          </Button>
                          <h6 className="guest-selector-count mb-0 adults">{formValue.guests.adults ?? 0}</h6>
                          <Button
                            variant="link"
                            className="adult-add p-0 mb-0 text-gray-900 dark:text-white"
                            onClick={() => updateGuests("adults")}
                          >
                            <BsPlusCircle className="fs-5 fa-fw" />
                          </Button>
                        </div>
                      </li>
                      <DropdownDivider className="bg-gray-300 dark:bg-gray-600" />
                      <li className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">Children</h6>
                          <small>Ages 13 below</small>
                        </div>
                        <div className="hstack gap-1 align-items-center">
                          <Button
                            variant="link"
                            className="child-remove p-0 mb-0 text-gray-900 dark:text-white"
                            onClick={() => updateGuests("children", false)}
                          >
                            <BsDashCircle className="fs-5 fa-fw" />
                          </Button>
                          <h6 className="guest-selector-count mb-0 child">{formValue.guests.children ?? 0}</h6>
                          <Button
                            variant="link"
                            className="child-add p-0 mb-0 text-gray-900 dark:text-white"
                            onClick={() => updateGuests("children")}
                          >
                            <BsPlusCircle className="fs-5 fa-fw" />
                          </Button>
                        </div>
                      </li>
                      <DropdownDivider className="bg-gray-300 dark:bg-gray-600" />
                      <li className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">Rooms</h6>
                          <small>Max room 8</small>
                        </div>
                        <div className="hstack gap-1 align-items-center">
                          <Button
                            variant="link"
                            className="room-remove p-0 mb-0 text-gray-900 dark:text-white"
                            onClick={() => updateGuests("rooms", false)}
                          >
                            <BsDashCircle className="fs-5 fa-fw" />
                          </Button>
                          <h6 className="guest-selector-count mb-0 rooms">{formValue.guests.rooms ?? 0}</h6>
                          <Button
                            variant="link"
                            className="room-add p-0 mb-0 text-gray-900 dark:text-white"
                            onClick={() => updateGuests("rooms")}
                          >
                            <BsPlusCircle className="fs-5 fa-fw" />
                          </Button>
                        </div>
                      </li>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </Col>
          </Row>

          <div className="btn-position-md-middle mt-4">
            <Button
              type="submit"
              className="icon-lg btn btn-round btn-primary mb-0 flex-centered text-white"
              onClick={() => {
                // Handle search logic here, e.g., navigate with form values
                console.log("Search with:", formValue);
              }}
            >
              <BsSearch className="fa-fw" />
              <span className="ms-2">Search</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;