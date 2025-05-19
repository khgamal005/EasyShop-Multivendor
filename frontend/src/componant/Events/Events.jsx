import { useDispatch, useSelector } from 'react-redux';
import  { useEffect } from "react";

import styles from '../../styles/styles'
import EventCard from "./EventCard";
import { getEvents } from '../../redux/slices/eventSlice';

const Events = () => {
  
    const dispatch = useDispatch();
  const {events,loading} = useSelector((state) => state.events);  
   
  useEffect(()=>{
   dispatch(getEvents());
  },[])
  return (
    <div>
     {
      !loading && (
        <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
         {
          events.length !== 0 && (
            <EventCard data={events && events[0]} />
          )
         }
         <h4>{
           events?.length === 0 && (
            'No Events have!'
           )
          }

         </h4>
      </div>
     
    </div>
      )
     }
  </div>
  )
}

export default Events