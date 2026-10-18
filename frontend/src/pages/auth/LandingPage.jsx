import { Activity, HeartPulse, MessageCircle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../../styles/landing.css';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/landing" aria-label="Ansaea home">
          <Activity size={28} aria-hidden="true" />
          Ansaea
        </Link>
        <nav aria-label="Account">
          <Link className="landing-account-link" to={user ? '/dashboard' : '/login'}>
            {user ? 'Open dashboard' : 'Sign in'}
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-introduction" aria-labelledby="landing-title">
          <h1 id="landing-title">Your care, in one place.</h1>
          <p className="landing-description">
            Find a doctor, keep track of your health, and stay connected between appointments.
            Ansaea brings your everyday care together.
          </p>
          <div className="landing-actions">
            <Link className="btn btn-primary btn-lg" to={user ? '/dashboard' : '/register'}>
              {user ? 'Go to your dashboard' : 'Create an account'}
            </Link>
            {!user && (
              <Link className="landing-account-link" to="/login">
                I already have an account
              </Link>
            )}
          </div>
        </section>

        <section className="landing-care" aria-labelledby="landing-care-title">
          <h2 id="landing-care-title">From your first visit to your daily routine</h2>
          <ul className="landing-features">
            <li>
              <Video size={24} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Meet your doctor</h3>
                <p>Find specialists, book appointments, and join video consultations.</p>
              </div>
            </li>
            <li>
              <HeartPulse size={24} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Know your health</h3>
                <p>Keep your records, vitals, and well-being check-ins together.</p>
              </div>
            </li>
            <li>
              <MessageCircle size={24} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Keep the conversation going</h3>
                <p>Message your care team and keep up with your appointments.</p>
              </div>
            </li>
          </ul>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Healthcare that fits into your day.</p>
        <Link to="/intro">Take another look around</Link>
      </footer>
    </div>
  );
}
