import React ,{useEffect,useState} from 'react'
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import Multiselect from 'multiselect-react-dropdown';

const service_url ="http://127.0.0.1:8000/api"

const AllUsers =()=>{
    const [users,setUsers] = useState([]);
    const[selectedusers,setSelectedusers] = useState([]);


    const user_url = service_url+'/allusers/';
    // behaves like component did mount and only on first load of web app this is called
    useEffect(()=>{
        axios.get(user_url)
        .then((resp) => {
           console.log(resp && resp.data);
           setUsers(resp && resp.data);
       })
        .catch((err) =>{
           console.log(err)
       });
   
      },[]);

    const  onSelect =(event) =>{
        const updatedUsers = [...event]
        setSelectedusers(updatedUsers);
    }
    
    const onRemove =(event) => {
        const updatedUsers = [...event]
        setSelectedusers(updatedUsers);
    }
    console.log('printing selected users ',selectedusers);
    return ( 
        <div style={{width:"300px",dsiplay:"flex"}}>
         <Multiselect
           options ={users}
           displayValue="username"
           onSelect={(event) =>onSelect(event)}
           onRemove={(event)=>onRemove(event)}
         />
         </div>
          
    )
}
export default AllUsers