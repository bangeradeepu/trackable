import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import './index.css'
import './App.css'

const home = ({emailId,gPicture,gSubId,gName,serverUrl}) => {
  const navigate = useNavigate();

  const [bankDetails, setBankDetails] = useState([]);
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const bankDetailsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/getBankDetails`);
        setBankDetails(bankDetailsResponse.data);
        console.log(bankDetailsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBankData();
  },[])
  return (
   <div className='pd1'>
    <div className="flex">
    <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQ1LTMtMDktbmFwXzEuanBn.jpg" alt="" className='homePageImg' />
    <div className='mainPageBox'>
    <div className="mainPageTitle flex flex-end">
          <div className='f40' style={{textAlign:'right',lineHeight:'10vh'}}>
            <div>Keep</div>
            <div><span className='primary'>Track </span>of your</div>
            <div>Every Bills</div>
            <div className='f20'>With</div>
           <div className='flex align-item-center'>
            <img src="https://purepng.com/public/uploads/large/purepng.com-flower-vectorflower-clipart-vector-floral-96152467976291dkh.png" alt="" className='logoBigHome' />
           <div className='primary'>Trackable</div>
           </div>
          </div>
    </div>
    <div className="flex space-evenly mt-2">
      <Link to="/donation" className='homePageNavButton c-pointer'>Add Donations</Link>
      <Link to="/spends" className='homePageNavButton c-pointer'>Add Spends</Link>
      <Link to="/itemLists" className='homePageNavButton c-pointer'>Create Item List</Link>
    </div>
    {/* <div className="flex space-evenly">
    <div className='homeDisplaySectionBox'>
      <div className='primary f14'>Bank Balance</div>
      <div className='primary mt-1 f30'>10000</div>
      <button className='button'>View</button>
    </div>
    <div className='homeDisplaySectionBox'>
      <div className='primary'>Spends</div>
    </div>
    <div className='homeDisplaySectionBox'>
      <div className='primary'>Members</div>
    </div>
    </div> */}
    </div>
    </div>
   </div>
  )
}

export default home