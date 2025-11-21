import React from 'react'

export default function Contact(){
  return (
    <div className="page container">
      <h1>Contact Us</h1>
      <p className="page-description">Get in touch with Woodcourt Timbers for all your timber needs</p>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>📍 Location</h3>
          <p>Harare, Zimbabwe</p>
          <p>We serve Harare and surrounding areas</p>
        </div>

        <div className="contact-card">
          <h3>📞 Phone & WhatsApp</h3>
          <p>Available 7 days a week</p>
          <div className="phone-numbers">
            <div className="phone-item">
              <strong>Primary:</strong>
              <a href="https://wa.me/263786510519" target="_blank" rel="noopener noreferrer">
                0786 510 519
              </a>
            </div>
            <div className="phone-item">
              <strong>Secondary:</strong>
              <a href="https://wa.me/263786721070" target="_blank" rel="noopener noreferrer">
                0786 721 070
              </a>
            </div>
          </div>
        </div>

        <div className="contact-card">
          <h3>⏰ Business Hours</h3>
          <p>Monday - Friday: 7:00 AM - 5:00 PM</p>
          <p>Saturday: 8:00 AM - 1:00 PM</p>
          <p>Sunday: Emergency orders only</p>
        </div>
      </div>

      <div className="whatsapp-direct">
        <h3>Quick Contact via WhatsApp</h3>
        <p>Click below to start a conversation directly on WhatsApp:</p>
        <div className="contact-buttons large">
          <a href="https://wa.me/263786510519" className="whatsapp-btn large" target="_blank" rel="noopener noreferrer">
            💬 Chat with 0786 510 519
          </a>
          <a href="https://wa.me/263786721070" className="whatsapp-btn large" target="_blank" rel="noopener noreferrer">
            💬 Chat with 0786 721 070
          </a>
        </div>
      </div>
    </div>
  )
}