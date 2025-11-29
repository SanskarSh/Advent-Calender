import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Save2, Share, Lock } from 'iconsax-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Snowfall } from 'react-snowfall';
import { fetchJson, listFiles } from '../services/supabase';
import './EditorPage.css';

const elementImages = import.meta.glob('/src/assets/elements/*.png', { eager: true, import: 'default' });

function EditorPage() {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = location.pathname.endsWith('/editor');

  const [calendarData, setCalendarData] = useState(null);
  const [dayManifests, setDayManifests] = useState({});
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // View mode specific state
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [selectedLockedDay, setSelectedLockedDay] = useState(null);

  // Construct share link (view mode URL)
  const shareLink = `${window.location.origin}/calendar/${token}`;

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        // Fetch calendar metadata
        const data = await fetchJson(token, 'calendar.json');
        setCalendarData(data);

        // Check for day manifests (optimized)
        // List the calendar folder to see which days exist
        const files = await listFiles(`calendar/${token}`);
        const manifests = {};

        // Filter for folders/files that look like 'dayX'
        // Note: Supabase list returns names. If day1 is a folder, it appears as 'day1'.
        // If we uploaded day1/manifest.json, 'day1' should be in the list.
        const dayFolders = files.filter(name => name.startsWith('day'));

        // Fetch manifests only for existing days
        await Promise.all(dayFolders.map(async (folderName) => {
          const dayNum = parseInt(folderName.replace('day', ''));
          if (!isNaN(dayNum)) {
            const manifest = await fetchJson(token, `${folderName}/manifest.json`);
            if (manifest) {
              manifests[dayNum] = true; // Mark as existing
            }
          }
        }));

        setDayManifests(manifests);

      } catch (error) {
        console.error('Error loading calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const isDayUnlocked = (day) => {
    if (!calendarData) return false;

    // In Edit Mode, everything is accessible
    if (isEditMode) return true;

    const now = new Date();
    // Use calendar timezone if available, else local
    const timeZone = calendarData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get current date in target timezone
    const targetDateStr = now.toLocaleDateString('en-US', { timeZone });
    const targetDate = new Date(targetDateStr);

    // Unlock condition: Month is December and Day >= day number
    // Or if year is past the creation year? 
    // For simplicity: If it's December of the current year (or any year?)
    // Let's assume strict Advent Calendar rules: Dec 1-24 of the current year.
    // But for testing, we might want to be flexible.

    // Let's use a simple check: Is it Dec <day> or later?
    const currentMonth = targetDate.getMonth(); // 0-indexed, Dec is 11
    const currentDay = targetDate.getDate();

    // Unlock if it's December (11) and date >= day
    // OR if it's past December (e.g. Jan next year)
    if (currentMonth > 11) return true; // Past December
    if (currentMonth < 11) return false; // Before December
    return currentDay >= day;
  };

  const handleDayClick = (e, day) => {
    if (isEditMode) return; // Link handles navigation

    if (!isDayUnlocked(day)) {
      e.preventDefault();
      setSelectedLockedDay(day);
      setLockedDialogOpen(true);
    } else if (!dayManifests[day]) {
      // If unlocked but empty, maybe show a message?
      // Or just let them go to an empty page?
      // For now, let them go.
    }
  };

  // Generate array of 24 days
  const days = Array.from({ length: 24 }, (_, i) => i + 1);

  if (loading) {
    return <div className="loading-screen">Loading your calendar...</div>;
  }

  if (!calendarData) {
    return <div className="error-screen">Calendar not found.</div>;
  }

  return (
    <div className="editor-page">
      <Snowfall color="#0000FF" />
      <div className="editor-header">
        <a
          href="https://instagram.com/prishaCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
        >
          @prishacodes🎄
        </a>
        <div className="editor-title-section">
          <h1>{calendarData.title}</h1>
          <p className="subtitle">{calendarData.description}</p>
        </div>
        <div className="header-actions">
          {isEditMode && (
            <Dialog.Root open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="btn-share">
                  <Save2 className="btn-icon" size="18" variant="Outline" color="currentColor" />
                  Save to edit
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                  <Dialog.Title className="dialog-title">
                    Save this link to edit your calendar later
                  </Dialog.Title>
                  <Dialog.Description className="dialog-description" style={{ fontSize: '1.2em' }}>
                    Make sure to keep this link safe, you will need it to make changes.
                  </Dialog.Description>

                  <div className="dialog-actions">
                    <div className="dialog-input-group">
                      <input
                        type="text"
                        className="dialog-input"
                        value={window.location.href}
                        readOnly
                        onClick={(e) => e.target.select()}
                      />
                      <button
                        className="btn-dialog-primary"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        style={{ flex: '0 0 auto' }}
                      >
                        Copy link
                      </button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}

          <Dialog.Root open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <Dialog.Trigger asChild>
              <button className="btn-share">
                <Share className="btn-icon" size="18" variant="Outline" color="currentColor" />
                Share
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="dialog-content">
                <Dialog.Title className="dialog-title" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                  Share Your Calendar
                </Dialog.Title>
                <Dialog.Description className="dialog-description" style={{ fontSize: '1.2em' }}>
                  This is a view-only link. Share with your loved one(s)
                </Dialog.Description>

                <div className="dialog-actions">
                  <button
                    className="btn-dialog-secondary"
                    onClick={() => window.open(shareLink, '_blank')}
                  >
                    Open
                  </button>
                  <button
                    className="btn-dialog-primary"
                    onClick={handleCopyLink}
                  >
                    Copy link
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <div className="editor-container">
        <div className="calendar-grid">
          {days.map((day) => {
            const imagePath = `/src/assets/elements/${day}.png`;
            const imageSrc = elementImages[imagePath];
            const isUnlocked = isDayUnlocked(day);
            const hasContent = dayManifests[day];

            return (
              <Link
                key={day}
                to={isEditMode ? `/calendar/${token}/edit/day/${day}` : `/calendar/${token}/day/${day}`}
                className={`day-link ${!isUnlocked && !isEditMode ? 'locked' : ''}`}
                onClick={(e) => handleDayClick(e, day)}
              >
                <div className="calendar-day">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={`Day ${day}`}
                      className="calendar-day-image"
                      style={{ filter: !isUnlocked && !isEditMode ? 'grayscale(100%) brightness(50%)' : 'none' }}
                    />
                  )}
                  {!isUnlocked && !isEditMode && (
                    <div className="lock-overlay">
                      <Lock size="32" color="#fff" variant="Bold" />
                    </div>
                  )}
                  {isEditMode && hasContent && (
                    <div className="status-indicator customized">Customized</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Locked Dialog */}
      <Dialog.Root open={lockedDialogOpen} onOpenChange={setLockedDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">
              Day {selectedLockedDay} is Locked! 🔒
            </Dialog.Title>
            <Dialog.Description className="dialog-description">
              You can't open this door yet. Come back on December {selectedLockedDay}!
            </Dialog.Description>
            <div className="dialog-actions">
              <button className="btn-dialog-primary" onClick={() => setLockedDialogOpen(false)}>
                Okay
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <footer className="editor-footer">
        Made with 💖 and ☕️ by{' '}
        <a
          href="https://instagram.com/prishaCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          @prishacodes
        </a>
      </footer>
    </div>
  );
}

export default EditorPage;
