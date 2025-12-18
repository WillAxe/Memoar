import PhotoAlbum from "../assets/Photo-album-ex.jpg"
import CreateRoom from "../assets/create-room.jpg"
import UploadPhoto from "../assets/upload-image.jpg"
import "../css/home.css"
import { useState } from "react"
function Home() {
  const [slideIndex, setSlideIndex] = useState<number>(1)

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
      <a href="uml.html" target="_blank">
        UML Diagram
      </a>

      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`image-fade ${index === slideIndex ? "active" : ""}`}
          >
            <img className="image" src={slide.img} alt={slide.alt} />
            <p className="caption-text">{slide.text}</p>
          </div>
        ))}
        <button className="prev" onClick={() => changeSlide(-1)}>
          &lt;
        </button>
        <button className="next" onClick={() => changeSlide(1)}>
          &gt;
        </button>
      </div>

      <article>
        <p>
          Here you can create and share photo albums with friends, family or
          collegues. Or just a place to store pictures for safe keeping
        </p>

        <p>
          Just create a room and you have yourself a photo album ready for
          pictures
        </p>
      </article>
    </>
  )
}

export default Home
