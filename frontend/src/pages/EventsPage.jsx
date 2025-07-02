import { useSelector } from "react-redux";
import EventCard from "../componant/Events/EventCard";
import Loader from "../componant/Layout/Loader";

const EventsPage = () => {
  const { events,loading } = useSelector((state) => state.events);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <EventCard active={true} data={events && events[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;
