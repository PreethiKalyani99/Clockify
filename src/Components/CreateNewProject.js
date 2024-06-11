import React, {useState, useEffect} from "react";
import Creatable from 'react-select/creatable';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setIsModalOpen, updateClientValue, updateProjectValue } from "../redux/ClockifySlice";
import { createClient, createProject, updateTimeEntry } from "../redux/clockifyThunk";

export function CreateNewProject(props){
    const [projectInput, setProjectInput] = useState(props.project)
    const dispatch = useDispatch()

    useEffect(() => {
        setProjectInput(props.project)
    }, [props.project])

    function handleClose(){
        props.setIsOpen(false)
        dispatch(setIsModalOpen(false))
        props.setShowPopup(false)
    }

    function handleInputChange(e){
        setProjectInput(e.target.value)
    }

    function handleSelect(value){
        if(!props.setClientSelected){
            dispatch(updateClientValue(value))
            return
        }
        props.setClientSelected(value)
    }

    function handleCreateOption(input){
        dispatch(createClient({name: input}))
        if(!props.setClientSelected){
            dispatch(updateClientValue({ label: input, value: '' }))
            return
        }
        props.setClientSelected({ label: input, value: '' })
    }

    async function addProject(){
        const clientInfo = props?.clients?.find(item => item.name === props.selectedClient.label)
        const response = await dispatch(createProject({
            name: projectInput,
            clientId: clientInfo?.id
        }))
        if(!props.setProjectSelected){
            dispatch(updateProjectValue({value: response?.payload?.id, label: projectInput}))
            dispatch(updateClientValue({value: clientInfo?.id, label: props.selectedClient.label}))
        }
        else{
            props.setProjectSelected({value: response?.payload?.id, label: projectInput})
            dispatch(updateTimeEntry({
                id: props.task.id, 
                start: props.task.timeInterval.start, 
                end: props.task.timeInterval.end, 
                description: props.task.description,
                projectId: response?.payload?.id
            }))
        }
        setProjectInput('')
        props.setIsOpen(false)
        dispatch(setIsModalOpen(false))
        props.setShowPopup(false)
        props.setShowProjects(false)
    }

    return (
        <>
            <Modal show={props.isOpen} onHide={handleClose}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Create New Project
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <input 
                        type="text" 
                        placeholder="Enter Project name" 
                        name="project"
                        required
                        value={projectInput} 
                        onChange={handleInputChange}
                    ></input>
                     <Creatable
                        className="react-selectcomponent"
                        onChange={handleSelect}
                        onCreateOption={handleCreateOption}
                        options={props?.clients?.map(client => {
                            return ({
                                label: client.name,
                                value: client.id
                            })
                        })}
                        isSearchable
                        value={props.selectedClient}
                        placeholder="Select client"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={addProject}>CREATE</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}