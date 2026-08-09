import { useEffect, useState } from "react";

const blankEvent = { title: "", description: "", date: "", venue: "", maxTeams: "", status: "Open" };

export default function EventForm({ selectedEvent, onSave, onCancel }) {
  const [event, setEvent] = useState(blankEvent);

  useEffect(() => setEvent(selectedEvent ? { ...selectedEvent } : blankEvent), [selectedEvent]);

  function handleChange(e) {
    setEvent((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!event.title.trim() || !event.description.trim() || !event.date || !event.venue.trim() || Number(event.maxTeams) < 1) {
      return alert("Please complete every field. Team capacity must be at least 1.");
    }
    onSave(event);
    if (!selectedEvent) setEvent(blankEvent);
  }

  return <section className="form-card">
    <h2>{selectedEvent ? "Edit hackathon event" : "Create a hackathon event"}</h2>
    <form onSubmit={handleSubmit}>
      <label>Event title<input name="title" value={event.title} onChange={handleChange} placeholder="HackConnect 2026" /></label>
      <label>Description<textarea name="description" value={event.description} onChange={handleChange} placeholder="What will participants build?" rows="3" /></label>
      <div className="two-columns">
        <label>Date<input type="date" name="date" value={event.date} onChange={handleChange} /></label>
        <label>Venue<input name="venue" value={event.venue} onChange={handleChange} placeholder="Innovation Lab" /></label>
      </div>
      <div className="two-columns">
        <label>Maximum teams<input type="number" min="1" name="maxTeams" value={event.maxTeams} onChange={handleChange} /></label>
        <label>Registration status<select name="status" value={event.status} onChange={handleChange}><option>Open</option><option>Closed</option></select></label>
      </div>
      <div className="form-actions"><button type="submit">{selectedEvent ? "Update event" : "Create event"}</button>{selectedEvent && <button type="button" className="secondary" onClick={onCancel}>Cancel edit</button>}</div>
    </form>
  </section>;
}
