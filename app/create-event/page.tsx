// "use client";

// import { useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";

// const MODES = ["online", "offline", "hybrid"] as const;
// type Mode = (typeof MODES)[number];

// type EventFormState = {
//   title: string;
//   description: string;
//   overview: string;
//   venue: string;
//   location: string;
//   date: string;
//   time: string;
//   mode: Mode;
//   audience: string;
//   agendaText: string; // textarea → agenda[]
//   organizer: string;
//   tagsText: string;   // input → tags[]
// };

// const initialState: EventFormState = {
//   title: "",
//   description: "",
//   overview: "",
//   venue: "",
//   location: "",
//   date: "",
//   time: "",
//   mode: "offline",
//   audience: "",
//   agendaText: "",
//   organizer: "",
//   tagsText: "",
// };

// export default function CreateEventPage() {
//   const router = useRouter();

//   const [form, setForm] = useState<EventFormState>(initialState);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       if (!form.title.trim()) throw new Error("Title is required");
//       if (!form.description.trim()) throw new Error("Description is required");
//       if (!form.overview.trim()) throw new Error("Overview is required");
//       if (!form.venue.trim()) throw new Error("Venue is required");
//       if (!form.location.trim()) throw new Error("Location is required");
//       if (!form.date.trim()) throw new Error("Date is required");
//       if (!form.time.trim()) throw new Error("Time is required");
//       if (!form.audience.trim()) throw new Error("Audience is required");
//       if (!form.organizer.trim()) throw new Error("Organizer is required");
//       if (!form.agendaText.trim())
//         throw new Error("At least one agenda item is required");
//       if (!form.tagsText.trim())
//         throw new Error("At least one tag is required");
//       if (!imageFile) throw new Error("Event banner image is required");

//       const agenda = form.agendaText
//         .split("\n")
//         .map((x) => x.trim())
//         .filter(Boolean);

//       const tags = form.tagsText
//         .split(",")
//         .map((x) => x.trim())
//         .filter(Boolean);

//       const fd = new FormData();

//       fd.append("title", form.title.trim());
//       fd.append("description", form.description.trim());
//       fd.append("overview", form.overview.trim());
//       fd.append("venue", form.venue.trim());
//       fd.append("location", form.location.trim());
//       fd.append("date", form.date.trim());
//       fd.append("time", form.time.trim());
//       fd.append("mode", form.mode);
//       fd.append("audience", form.audience.trim());
//       fd.append("organizer", form.organizer.trim());

//       fd.append("agenda", JSON.stringify(agenda));
//       fd.append("tags", JSON.stringify(tags));

//       fd.append("image", imageFile);

//       const res = await fetch("/api/events", {
//         method: "POST",
//         body: fd, // DO NOT set Content-Type manually
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Failed to create event");
//       }

//       // reset & redirect
//       setForm(initialState);
//       setImageFile(null);
//       setImagePreview(null);

//       if (data?.event?.slug) {
//         router.push(`/events/${data.event.slug}`);
//       } else {
//         router.push("/events");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="min-h-screen">
//       <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10">
//         <div className="mb-8 text-center">
//           <h1 className="text-5xl font-semibold tracking-tight">
//             Create event
//           </h1>
//           <p className="mt-2 text-xl text-zinc-400">
//             Minimal details. Solid event.
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-1 flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur"
//           encType="multipart/form-data"
//         >
//           {/* Title */}
//           <div className="space-y-1">
//             <label className="text-sm text-zinc-300" htmlFor="title">
//               Title
//             </label>
//             <input
//               id="title"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               placeholder="DevEvent India 2025"
//             />
//           </div>

//           {/* Description + Overview */}
//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="description">
//                 Short description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//                 placeholder="One or two lines about the event."
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="overview">
//                 Overview
//               </label>
//               <textarea
//                 id="overview"
//                 name="overview"
//                 value={form.overview}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//                 placeholder="What people will learn / build."
//               />
//             </div>
//           </div>

//           {/* Image upload */}
//           <div className="space-y-2">
//             <label className="text-sm text-zinc-300">Banner image</label>
//             <div className="flex items-center gap-3">
//               <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950 px-4 py-3 text-xs text-zinc-400 hover:border-zinc-500">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageChange}
//                 />
//                 <span>Select image</span>
//               </label>
//               {imagePreview && (
//                 <div className="h-16 w-28 overflow-hidden rounded-lg border border-zinc-800">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//             <p className="text-xs text-zinc-500">
//               JPG/PNG, one clean banner is enough.
//             </p>
//           </div>

//           {/* Venue + Location */}
//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="venue">
//                 Venue
//               </label>
//               <input
//                 id="venue"
//                 name="venue"
//                 value={form.venue}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//                 placeholder="Main auditorium"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="location">
//                 Location
//               </label>
//               <input
//                 id="location"
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//                 placeholder="City, State"
//               />
//             </div>
//           </div>

//           {/* Date / Time / Mode */}
//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="date">
//                 Date
//               </label>
//               <input
//                 id="date"
//                 name="date"
//                 type="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="time">
//                 Time
//               </label>
//               <input
//                 id="time"
//                 name="time"
//                 type="time"
//                 value={form.time}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-sm text-zinc-300" htmlFor="mode">
//                 Mode
//               </label>
//               <select
//                 id="mode"
//                 name="mode"
//                 value={form.mode}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               >
//                 {MODES.map((m) => (
//                   <option key={m} value={m}>
//                     {m.charAt(0).toUpperCase() + m.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Audience */}
//           <div className="space-y-1">
//             <label className="text-sm text-zinc-300" htmlFor="audience">
//               Audience
//             </label>
//             <input
//               id="audience"
//               name="audience"
//               value={form.audience}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               placeholder="Students, professionals, beginners…"
//             />
//           </div>

//           {/* Agenda */}
//           <div className="space-y-1">
//             <label className="text-sm text-zinc-300" htmlFor="agendaText">
//               Agenda
//             </label>
//             <textarea
//               id="agendaText"
//               name="agendaText"
//               value={form.agendaText}
//               onChange={handleChange}
//               rows={4}
//               className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               placeholder={`10:00 - Check-in\n10:30 - Intro talk\n11:30 - Workshop`}
//             />
//             <p className="text-xs text-zinc-500">One item per line.</p>
//           </div>

//           {/* Organizer */}
//           <div className="space-y-1">
//             <label className="text-sm text-zinc-300" htmlFor="organizer">
//               Organizer
//             </label>
//             <input
//               id="organizer"
//               name="organizer"
//               value={form.organizer}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               placeholder="Dev club / community / org"
//             />
//           </div>

//           {/* Tags */}
//           <div className="space-y-1">
//             <label className="text-sm text-zinc-300" htmlFor="tagsText">
//               Tags
//             </label>
//             <input
//               id="tagsText"
//               name="tagsText"
//               value={form.tagsText}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-500"
//               placeholder="react, hackathon, web"
//             />
//             <p className="text-xs text-zinc-500">
//               Comma separated. Used for filtering & similar events.
//             </p>
//           </div>

//           {error && (
//             <p className="text-sm text-red-400">
//               {error}
//             </p>
//           )}

//           <div className="mt-2 flex justify-end">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-white disabled:opacity-60"
//             >
//               {isSubmitting ? "Creating…" : "Create event"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page