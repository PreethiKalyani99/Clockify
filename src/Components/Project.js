import React, {useState} from "react";
import Select from 'react-select';

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
    const projectsAndClients = groupProjectsAndClients(props.projects)
    const options = customOptions(projectsAndClients)
    function handleSelect(value){
        setSelected(value)
    }
    return (
        <>
            <Select
                className="react-selectcomponent"
                onChange={handleSelect}
                options={options}
                isSearchable={true}
                placeholder="Search project"
            />
        </>
    )
}