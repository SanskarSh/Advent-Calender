import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/Create your own Advent Calendar.png';
import './FormPage.css';
import { generateToken, uploadFile } from '../services/supabase';
import { Snowfall } from 'react-snowfall';

const POPULAR_TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Anchorage", "Pacific/Honolulu", "Europe/London", "Europe/Paris",
  "Europe/Berlin", "Europe/Rome", "Europe/Madrid", "Europe/Amsterdam",
  "Europe/Brussels", "Europe/Vienna", "Europe/Stockholm", "Europe/Oslo",
  "Europe/Copenhagen", "Europe/Dublin", "Europe/Lisbon", "Europe/Athens",
  "Europe/Helsinki", "Europe/Warsaw", "Europe/Prague", "Europe/Budapest",
  "Europe/Bucharest", "Asia/Dubai", "Asia/Tokyo", "Asia/Shanghai",
  "Asia/Hong_Kong", "Asia/Singapore", "Asia/Seoul", "Asia/Kolkata",
  "Asia/Bangkok", "Asia/Jakarta", "Asia/Manila", "Asia/Kuala_Lumpur",
  "Asia/Karachi", "Asia/Riyadh", "Asia/Tehran", "Asia/Jerusalem",
  "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane",
  "Australia/Perth", "Pacific/Auckland", "America/Toronto", "America/Vancouver",
  "America/Mexico_City", "America/Sao_Paulo", "America/Buenos_Aires",
  "America/Lima", "America/Bogota", "America/Santiago", "Africa/Cairo",
  "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi", "UTC"
];

const formatTimezoneOption = (timeZone) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(date);
    const offset = parts.find(part => part.type === 'timeZoneName')?.value || '';

    // Clean up timezone name for display
    const city = timeZone.split('/').pop().replace(/_/g, ' ');
    return `${city} (${offset})`;
  } catch (e) {
    return timeZone;
  }
};

function FormPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's timezone and ensure it's in the list
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const allTimezones = Array.from(new Set([userTimezone, ...POPULAR_TIMEZONES]));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timezone: userTimezone
  });

  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 80;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce character limits
    if (name === 'title' && value.length > MAX_TITLE_LENGTH) return;
    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) return;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = generateToken();
      const calendarData = {
        token,
        title: formData.title,
        description: formData.description,
        timezone: formData.timezone,
        daysCount: 24,
        createdAt: new Date().toISOString()
      };

      // Create a Blob for the JSON file
      const blob = new Blob([JSON.stringify(calendarData)], { type: 'application/json' });
      const file = new File([blob], 'calendar.json', { type: 'application/json' });

      // Upload to Supabase
      // Path: calendar/<token>/calendar.json
      await uploadFile(file, `calendar/${token}`, 'calendar.json');

      console.log('Calendar created:', token);
      navigate(`/calendar/${token}/editor`);
    } catch (error) {
      console.error('Failed to create calendar:', error);
      alert('Failed to create calendar. Please check your Supabase credentials in .env');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="form-page">
      <Snowfall color="#0000FF" />
      <div className="form-header">
        <a
          href="https://instagram.com/prishaCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
        >
          @prishacodes🎄
        </a>
      </div>

      <div className="form-card">
        {/* Header */}
        <div className="form-header-text">
          <img
            src={heroImage}
            alt="Create your own Advent Calendar"
            className="form-hero-image"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="calendar-form">
          {/* Calendar Title */}
          <div className="form-group">
            <div className="label-row">
              <label
                htmlFor="title"
                className="form-label"
              >
                Calendar Title
              </label>
              <span className="char-counter">{formData.title.length}/{MAX_TITLE_LENGTH}</span>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Our Christmas Countdown 🎄"
              required
              autoFocus
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <div className="label-row">
              <label
                htmlFor="description"
                className="form-label"
              >
                Description
              </label>
              <span className="char-counter">{formData.description.length}/{MAX_DESCRIPTION_LENGTH}</span>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Open a new door each day in December!"
              rows={3}
              className="form-textarea"
            />
          </div>

          {/* Timezone */}
          <div className="form-group">
            <label
              htmlFor="timezone"
              className="form-label"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="form-input"
            >
              {allTimezones.map((tz) => (
                <option key={tz} value={tz}>
                  {formatTimezoneOption(tz)}
                </option>
              ))}
            </select>
            <p className="helper-text">Doors will unlock at midnight in each person's local time</p>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Calendar'}
            </button>
          </div>
        </form>
      </div>

      <footer className="form-footer">
        Made with 💖 and ☕️ by{' '}
        <a
          href="https://instagram.com/prishaCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          @prishaCodes
        </a>
      </footer>
    </div>
  );
}

export default FormPage;
