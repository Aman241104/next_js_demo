# DevEvent

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Aman241104/next_js_demo)

DevEvent is a full-stack web application built with Next.js that serves as a centralized hub for developer events. Users can discover, get details on, and book spots for various tech events like hackathons, meetups, and conferences. The platform also includes functionality for creating and managing event listings.

## Features

-   **Browse & Discover:** Homepage and a dedicated events page display a list of available developer events.
-   **Detailed Event View:** In-depth information for each event, including an overview, agenda, venue, time, and organizer details.
-   **Create Events:** A user-friendly form to add new events to the platform. Event banner images are uploaded and managed via Cloudinary.
-   **Book Your Spot:** A simple email-based booking system for any event, with data persisted in MongoDB.
-   **Find Similar Events:** The system suggests related events based on shared tags on each event's detail page.
-   **Dynamic UI:** The application features an interactive and visually appealing interface with animated light rays powered by OGL (a WebGL library).
-   **Analytics:** Integrated with PostHog for user analytics and error tracking.
-   **API Endpoints:** A set of RESTful API endpoints for creating and fetching event data.

## Tech Stack

-   **Framework:** Next.js 16 (App Router)
-   **Language:** TypeScript
-   **Database:** MongoDB with Mongoose
-   **Styling:** Tailwind CSS 4
-   **Image Management:** Cloudinary
-   **Frontend Libraries:** React 19, OGL (for WebGL effects)
-   **Analytics & Error Tracking:** PostHog

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v20 or later)
-   npm, yarn, or pnpm
-   MongoDB instance (local or cloud-based)
-   Cloudinary account

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/aman241104/next_js_demo.git
    cd next_js_demo
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables. Replace the placeholder values with your actual credentials.

    ```env
    # MongoDB Connection String
    MONGODB_URI=your_mongodb_connection_string

    # Base URL of the application
    NEXT_PUBLIC_BASE_URL=http://localhost:3000

    # Cloudinary Credentials for image uploads
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # PostHog for analytics
    NEXT_PUBLIC_POSTHOG_KEY=your_posthog_public_key
    ```
    *Note: The Cloudinary Node.js SDK automatically uses these environment variables for configuration.*

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application exposes the following API endpoints for managing events:

-   `GET /api/events`
    -   **Description:** Fetches a list of all events, sorted by creation date.
    -   **Response:** A JSON object containing a list of event documents.

-   `POST /api/events`
    -   **Description:** Creates a new event.
    -   **Body:** `multipart/form-data` containing event details (`title`, `description`, etc.) and an `image` file for the banner. `tags` and `agenda` should be JSON stringified arrays.
    -   **Response:** A JSON object with a success message and the newly created event document.

-   `GET /api/events/[slug]`
    -   **Description:** Fetches a single event by its unique slug.
    -   **Response:** A JSON object containing the requested event document.
