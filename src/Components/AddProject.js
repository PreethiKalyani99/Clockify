import React, {useState} from "react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addProjectClient, setIsModalOpen } from "../redux/ClockifySlice";

export function AddProject(props){
    console.log('inside component')
    const {isModalOpen} = useSelector(state => state.clockify)
    const [isOpen, setIsOpen] = useState(false)
    const [inputvalues, setInputvalues] = useState({
        project: props.project,
        client: props.client
    })
    const dispatch = useDispatch()

    function handleClose(){
        setIsOpen(false)
        dispatch(setIsModalOpen(false))
    }

    function handleInputChange(e){
        setInputvalues({...inputvalues, [e.target.name]: e.target.value})
    }
    
    function createProject(){
      dispatch(addProjectClient({id:props.id, project: inputvalues.project, client: inputvalues.client}))
      setInputvalues({
        project: '',
        client: ''
      })
      setIsOpen(false)
      props.setIsProjectCreated(true)
      dispatch(setIsModalOpen(false))
    }
    return (
        <>
            {props.isProjectCreated ? 
                `${props.projectClient?.[props.id]?.project !== undefined ? (props.projectClient[props.id].project + (props.projectClient?.[props.id]?.client !== undefined ? ' - ' + props.projectClient[props.id].client : '')) : (props.projectClient?.[props.id]?.client !== undefined ? props.projectClient[props.id].client : '')}` 
                : <button onClick={() => {
                    console.log('button click')
                    setIsOpen(!isOpen)
                    dispatch(setIsModalOpen(!isOpen))
                }}>{props.buttonText}</button>
            }   
            <Modal show={isOpen} onHide={handleClose}>
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
                    <input 
                        type="text" 
                        placeholder="Enter Client" 
                        name="client"
                        required
                        value={inputvalues.client} 
                        onChange={handleInputChange}
                    ></input>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={createProject}>CREATE</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}