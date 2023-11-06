import React from "react";
import "./footer.css"


function Footer(){

    const year = new Date().getFullYear()

    return(
        <div className={"container-fluid"}>
            <div className={"row justify-content-center"}>
                <div className={"col footer-copyright justify-content-center"}>
                    <p>Copyright of NoteNest.ltd {year}</p>
                </div>
            </div>

        </div>
    )
}


export default Footer