import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import heroImage from '../assets/Create your own Advent Calendar.png';
import createYourOwnImage from '../assets/create your own.png';
import adventCalendarImage from '../assets/advent calendar.png';
import './EntryPage.css';

import { Snowfall } from 'react-snowfall';

function EntryPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/create');
  };

  return (
    <div className="entry-page">
      <Snowfall color="#0000FF" />
      <div className="entry-header">
        <a
          href="https://instagram.com/prishaCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
        >
          @prishacodes🎄
        </a>
      </div>
      <div className="entry-content flex flex-col items-center">
        {/* Desktop Image */}
        <img
          src={heroImage}
          alt="Create your own Advent Calendar"
          className="hero-image"
        />

        {/* Mobile Images */}
        <div className="mobile-images flex flex-col items-center w-full max-w-[500px]">
          <img
            src={createYourOwnImage}
            alt="Create your own"
            className="w-full h-auto"
          />
          <img
            src={adventCalendarImage}
            alt="Advent Calendar"
            className="w-full h-auto"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleGetStarted}
          className="btn-cta border-2 border-primary text-primary hover:bg-primary hover:text-white"
        >
          create yours
        </Button>
      </div>
      <footer className="entry-footer">
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

export default EntryPage;
