import React, { useEffect, useRef } from "react";

export default function useClickOutside(toggleState){
    let inputRef = useRef()

    useEffect(() => {
        let handler = (e) => {
            if(inputRef.current && !inputRef.current.contains(e.target)){
                toggleState()
            }
        }
        document.addEventListener("mousedown", handler)
        
        return () => document.removeEventListener("mousedown", handler)
    })

    return inputRef
}