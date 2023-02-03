import React ,{useEffect,useState} from 'react'
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import Multiselect from 'multiselect-react-dropdown';
import { render } from '@testing-library/react';
import UserCard from './UserCard';
import SearchCard from './SecondSearch';

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
           console.log(resp && resp.data);
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
        console.log("users ",users);
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
            console.log('newuser is ',newuser);
        }
        console.log("query_params is ",repo_url); 
        
        axios.get(repo_url)
        .then((resp) => {
           console.log("old resp ",resp && resp.data && resp.data.oldusers);
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
        console.log('..... ',Changedname);
        setGithubusernames(Changedname);
        
     }
     const getRepos=(e)=>{
        console.log('button clicked')
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
            console.log('newuser is ',newuser);
        }
        axios.get(repo_url).then((resp)=>{
            let newUserRepos =[]
            let oldUserRepos =[]
            console.log("resp is ",resp);
            const ids = new Set();
            let newusers = resp && resp.data &&  resp.data.newusers;
            for(const item of  newusers){
                ids.add(item.githubuser);
            }
            console.log("ids ",ids);
            ids.forEach (function(value) {
                 let repo = newusers && newusers.filter((item)=> item.githubuser == value)
                 console.log('fileterd repo is ',repo);
                 newUserRepos.push(repo);
              })
            console.log('new.. ',newUserRepos);
            let oldusers = resp && resp.data && resp.data.oldusers;
            for(let i =0 ;i <oldusers.length;i++){
                oldUserRepos.push(oldusers[i]);
            }
            let combinedUsers = [...newUserRepos,...oldUserRepos];
            console.log('combinedusers ',combinedUsers);
            setSecondrepos(combinedUsers);
        })
        .catch((err)=>{
            console.log("err is",err);
        })

     }
    console.log('printing selected users ',selectedusers ,repos);
    console.log('oldrepos ',oldrepos);
    console.log('secondrepos ',secondrepos);
    return ( 
        <div style={{display:"flex"}}>
            <div style={{width:"400px",marginTop:"50px",marginLeft:"20%"}}>
            <Multiselect
           options ={users}
           displayValue="username"
           onSelect={(event) =>onSelect(event)}
           onRemove={(event)=>onRemove(event)}
         />
         {
          oldrepos && oldrepos.map((item)=>{
             console.log('item ',item);
             let githubuser = item[0]['githubuser'];
             console.log('username ', item[0]['githubuser']);
             let user = users.filter((user)=> (user.id === githubuser));
             console.log('user ',user);
                return(
                    <div>
                        <UserCard repos ={item} userinfo={user[0]}/>

                     </div>
                )
            })
         }
            </div>
            <div>
            <input style={{width:"400px",height:"30px",marginTop:"50px",marginLeft:"50px"}} placeholder='Enter usernames seperated by commas'
             type="text" value={githubusernames} onChange={(e)=>userNameChange(e)} ></input>
             <button onClick={(e)=>getRepos(e)}  style={{width:"200px",height:"30px",marginLeft:"10px"}}>Get Repos</button>
             {
           secondrepos && secondrepos.map((item)=>{
             console.log('item ',item);
             let githubuser = item[0]['githubuser'];
             console.log('username ', item[0]['githubuser']);
             let user = users.filter((user)=> (user.id === githubuser));
             console.log('user ',user);
                return(
                    <div>
                        <SearchCard repos ={item} />

                     </div>
                )
            })
         }
            </div>
           
         
         </div>
          
    )
}
export default AllUsers