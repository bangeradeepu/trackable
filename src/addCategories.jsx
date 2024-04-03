import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const addCategories = ({serverUrl}) => {

    const [typeData,setTypeData] = useState([]);
    const [typeName, setTypeName] = useState('');
    const typeNameRef = useRef(null);
    useEffect(() => {
        const fetchTypeData =async() => {
            try {
                const  responseTypeData = await axios.get(`${serverUrl}/api/getType`);
                setTypeData(responseTypeData.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTypeData();
    },[])

    const  handlePostType = async() =>{
        try {
            const responseTypeData = await axios.post(`${serverUrl}/api/postType`,{
                typeName:typeName
            });
            setTypeData([...typeData,responseTypeData.data]);
            setTypeName('');
            typeNameRef.current.focus();
        } catch (error) {
            console.error(error);
        }
    }
    const handleDelteType = async(id) =>{
        try {
            const responseTypeData = await axios.delete(`${serverUrl}/api/deleteType/${id}`);
            if (responseTypeData.status === 200) {
                setTypeData((prevType) => prevType.filter((type) => type._id !== id));
              } else {
                console.error('Failed to delete member');
              }
        } catch (error) {
            console.error(error);
        }
    }
    const handleTypeKeyPress = (e) => {
        if (e.key === "Enter") {
          handlePostType();
        }
      };


      const [occassionData,setOccassionData] = useState([]);
      const [occassionName,setOccassionName] = useState('');
      const occassionRef = useRef(null);
      useEffect(() => {
        const fetchOccassion = async() => {
            try {
                const occassionDataResponse = await axios.get(`${serverUrl}/api/getOccassion`)
                setOccassionData(occassionDataResponse.data);
                
            } catch (error) {
                console.error(error)
            }
        }
        fetchOccassion();
      },[]);

      const handlePostOccassion = async() => {
        try {
            const occassionDataResponse = await axios.post(`${serverUrl}/api/postOccassion`,{
                occassionName:occassionName
            })
            setOccassionData([...occassionData,occassionDataResponse.data]);
            setOccassionName('');
        } catch (error) {
            console.error(error);
        }
      }
      const handleDeleteOccassion = async(id) => {
        try {
            const deleteOccassionResponse = await axios.delete(`${serverUrl}/api/deleteOccassion/${id}`);
            if (deleteOccassionResponse.status === 200) {
                setOccassionData((prevOccassion) => prevOccassion.filter((occassion) => occassion._id !== id));
              } else {
                console.error('Failed to delete member');
              }
        } catch (error) {
            
        }
      }
      const handleOccassionKeypress = (e) => {
        if (e.key === "Enter") {
            handlePostOccassion();
          }
      }

      const [memberRoleData,setMemberRoleData] = useState([]);
      const [memberRoleName,setMemberRoleName] = useState('');
      const memberRoleRef = useRef(null);

      useEffect(() => {
        const fetchMemberRole = async() =>  {
            try {
                const memberRoleResponse = await axios.get(`${serverUrl}/api/getMemberRole`);
                setMemberRoleData(memberRoleResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchMemberRole();
      },[]);

      const hanldeAddMemberRole = async() =>{
        try {
            const memberRoleResponse = await axios.post(`${serverUrl}/api/postMemberRole`,{
                memberRoleCat:memberRoleName
            });
            setMemberRoleData([...memberRoleData,memberRoleResponse.data]);
            setMemberRoleName('');
        } catch (error) {
            console.error(error);
        }
      }
      const handleDeleteMemberRole = async(id) => {
        try {
            const deleteMemberRole = await axios.delete(`${serverUrl}/api/deleteMemberRole/${id}`);
            if (deleteMemberRole.status === 200) {
                setMemberRoleData((prevMemberRole) => prevMemberRole.filter((memberRole) => memberRole._id !== id));
              } else {
                console.error('Failed to delete member');
              }
        } catch (error) {
            
        }
      }
      const handleMemberRoleKeyPress = (e) => {
        if (e.key === "Enter") {
            hanldeAddMemberRole();
          }
      }
  return (
    <div className='pd1'>
       <div className="flex space-evenly">
       <div className="addCatBox pd1">
        <div className='primary f14'>Add Item Type</div>
            <div className='flex space-evenly mt-1'>
                <div className='flex'>
                <input type="text" className='addCatSearch' placeholder='Enter Item type' value={typeName} onChange={(e) => setTypeName(e.target.value)} ref={typeNameRef} onKeyPress={handleTypeKeyPress}
                  required/>
                <button className='addCatButton c-pointer' onClick={handlePostType}>Add</button>
                </div>
            </div>
            <div className="addCatList mt-1">
            {typeData.map((type) => (
                <div className="displayRowCardMembers flex space-between"key={type._id}>
                    <div>{type.typeName}</div>
                    <DeleteIcon onClick={() => handleDelteType(type._id)} className='icon c-pointer' />
                </div>
            ))}
            </div>
        </div>
        <div className="addCatBox pd1">
        <div className='primary f14'>Add Occassions</div>
            <div className='flex space-evenly mt-1'>
                <div className='flex'>
                <input type="text" className='addCatSearch' placeholder="Enter Occassions" value={occassionName} onChange={(e) => setOccassionName(e.target.value)} ref={occassionRef} required onKeyPress={handleOccassionKeypress}/>
                <button className='addCatButton c-pointer' onClick={handlePostOccassion}>Add</button>
                </div>
            </div>
            <div className="addCatList mt-1">
                {occassionData.map((occassion) => (
                    <div className="displayRowCardMembers flex space-between" key={occassion._id}>
                    <div>{occassion.occassionName}</div>
                    <DeleteIcon onClick={() => handleDeleteOccassion(occassion._id)} className='icon c-pointer' />
                </div>
                ))}
                
            </div>
        </div>
        <div className="addCatBox pd1">
        <div className='primary f14'>Add Member Role</div>
            <div className='flex space-evenly mt-1'>
                <div className='flex'>
                <input type="text" className='addCatSearch' placeholder="Enter Member Role" value={memberRoleName} onChange={(e) => setMemberRoleName(e.target.value)} ref={memberRoleRef} onKeyPress={handleMemberRoleKeyPress} required={true}  />
                <button className='addCatButton c-pointer' onClick={hanldeAddMemberRole}>Add</button>
                </div>
            </div>
            <div className="addCatList mt-1">
            {memberRoleData.map((member) => (
                    <div className="displayRowCardMembers flex space-between" key={member._id}>
                    <div>{member.memberRoleCat}</div>
                    {!(member.memberRoleCat === 'Accountant' || member.memberRoleCat === 'President' || member.memberRoleCat === 'Vice-President') && (
                  <DeleteIcon onClick={() => handleDeleteMemberRole(member._id)} className='icon c-pointer' />
                )}
                </div>
                ))}
            </div>
        </div>
       </div>
    </div>
  )
}

export default addCategories