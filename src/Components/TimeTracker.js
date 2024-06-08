import React, { useState, useEffect, useRef } from "react";
import { AddTask } from "./AddTask";
import { Tasks } from "./Tasks";
import { Timer } from "./Timer";
import { useSelector, useDispatch } from "react-redux";
import {
    updateDuration,
    updateEndTime,
    updateStartTime,
    addTodayTask,
    updateUniqueId,
    updateTaskName,
    resetState,
} from "../redux/ClockifySlice";
import {
    createTimeEntry,
    getUserTimeEntries,
    getProjects,
    getClients
} from "../redux/clockifyThunk"
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { calculateEndDate } from "../utils/calculateEndDate";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { calculateEndTime } from "../utils/calculateEndTime";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import { formatTime } from "../utils/formatTime";
import useClickOutside from "../utils/useClickOutside";

export function TimeTracker(props){
    const {projectClient , uniqueId, isModalOpen, currentTask, data, projects, clients} = useSelector(state => state.clockify)
    const {startTime, endTime, duration, taskName, project, client} = currentTask

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)

    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [selected, setSelected] = useState({value: '', label: ''})
    const [totalDuration, setDuration] = useState(duration)
    const [isTimerOn, setIsTimerOn] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [showActionItems, setShowActionItems] = useState(false)
    const [showProjects, setShowProjects] = useState(false)
    const [selectedProject, setSelectedProject] = useState('Project')

    const dispatch = useDispatch()
    const intervalIdRef = useRef()
    const timerStart = Date.now()

    useEffect(() => {
        dispatch(getUserTimeEntries())
        dispatch(getProjects())
        dispatch(getClients())
    }, [])
    
    useEffect(() => {
        if(selected?.value){
            const selectedProject = projects?.find(project => project.id === selected?.value);
            if (selectedProject) {
                setSelectedProject(`${selectedProject.name}${(selectedProject.name && selectedProject.clientName) && ' - '}${selectedProject.clientName}`);
            }
        }
        else{
            setSelectedProject('Project')
        }
    }, [selected?.value, projects])

    useEffect(() => {
        if(isTimerOn){
            intervalIdRef.current = setInterval(() => {
                const currentTimeInMs = Date.now() - timerStart
                setElapsedTime(currentTimeInMs)
            }, 1000)
        }
        else{
            clearInterval(intervalIdRef.current)
            intervalIdRef.current = null
        }
        return () => clearInterval(intervalIdRef.current)

    }, [isTimerOn])

    function updateEndDateIfNeeded() {
        if (timeStart > timeEnd) {
            let date = new Date(timeEnd)
            date.setDate(date.getDate() + 1)
            dispatch(updateEndTime(date.toString()))
        }
    }
    function updateDurationIfNeeded() {
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        const timeParts = duration.split(':')
        const totalTimeDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${timeParts[2]}`
        const timeDuration = (hours <= 999) ? totalTimeDuration : duration
        if (timeDuration !== duration) {
            dispatch(updateDuration(timeDuration))
            setDuration(timeDuration)
        }
    }

    useEffect(() => {
        if (startDateTime !== getFormattedTime(timeStart) || endDateTime !== getFormattedDate(timeEnd)){
            setStartDateTime(getFormattedTime(timeStart))
            setEndDateTime(getFormattedTime(timeEnd))
            setDuration(duration)
        }
        updateEndDateIfNeeded()
        updateDurationIfNeeded()

    }, [startTime, endTime])

    const toggleActionItem = () => {
        setShowActionItems(!showActionItems)
    }

    const toggleProject = () => {
        setShowProjects(!showProjects)
    }

    const actionItem = useClickOutside(() => {
        setShowActionItems(false)
    })

    // const projectDropdowm = useClickOutside(() => {
    //     setShowProjects(false)
    // })
    
    const handleDiscard = () => {
        setIsTimerOn(false)
        setShowActionItems(false)
    }

    const handleSelect = (value) => {
        setSelected(value)
        setShowProjects(false)
    }

    const handleStart = () => {
        setIsTimerOn(true)
        setElapsedTime(0)
    }

    const handleStop = () => {
        const start = new Date()
        const {isValid, newEndTime} = calculateEndTime(start, formatTime(elapsedTime))
        if(isValid) {
            dispatch(createTimeEntry({
                description: taskName,
                start: new Date(start).toISOString().split('.')[0] + 'Z',
                end:  new Date(newEndTime).toISOString().split('.')[0] + 'Z',
            }))
            setIsTimerOn(false)
            dispatch(updateUniqueId())
            dispatch(resetState())
        }
    }

    const handleDateChange = (dateTime) => {
        dispatch(updateStartTime(dateTime.toString()))
        const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
        dispatch(updateEndTime(newEndTime.toString()))
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(timeStart)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || isDurationLimitExceeded(newStart, timeEnd)) {
            setStartDateTime(getFormattedTime(timeStart))
            return
        }

        dispatch(updateStartTime(newStart.toString()))
        setStartDateTime(getFormattedTime(newStart))
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(timeEnd)
        newEnd.setHours(validatedHour, validatedMins)

        if(!isValid || isDurationLimitExceeded(timeStart, newEnd)) {
            setEndDateTime(getFormattedTime(timeEnd))
            return
        }

        dispatch(updateEndTime(newEnd.toString()))
        setEndDateTime(getFormattedTime(newEnd))
    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(timeStart, e.target.value)
        if(isValid){
            dispatch(updateEndTime(newEndTime.toString()))
            dispatch(updateDuration(timeDuration))
            setEndDateTime(getFormattedTime(newEndTime))
            setDuration(timeDuration)
        }
        else{
            setDuration(duration)
        }
    }
    
    const toggleTimer = () => { 
        setIsTimerOn(true)
    }
    const addTask = () => {
        if(taskName !== ''){
            dispatch(createTimeEntry({
                description: taskName,
                start: new Date(timeStart).toISOString().split('.')[0] + 'Z',
                end:  new Date(timeEnd).toISOString().split('.')[0] + 'Z',
                projectId: selected.value
            }))
            dispatch(resetState())
            setSelected({value: '', label: ''})
        }
        else{
            alert('Please enter task description')
        }
    }

    return (
        <>
            {isTimerOn ? 
                <Timer
                    isSidebarShrunk={props.isSidebarShrunk}
                    data={data}
                    isTimerOn={isTimerOn}
                    elapsedTime={elapsedTime}
                    taskName={taskName}
                    project={project}
                    client={client}
                    actionItem={actionItem}
                    showActionItems={showActionItems}
                    projectClient={projectClient}
                    uniqueId={uniqueId}
                    onNameChange={(e) =>  dispatch(updateTaskName(e.target.value))}
                    onTimerStop={handleStop}
                    onToggle={toggleActionItem}
                    onDiscard={handleDiscard}
                /> : 
                <AddTask
                    isSidebarShrunk={props.isSidebarShrunk}
                    projectClient={projectClient}
                    onToggle={toggleProject}
                    selectedProject={selectedProject}
                    selectedValue={selected?.value}
                    onSelect={handleSelect}
                    showProjects={showProjects}
                    setShowProjects={setShowProjects}
                    // projectDropdowm={projectDropdowm}
                    projects={projects}
                    clients={clients}
                    uniqueId={uniqueId}
                    timeStart={new Date(startTime)}
                    timeEnd={new Date(endTime)}
                    isModalOpen={isModalOpen}
                    taskDescription={taskName}
                    start={startDateTime}
                    end={endDateTime}
                    totalDuration={totalDuration}
                    onNameChange={(e) =>  dispatch(updateTaskName(e.target.value))}
                    onStartChange={(e) =>  setStartDateTime(e.target.value)}
                    onEndChange={(e) =>  setEndDateTime(e.target.value)}
                    onDurationChange={(e) =>  setDuration(e.target.value)}
                    onStartBlur={handleStartTimeBlur}
                    onEndBlur={handleEndTimeBlur}
                    onDurationBlur={handleTotalDurationBlur}
                    onDateChange={handleDateChange}
                    onAddTask={addTask}
                />
            }
            <Tasks
                isSidebarShrunk={props.isSidebarShrunk}
                data={data}
                timeStart={new Date(startTime)}
                timeEnd={new Date(endTime)}
                projectClient={projectClient}
                uniqueId={uniqueId}
                duration={duration}
                taskName={taskName}
                onStartBlur={handleStartTimeBlur}
                onEndBlur={handleEndTimeBlur}
                onDurationBlur={handleTotalDurationBlur}
                onDateChange={handleDateChange}
                onTimerStart={handleStart}
                convertToHoursAndMinutes={convertToHoursAndMinutes}
                isDurationLimitExceeded={isDurationLimitExceeded}
                calculateEndTime={calculateEndTime}
                calculateEndDate={calculateEndDate}
                getFormattedTime={getFormattedTime}
                isTimerOn={isTimerOn}
                toggleTimer={toggleTimer}
                addTodayTask={addTodayTask}
                dispatch={dispatch}
            />
        </>
    )
}
