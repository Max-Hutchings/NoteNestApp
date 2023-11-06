import "./navbar.css"
import React, {useState, useContext} from "react";
import {useMediaQuery} from "react-responsive";
import Create from '@mui/icons-material/Create';
import NavbarAddons from "./navbar_addons/NavbarAddons";
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from "../../context/AuthContext";
import authContext from "../../context/AuthContext";

function Navbar(){

    const {logoutUser} = useContext(authContext)

    const isMobile = useMediaQuery({query: '(max-width: 767px)'});
    const [mobileMenu, setMobileMenu] = useState(false)

    function toggleMobileMenu(){
        setMobileMenu(mobileMenu => !mobileMenu)
    }

    return(
        <nav className={"navbar navbar-expand-lg"}>
            <div className={"container-fluid"}>
                <a className={"navbar-icon-title"} href={"/"}>
                    <Create
                        sx={{
                            fontSize: "2rem",

                        }}/>
                    NoteNest
                </a>
                {isMobile ? (
                    <>
                        <MenuIcon onClick={toggleMobileMenu} />
                        {mobileMenu ? <NavbarAddons logoutUser={logoutUser} toggleMobileMenu={toggleMobileMenu} mobileFirst={true}/> : null}
                    </>
                ) : (
                    <NavbarAddons logoutUser={logoutUser}/>
                )}

            </div>

        </nav>
    )
}


export default Navbar