import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/Eventcard";

// Use a light DTO type instead of importing mongoose types
type EventDTO = {
  _id?: string;
  slug?: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
};

const Page = async () => {
  "use cache";

  let events: EventDTO[] = [];

  try {
    const response = await fetch("/api/events", {
      // internal fetch, no BASE_URL, no localhost nonsense
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      events = data.events ?? [];
    } else {
      console.error(
        "Failed to fetch events on home page:",
        response.status,
        response.statusText
      );
    }
  } catch (err) {
    console.error("Fetch /api/events failed on home page:", err);
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
              <li
                key={event._id ?? event.slug ?? event.title}
                className="list-none"
              >
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="text-sm text-zinc-400">
              No events found. (Or the API/database is sleeping.)
            </p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Page;
