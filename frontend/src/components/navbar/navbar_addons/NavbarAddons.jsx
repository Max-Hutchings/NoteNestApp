import React from "react";
import "./navbar_addons.css"
import CloseIcon from '@mui/icons-material/Close';

function NavbarAddons(props){

    function closeNav(){
        props.toggleMobileMenu();
    }

    return(
        <div className={`navbar-navigation row ${props.mobileFirst? "navbar-mobile":""}`}>
            { props.mobileFirst ?
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <a onClick={closeNav}>
                        <CloseIcon
                            sx={{ fontSize: "3rem" }}
                            className={"navbar-navigation-close"}

                        />
                    </a>
                </div>  : null}
            <a className={`col navbar-navigation-links ${props.mobileFirst ? "mobile-bottom-border" : null}`} href={"/dashboard"}>Dashboard</a>
            <a className={`col navbar-navigation-links ${props.mobileFirst ? "mobile-bottom-border" : null}`} onClick={props.logoutUser} href={"/contact-us"}>Logout</a>
            <a className={"col navbar-navigation-links"} href={"/login"}>
                <button className={" btn navbar-navigation-create-account-btn"}>
                    Login
                </button>
            </a>
        </div>
    )
}


export default NavbarAddons