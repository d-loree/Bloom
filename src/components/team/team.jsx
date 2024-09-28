import React from 'react'
import { useAuth } from '../../contexts/authContext/authContext'
import {getFirestore, doc, setDoc} from "firebase/firestore"

const Team = () => {
    const { currentUser } = useAuth()
    return (
        <div>
            
        </div>
    )
}

export default Team