import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Save2, Share } from 'iconsax-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Snowfall } from 'react-snowfall';
import './EditorPage.css';

const elementImages = import.meta.glob('/src/assets/elements/*.png', { eager: true, import: 'default' });

function EditorPage() {
  const location = useLocation();
  const { title, description } = location.state || {
    title: 'My Calendar',
    description: 'Customize each day of your advent calendar'
  };

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const shareLink = window.location.href; // You can customize this URL

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  // Generate array of 24 days
  const days = Array.from({ length: 24 }, (_, i) => i + 1);

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
          <h1>{title}</h1>
          <p className="subtitle">{description}</p>
        </div>
        <div className="header-actions">
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
                      value={shareLink}
                      readOnly
                      onClick={(e) => e.target.select()}
                    />
                    <button
                      className="btn-dialog-primary"
                      onClick={handleCopyLink}
                      style={{ flex: '0 0 auto' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.33333 10H2.66667C2.31304 10 1.97391 9.85952 1.72386 9.60947C1.47381 9.35943 1.33333 9.02029 1.33333 8.66667V2.66667C1.33333 2.31304 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31304 1.33333 2.66667 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60947 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copy link
                    </button>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Open
                  </button>
                  <button
                    className="btn-dialog-primary"
                    onClick={handleCopyLink}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.33333 10H2.66667C2.31304 10 1.97391 9.85952 1.72386 9.60947C1.47381 9.35943 1.33333 9.02029 1.33333 8.66667V2.66667C1.33333 2.31304 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31304 1.33333 2.66667 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60947 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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

            return (
              <Link key={day} to={`/editor/day/${day}`} className="day-link">
                <div className="calendar-day">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={`Day ${day}`}
                      className="calendar-day-image"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

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
