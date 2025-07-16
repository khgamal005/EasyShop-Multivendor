import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Loader from "../components/Layout/Loader";

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
