import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./App.css";
import "./index.css";

const members = ({serverUrl}) => {
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberPhoneNumber, setMemberPhoneNumber] = useState("");
  const [memberAddress, setMemberAddress] = useState("");
  const [memberData, setMemberData] = useState([]);
  const donatorNameRef = useRef(null);
  const [expandedMembers, setExpandedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const  [error,setError] = useState('');

  // Function to set the error and clear it after a delay
  const setErrorWithTimeout = (errorMessage, duration) => {
    setError(errorMessage);

    // Clear the error after the specified duration
    setTimeout(() => {
      setError('');
    }, duration);
  };
  
  const [showFileInput, setShowFileInput] = useState(false);

  const handleToggleExpand = (memberId) => {
    setExpandedMembers((prevExpandedMembers) => {
      if (prevExpandedMembers.includes(memberId)) {
        // If member is already expanded, collapse it
        return prevExpandedMembers.filter((id) => id !== memberId);
      } else {
        // If member is not expanded, expand it
        return [...prevExpandedMembers, memberId];
      }
    });
  };
  const [memberImage, setMemberImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMemberImage(file);
  };
  
  const handleAddMembers = async () => {
    if(memberRole === 'Member'){
      if (memberName === '' || memberRole === '' || memberPhoneNumber === '' || memberAddress === '') {
        let errorMessage = 'Please fill the following fields: ';
        
        if (memberName === '') {
          errorMessage += 'Member Name, ';
        }
        
        if (memberRole === '') {
          errorMessage += 'Member Role, ';
        }
        
        if (memberPhoneNumber === '') {
          errorMessage += 'Member Phone Number, ';
        }
        
        if (memberAddress === '') {
          errorMessage += 'Member Address, ';
        }
      
        // Remove the trailing comma and space
        errorMessage = errorMessage.slice(0, -2);
      
        setErrorWithTimeout(errorMessage),5000;
      } else {
        try {
          const formData = new FormData();
          formData.append('memberName', memberName);
          formData.append('memberAddress', memberAddress);
          formData.append('memberRole', memberRole);
          formData.append('memberPhoneNumber', memberPhoneNumber);
    
          // Check if memberRole is not "Member" before appending the image
          if (memberRole !== 'Member') {
            formData.append('image', memberImage);
          }
    
          const responseAddMembers = await axios.post(
            `${serverUrl}/api/postMembersNoImage`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
    
          setMemberData([...memberData, responseAddMembers.data]);
          setMemberName('');
          setMemberPhoneNumber('');
          setMemberAddress('');
          donatorNameRef.current.focus();
        } catch (error) {
          console.error(error);
        } finally{
          setMemberImage(null);

        }
      }
    }else{
      if (memberName === '' || memberRole === '' || memberPhoneNumber === '' || memberAddress === '' || memberImage === null) {
        let errorMessage = 'Please fill the following fields: ';
        
        if (memberName === '') {
          errorMessage += 'Member Name, ';
        }
        
        if (memberRole === '') {
          errorMessage += 'Member Role, ';
        }
        
        if (memberPhoneNumber === '') {
          errorMessage += 'Member Phone Number, ';
        }
        
        if (memberAddress === '') {
          errorMessage += 'Member Address, ';
        }
        
        if (memberImage === null) {
          errorMessage += 'Member Image, ';
        }
      
        // Remove the trailing comma and space
        errorMessage = errorMessage.slice(0, -2);
      
        setErrorWithTimeout(errorMessage,5000);
      }  else {
        try {
          const formData = new FormData();
          formData.append('memberName', memberName);
          formData.append('memberAddress', memberAddress);
          formData.append('memberRole', memberRole);
          formData.append('memberPhoneNumber', memberPhoneNumber);
    
          // Check if memberRole is not "Member" before appending the image
          if (memberRole !== 'Member') {
            formData.append('image', memberImage);
          }
    
          const responseAddMembers = await axios.post(
            `${serverUrl}/api/postMembers`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
    
          setMemberData([...memberData, responseAddMembers.data]);
          setMemberName('');
          setMemberPhoneNumber('');
          setMemberAddress('');
          donatorNameRef.current.focus();
        } catch (error) {
          console.error(error);
        } finally{
          setMemberImage(null);

        }
      }
    }
  };
  
  

  const handleDeleteMember =  async(memberId) => {
    try {
        const memberDeleteResponse = await axios.delete(`${serverUrl}/api/deleteMember/${memberId}`);
        if (memberDeleteResponse.status === 200) {
            // If successful, update the memberData state by filtering out the deleted member
            setMemberData((prevMembers) => prevMembers.filter((member) => member._id !== memberId));
          } else {
            console.error('Failed to delete member');
          }
    } catch (error) {
        console.error(error);
    }
  }
  useEffect(() => {
    const fetchMemberData = async () => {
      
      try {
        const responseMemberData = await axios.get(
          `${serverUrl}/api/getMembers`
        );
        setMemberData(responseMemberData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMemberData();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddMembers();
    }
  };
  // Filter members based on search query
  const filteredMembers = memberData.filter((member) =>
    member.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const [memberRoleData,setMemberRoleData] = useState([]);
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


  return (
    <div className="pd1">
      <div className="flex space-between">
        <div className="bankDetailsWhiteBox bg-white">
          <div className="primary f20">Members</div>
          <div className="flex justify-content-center align-item-center">
            <div>
              <div className="mt-1">
                <div className="grey">Member Name</div>
                <input
                  type="text"
                  className="txtBox"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  ref={donatorNameRef}
                  required
                />
              </div>
              <div className="mt-1">
                <div className="grey">Member Role</div>
              </div>
              <select
  name=""
  className="txtBoxDD"
  id=""
  value={memberRole}
  onChange={(e) => setMemberRole(e.target.value)}
>
  <option value="" disabled>
    Choose Member Role
  </option>
  {memberRoleData.map((memberRole) => {
    // Check if the role is "Member" or if it is not present in the member data
    if (memberRole.memberRoleCat === 'Member' || !memberData.some(member => member.memberRole === memberRole.memberRoleCat)) {
      return (
        <option
          key={memberRole._id}
          value={memberRole.memberRoleCat}
        >
          {memberRole.memberRoleCat}
        </option>
      );
    } else {
      return null; // Don't render this role in the dropdown
    }
  })}
</select>

                  <div className="mt-1">
                  {memberRole !== 'Member' && memberRole !== '' && (
          <div className="mt-1">
            <div className="grey">Member Image</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
        )}

                  </div>
              <div className="mt-1">
                <div className="grey">Member Phone Number</div>
                <input
                  type="number"
                  className="txtBox"
                  value={memberPhoneNumber}
                  onChange={(e) => setMemberPhoneNumber(e.target.value)}
                />
              </div>
              <div className="mt-1">
                <div className="grey">Member Address</div>
                <input
                  type="text"
                  className="txtBox"
                  value={memberAddress}
                  onChange={(e) => setMemberAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
             
              <div className="button mt-2 c-pointer" onClick={handleAddMembers}>
                Add Member
              </div>
              <div className="red f10 fw-700 mt-2">{error}</div>
            </div>
            
          </div>

        </div>
        <div className="bankDetailsWhiteBox bg-white">
          <div className="flex space-evenly">
            <input
              type="text"
              className="searchTxtBoxMembers"
              placeholder="Enter Member Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="membersDetailsScrollable">
            {filteredMembers.map((member) => (
              <div className="displayRowCardMembers mt-1" key={member._id}>
                <div className=" flex space-between">
                  <div>{member.memberName}</div>
                  <div className="memberTag f8 fw-700">{member.memberRole}</div>
                  
                </div>
                <div className="flex space-between align-item-center mt-1">
                  <div
                    className="c-pointer"
                    onClick={() => handleToggleExpand(member._id)}
                  >
                    {expandedMembers.includes(member._id) ? (
                      <div className="flex align-item-center icon">
                        <span className="f10">View Less</span>
                        <ExpandLessIcon />
                      </div>
                    ) : (
                      <div className="flex align-item-center icon">
                        <span className="f10">View More</span>

                        <ExpandMoreIcon />
                      </div>
                    )}
                  </div>
                  <DeleteIcon className="icon c-pointer" onClick={() => handleDeleteMember(member._id)} />
                </div>
                {expandedMembers.includes(member._id) && (
                  <div className="additionalInfo">
                    <hr className="mt-1" />
                    {/* Display additional information here */}
                    <div className="flex mt-1">
                        <div className="flex-1">
                            <div className="grey f8">Phone Number</div>
                            <div>{member.memberPhoneNumber}</div>
                        </div>
                        <div className="flex-1">
                            <div className="grey f8" >Registered Date</div>
                            <div>{member.createdAt}</div>
                        </div>
                    </div>
                    <div className="flex mt-1">
                        <div className="flex-1">
                            <div className="grey f8">Address</div>
                            <div>{member.memberAddress}</div>
                        </div>
                        <div className="flex-1">
                            <div className="grey f8">{member._id}</div>
                        </div>
                    </div>
                    {member.memberRole !== 'Member' && member.memberRole !== '' && (
                    <div className="mt-1">
                      <div className="grey f8 ">Signature</div>
                      
                              {member.memberImage && (
              <img
                src={`${serverUrl}${member.memberImage}`}
                alt={member.memberName} className="signatureMember"
              />
            )}
                            </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default members;
