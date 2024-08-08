import React from "react";

const ImageFile = ({ images, previewSrc }) => {
  if (!images || !Array.isArray(images)) {
    return <p>No images to display.</p>;
  }

  return (
    <div className="cont">
      <div className="preview-container">
        {previewSrc && (
          <div className="box1">
            <div className="image">
              <img className="card-image" src={previewSrc} alt="uploadPreview" />
              <p>source Image</p>
            </div>
            <div>
            </div>
          </div>
        )}
        {images.map((item, index) => (
          <div className="box1" key={index}>
            <div className="image">
              <img className="card-image" src={item.image} alt={item.title} />
            </div>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageFile;
