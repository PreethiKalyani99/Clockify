import React from "react";

export function DisplayTasks(props){
    return(
        <>
           {Object.entries(props.totalTasks).map(([key, tasks]) => (
                <div className="display-container mb-3" key={key}>
                    <div> {tasks.map((task, index) => (
                       <div className="sub-container" key={index}>
                            <p>{task.text}</p>
                            <p>{task.project !== undefined ? (task.project + (task.client !== undefined ? ' - ' + task.client : '')) : (task.client !== undefined ? task.client : '')}</p>
                            <p>{task.startTime}</p>
                            <p>{task.endTime}</p>
                            <p>{task.date}</p>
                       </div> 
                        ))}
                    </div>

                </div>
            ))} 
        </>
    )
}