import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());

    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    const rawTags = formData.get("tags");
    const rawAgenda = formData.get("agenda");

    if (typeof rawTags !== "string" || typeof rawAgenda !== "string") {
      return NextResponse.json(
        { message: "Tags and agenda are required" },
        { status: 400 }
      );
    }

    let tags: string[];
    let agenda: string[];

    try {
      tags = JSON.parse(rawTags);
      agenda = JSON.parse(rawAgenda);
    } catch {
      return NextResponse.json(
        { message: "Invalid tags or agenda format" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        )
        .end(buffer);
    });

    const imageUrl = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({
      title: event.title,
      description: event.description,
      overview: event.overview,
      venue: event.venue,
      location: event.location,
      date: event.date,
      time: event.time,
      mode: event.mode,
      audience: event.audience,
      organizer: event.organizer,
      tags,
      agenda,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error("[POST /api/events] Error:", e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
