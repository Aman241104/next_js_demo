import Eventcard from "@/components/Eventcard";

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

const EventsPage = async () => {
  let events: EventDTO[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      // let Next handle caching via revalidate, no "use cache" drama
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = (await response.json()) as { events?: EventDTO[] };
      events = data.events ?? [];
    } else {
      console.error(
        "Failed to fetch /api/events:",
        response.status,
        response.statusText
      );
    }
  } catch (err) {
    console.error("Fetch /api/events failed:", err);
  }

  return (
    <div className="space-y-5">
      <h3>Featured Events</h3>

      <ul className="events">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id} className="list-none">
              <Eventcard {...event} />
            </li>
          ))
        ) : (
          <p className="text-sm text-zinc-400">
            No events found. Either DB is empty or /api/events failed.
          </p>
        )}
      </ul>
    </div>
  );
};

export default EventsPage;
