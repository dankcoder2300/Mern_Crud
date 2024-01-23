import React, { useEffect, useState } from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import "./user.css";
import { Link } from 'react-router-dom'

const User = () => {

  const [users, setUsers] = useState([]);

  useEffect(()=>{

    const fetchData = async()=>{
        const response = await axios.get("http://localhost:8000/api/getall");
        setUsers(response.data);
    }

    fetchData();

  },[])

  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (id) => {
    const isSelected = selectedRows.includes(id);

    if (isSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((rowId) => rowId !== id)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    }
}

const handleSendEmail = async () => {
      try {
        await axios.post('http://localhost:8000/api/sendEmail', { selectedRows });
  
      } catch (error) {
        console.error('Error sending email:', error);
        
      }
    toast.success("Email Sent Successfully",{position:'top-right'});
  };

  const deleteUser = async(userId) =>{
      await axios.delete(`http://localhost:8000/api/delete/${userId}`)
      .then((respones)=>{
        setUsers((prevUser)=> prevUser.filter((user)=> user._id !== userId))
        toast.success(respones.data.msg, {position: 'top-right'})
      })
      .catch((error) =>{
        console.log(error);
      })
  }

  return (
    <div className='userTable'>
        <Link to={"/add"} className='addButton'>Add User</Link>
        <table border={1} cellPadding={10} cellSpacing={0}>
            <thead>
                <tr>
                    <th>Select</th>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Hobbies</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user, index)=>{
                        return(
                        <tr key={user._id}>
                            <td><input type="checkbox" onChange={() => handleCheckboxChange(user._id)}checked={selectedRows.includes(user._id)}/></td>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>{user.hobbies}</td>
                            <td className='actionButtons'>
                                <button onClick={()=> deleteUser(user._id)}><i className="fa-solid fa-trash"></i></button>
                                <Link to={`/edit/`+user._id}><i className="fa-solid fa-pen-to-square"></i></Link>
                            </td>
                        </tr>
                        )
                    })
                }
                
            </tbody>
        </table>
        <div >
        <Link to={'/sendEmail'} className='sendEmailButton' onClick={handleSendEmail}>Send Email</Link>
    </div>
    </div>
  )
}

export default User