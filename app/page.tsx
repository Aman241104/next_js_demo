import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/Eventcard";
import { cacheLife } from "next/cache";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Keep UI types dumb; don't import mongoose types here
type EventDTO = {
  _id: string;
  slug: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
};

const Page = async () => {
  "use cache";
  cacheLife("hours");

  let events: EventDTO[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch /api/events on home:",
        response.status,
        response.statusText
      );
    } else {
      // Guard JSON parsing so HTML error pages don't crash build
      const data = (await response.json()) as { events?: EventDTO[] };
      events = data.events ?? [];
    }
  } catch (err) {
    console.error("Error fetching /api/events on home:", err);
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event._id} className="list-none">
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="text-sm text-zinc-400">
              No events found. Either DB is empty or the API returned an error.
            </p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Page;
