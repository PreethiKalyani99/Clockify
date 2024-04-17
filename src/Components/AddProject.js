import React, {useState} from "react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addProjectClient } from "../redux/ClockifySlice";

export function AddProject(props){
    const [isOpen, setIsOpen] = useState(false)
    const [inputvalues, setInputvalues] = useState({
        project: '',
        client: ''
    })
    const dispatch = useDispatch()

    function handleClose(){
        setIsOpen(false)
    }

    function handleInputChange(e){
        setInputvalues({...inputvalues, [e.target.name]: [e.target.value]})
    }
    
    function createProject(){
      dispatch(addProjectClient({id:props.id, project: inputvalues.project[0], client: inputvalues.client[0]}))
      setInputvalues({
        project: '',
        client: ''
      })
      setIsOpen(false)
      props.setIsProjectCreated(true)
    }
    return (
        <>
            {props.isProjectCreated ? 
                `${props.projectClient?.[props.id]?.project !== undefined ? (props.projectClient[props.id].project + (props.projectClient?.[props.id]?.client !== undefined ? ' - ' + props.projectClient[props.id].client : '')) : (props.projectClient?.[props.id]?.client !== undefined ? props.projectClient[props.id].client : '')}` 
                : <button onClick={() => setIsOpen(!isOpen)}>Project</button>
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