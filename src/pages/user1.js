import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MultiSelectDropdown from "./MultiSelectDropdown";

const user1 = () => {
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageData, setImageData] = useState([]);
    const [imageData1, setImageData1] = useState([]);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [hasResponse, setHasResponse] = useState(false); // Track if response is received
    const [progress, setProgress] = useState(0);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const inputFileRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageText, setImageText] = useState("");
    const [hasResponse1, setHasResponse1] = useState(false); 
    const [fileName, setFileName] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);

    const handleImageHover = (image1) => {
        setHoveredImage(image1);
        
        setIsModalOpen1(true);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const searchClick = () => {
        const randomTimeout = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        setTimeout(() => {
            setImageData(imageData1);
            setHasResponse1(true);
        }, randomTimeout);
        
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setImageFile(file);
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImage(reader.result);

    //             setIsFileUploaded(true);

    //         };


    //         reader.onerror = () => {
    //             console.error("Error reading file");
    //         };
    //         reader.readAsDataURL(file);

    //     }

    // };

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
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result
                    .replace("data:", "")
                    .replace(/^.+,/, "");
                setImage(reader.result);
                setIsFileUploaded(true);

                // Call API automatically once the image is uploaded
                handleSearch(base64String);
            };

            reader.onerror = () => {
                console.error("Error reading file");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSearch = async (encodedImageBytes) => {
        setProgress(10);
        const intervalId = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 90) return 90; // Max progress before response
                return prevProgress + 1; // Increment progress
            });
        }, 100);


        const data = {
            image_bytes: encodedImageBytes ? encodedImageBytes : null,
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
            clearInterval(intervalId);
            setProgress(100);
            const responseData = responseData1["result"];

            const uniqueClasses = Array.from(
                new Set(responseData.map((item) => item.class))
              ).map((cls) => ({ value: cls, label: `Class ${cls}` }));
            setOptions([{ value: "all", label: "Select All" }, ...uniqueClasses]);

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
            // setIsLoading(false); // End loading
            // setIsModalOpen(false);
            toast.success("Image uploaded and processed successfully!", {
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


    // const handleSearch = async () => {
    //     setProgress(10);
    //     const intervalId = setInterval(() => {
    //         setProgress((prevProgress) => {
    //             if (prevProgress >= 90) return 90; // Max progress before response
    //             return prevProgress + 1; // Increment progress
    //         });
    //     }, 100);
    //     let encodedImageBytes = null;

    //     if (imageFile) {
    //         const reader = new FileReader();
    //         reader.onloadend = async () => {
    //             const base64String = reader.result
    //                 .replace("data:", "")
    //                 .replace(/^.+,/, "");
    //             encodedImageBytes = base64String;
    //             const data = {
    //                 image_bytes: encodedImageBytes ? encodedImageBytes : null
    //                 // image_text: imageText || null,
    //                 // image_class: 2,
    //             };

    //             try {
    //                 setProgress(10);
    //                 const response = await fetch(
    //                     "https://dpiit-capps.livelypebble-8970d685.centralindia.azurecontainerapps.io/process",
    //                     {
    //                         method: "POST",
    //                         headers: {
    //                             "Content-Type": "application/json",
    //                         },
    //                         body: JSON.stringify(data),
    //                     }
    //                 );

    //                 const responseData1 = await response.json();
    //                 setProgress(100);
    //                 const responseData = responseData1["result"];
    //                 const formattedData = responseData.map((item) => ({
    //                     image: item["logo_url"],
    //                     word_mark_type: item["word_mark_type"],
    //                     application_number: item["application_number"],
    //                     application_date: item["application_date"],
    //                     trade_mark_type: item["trade_mark_type"],
    //                     trade_mark_reg_date: item["trade_mark_reg_date"],
    //                     tm_certificate_no: item["tm_certificate_no"],
    //                     registration_valid_upto: item["registration_valid_upto"],
    //                     tmr_application_status: item["tmr_application_status"],
    //                     three_dimensional_mark: item["three_dimensional_mark"],
    //                     sound_mark: item["sound_mark"],
    //                     class: item["class"],
    //                     cosine_distance: item["cosine_distance"],
    //                 }));
    //                 setImageData1(formattedData);
    //                 setHasResponse(true); // Set flag to true when response is received


    //             } catch (error) {
    //                 console.error("There was an error!", error);
    //             } finally {
    //                 setIsLoading(false); // End loading
    //                 setIsModalOpen(false);
    //                 toast.success("Image uploaded successfully!", {
    //                     position: "top-right",
    //                     autoClose: 5000, // 5 seconds
    //                     hideProgressBar: false,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     theme: "colored",
    //                 });
    //             }
    //         };
    //         reader.readAsDataURL(imageFile);
    //     } else {
    //         const data = {
    //             image_bytes: null,
    //             image_text: imageText || null,
    //             image_class: 2,
    //         };

    //         try {
    //             const response = await fetch(
    //                 "https://dpiit-capps.livelypebble-8970d685.centralindia.azurecontainerapps.io/process",
    //                 {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify(data),
    //                 }
    //             );

    //             const responseData = await response.json();
    //             const formattedData = Object.values(responseData.result).map((item) => ({
    //                 image: item[1],
    //                 title: "Image", // Adjust as needed
    //             }));
    //             setImageData1(formattedData);
    //             setHasResponse(true); // Set flag to true when response is received
    //         } catch (error) {
    //             console.error("There was an error!", error);
    //         }
    //     }
    // };

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
       
    };

    const closeModal1 = () => {
        setImage(null);
        setImageData(null);
        setImageData1(null);
        setIsFileUploaded(false);
        setHasResponse(false);
        setHasResponse1(false);
        window.location.reload();
       
    };

    const handleFilterChange = (selected) => {
        const selectedClasses = selected.map(option => option.value);
        if (selectedClasses.includes("all")) {
            setImageData(imageData1); // Show all images if "Select All" is selected
        } else {
            setImageData(imageData1.filter(image => selectedClasses.includes(image.class)));
        }
        setSelectedClasses(selected);
    };




    return (

        <div className="main-container">
            <nav className="nav1">
                <div className="left-section">
                    <img className="logo" src="image/images.jpg" alt="Logo" />

                </div>

            </nav>

            <main className="content1">

                <div className="div45">
                    <div className="div46">
                        <div className="image45">
                            <img className="logo1" src="image/upl.png" alt="Logo" />
                        </div>
                        <div className="div47">
                            <div className="text47">
                                Upload Files
                            </div>
                            <div>Select and upload the files of your choice</div>
                        </div>
                    </div>
                    {!hasResponse && (
                    <button className="button47" type="button" onClick={handleClick}>Upload Image</button>)}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    {isFileUploaded && (
                        <div className="div50">
                            <div className="div51">
                                {!hasResponse && (
                                    <div className="div53">
                                        <img className="logo2" src="image/logo5.png" alt="Logo" />
                                    </div>)}
                                {hasResponse && (
                                    <div className="div53">
                                        <img className="logo2" src={image} alt="Logo" />
                                    </div>)}
                                <div className="div54">
                                    <div className="text51">{fileName}</div>
                                    {!hasResponse && (
                                    <div className="text52">Uploading</div>)}
                                    {hasResponse && (
                                    <div className="text52">Uploaded</div>)}
                                </div>
                                <div className="div55">
                                    <img className="logo3" src="image/cross.png" onClick={closeModal1}></img>
                                </div>
                            </div>
                            <div className="div52">
                                <div style={{
                                    width: "100%",
                                    height: "5px",
                                    backgroundColor: "#D9D9D9",

                                    borderRadius: "5px"
                                }}>
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${progress}%`,
                                            height: "5px",
                                            backgroundColor: "#0B0961",
                                            transition: "width 0.5s ease-in-out",
                                            borderRadius: "5px"
                                        }}
                                    />
                                </div></div>
                        </div>)}
                    {isFileUploaded && (
                        <button className="button47" onClick={searchClick}>Search</button>)}

                </div>
                {hasResponse1  && (
                <div className="div204">
                    <div className="div205">
                        <div className="text47">Similar Images</div>
                        <div >

                            <MultiSelectDropdown options={options} onChange={handleFilterChange} />
                        </div>
                    </div>
                    <div><div className="imageprev">
                        {imageData.map((data, index) => (
                            <div
                                key={index}
                                className="imgbox"
                                
                            >
                                <img src={data.image} alt={data.title} className="card-image" />
                                <p>{data.title}</p>
                            </div>
                        ))}
                    </div></div>

                </div>)}





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
                        <div className="div68">
                            
                            <h2>Details</h2>
                            <div className="text999"> 
                            <p>
                                <strong>Word Mark Type:</strong> <br/> {hoveredImage.word_mark_type}
                            </p>
                            <p className="text1000">
                                <strong>Application Number:</strong><br/> {" "}
                                {hoveredImage.application_number}
                            </p>
                            </div>
                            <div className="text999"> 
                            <p>
                                <strong>Application Date:</strong><br/> {" "}
                                {hoveredImage.application_date}
                            </p>
                            <p className="text1000">
                                <strong>Trade Mark Type:</strong><br/>
                                {hoveredImage.trade_mark_type}
                            </p>
                            </div>
                            <div className="text999"> 
                            <p>
                                <strong>Trade Mark Registration Date:</strong><br/> {" "}
                                {hoveredImage.trade_mark_reg_date}
                            </p>
                            <p className="text1000">
                                <strong>TM Certificate No:</strong><br/> {" "}
                                {hoveredImage.tm_certificate_no}
                            </p>
                            </div>
                            <div className="text999"> 
                            <p>
                                <strong>Registration Valid Upto:</strong><br/>{" "}
                                {hoveredImage.registration_valid_upto}
                            </p>
                            <div className="text1000">
                                <p><strong>Application Status:</strong></p>{" "}
                                <p>{hoveredImage.tmr_application_status}</p>
                            </div>
                            </div>
                            <div className="text999"> 
                            <p>
                                <strong>Three Dimensional Mark:</strong><br/>{" "}
                                {hoveredImage.three_dimensional_mark}
                            </p>
                            <p className="text1000">
                                <strong>Sound Mark:</strong> <br/>{hoveredImage.sound_mark}
                            </p>
                            </div>
                            <div className="text999"> 
                            <p>
                                <strong>Class:</strong> <br/>{hoveredImage.class}
                            </p>
                            <div className="text1000">
                                <p><strong >Cosine Distance:</strong></p>{" "}
                                <p>
                                {hoveredImage.cosine_distance}</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default user1;