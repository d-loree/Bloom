import React from 'react'
import { useAuth } from '../../contexts/authContext/authContext'

const Inbox = () => {
    const { currentUser } = useAuth()
    return (
        <div className='text-2xl font-bold pt-14'>Hello</div>
    )
}

export default Inbox