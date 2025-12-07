import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/Eventcard";

type EventDTO = {
  _id: string;
  slug: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
};

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    return `https://${raw}`;
  }

  return raw;
}

const BASE_URL = getBaseUrl();

const Page = async () => {
  let events: EventDTO[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      // normal ISR-style caching instead of "use cache"
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = (await response.json()) as { events?: EventDTO[] };
      events = data.events ?? [];
    } else {
      console.error(
        "Failed to fetch /api/events on home:",
        response.status,
        response.statusText
      );
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
              No events found. Either DB is empty or /api/events failed.
            </p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Page;
