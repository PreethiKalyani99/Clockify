import React, {useState, useEffect} from "react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addProjectClient, setIsModalOpen } from "../redux/ClockifySlice";

export function AddProject(props){
    const [isOpen, setIsOpen] = useState(false)
    const [inputvalues, setInputvalues] = useState({
        project: props.project,
        client: props.client
    })
    const dispatch = useDispatch()

    useEffect(() => {
        setInputvalues({
            project: props.project,
            client: props.client
        })
    }, [props.project, props.client])

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
      dispatch(setIsModalOpen(false))
    }
    return (
        <>
            <button onClick={() => {
                setIsOpen(!isOpen)
                dispatch(setIsModalOpen(!isOpen))
            }}>
                {(typeof props.projectClient?.[props.id]?.project !== 'undefined' && props.projectClient?.[props.id]?.project !== '') ? 
                    (props.projectClient[props.id].project + ((typeof props.projectClient?.[props.id]?.client !== 'undefined' && props.projectClient?.[props.id]?.client !== '') ? 
                        ' - ' + props.projectClient[props.id].client : 
                    '')) : 
                    ((props.projectClient?.[props.id]?.client !== undefined && props.projectClient?.[props.id]?.client !== '') ? 
                        props.projectClient[props.id].client : 
                    'Project')
                }
            </button>
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