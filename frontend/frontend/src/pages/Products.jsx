import React, {useEffect, useState} from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Products(){
  const [products, setProducts] = useState([])
  const [media, setMedia] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [zoomImage, setZoomImage] = useState(null)
  
  useEffect(() => {
    axios.get(API + '/api/products')
      .then(r => setProducts(r.data.products))
      .catch(err => console.log('Failed to load products:', err))
    
    axios.get(API + '/api/media')
      .then(r => setMedia(r.data.media))
      .catch(err => console.log('Failed to load media:', err))
  }, [])

  return (
    <div className="page container">
      <h1>Products & Prices</h1>
      <p className="page-description">Browse our range of quality timber products at competitive prices</p>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <div className="price-badge">{product.price}</div>
            <p className="product-description">{product.description}</p>
          </div>
        ))}
      </div>

      {/* Timber Gallery Section - Visible to all users */}
      <div className="timber-gallery-section">
        <h2>Timber Gallery</h2>
        <p className="page-description">Browse our collection of timber photos and demonstration videos</p>
        
        {media.length === 0 ? (
          <div className="no-media-message">
            <p>No photos or videos available yet. Check back soon for timber images and demonstrations.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {media.map((item, index) => (
              <div key={index} className="gallery-item">
                {item.type === 'video' ? (
                  <div 
                    className="video-thumbnail"
                    onClick={() => setSelectedVideo(item)}
                  >
                    <video>
                      <source src={API + item.url} type="video/mp4" />
                    </video>
                    <div className="play-overlay">
                      <div className="play-button">▶</div>
                      <div className="play-text">Click to play video</div>
                    </div>
                    <div className="media-badge">Video</div>
                  </div>
                ) : (
                  <div 
                    className="image-thumbnail"
                    onClick={() => setZoomImage(item)}
                  >
                    <img src={API + item.url} alt="Timber product" />
                    <div className="zoom-overlay">
                      <div className="zoom-icon">🔍</div>
                      <div className="zoom-text">Click to zoom</div>
                    </div>
                    <div className="media-badge">Photo</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="media-modal">
          <div className="media-modal-content">
            <div className="media-modal-header">
              <h3>Timber Video</h3>
              <button onClick={() => setSelectedVideo(null)} className="close-btn">✕</button>
            </div>
            <div className="video-player">
              <video controls autoPlay>
                <source src={API + selectedVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="zoom-modal">
          <div className="zoom-modal-content">
            <div className="zoom-modal-header">
              <button onClick={() => setZoomImage(null)} className="close-btn">✕</button>
            </div>
            <div className="zoom-image-container">
              <img src={API + zoomImage.url} alt="Timber zoomed view" />
            </div>
          </div>
        </div>
      )}

      <div className="contact-cta">
        <h3>Interested in Our Products?</h3>
        <p>Contact us on WhatsApp for bulk orders and custom requirements</p>
        <div className="contact-buttons">
          <a href="https://wa.me/263786510519" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            Contact: 0786 510 519
          </a>
          <a href="https://wa.me/263786721070" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            Contact: 0786 721 070
          </a>
        </div>
      </div>
    </div>
  )
}