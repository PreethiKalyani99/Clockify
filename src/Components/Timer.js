import { formatTime } from "../utils/formatTime"
import { AddProject } from "./AddProject"

export function Timer(props){
    const totalTime = formatTime(props.elapsedTime)
    return (
        <>
            {props.isTimerOn && <input disabled className="time" value={totalTime}></input>}
            <div className={props.isModalOpen ? "add-task-container" : "add-task-container zIndex"} data-testid="container">
                <input
                    data-testid="task-name"
                    type="text"
                    placeholder="What are you working on?"
                    className={props.isSidebarShrunk ? "input-box expand-input-width" : "input-box shrink-input-width"}
                    onChange={props.onNameChange}
                    value={props.taskName}
                ></input>
                <AddProject
                    projectClient={props.projectClient}
                    id={props.uniqueId}
                    project={props.project}
                    client={props.client}
                />
                <button onClick={props.onTimerStop}><i className="bi bi-pause"></i></button>
            </div>
        </>
    )
}