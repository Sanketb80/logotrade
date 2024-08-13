import ImageFile from "@/components/ImageFile";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";

const HomePage = () => {
  const [adminLoader, setAdminLoader] = useState(false);
  const [userLoader, setUserLoader] = useState(false);



  const router = useRouter();
  const handleSubmit = (link) => {
    if (link == "/dash") {
      setUserLoader(true);
    } else {
      setAdminLoader(true);
    }

    setTimeout(() => {
      setUserLoader(false);
      setAdminLoader(false);
      router.push(link)

    }, 2000);
  };
  return (
    <Fragment>
      <div className="main-box">
        <div className="button-box">
          <button className="admin-button " onClick={() => handleSubmit("/admin1")}>

            {adminLoader ? (
              <i class="fa fa-spinner fa-spin spinner-icons"></i>
            ) : (
              " Admin"
            )}
          </button>
          <button className="user-button " onClick={() => handleSubmit("/user1")}>
            {userLoader ? (
              <i class="fa fa-spinner fa-spin spinner-icons"></i>
            ) : (
              " User"
            )}
          </button>
        </div>
      </div>
      <Header setOpenModal={() => { }} />
      <ImageFile />
      <Footer />
    </Fragment>
  );
};

export default HomePage;
