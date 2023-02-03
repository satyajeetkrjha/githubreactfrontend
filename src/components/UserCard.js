import React ,{useEffect,useState} from 'react'
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';


const UserCard =(props)=>{
 console.log('this.props ',props);
 const{userinfo,repos} = props;
 console.log('userinfo and repos are ',userinfo, repos);
  return(
    <Card style={{margin:'20px'}} sx={{ width: 300 }}>
    <CardContent style={{padding:'10px'}}>
        <div style={{display:'flex'}}>
          <Typography>
            Username: 
          </Typography>
          <Typography>
            {userinfo && userinfo.username}
          </Typography>
        </div>
        <div style={{display:'flex'}}>
          <Typography>
            Name: 
          </Typography>
          <Typography>
            {userinfo && userinfo.name}
          </Typography>
        </div>
        <div style={{display:'flex'}}>
          <Typography>
            Total followers: 
          </Typography>
          <Typography>
            {userinfo && userinfo.total_followers}
          </Typography>
        </div>
        <div style={{display:'flex'}}>
          <Typography>
            Public repos: 
          </Typography>
          <Typography>
            {userinfo && userinfo.total_publicrepos}
          </Typography>
        </div>
        <div style={{display:'flex'}}>
          <Typography>
            Location: 
          </Typography>
          <Typography>
            {userinfo && userinfo.location}
          </Typography>
        </div>
        <div style={{display:'flex'}}>
        <Typography>
            Bio : 
          </Typography>
          <Typography>
            {userinfo && userinfo.bio}
          </Typography>
        </div>
        <Typography>Public</Typography>
        <div>
          {
            repos && repos.map((item)=>{
              return(
                <Typography>
                {item && item.name}
              </Typography>
              )
            })
          }
        </div>
    </CardContent>

   </Card>
        
   
  )
}
   
    

       

       
                    
   
export default UserCard