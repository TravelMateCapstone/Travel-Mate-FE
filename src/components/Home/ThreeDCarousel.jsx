import React, { useState, useEffect } from "react";
import "../../assets/css/Shared/ThreeDCarousel.css";

const images = [
  "https://vcdn1-dulich.vnecdn.net/2022/06/03/cauvang-1654247842-9403-1654247849.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=Swd6JjpStebEzT6WARcoOA",
  "https://vcdn1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g",
  "https://images.baodantoc.vn/uploads/lethihongphuc/2023/3/23/h%C3%A0%20giang.jpg",
  "https://www.vietmytravel.com/wp-content/uploads/2019/04/h%E1%BB%93-ho%C3%A0n-ki%E1%BA%BFm_vietmytravel_du-l%E1%BB%8Bch-h%C3%A0-n%E1%BB%99i-e1554716923715.jpg",
  "https://static.vinwonders.com/production/kinh-thanh-hue-topbanner_optimized.jpg",
];

// Chữ chú thích cho mỗi ảnh
const captions = [
  "Đà Nẵng",
  "Hội An",
  "Hà Giang",
  "Hà Nội",
  "Huế",
];

const ThreeDCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Bắt đầu từ phần tử trung tâm
  const [screenSize, setScreenSize] = useState("desktop"); // State để lưu kích thước màn hình

  // Lắng nghe sự thay đổi kích thước của cửa sổ
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 576) {
        setScreenSize("mobile");
      } else if (width <= 768) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize(); // Gọi khi component mount
    window.addEventListener("resize", updateScreenSize); // Lắng nghe sự thay đổi kích thước

    return () => window.removeEventListener("resize", updateScreenSize); // Dọn dẹp sự kiện khi unmount
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveToNextItem();
    }, 3000); // Auto-rotate mỗi 3 giây
    return () => clearInterval(intervalId); // Dọn dẹp interval khi component unmount
  }, [currentIndex]);

  const moveToNextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const moveToClickedItem = (index) => {
    setCurrentIndex(index);
  };

  const getTransformStyle = (index) => {
    let diff = index - currentIndex;
    if (diff < 0) diff += images.length;

    let translateX = 0;
    let translateY = 0;
    let scale = 1;
    let zIndex = 10; // Default zIndex for the center image

    switch (screenSize) {
      case "mobile":
        switch (diff) {
          case 0:
            translateX = 0;
            translateY = 0;
            scale = 1;
            zIndex = 10;
            break;
          case 1:
            translateX = 48;
            translateY = 25;
            scale = 0.7;
            zIndex = 5;
            break;
          case 2:
            translateX = 90;
            translateY = 45;
            scale = 0.5;
            zIndex = 3;
            break;
          case images.length - 1:
            translateX = -48;
            translateY = 25;
            scale = 0.7;
            zIndex = 5;
            break;
          case images.length - 2:
            translateX = -90;
            translateY = 45;
            scale = 0.5;
            zIndex = 3;
            break;
          default:
            zIndex = 1;
            break;
        }
        break;

      case "tablet":
        switch (diff) {
          case 0:
            translateX = 0;
            translateY = 0;
            scale = 1;
            zIndex = 10;
            break;
          case 1:
            translateX = 38;
            translateY = 40;
            scale = 0.8;
            zIndex = 5;
            break;
          case 2:
            translateX = 78;
            translateY = 80;
            scale = 0.6;
            zIndex = 3;
            break;
          case images.length - 1:
            translateX = -48;
            translateY = 40;
            scale = 0.8;
            zIndex = 5;
            break;
          case images.length - 2:
            translateX = -78;
            translateY = 80;
            scale = 0.6;
            zIndex = 3;
            break;
          default:
            zIndex = 1;
            break;
        }
        break;

      case "desktop":
      default:
        switch (diff) {
          case 0:
            translateX = 0;
            translateY = 0;
            scale = 1;
            zIndex = 10;
            break;
          case 1:
            translateX = 48;
            translateY = 100;
            scale = 0.8;
            zIndex = 5;
            break;
          case 2:
            translateX = 98;
            translateY = 200;
            scale = 0.6;
            zIndex = 3;
            break;
          case images.length - 1:
            translateX = -48;
            translateY = 100;
            scale = 0.8;
            zIndex = 5;
            break;
          case images.length - 2:
            translateX = -98;
            translateY = 200;
            scale = 0.6;
            zIndex = 3;
            break;
          default:
            zIndex = 1;
            break;
        }
        break;
    }

    return {
      transform: `translateX(${translateX}%) translateY(${translateY}px) scale(${scale})`,
      zIndex: zIndex,
    };
  };

  return (
    <div className="carousel m-0 p-0">
      <div className="carousel__track m-0 p-0">
        {images.map((image, index) => (
          <div
            key={index}
            className="carousel__item"
            style={getTransformStyle(index)}
            onClick={() => moveToClickedItem(index)}
          >
            <div className="carousel__image-container">
              <img src={image} alt={`Image ${index + 1}`} />
              {index === currentIndex && (  // Chỉ hiển thị caption khi ảnh ở giữa
                <div className="carousel__caption">{captions[index]}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="carousel__dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => moveToClickedItem(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreeDCarousel;