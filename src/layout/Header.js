import React, { useRef, useState } from "react";
import UploadSuccessModal from "@/modal/uploadsuccessmodal";
import ImageFile from "@/components/ImageFile";

const Header = ({ setImageData }) => {
  const inputFileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageText, setImageText] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    let encodedImageBytes = null;
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        encodedImageBytes = base64String;
        const data = {
          image_bytes: encodedImageBytes ? encodedImageBytes : null,
          image_text: imageText || null,
          image_class: 2,
        };

        try {
          const response = await fetch(
            "https://cors-anywhere.herokuapp.com/https://dpiit-capps.livelypebble-8970d685.centralindia.azurecontainerapps.io/api",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          const responseData = await response.json();
          const formattedData = Object.values(responseData.result).map((item) => ({
            image: item[1],
            title: "Image", // Adjust as needed
          }));
          setImageData(formattedData);
          setSuccessMessage("Your image has been successfully uploaded.");
          setShowSuccessModal(true); // Show success modal
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      reader.readAsDataURL(imageFile);
    } else {
      const data = {
        image_bytes: null,
        image_text: imageText || null,
        image_class: 2,
      };

      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://dpiit-capps.livelypebble-8970d685.centralindia.azurecontainerapps.io/api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const responseData = await response.json();
        const formattedData = Object.values(responseData.result).map((item) => ({
          image: item[1],
          title: "Image", // Adjust as needed
        }));
        setImageData(formattedData);
        setSuccessMessage("Your image has been successfully uploaded.");
        setShowSuccessModal(true); // Show success modal
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
  };

  return (
    <header className="header-area">
      <UploadSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        message={successMessage} 
      />
      <div className="box">
        <img className="logo" src="image/img-1.jpg" alt="image" />
        <form className="form1">
          <button type="button">
            <img className="search" src="image/Search.png" alt="Search" />
          </button>
          <input
            className="input"
            placeholder="Enter Brand"
            type="text"
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
          />
        </form>
        <div>
          <input
            className="text-file"
            type="file"
            ref={inputFileRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button className="buttonDownload" onClick={() => inputFileRef.current.click()}>
            Upload
          </button>
        </div>
        <button className="btn-donate" onClick={handleSearch}>
          Search
        </button>
      </div>
      <ImageFile images={[]} previewSrc={previewSrc} />
    </header>
  );
};

export default Header;
