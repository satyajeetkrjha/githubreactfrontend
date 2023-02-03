import React ,{useEffect,useState} from 'react'
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import Multiselect from 'multiselect-react-dropdown';
import { render } from '@testing-library/react';
import UserCard from './UserCard';
import SecondSearch from './SecondSearch';

const service_url ="http://127.0.0.1:8000/api"

const AllUsers =()=>{
    const [users,setUsers] = useState([]);
    const[selectedusers,setSelectedusers] = useState([]);
    const[repos,setRepos] = useState([]);
    const[oldrepos,setOldrepos] = useState([])
    const[githubusernames,setGithubusernames] = useState('');
    const[secondrepos,setSecondrepos] = useState([]);

    const user_url = service_url+'/allusers/';
    // behaves like component did mount and only on first load of web app this is called
    useEffect(()=>{
        axios.get(user_url)
        .then((resp) => {
           setUsers(resp && resp.data);
           
       })
        .catch((err) =>{
           console.log(err)
       });
   
      },[secondrepos]);

      useEffect(()=>{
        let usernames;
        let users =[];
        for(let i =0 ;i<selectedusers.length;i++){
            let user = selectedusers[i];
            users.push(user.username);
        }
        
        let newuser;
        let repo_url=service_url +'/repos?';
        for(let i =0 ;i<users.length;i++){
            if(i === (users.length -1)){
              newuser = `username${i+1}=`+ users[i];
            }
            else{
                newuser = `username${i+1}=`+ users[i] +'&&'
            } 
            repo_url+=newuser;
            
        }
       
        
        axios.get(repo_url)
        .then((resp) => {
           axios.get(user_url)
        .then((resp) => {
           console.log(resp && resp.data);
           setUsers(resp && resp.data);
           
       })
        .catch((err) =>{
           console.log(err)
       });
           setOldrepos(resp && resp.data && resp.data.oldusers)
           setRepos(resp && resp.data);
           

       })
        .catch((err) =>{
           console.log(err)
       });
   
       
      },[selectedusers])

    const  onSelect =(event) =>{
        const updatedUsers = [...event]
        setSelectedusers(updatedUsers);
    }
    
    const onRemove =(event) => {
        const updatedUsers = [...event]
        setSelectedusers(updatedUsers);
    }
    const userNameChange =(e)=>{
        let Changedname =e.target.value;
        setGithubusernames(Changedname);
        
     }
     const getRepos=(e)=>{
        let allusernames = githubusernames && githubusernames.split(',');
        let repo_url=service_url +'/repos?';
        let newuser;
        console.log('.....',allusernames);
        for(let i =0 ;i<allusernames.length;i++){
            if(i === (allusernames.length -1)){
              newuser = `username${i+1}=`+allusernames[i];
            }
            else{
                newuser = `username${i+1}=`+ allusernames[i] +'&&'
            } 
            repo_url+=newuser;
        }
        axios.get(repo_url).then((resp)=>{
            let newUserRepos =[]
            let oldUserRepos =[]
            const ids = new Set();
            let newusers = resp && resp.data &&  resp.data.newusers;
            for(const item of  newusers){
                ids.add(item.githubuser);
            }
            ids.forEach (function(value) {
                 let repo = newusers && newusers.filter((item)=> item.githubuser == value)
                 console.log('fileterd repo is ',repo);
                 newUserRepos.push(repo);
              })
            let oldusers = resp && resp.data && resp.data.oldusers;
            for(let i =0 ;i <oldusers.length;i++){
                oldUserRepos.push(oldusers[i]);
            }
            let combinedUsers = [...newUserRepos,...oldUserRepos];
            setSecondrepos(combinedUsers);
        })
        .catch((err)=>{
            console.log("err is",err);
        })

     }

    return ( 
        <div style={{display:"flex"}}>
            <div style={{width:"400px",marginTop:"50px",marginLeft:"20%"}}>
             <Typography sx={{fontWeight: 'bold'}}>Search usernames from database</Typography>   
            <Multiselect
           options ={users}
           displayValue="username"
           onSelect={(event) =>onSelect(event)}
           onRemove={(event)=>onRemove(event)}
         />
         {
          oldrepos && oldrepos.map((item)=>{
             console.log('item ',item);
             let githubuser = item.length >0 ? item[0]['githubuser']:null;
             let user = users.filter((user)=> (user.id === githubuser));
                return(
                    <div>
                        <UserCard repos ={item} userinfo={user[0]}/>

                     </div>
                )
            })
         }
            </div>
            <div style={{marginTop:"50px"}}>
            <Typography sx={{fontWeight: 'bold'}}>Search usernames from internet</Typography>   
            <input style={{width:"400px",height:"30px",marginLeft:"50px"}} placeholder='Enter usernames seperated by commas'
             type="text" value={githubusernames} onChange={(e)=>userNameChange(e)} ></input>
             <button onClick={(e)=>getRepos(e)}  style={{width:"200px",height:"30px",marginLeft:"10px"}}>Get Repos</button>
             {
           secondrepos && secondrepos.map((item)=>{
             console.log('item ',item);
             let githubuser = item.length >0 ? item[0]['githubuser']:null;
             let user = users.filter((user)=> (user.id === githubuser));
             console.log('user secondrepo ',user);
                return(
                    <div>
                        <SecondSearch repos ={item}  />

                     </div>
                )
            })
         }
            </div>
           
         
         </div>
          
    )
}
export default AllUsers