import { useEffect, useState } from 'react';
import './App.css';
import { Modal } from "antd";
import axios from 'axios';

function App() {
  const Api = 'https://6788f7072c874e66b7d70e7e.mockapi.io/user';
  
  const [data, setData] = useState([]);
  const [isOpen, setModal] = useState(false);
  const [isOpenEdit, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [statusEdit, setStatusEdit] = useState('');

  const [nameEdit, setNameEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [phoneEdit, setPhoneEdit] = useState('');

  const [edit, setEdit] = useState({});
  const [status, setStatus] = useState(""); 

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  const Get = async () => {
    const requests = await axios.get(Api);
    setData(requests.data);
  }

  const isOpenModal = () => {
    setModal(true)
  }

  const isCloseModalEdit = () => {
    setOpen(false);
  }
  
  const isCloseModal = () => {
    setModal(false);
  }

  useEffect(()=> {
    Get();
  }, [])

  const DeleteUser = async (id) => {
    try {
      await axios.delete(`${Api}/${id}`);
      Get();
    } catch (error) {
      console.error(error);
    }
  }

  const saveData = () => {
    let newUser = {
      name : name,
      email: email,
      phone: phone,
      status,
    }
    postUser(newUser);
    setModal(false);
    setName("");
    setEmail("");
    setPhone("");
    setStatus("");
  }

  const EditUser = (user) => {
    setEdit(user);
    setNameEdit(user.name);
    setEmailEdit(user.email);
    setPhoneEdit(user.phone);
    setStatusEdit(user.status);
    setOpen(true);
  };

  const EditData = async () => {
    let updateUser = {
      ...edit,
      name: nameEdit,
      email: emailEdit,
      phone: phoneEdit,
      status: statusEdit,
    };
    await putUser(updateUser);
    setOpen(false);
  };  

  const putUser = async (user) => {
    try {
      await axios.put(`${Api}/${user.id}`, user);
      Get();
    } catch (error) {
      console.error(error);
    }
  };

  const postUser = async (user) => {
    try {
      await axios.post(Api, user);
      Get();
    } catch (error) {
      console.error(error);
    }
  }


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };
  
  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedData = filteredData.filter((user) =>
    statusFilter ? user.status === statusFilter : true
  );

  return (
    <>
    <div className='tool'>
      <h1 style={{cursor : 'pointer'}} onClick={isOpenModal}>+</h1>
      <div className='filter-data'>
        <input value={searchTerm} onChange={handleSearch} type="text" name="" id="" style={{margin: '20px 0px', padding: '10px 10px'}} placeholder='Search' />
        <select value={statusFilter} onChange={handleStatusFilter} name="" id="">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
      <div className='main-box'>
        {sortedData.length > 0 ? sortedData.map((user)=> {
          return (
          <div className='card' key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <span>{user.phone}</span>
            <p className={user.status ? "color" : "nextColor"}>{user.status ? "Active" : "Inactive"}</p>
            <div className='btnTool'>
              <button onClick={()=> DeleteUser(user.id)}>Delete</button>
              <button onClick={() => EditUser(user)}>Edit</button>
            </div>
            <Modal open={isOpen} onCancel={isCloseModal} onOk={saveData}>
              <div className='modal_flex'>
                <input value={name} onChange={(e)=> setName(e.target.value)} placeholder='Enter name' type="text" name="" id="" />
                <input value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Enter Email' type="text" name="" id="" />
                <input value={phone} onChange={(e)=> setPhone(e.target.value)} placeholder='Enter Phone' type="text" name="" id="" />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Choose Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </Modal>

            <Modal open={isOpenEdit} onCancel={isCloseModalEdit} onOk={EditData}>
              <div className='modal_flex'>
                <input value={nameEdit} onChange={(e)=> setNameEdit(e.target.value)} placeholder='Enter name' type="text" name="" id="" />
                <input value={emailEdit} onChange={(e)=> setEmailEdit(e.target.value)} placeholder='Enter Email' type="text" name="" id="" />
                <input value={phoneEdit} onChange={(e)=> setPhoneEdit(e.target.value)} placeholder='Enter Phone' type="text" name="" id="" />
                <select value={statusEdit} onChange={(e) => setStatusEdit(e.target.value)}>
                  <option value="">Choose Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </Modal>
          </div>
          )
        }): 
          <div className='notFound'>Not Found</div>
        }
      </div> 
    </>
  )
}

export default App
