import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event', // String reference prevents circular dependency imports
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate event exists before creating booking
// NOTE: We use async/await and THROW errors. We do not use 'next' callback.
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      // DYNAMIC IMPORT: Access the model from the mongoose instance
      // This prevents circular dependency issues if Event.ts imports Booking.ts
      const EventModel = models.Event;

      if (!EventModel) {
        // This usually happens if the Event model hasn't been initialized yet
        throw new Error('Event model not registered');
      }

      // Check existence. Use .lean() for performance since we don't need a full document
      const eventExists = await EventModel.findById(booking.eventId).select('_id').lean();

      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        throw error;
      }
    } catch (err: any) {
      // If we manually threw a validation error above, rethrow it so Mongoose sees it
      if (err.name === 'ValidationError') {
        throw err;
      }

      // If it's a database error (e.g. malformed ID), wrap it
      const validationError = new Error('Invalid event ID format or database error');
      validationError.name = 'ValidationError';
      throw validationError;
    }
  }
});

// --- INDEXES ---

// 1. Compound index for "Get all bookings for an event, newest first"
// OPTIMIZATION: This replaces the need for a standalone { eventId: 1 } index
BookingSchema.index({ eventId: 1, createdAt: -1 });

// 2. Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// 3. Enforce one booking per event per email (Duplicate prevention)
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

// Check models.Booking to prevent OverwriteModelError in Next.js hot reloading
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;