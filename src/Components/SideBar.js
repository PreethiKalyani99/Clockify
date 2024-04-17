import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

export function SideBar(props){
    return (
        <>
            <div>
                <ul className="nav nav-pills flex-column">
                    <li className={`mb-3 ${props.isSidebarShrunk ? 'shrink-li' : 'expand-li'}`}>
                        <Link to='/tracker' className="nav-link text-decoration-none">
                        <i className="bi bi-clock me-2 ms-2"></i>
                        <span className={`ms-2 ${props.isSidebarShrunk ? 'hide' : ''} `}>TIME TRACKER</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}