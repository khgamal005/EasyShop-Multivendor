import React, { useState } from "react";
import { useSelector } from "react-redux";
import EventCard from "../componant/Events/EventCard";
import Header from "../componant/Layout/Header";
import Loader from "../componant/Layout/Loader";

const EventsPage = () => {
  // const { allEvents, isLoading } = useSelector((state) => state.events);
    const [allProducts, isLoading] = useState([]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;
