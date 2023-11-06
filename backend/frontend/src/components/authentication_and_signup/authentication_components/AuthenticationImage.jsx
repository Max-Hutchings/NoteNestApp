import React from "react";
import homePageImage from "../../../assets/images/home_page_image_1.png";

function AuthenticationImage(props){
    const isMobile = props.isMobile
    return(
        <>
            {!isMobile ?
            <div className={"col-sm-4 col-md-6 d-flex align-items-center"}>
                <img className={"home-page-image img-fluid"} alt={"authentication image"} src={homePageImage}/>
            </div> : null}
        </>
    )
}

export default AuthenticationImage