import React, {useState, useEffect} from "react";
import Creatable from 'react-select/creatable';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "../redux/ClockifySlice";
import { createClient, createProject } from "../redux/clockifyThunk";

export function CreateNewProject(props){
    const [inputvalues, setInputvalues] = useState({
        project: props.project,
        client: props.client
    })
    const [selectedValue, setSelectedValue] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        setInputvalues({
            project: props.project,
            client: props.client
        })
    }, [props.project, props.client])

    function handleClose(){
        props.setIsOpen(false)
        dispatch(setIsModalOpen(false))
        props.setShowPopup(false)
    }

    function handleInputChange(e){
        setInputvalues({...inputvalues, [e.target.name]: e.target.value})
    }

    function handleSelect(value){
        setSelectedValue(value)
    }

    function handleCreateOption(input){
        dispatch(createClient({name: input}))
        setSelectedValue(input)
    }

    function addProject(){
        const clientvalue = typeof selectedValue === 'object' ? selectedValue.label : selectedValue
        const clientInfo = props?.clients?.find(item => item.name === clientvalue)
        dispatch(createProject({
            name: inputvalues.project,
            clientId: clientInfo.id
        }))
        setInputvalues({
            project: '',
            client: ''
        })
      props.setIsOpen(false)
      dispatch(setIsModalOpen(false))
      props.setShowPopup(false)
    }
    return (
        <>
            {/* <button
                data-testid="add-project"
                onClick={() => {
                setIsOpen(!isOpen)
                dispatch(setIsModalOpen(!isOpen))
            }}>
                {(props.projectClient?.[props.id]?.project || props.projectClient?.[props.id]?.client) ?
                    `${props.projectClient?.[props.id]?.project || ''}${props.projectClient?.[props.id]?.client && props.projectClient?.[props.id]?.project ? ' - ' : ''} ${props.projectClient[props.id].client || ''}` 
                    : 'Project'
                }
            </button> */}
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
                        value={inputvalues.project} 
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
                        value={typeof selectedValue === 'object' ? selectedValue.value : selectedValue}
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