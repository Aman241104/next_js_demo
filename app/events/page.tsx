const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import Eventcard from "@/components/Eventcard";
// import { events } from "@/lib/constants";

const page = async () => {
  "use cache";
  cacheLife("seconds");

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
    
  return (
    <div className="space-y-5">
      <h3>Featured Events</h3>
      <ul className="events">
        {events &&
          events.length > 0 &&
          events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <Eventcard {...event} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default page;

