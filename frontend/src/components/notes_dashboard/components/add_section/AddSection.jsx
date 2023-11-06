import React from "react";
import AddIcon from '@mui/icons-material/Add';


function AddSectionComponent(props){
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col-1"}>
                    <a style={{cursor: "pointer"}} onClick={props.click}>
                        <AddIcon
                            sx={{
                                color: "white",
                                fontSize: "2.5rem"
                            }}/>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AddSectionComponent