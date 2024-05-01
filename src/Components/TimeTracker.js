import React from "react";
import { AddTask } from "./AddTask";
import { DisplayTasks } from "./DisplayTasks";

export function TimeTracker(props){
    return (
        <>
            <AddTask 
                isSidebarShrunk={props.isSidebarShrunk}
            />
            <DisplayTasks
                isSidebarShrunk = {props.isSidebarShrunk}
            /> 
        </>
    )
}