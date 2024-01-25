import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './home.css'
import axios from 'axios'
import LeftCurrent from './LeftCurrent'
import LeftAll from './LeftAll';

export default function Home() {
    const navigate = useNavigate()
    const [allUsers, setAllUsers] = useState({})
    const [current, setCurrent] = useState(0)
    const [updated, setUpdated] = useState(false)

    const getAllUsers = () => {
        axios.get(`http://127.0.0.1:5000/users`).then(res => {
            setAllUsers(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getAllUsers()
    }, [updated])

    return (
        <div className='homeContainer'>
            <div className="navbar">
                <span className='logo' onClick={() => navigate('/home')}>Visitor</span>
                <span className='logout' onClick={() => {
                    navigate('/')
                    localStorage.clear()
                }}>Logout</span>
            </div>
            <div className="mainComponent">
                <div className='sidebar'>
                    <span className={current === 0 ? 'active' : 'not__active'} onClick={() => setCurrent(0)}>My Profile</span>
                    <span className={current === 1 ? 'active' : 'not__active'} onClick={() => setCurrent(1)}>All Users</span>
                </div>
                {current === 0 ? <LeftCurrent changeUpdated={() => {
                    setUpdated(!updated)
                }}/> : <LeftAll allUsers={allUsers}/>}
            </div>
        </div>
    )
}
