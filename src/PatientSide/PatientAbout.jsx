import React, { useState } from "react";
import "./PatientAbout.css";

function PatientAbout() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      alt: "Nursery with baby cribs and changing table"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
      alt: "Modern clinic hallway"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      alt: "Birthing room with medical equipment"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="pa-shell">
      <div className="page-header">
        <h1 className="page-title">About</h1>
      </div>

      <div className="pa-body">
        <aside className="pa-sidebar">
          <div className="user-account">
            <div className="user-icon">👤</div>
            <div className="user-text">User Name</div>
          </div>
          
          <nav className="pa-nav">
            <a className="nav-btn" href="#">Dashboard</a>
            <a className="nav-btn" href="#">Patient</a>
            <a className="nav-btn active" href="#">About</a>
            <a className="nav-btn" href="#">Feedback</a>
          </nav>
        </aside>

        <main className="pa-content">
          {/* About Section with Carousel */}
          <div className="about-section">
            <div className="content-header">
              <h2 className="brand-name">A.C.E Birthing Home</h2>
            </div>

            <div className="carousel-container">
              <div className="carousel-wrapper">
                <div 
                  className="carousel-slides"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselImages.map((image) => (
                    <div key={image.id} className="carousel-slide">
                      <img src={image.src} alt={image.alt} className="carousel-image" />
                    </div>
                  ))}
                </div>
                
                <button className="carousel-btn prev" onClick={prevSlide}>
                  ‹
                </button>
                <button className="carousel-btn next" onClick={nextSlide}>
                  ›
                </button>
              </div>

              <div className="carousel-dots">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>

            <div className="about-text">
              <p>
                At A.C.E Birthing Home, we are dedicated to providing comprehensive and compassionate support before, during, and after childbirth. Our team of skilled professionals is here to offer personalized care, ensuring a safe and comfortable experience for both mother and baby. We prioritize your well-being, offering a nurturing environment and expert medical assistance throughout your journey to parenthood.
              </p>
            </div>

            <div className="page-number">1</div>
          </div>

          {/* Location Section */}
          <div className="location-section">
            <div className="content-header">
              <h2 className="brand-name">A.C.E Birthing Home</h2>
            </div>

            <div className="location-content">
              <h3 className="location-title">You can find us at:</h3>
              
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-marker">📍</div>
                  <div className="map-labels">
                    <div className="location-label">Caloocan</div>
                    <div className="nearby-labels">
                      <span>Quezon City</span>
                      <span>Manila</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-link">
                <a href="#" className="google-maps-link">
                  View in Google Maps (Click to view A.C.E Birthing Home and Baby's Clinic in Google Maps)
                </a>
              </div>

              <div className="page-number">1</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientAbout;
