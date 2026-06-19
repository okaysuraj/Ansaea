import React, { useState, useEffect } from 'react';
import '../landing.css';

export default function LandingPage({ AuthComponent, onNavigateToSignup }) {
  const [showAuth, setShowAuth] = useState(false);

  // Micro-interactions and scroll reveal
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.transition = 'all 0.7s ease-out';
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-body">
      {/* TopNavBar */}
      <header className="landing-header">
        <div className="max-w-container-max header-container">
          <a className="header-logo" href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} /> Ansaea
          </a>
          <nav className="header-nav">
            <a className="nav-link active font-label-caps" href="#">Biomarkers</a>
            <a className="nav-link font-label-caps" href="#">Reviews</a>
            <a className="nav-link font-label-caps" href="#">FAQs</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="nav-link font-label-caps" 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setShowAuth(true)}
            >
              Log in
            </button>
            <button className="btn-solid" onClick={onNavigateToSignup}>Become a member</button>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section className="max-w-container-max hero-section">
          <div className="hero-content">
            <h1 className="font-display-lg text-primary-landing">
              Get better at being<br/>healthy, every year
            </h1>
            <p className="font-headline-lg text-on-surface-variant" style={{ maxWidth: '500px', fontSize: '24px' }}>
              100+ biomarkers. A plan built around you. Everything you need to act on it.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-solid btn-solid-lg" onClick={onNavigateToSignup}>Become a member</button>
              <button className="btn-outline">See what we test</button>
            </div>
          </div>
          <div className="hero-image-container">
            <img 
              alt="Modern medical interface showing a rotating 3D digital twin" 
              className="hero-image" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsSlp8GyUJd7S5UZmq7fkxa3kZkY5V9HebCwf1B4gUYLUxcUWgf_cRT50AlOkUInGBcB5qZGURTvhVUopSKEkV9QT3T8vmTzA8UwuSfYzfzOeSeBvaH7v9-dyYxTcC-saQQalzJoNH5ak5IWa2PNEencJzrtm8J_L1kDQePvRo5nXAFNyr-MoXB__MLkmjn7zCuzHPUX7Cw1UbDkPF_kxlk7LIGcQCwWL9LrnALHYzFk9bMhKchiC-cRx9D"
            />
          </div>
        </section>

        {/* Trust Bar */}
        <section className="trust-bar">
          <div className="max-w-container-max trust-grid">
            <div className="trust-item">
              <span className="font-label-caps text-on-surface-variant">Whole body check</span>
              <p className="font-headline-lg text-primary-landing" style={{ fontSize: '24px' }}>Detect 1,000+ conditions</p>
            </div>
            <div className="trust-item">
              <span className="font-label-caps text-on-surface-variant">Accessible</span>
              <p className="font-headline-lg text-primary-landing" style={{ fontSize: '24px' }}>Starts at $199/year</p>
            </div>
            <div className="trust-item">
              <span className="font-label-caps text-on-surface-variant">Trusted</span>
              <p className="font-headline-lg text-primary-landing" style={{ fontSize: '24px' }}>1M biomarkers tested</p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="max-w-container-max section-padding">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="font-display-lg text-primary-landing" style={{ fontSize: '48px', marginBottom: '1rem' }}>How it works</h2>
            <p className="font-headline-lg text-on-surface-variant" style={{ fontSize: '24px' }}>It starts with an advanced health check, then so much more.</p>
          </div>
          <div className="how-it-works-grid">
            {[
              {step: "1", title: "Test your baseline", text: "One simple blood draw to measure 100+ biomarkers."},
              {step: "2", title: "Results explained", text: "Get a complete picture of your health data in one secure location."},
              {step: "3", title: "Build your protocol", text: "AI builds evidence-backed protocols, informed by your data."},
              {step: "4", title: "Access everything", text: "Take action, access everything you need, then retest."}
            ].map((item, i) => (
              <div key={i} className="step-card">
                <div className="step-number font-headline-lg">{item.step}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 className="font-headline-lg text-primary-landing" style={{ fontSize: '24px' }}>{item.title}</h3>
                  <p className="text-on-surface-variant">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Props - Bento Grid */}
        <section className="max-w-container-max section-padding">
          <div className="bento-grid">
            {/* 100+ Biomarkers */}
            <div className="bento-item bento-col-7" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="font-headline-lg text-primary-landing" style={{ marginBottom: '1rem' }}>Every membership starts with 100+ biomarkers</h3>
                <p className="text-on-surface-variant" style={{ maxWidth: '400px' }}>A full body test with a quick 10-min lab draw to get started. Test at 2,000+ Quest locations or at-home.</p>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <span className="pill-tag font-label-caps">HORMONES</span>
                <span className="pill-tag font-label-caps">HEART HEALTH</span>
                <span className="pill-tag font-label-caps">METABOLISM</span>
                <span className="pill-tag font-label-caps">VITAMINS</span>
              </div>
            </div>

            {/* Data Dashboard */}
            <div className="bento-item bento-col-5 dark">
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 className="font-headline-lg" style={{ marginBottom: '1rem' }}>All your health data, in one place</h3>
                <p style={{ opacity: 0.8 }}>Sync past labs and wearables (Oura, Whoop, Apple Health) to connect the dots.</p>
              </div>
              <img 
                alt="Health dashboard mockup" 
                style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '80%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                src="https://lh3.googleusercontent.com/aida/AP1WRLvE9fpspCRPaBkWkVR8ATeJVr7gt9DoCK-k_VYptCu8BftnBxYfZUiMrDnK2g-LEQ7YVaO9lPrnz57aOAgjM95GHGZzYzlWUsfbns2iFyr7jBS7OCLfTRgdZP2W0J2XcN4wP3MPSFwj4SpPrs9d1hhwIa9Qf0GduEA3Ja8avtIex4eommwYrY7WX9mGChfeHyZ7Ro-YwLqRdEgX-pNp2Z9txHUdaEqHbN6cJc5JFaznu0lDkNJh3ayr7j8i"
              />
            </div>

            {/* Protocol */}
            <div className="bento-item bento-col-5" style={{ backgroundColor: 'var(--color-clinical-grey)' }}>
              <h3 className="font-headline-lg text-primary-landing" style={{ marginBottom: '1rem' }}>Personalized health protocol</h3>
              <p className="text-on-surface-variant" style={{ marginBottom: '2rem' }}>A clinician-grade action plan after every test with insight on exactly what to do next.</p>
              <div>
                <div className="check-item">
                  <span className="material-symbols-outlined text-status-green">check_circle</span>
                  <span className="font-label-caps">OPTIMIZE SLEEP HYGIENE</span>
                </div>
                <div className="check-item">
                  <span className="material-symbols-outlined text-status-orange">clinical_notes</span>
                  <span className="font-label-caps">VITAMIN D3 SUPPLEMENTATION</span>
                </div>
              </div>
            </div>

            {/* Care Team */}
            <div className="bento-item bento-col-7" style={{ display: 'flex', gap: '2rem', padding: '0', alignItems: 'stretch' }}>
              <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="font-headline-lg text-primary-landing" style={{ marginBottom: '1rem' }}>Message your private care team 24/7</h3>
                <p className="text-on-surface-variant">A private care-team in your pocket at all times for any health questions or concerns.</p>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <img 
                  alt="Smartphone displaying AI chat" 
                  style={{ position: 'absolute', height: '100%', width: '100%', objectFit: 'cover' }}
                  src="https://lh3.googleusercontent.com/aida/AP1WRLu-EUqAWu-ti3HBvtgNHvIs1YMsieU_8IukQ0OAq-a9PNhcmyLpJbXQA4gOkWiili3N-5BQfkk7yUj-ZhE1briLI2BDkkRN8vVEpfhq-QnOqCVj2ZaDVkUG75YN7VMTPGxWMdMa21mMhLvSzTuPaLlNc4QJnM2FLL0DcE42D7rznI3PimefHWB8lgoCSOU8JsJGOhiyTAEdZSQ6UF3330FJCj4BdNxUB42BPV22Rq9bhn0Fd-jIAT21q2rX"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="max-w-container-max section-padding">
          <div className="pricing-card">
            <span className="pill-tag font-label-caps text-primary-landing" style={{ marginBottom: '1.5rem', background: 'var(--color-surface)', fontSize: '12px' }}>HSA / FSA ELIGIBLE</span>
            <h2 className="font-display-lg text-primary-landing" style={{ fontSize: '48px' }}>What could cost $10,000 is now $199</h2>
            <p className="font-headline-lg text-on-surface-variant" style={{ fontSize: '24px', marginTop: '0.5rem' }}>$199 / year*</p>
            
            <div className="pricing-grid">
              {[
                "100+ biomarker test", "Detect early risk factors", "Health data upload", "Biological age", 
                "Personalized protocol", "Wearable connection", "Advanced AI chat", "24/7 care team access",
                "Access peptides & supplements", "Access add-on specialty tests"
              ].map((perk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined text-status-green" style={{ fontSize: '20px' }}>check</span>
                  <span className="font-body-md" style={{ fontWeight: 500, color: 'var(--color-primary-landing)' }}>{perk}</span>
                </div>
              ))}
            </div>
            
            <button className="btn-solid btn-solid-lg" style={{ marginBottom: '1rem' }} onClick={onNavigateToSignup}>Become a member</button>
            <p style={{ fontSize: '10px', color: 'var(--color-surface-variant)', opacity: 0.6 }}>Billed annually. Cancel anytime. Pricing may vary for NY/NJ members.</p>
          </div>
        </section>

        {/* Medical Advisory Board */}
        <section className="trust-bar section-padding">
          <div className="max-w-container-max">
            <div style={{ marginBottom: '4rem' }}>
              <span className="font-label-caps text-on-surface-variant">MEDICAL ADVISORY BOARD</span>
              <h2 className="font-display-lg text-primary-landing" style={{ fontSize: '48px', marginTop: '1rem', maxWidth: '800px' }}>Led by doctors with 40 years of health expertise</h2>
            </div>

            <div className="advisory-grid">
              {[
                { name: "Dr Anant Vinjamoori, MD", role: "CHIEF LONGEVITY OFFICER", bio: "Board-certified longevity physician. Previously product leader at Virta Health.", img: "https://lh3.googleusercontent.com/aida/AP1WRLvePGQ5g3vgRpt9PvqWy1mEMn2_rwl9p1JvSoqqf42xwla6o2KrI3gcY32kEM37e1F_E6rKbRYLDy697VK6_8MvCmsWfgEg_H0J2602iwqRT8DcNXfDyXo816Fi7tNwz0jySN8iATvhiF5dz5tqL-QI_wfDQ2d7F1xDGCBm-G9KRq0fASLOpaxOTt5iuHotbSsTcwEt1bz1MBgBnq5JfT5-Pez8319tcC-vys_5Or1-xVVUN5qsVC-CzZ5-" },
                { name: "Dr Leigh Erin Connealy, MD", role: "FOUNDER, CENTRE FOR NEW MEDICINE", bio: "Leads the largest integrative medical clinic in North America. Pioneer in oncology.", img: "https://lh3.googleusercontent.com/aida/AP1WRLsACU7M6KPc4BZxxj3o8-zApKGcSEMFlIOuWHD7zErRF-Cr2uw4md9qFepKoRGoNg74-HGB0TjkWEgp3YkWK6FlA6ADy0ebfFZryRSWv_QEzF7Y8JnaYiDgVJnUKWBcaY9N4rqB6ibAyBiJm-O0Qz1oU5GTn6_dXW9Y-WmrcCnWAgXZl7fkcoGttLYowEfAq3Q_AX3L13E90tEgaUonG9VWBzQ8PB4EdqDtTP5JzWDDnHqKIsc7ki5tArDZ" },
                { name: "Dr Robert Lufkin", role: "UCLA MEDICAL PROFESSOR", bio: "Leading voice on metabolic health and longevity. NYT Bestselling Author.", img: "https://lh3.googleusercontent.com/aida/AP1WRLtZ_44Pq4ec7gva-qYVqda2sfaSmhtnLnEbI7xnC9uB_aA8ZtA_KivcBjNflry3cmb5dZ0SvvdtD8ARDDoaTbvzZJkt0CdZsMGej1FT-2dodu0-bZMq_PKnbTht3NKWSErmJMh0tijSeGvBi7mQ3-TA1z1D9pUMqXV64pvzm0zmW7OwmTyflCgI_lpHiQyHR5L6mE_1V4_AMu_jjT-1bogI83sMxyKO2GlnBE9DVIg37A0XOsI59TVfuMUK" },
                { name: "Dr Abe Malkin, MD", role: "FOUNDER, CONCIERGE MD", bio: "Leads a nationwide medical practice and mobile IV therapeutics company.", icon: "person" }
              ].map((doc, i) => (
                <div key={i} className="doctor-card">
                  {doc.img ? (
                    <img alt={doc.name} src={doc.img} className="doctor-image" />
                  ) : (
                    <div className="doctor-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--color-surface-variant)' }}>{doc.icon}</span>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h4 className="font-headline-lg text-primary-landing" style={{ fontSize: '18px' }}>{doc.name}</h4>
                    <p className="font-label-caps text-on-surface-variant" style={{ fontSize: '10px' }}>{doc.role}</p>
                    <p className="text-on-surface-variant" style={{ fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{doc.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-container-max section-padding" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 className="font-display-lg text-primary-landing" style={{ fontSize: '48px', marginBottom: '1.5rem' }}>Changing outcomes and lives across the nation</h2>
            <p className="font-headline-lg text-on-surface-variant" style={{ fontSize: '24px' }}>60% of members said Ansaea identified something previously missed or overlooked by a doctor.</p>
          </div>
          <div className="testimonials-scroll">
            {[
              {name: "Camelia, 29", quote: "Doctors refused to test her fertility, so she took control of her health."},
              {name: "Thach, 37", quote: "His Ansaea test caught risks that two doctors missed."},
              {name: "Joel, 55", quote: "Ansaea gave him a supplement plan that saved him time and money."}
            ].map((member, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--color-primary-landing)' }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>star</span>
                  ))}
                </div>
                <p style={{ fontWeight: 500, color: 'var(--color-primary-landing)' }}>"{member.quote}"</p>
                <p className="font-label-caps text-on-surface-variant" style={{ marginTop: 'auto' }}>{member.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
          <div className="faq-container">
            <h2 className="font-display-lg text-primary-landing" style={{ fontSize: '36px', textAlign: 'center', marginBottom: '3rem' }}>Frequently asked questions</h2>
            <div style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
              {[
                "How is Ansaea better than a standard physical?",
                "What biomarkers do you test?",
                "How safe and secure is my data?",
                "How does Ansaea turn labs into a protocol?",
                "Isn't this just another AI chatbot?"
              ].map((q, i) => (
                <button key={i} className="faq-item">
                  <span className="font-headline-lg text-primary-landing" style={{ fontSize: '18px' }}>{q}</span>
                  <span className="material-symbols-outlined text-on-surface-variant">add</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <a className="header-logo" href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} /> Ansaea
            </a>
            <p className="text-on-surface-variant" style={{ opacity: 0.7 }}>Precision health for human longevity.</p>
          </div>
          <div>
            <h5 className="font-label-caps text-primary-landing" style={{ marginBottom: '1.5rem' }}>Explore</h5>
            <ul className="footer-links">
              <li><a href="#">What we test</a></li>
              <li><a href="#">How it works</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-primary-landing" style={{ marginBottom: '1.5rem' }}>Compare</h5>
            <ul className="footer-links">
              <li><a href="#">vs Function Health</a></li>
              <li><a href="#">vs Mito Health</a></li>
              <li><a href="#">vs InsideTracker</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-primary-landing" style={{ marginBottom: '1.5rem' }}>Company</h5>
            <ul className="footer-links">
              <li><a href="#">Blog</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p className="text-on-surface-variant" style={{ fontSize: '12px', opacity: 0.5 }}>© 2026 Ansaea. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" className="material-symbols-outlined text-on-surface-variant" style={{ textDecoration: 'none' }}>share</a>
            <a href="#" className="material-symbols-outlined text-on-surface-variant" style={{ textDecoration: 'none' }}>contact_support</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      {showAuth && (
        <div className="landing-auth-modal-overlay">
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowAuth(false)}
              style={{
                position: 'absolute', top: '-1rem', right: '-1rem',
                background: '#1f1f1f', color: '#fff', border: 'none',
                width: '32px', height: '32px', borderRadius: '50%',
                cursor: 'pointer', zIndex: 1001, fontWeight: 'bold'
              }}
            >
              ✕
            </button>
            {AuthComponent}
          </div>
        </div>
      )}
    </div>
  );
}
