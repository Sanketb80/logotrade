import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dash = () => {
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [imageData1, setImageData1] = useState([]);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [hasResponse, setHasResponse] = useState(false); // Track if response is received

  const handleImageHover = (image) => {
    setHoveredImage(image);
    setIsModalOpen1(true);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const searchClick = () => {
    setImageData(imageData1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsModalOpen(true);
      };
      reader.onerror = () => {
        console.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const inputFileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageText, setImageText] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    let encodedImageBytes = null;
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        encodedImageBytes = base64String;
        const data = {
          image_bytes: encodedImageBytes ? encodedImageBytes : null,
          image_text: imageText || null,
          image_class: 2,
        };

        try {
          const response = await fetch(
            "https://dpiit-capps.livelypebble-8970d685.centralindia.azurecontainerapps.io/process",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          const responseData1 = await response.json();
          const responseData = responseData1["result"];
          const formattedData = responseData.map((item) => ({
            image: item["logo_url"],
            word_mark_type: item["word_mark_type"],
            application_number: item["application_number"],
            application_date: item["application_date"],
            trade_mark_type: item["trade_mark_type"],
            trade_mark_reg_date: item["trade_mark_reg_date"],
            tm_certificate_no: item["tm_certificate_no"],
            registration_valid_upto: item["registration_valid_upto"],
            tmr_application_status: item["tmr_application_status"],
            three_dimensional_mark: item["three_dimensional_mark"],
            sound_mark: item["sound_mark"],
            class: item["class"],
            cosine_distance: item["cosine_distance"],
          }));
          setImageData1(formattedData);
          setHasResponse(true); // Set flag to true when response is received

          
        } catch (error) {
          console.error("There was an error!", error);
        } finally {
          setIsLoading(false); // End loading
          setIsModalOpen(false);
          toast.success("Image uploaded successfully!", {
            position: "top-right",
            autoClose: 5000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
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
          "https://dpiit-capps.livelypebble-8970d685.centralindia.azurecontainerapps.io/process",
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
        setImageData1(formattedData);
        setHasResponse(true); // Set flag to true when response is received
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
  };

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpen1(false);
    setImage(null);
  };

  // Inline styles for the modal
  const modalStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    flexDirection: "column",
  };

  const modalContentStyles = {
    display: "flex",
    width: "80%",
    height: "60%",
    background: "white",
    borderRadius: "5px",
    position: "relative",
  };

  const closeButtonStyles = {
    position: "absolute",
    top: "-10px",
    right: "10px",
    cursor: "pointer",
    fontSize: "30px",
    color: "#000",
  };

  const imageContainerStyles = {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: "40px",
    flexDirection: "column",
    gap: "30px",
  };

  const imageStyles = {
    maxWidth: "90%",
    width:"230px"
  };

 

  const imageStyles1 = {
    maxWidth: "90%",
  };

  const textContainerStyles = {
    width: "50%",
    padding: "20px",
    boxSizing: "border-box",
    margin: "20px",
  };

  // New styles to toggle based on response state
  const containerStyles = {
    display: "flex",
    flexDirection: hasResponse ? "row" : "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  };

  const imagePreviewStyles = {
    flex: "0 0 50%",
    display: hasResponse ? "block" : "none",
    textAlign: "center",
  };

  return (

    <div className="main-container">
      <nav className="nav1">
        <div className="left-section">
          <img className="logo" src="image/logo.jpg" alt="Logo" />
          <h1>DPIIT</h1>
        </div>
        <img className="logo1" src="image/logo-vsn.jpg" alt="Secondary Logo" />
      </nav>
      <ToastContainer />
      <main className="content">
        <div>
          <h2>Files and Assets</h2>
          <p>
            Kindly upload your image below for related results and preview with
            same
          </p>
        </div>

        {/* Container that changes layout based on API response */}
        <div style={containerStyles}>
          <div className={`rectbox ${hasResponse ? "half-width" : ""}`} onClick={handleClick}>
            <img className="upimg" src="image/Upload.png" alt="Upload" />
            <p>
              <span>Click here</span> to upload the image
            </p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Image preview section */}
          {hasResponse && (
            <div style={imagePreviewStyles}>
              <h2>Source Image</h2>
              {image && <img src={image} alt="Uploaded Preview" style={imageStyles} />}
            </div>
          )}
        </div>

        <div className="searchbar">
          <button className="search-button" onClick={searchClick}>
            Search
          </button>
        </div>

        <div className="text001">
          <h1>Search Results</h1>
          <p>Below are search results for your selection. Kindly refer that</p>
          <div className="imageprev">
            {imageData.map((data, index) => (
              <div
                key={index}
                className="imgbox"
               
              >
                <img src={data.image} alt={data.title} className="card-image" />
                <p>{data.title}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal for image preview */}
      {isModalOpen1 && hoveredImage && (
        <div style={modalStyles} aria-hidden={true}>
          <div style={modalContentStyles} className="sam">
            <span style={closeButtonStyles} onClick={closeModal}>
              &times;
            </span>
            <div className="div67">
              <img
                src={hoveredImage.image}
                alt="Hovered Preview"
                className="img1001"
              />
            </div>
            <div className="div67">
              <h2>Details</h2>
              <p>
                <strong>Word Mark Type:</strong> {hoveredImage.word_mark_type}
              </p>
              <p>
                <strong>Application Number:</strong>{" "}
                {hoveredImage.application_number}
              </p>
              <p>
                <strong>Application Date:</strong>{" "}
                {hoveredImage.application_date}
              </p>
              <p>
                <strong>Trade Mark Type:</strong>{" "}
                {hoveredImage.trade_mark_type}
              </p>
              <p>
                <strong>Trade Mark Registration Date:</strong>{" "}
                {hoveredImage.trade_mark_reg_date}
              </p>
              <p>
                <strong>TM Certificate No:</strong>{" "}
                {hoveredImage.tm_certificate_no}
              </p>
              <p>
                <strong>Registration Valid Upto:</strong>{" "}
                {hoveredImage.registration_valid_upto}
              </p>
              <p>
                <strong>Application Status:</strong>{" "}
                {hoveredImage.tmr_application_status}
              </p>
              <p>
                <strong>Three Dimensional Mark:</strong>{" "}
                {hoveredImage.three_dimensional_mark}
              </p>
              <p>
                <strong>Sound Mark:</strong> {hoveredImage.sound_mark}
              </p>
              <p>
                <strong>Class:</strong> {hoveredImage.class}
              </p>
              <p>
                <strong>Cosine Distance:</strong>{" "}
                {hoveredImage.cosine_distance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for image preview */}
      {isModalOpen && (
        <div style={modalStyles} aria-hidden={true}>
          <div style={modalContentStyles}>
            <span style={closeButtonStyles} onClick={closeModal}>
              &times;
            </span>
            {isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
                <p className="text10101">Uploading File ....</p>
              </div>
            ) : (
              <>
                <div style={textContainerStyles}>
                  <h2>Upload Your Image</h2>
                  <p>
                    Kindly upload your image below for related results and
                    preview with same.
                  </p>
                  <div className="rectbox1" onClick={handleClick}>
                    <img
                      className="upimg"
                      src="image/Upload.png"
                      alt="Upload"
                    />
                    <p>
                      <span>Click here</span> to upload the image
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange1}
                    />
                  </div>
                  <button className="button1" onClick={handleSearch}>
                    Upload
                  </button>
                </div>
                <div style={imageContainerStyles}>
                  <h2>Image Preview</h2>
                  <img src={image} alt="Uploaded Preview" style={imageStyles1} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dash;
