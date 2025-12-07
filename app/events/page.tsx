import { cacheLife } from "next/cache";
import Eventcard from "@/components/Eventcard";
import { Suspense } from "react";

type EventDTO = {
  _id: string;
  slug: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventList = ({ events }: { events: EventDTO[] }) => {
  return (
    <ul className="events">
      {events.map((event) => (
        <li key={event._id} className="list-none">
          <Eventcard {...event} />
        </li>
      ))}
    </ul>
  );
};

const EventsPage = async () => {
  "use cache";
  cacheLife("hours");

  let events: EventDTO[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      cache: "force-cache",
    });

    if (response.ok) {
      const data = await response.json();
      events = data.events ?? [];
    }
  } catch (err) {
    console.error("fetch error:", err);
  }

  return (
    <div className="space-y-5">
      <h3>Featured Events</h3>

      <Suspense fallback={<p>Loading events...</p>}>
        <EventList events={events} />
      </Suspense>
    </div>
  );
};

export default EventsPage;
