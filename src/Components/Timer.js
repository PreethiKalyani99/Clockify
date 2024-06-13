import { formatTime } from "../utils/formatTime"
import { Project } from "./Project"
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'

export function Timer(props){
    const totalTime = formatTime(props.elapsedTime)
    return (
        <>
            <div className={props.isModalOpen ? "add-task-container" : "add-task-container zIndex"} data-testid="container">
                <input
                    data-testid="task-name"
                    type="text"
                    placeholder="What are you working on?"
                    className="input-box"
                    onChange={props.onNameChange}
                    value={props.taskName}
                ></input>
                <button onClick={props.onToggleProject}> 
                    {!props.projectId && <img src={circledPlusIcon} alt="Circled Plus Icon" style={{ width: '20px', height: '20px', marginRight: '5px'}}/>}
                    {`${props?.selectedProject?.label}${props?.selectedClient?.label && ' - '}${props?.selectedClient?.label}`}
                </button>
                {props.isTimerOn && <input disabled className="time" value={totalTime}></input>}
                <button onClick={props.onTimerStop}><i className="bi bi-pause"></i></button>
                <button className="three-dots" onClick={props.onToggle}><i className="bi bi-three-dots-vertical"></i></button>
                <div className={props.showActionItems ? "action-items-container": "hide"} >
                <ul>
                    <li>
                    <button onClick={props.onDiscard}>Discard</button>
                    </li>
                </ul>
            </div>
            </div>
            <div className= {props.showProjects ? "project-dropdown" : ''}>
                {props.showProjects && 
                    <Project 
                        onSelect={props.onSelect}
                        setShowProjects={props.setShowProjects}
                        selectedProject={props.selectedProject}
                        selectedClient={props.selectedClient}
                        projects={props.projects} 
                        clients={props.clients}
                    />
                }    
            </div>
        </>
    )
}