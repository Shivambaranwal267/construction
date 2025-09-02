import React from "react";

const Hero = () => {
  return (
    <section className="section-1">
      <div className="hero d-flex align-items-center">
        <div className="container-fluid">
          <div className="text-center">
            <span>Welcome Amazing Constructions</span>
            <h1>
              Crafting dreams with <br /> precision and excellence.
            </h1>
            <p>
              We excel at transforming visions into reality through outstanding
              craftsmanship and precise <br />
              attention to detail. With years of experience and a dedication to
              quality.
            </p>
            <div className="mt-4">
              <a className="btn btn-primary large">Contact Now</a>
              <a className="btn btn-secondary ms-2 large">View Projects</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
