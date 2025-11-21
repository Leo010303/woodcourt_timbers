import React from 'react'

export default function Home(){
  return (
    <div className="page container">
      <div className="hero-section">
        <h1>Woodcourt Timbers</h1>
        <p className="tagline">Quality Timber & Building Materials in Harare, Zimbabwe</p>
        <div className="hero-features">
          <div className="feature">
            <h3>Premium Quality</h3>
            <p>Top-grade timber and gum poles for all your construction needs</p>
          </div>
          <div className="feature">
            <h3>Competitive Prices</h3>
            <p>Affordable pricing without compromising on quality</p>
          </div>
          <div className="feature">
            <h3>Quick Delivery</h3>
            <p>Fast and reliable delivery service in Harare and surrounding areas</p>
          </div>
        </div>
      </div>

      <div className="quick-contact">
        <h2>Ready to Order?</h2>
        <p>Contact us directly on WhatsApp for quick quotes and orders:</p>
        <div className="contact-buttons">
          <a href="https://wa.me/263786510519" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            WhatsApp: 0786 510 519
          </a>
          <a href="https://wa.me/263786721070" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            WhatsApp: 0786 721 070
          </a>
        </div>
      </div>
    </div>
  )
}