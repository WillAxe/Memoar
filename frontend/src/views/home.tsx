import PhotoAlbum from "../assets/Photo-album-ex.jpg"
import CreateRoom from "../assets/create-room.jpg"
import UploadPhoto from "../assets/upload-image.jpg"
import "../css/home.css"
import { useState } from "react"
function Home() {
  const [slideIndex, setSlideIndex] = useState<number>(0)

  //This holds the images for the slideshow on the home page
  const slides = [
    {
      img: String(PhotoAlbum),
      alt: String("Photo album example"),
      text: String("Collect memories in your own rooms"),
    },
    {
      img: String(CreateRoom),
      alt: String("an image of creating a room"),
      text: String("1. Create a room"),
    },
    {
      img: String(UploadPhoto),
      alt: String("an image of uploading a photo"),
      text: String("2. Upload a photo"),
    },
  ]

  function changeSlide(n: number) {
    setSlideIndex((prev) => {
      const next = prev + n
      if (next < 0) return slides.length - 1
      if (next >= slides.length) return 0
      return next
    })
  }

  return (
    <>
      <h1>Memoar</h1>
      <p>Your personal or shared memory gallery for every moment</p>

      <div className="slideshow-container">
        {slides.map(
          (
            slide: { img: string; alt: string; text: string },
            index: number
          ) => (
            <div
              key={index}
              data-cy="slideshow-image"
              className={`image-fade ${index === slideIndex ? "active" : ""}`}
            >
              <img className="image" src={slide.img} alt={slide.alt} />
              <p data-cy="caption-text" className="caption-text">
                {slide.text}
              </p>
            </div>
          )
        )}
        <button
          data-cy="change-slide-btn"
          className="prev"
          onClick={() => changeSlide(-1)}
        >
          &lt;
        </button>
        <button
          data-cy="change-slide-btn"
          className="next"
          onClick={() => changeSlide(1)}
        >
          &gt;
        </button>
      </div>
      <div style={{ textAlign: "center" }}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === slideIndex ? "active" : ""}`}
            onClick={() => setSlideIndex(index)}
          ></span>
        ))}
      </div>

      <article className="home-info-article">
        <p>
          Here you can create and share photo albums with friends, family or
          collegues. Or just a place to store pictures for safe keeping
        </p>

        <p>
          Just create a room and you have yourself a photo album ready for your
          pictures
        </p>
      </article>
    </>
  )
}

export default Home
