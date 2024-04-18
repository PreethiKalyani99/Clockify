import React from "react";
import { DisplaySingleTask } from "./DisplaySingleTask";

export function DisplayTasks(props){
    return(
        <>
           {Object.entries(props.totalTasks).map(([key, tasks]) => (
                <div className="display-container mb-3" key={key}>
                    <div> {tasks.map((task, index) => (
                           <div className="sub-container" key={index}>
                                <DisplaySingleTask
                                    key={index}
                                    task={task}
                                    validateTime={props.validateTime}
                                    addTodayTask={props.addTodayTask}
                                    totalTasks={props.totalTasks}
                                />
                            </div> 
                        ))}
                    </div>
                </div>
            ))} 
        </>
    )
}
