import React, {useState, useEffect} from "react";
import Creatable from 'react-select/creatable';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setIsModalOpen, updateClientValue, updateProjectValue } from "../redux/ClockifySlice";
import { createClient, createProject } from "../redux/clockifyThunk";

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
        dispatch(updateClientValue(value))
    }

    function handleCreateOption(input){
        dispatch(createClient({name: input}))
        dispatch(updateClientValue({ label: input, value: input }))
    }

    function addProject(){
        const clientInfo = props?.clients?.find(item => item.name === props.selectedClient.label)
        dispatch(createProject({
            name: projectInput,
            clientId: clientInfo?.id
        }))
        dispatch(updateProjectValue({value: '', label: projectInput}))
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