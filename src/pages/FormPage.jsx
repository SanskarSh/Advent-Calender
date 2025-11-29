import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/Create your own Advent Calendar.png';
import './FormPage.css';

import { Snowfall } from 'react-snowfall';

function FormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/calendar', {
      state: {
        title: formData.title,
        description: formData.description,
        timezone: formData.timezone
      }
    });
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
              <option value="America/New_York">Eastern Time (UTC-05:00)</option>
              <option value="America/Chicago">Central Time (UTC-06:00)</option>
              <option value="America/Denver">Mountain Time (UTC-07:00)</option>
              <option value="America/Los_Angeles">Pacific Time (UTC-08:00)</option>
              <option value="America/Anchorage">Alaska Time (UTC-09:00)</option>
              <option value="Pacific/Honolulu">Hawaii Time (UTC-10:00)</option>
              <option value="Europe/London">London (UTC+00:00)</option>
              <option value="Europe/Paris">Paris (UTC+01:00)</option>
              <option value="Europe/Berlin">Berlin (UTC+01:00)</option>
              <option value="Europe/Rome">Rome (UTC+01:00)</option>
              <option value="Europe/Madrid">Madrid (UTC+01:00)</option>
              <option value="Europe/Amsterdam">Amsterdam (UTC+01:00)</option>
              <option value="Europe/Brussels">Brussels (UTC+01:00)</option>
              <option value="Europe/Vienna">Vienna (UTC+01:00)</option>
              <option value="Europe/Stockholm">Stockholm (UTC+01:00)</option>
              <option value="Europe/Oslo">Oslo (UTC+01:00)</option>
              <option value="Europe/Copenhagen">Copenhagen (UTC+01:00)</option>
              <option value="Europe/Dublin">Dublin (UTC+00:00)</option>
              <option value="Europe/Lisbon">Lisbon (UTC+00:00)</option>
              <option value="Europe/Athens">Athens (UTC+02:00)</option>
              <option value="Europe/Helsinki">Helsinki (UTC+02:00)</option>
              <option value="Europe/Warsaw">Warsaw (UTC+01:00)</option>
              <option value="Europe/Prague">Prague (UTC+01:00)</option>
              <option value="Europe/Budapest">Budapest (UTC+01:00)</option>
              <option value="Europe/Bucharest">Bucharest (UTC+02:00)</option>
              <option value="Asia/Dubai">Dubai (UTC+04:00)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+09:00)</option>
              <option value="Asia/Shanghai">Shanghai (UTC+08:00)</option>
              <option value="Asia/Hong_Kong">Hong Kong (UTC+08:00)</option>
              <option value="Asia/Singapore">Singapore (UTC+08:00)</option>
              <option value="Asia/Seoul">Seoul (UTC+09:00)</option>
              <option value="Asia/Kolkata">India (UTC+05:30)</option>
              <option value="Asia/Bangkok">Bangkok (UTC+07:00)</option>
              <option value="Asia/Jakarta">Jakarta (UTC+07:00)</option>
              <option value="Asia/Manila">Manila (UTC+08:00)</option>
              <option value="Asia/Kuala_Lumpur">Kuala Lumpur (UTC+08:00)</option>
              <option value="Asia/Karachi">Karachi (UTC+05:00)</option>
              <option value="Asia/Riyadh">Riyadh (UTC+03:00)</option>
              <option value="Asia/Tehran">Tehran (UTC+03:30)</option>
              <option value="Asia/Jerusalem">Jerusalem (UTC+02:00)</option>
              <option value="Australia/Sydney">Sydney (UTC+11:00)</option>
              <option value="Australia/Melbourne">Melbourne (UTC+11:00)</option>
              <option value="Australia/Brisbane">Brisbane (UTC+10:00)</option>
              <option value="Australia/Perth">Perth (UTC+08:00)</option>
              <option value="Pacific/Auckland">Auckland (UTC+13:00)</option>
              <option value="America/Toronto">Toronto (UTC-05:00)</option>
              <option value="America/Vancouver">Vancouver (UTC-08:00)</option>
              <option value="America/Mexico_City">Mexico City (UTC-06:00)</option>
              <option value="America/Sao_Paulo">São Paulo (UTC-03:00)</option>
              <option value="America/Buenos_Aires">Buenos Aires (UTC-03:00)</option>
              <option value="America/Lima">Lima (UTC-05:00)</option>
              <option value="America/Bogota">Bogota (UTC-05:00)</option>
              <option value="America/Santiago">Santiago (UTC-03:00)</option>
              <option value="Africa/Cairo">Cairo (UTC+02:00)</option>
              <option value="Africa/Johannesburg">Johannesburg (UTC+02:00)</option>
              <option value="Africa/Lagos">Lagos (UTC+01:00)</option>
              <option value="Africa/Nairobi">Nairobi (UTC+03:00)</option>
              <option value="UTC">UTC</option>
            </select>
            <p className="helper-text">Doors will unlock at midnight in each person's local time</p>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="submit"
              className="btn-submit"
            >
              Create Calendar
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
