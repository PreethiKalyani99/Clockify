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
            clientsAndProjects[clientName] = []
        }
        
        if (!clientsAndProjects[clientName].includes(item.name)) {
            clientsAndProjects[clientName].push(item.name)
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
        options: clientsAndProjects[clientName].map(projectName => ({
            value: projectName,
            label: projectName
        }))
    }))
}

export function Project(props){
    const [selected, setSelected] = useState('')
    const [showPopup, setShowPopup] = useState(false)
    const projectsAndClients = groupProjectsAndClients(props.projects)
    const options = customOptions(projectsAndClients)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()

    function handleSelect(value){
        setSelected(value)
    }

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
                onChange={handleSelect}
                options={options}
                isSearchable
                isClearable
                placeholder="Search project"
                menuIsOpen
                components={{ MenuList: componentMenuList }}
            />
            {showPopup && 
                <CreateNewProject
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    clients={props.clients}
                    projectClient={props.projectClient}
                    id={props.id}
                    project=''
                    client=''
                    setShowPopup={setShowPopup}
                />
            }
        </>
    )
}