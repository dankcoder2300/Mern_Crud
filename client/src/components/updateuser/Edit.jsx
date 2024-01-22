import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import "../adduser/add.css";
import toast from 'react-hot-toast';

const Edit = () => {

 const users = {
    name: "",
    phone: "",
    email: "",
    hobbies:""
 }

 const {id} = useParams();
 const navigate = useNavigate();
 const [user, setUser] = useState(users);

 const inputChangeHandler = (e) =>{
    const {name, value} = e.target;
    setUser({...user, [name]:value});
    console.log(user);
 }

 useEffect(()=>{
    axios.get(`http://localhost:8000/api/getone/${id}`)
    .then((response)=>{
        setUser(response.data)
    })
    .catch((error)=>{
        console.log(error);
    })
 },[id])


 const submitForm = async(e)=>{
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/update/${id}`, user)
    .then((response)=>{
       toast.success(response.data.msg, {position:"top-right"})
       navigate("/")
    })
    .catch(error => console.log(error))
 }

  return (
    <div className='addUser'>
        <Link to={"/"}>Back</Link>
        <h3>Update user</h3>
        <form className='addUserForm' onSubmit={submitForm}>
            <div className="inputGroup">
                <label htmlFor="name">Name</label>
                <input type="text" value={user.name} onChange={inputChangeHandler} id="name" name="name" autoComplete='off' placeholder='Name' />
            </div>
            <div className="inputGroup">
                <label htmlFor="phone">Phone</label>
                <input type="tel" value={user.phone} onChange={inputChangeHandler} id="phone" name="phone" autoComplete='off' placeholder='Phone' />
            </div>
            <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input type="email" value={user.email} onChange={inputChangeHandler} id="email" name="email" autoComplete='off' placeholder='Email' />
            </div>
            <div className="inputGroup">
                <label htmlFor="hobbies">Hobbies</label>
                <input type="text" value={user.hobbies} onChange={inputChangeHandler} id="hobbies" name="hobbies" autoComplete='off' placeholder='Hobbies' />
            </div>
            <div className="inputGroup">
                <button type="submit">UPDATE USER</button>
            </div>
        </form>
    </div>
  )
}

export default Edit