import ImageFile from '@/components/ImageFile'
import Footer from '@/layout/Footer'
import Header from '@/layout/Header'
import React, { Fragment, useState } from "react";

const user = () => {
    const [imageData, setImageData] = useState([]);
    return (
        <Fragment>
            <Header setImageData={setImageData}/>
            <ImageFile images={imageData}/>
            <Footer />
        </Fragment>
    )
}

export default user