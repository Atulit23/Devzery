import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Left({ changeUpdated }) {
  const [userDetails, setUserDetails] = useState({})

  const getCurrentUser = () => {
    axios.get(`http://127.0.0.1:5000/user/${localStorage.getItem("userId")}`).then(res => {
      console.log(res)
      setUserDetails(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  const handleChange = (value, field) => {
    let x = { ...userDetails }
    x[field] = value
    setUserDetails(x)
  }

  const handleSubmit = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (userDetails?.username?.length > 0 && userDetails?.email?.length > 0 && regex.test(userDetails.email)) {
      axios.put(`http://127.0.0.1:5000/update/${userDetails.id}`, {
        'username': userDetails.username,
        'email': userDetails.email,
      }).then(res => {
        console.log(res)
        setUserDetails({ ...userDetails, username: res.data.username, email: res.data.email })
        changeUpdated()
        toast.success('Details were updated successfully!')
      }).catch(err => {
        console.log(err)
      })
    } else {
      if(userDetails?.username?.length === 0){
        toast.error('Username cannot be empty!')
      }
      if(userDetails?.email?.length === 0){
        toast.error('Email cannot be empty!')
      } 
      if(!regex.test(userDetails.email)) {
        toast.error('Invalid email!')
      }
    }
  }

  return (
    <div className='myprofile__main'>
      <div className="top__header">
        <span className='heading'>View/Edit Profile</span>
        <span className='subtext'>View and edit your personal details over here.</span>
      </div>
      <div className="mid__component">
        <div className="start__header">
          <img src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg" alt="" />
        </div>
        <div className="main__mid">
          <div className="first">
            <span>Username</span>
            <input type="text" value={userDetails.username} onChange={(e) => { handleChange(e.target.value, 'username') }} />
          </div>
          <div className="first">
            <span>Email</span>
            <input type="text" value={userDetails.email} onChange={(e) => { handleChange(e.target.value, 'email') }} />
          </div>
        </div>
        <button className='save' onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}
