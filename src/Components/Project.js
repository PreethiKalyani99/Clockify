import React, {useState} from "react";
import Select, {components} from 'react-select';
import { CreateNewProject } from "./CreateNewProject";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "../redux/ClockifySlice";

function groupProjectsAndClients(projects) {
    let clientsAndProjects = {}
    projects.forEach(item => {
        let clientName = item.clientName || "No Client"
        if (!clientsAndProjects[clientName]) {
            clientsAndProjects[clientName] = { projects: [], projectKeys: new Set() }
        }

        let projectKey = `${item.name}-${item.id}`

        if (!clientsAndProjects[clientName].projectKeys.has(projectKey)) {
            clientsAndProjects[clientName].projects.push({ name: item.name, id: item.id })
            clientsAndProjects[clientName].projectKeys.add(projectKey)
        }
    })
    return clientsAndProjects
}

function customOptions(clientsAndProjects){
    if (!clientsAndProjects) {
        return <div>Loading projects...</div>
    }
    return Object.keys(clientsAndProjects).map(clientName => ({
        label: clientName,
        options: clientsAndProjects[clientName].projects.map(project => ({
            value: project.id,
            label: project.name
        }))
    }))
}

export function Project(props){
    const [showPopup, setShowPopup] = useState(false)
    const projectsAndClients = groupProjectsAndClients(props.projects)
    const options = customOptions(projectsAndClients)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()

    function componentMenuList(prop){
        return (
            <components.MenuList {...prop}>
            {prop.children}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px',
                    borderTop: '1px solid #ccc',
                    cursor: 'pointer',
                    position: 'sticky',
                    bottom: 0,
                    background: 'white'
                }}
                onClick={() => {
                    setIsOpen(!isOpen)
                    dispatch(setIsModalOpen(!isOpen))
                    setShowPopup(!showPopup)
                }}
            >
                Create New Project
            </div>
        </components.MenuList>
        )
    }
    return (
        <>
            <Select
                className="react-selectcomponent"
                onChange={props.onSelect}
                options={options}
                isSearchable
                placeholder="Search project"
                menuIsOpen
                components={{ MenuList: componentMenuList }}
            />
            {showPopup && 
                <CreateNewProject
                    isOpen={isOpen}
                    setShowProjects={props.setShowProjects}
                    selectedProject={props.selectedProject}
                    setProjectSelected={props.setProjectSelected ? props.setProjectSelected : null}
                    selectedClient={props.selectedClient}
                    setClientSelected={props.setClientSelected ? props.setClientSelected : null}
                    setIsOpen={setIsOpen}
                    projects={props.projects}
                    clients={props.clients}
                    task={props.task}
                    setShowPopup={setShowPopup}
                />
            }
        </>
    )
}