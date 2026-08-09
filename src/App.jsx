import { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./components/EventForm";

const API_URL = "http://localhost:8000/events";

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");

  async function fetchEvents() {
    try {
      const response = await axios.get(API_URL);
      setEvents(response.data);
    } catch {
      setMessage(
        "Could not connect to the API. Start the backend on port 8000."
      );
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function saveEvent(event) {
    try {
      if (selectedEvent) {
        await axios.put(`${API_URL}/${selectedEvent.id}`, event);
        setMessage("Event updated successfully.");
      } else {
        await axios.post(API_URL, event);
        setMessage("Event created successfully.");
      }

      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not save the event."
      );
    }
  }

  async function deleteEvent(id) {
    const shouldDelete = window.confirm(
      "Delete this event? This cannot be undone."
    );

    if (!shouldDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Event deleted.");

      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }

      fetchEvents();
    } catch {
      setMessage("Could not delete the event.");
    }
  }

  function editEvent(event) {
    setSelectedEvent(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <header>
        <p className="eyebrow">HACKCONNECT</p>

        <h1>Organize the next great hackathon.</h1>

        <p>
          Create, edit, view, and delete your fest events from one dashboard.
        </p>
      </header>

      {message && <p className="message">{message}</p>}

      <EventForm
        selectedEvent={selectedEvent}
        onSave={saveEvent}
        onCancel={() => setSelectedEvent(null)}
      />

      <section className="events">
        <h2>
          Scheduled events <span>{events.length}</span>
        </h2>

        {events.length === 0 ? (
          <p>No events yet. Create the first one above.</p>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <article key={event.id}>
                <div className="card-top">
                  <span
                    className={
                      event.status === "Open" ? "open" : "closed"
                    }
                  >
                    {event.status}
                  </span>

                  <span>{event.date}</span>
                </div>

                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <dl>
                  <div>
                    <dt>Venue</dt>
                    <dd>{event.venue}</dd>
                  </div>

                  <div>
                    <dt>Capacity</dt>
                    <dd>{event.maxTeams} teams</dd>
                  </div>
                </dl>

                <div className="card-actions">
                  <button onClick={() => editEvent(event)}>Edit</button>

                  <button
                    className="danger"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}