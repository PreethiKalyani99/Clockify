import React from "react";

export function Header(props){
    return (
        <div className="header-container">
            <i className="bi bi-list list-icon" onClick={props.toggleSidebar}></i>
        </div>
    )
}