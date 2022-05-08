import React from "react";
import { useSelector } from "react-redux";

function Carousel({ images, id }) {
  const { theme } = useSelector((state) => state);
  const isActive = (index) => {
    if (index === 0) return "active";
  };
  return (
    <div
      id={`images${id}`}
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="false"
    >
      <div className="carousel-indicators">
        {images.length > 1 &&
          images.map((image, i) => (
            <button
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
              key={i}
              type="button"
              data-bs-target={`#images${id}`}
              data-bs-slide-to={i}
              className={isActive(i)}
              aria-current="true"
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
      </div>
      <div
        className="carousel-inner my-1"
        style={{ filter: theme ? "invert(1)" : "invert(0)" }}
      >
        {images &&
          images.map((image, i) => (
            <div className={`carousel-item ${isActive(i)}`} key={i}>
              {image.url && image.url.match(/video/i) ? (
                <video
                  src={image.url}
                  controls
                  className="d-block w-100"
                  alt={image.url}
                />
              ) : (
                <img
                  src={image.url}
                  className="d-block w-100"
                  alt={image.url}
                />
              )}
            </div>
          ))}
      </div>
      {images.length > 1 && (
        <button
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#images${id}`}
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
      )}
      {images.length > 1 && (
        <button
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          className="carousel-control-next"
          type="button"
          data-bs-target={`#images${id}`}
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      )}
    </div>
  );
}

export default Carousel;
