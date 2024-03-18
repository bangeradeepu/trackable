import React from 'react'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
const userAccount = ({emailId,gPicture,gSubId,gName,onLogout,serverUrl}) => {
  return (
    <div className='pd1'>
      <div className="flex space-evenly">
      <div className='firstAddWindow'>
        <div className='primary f16'>Account</div>
        <div className=" mt-1 flex space-between align-item-center">
         <div className="flex align-item-center g1">
         <img src={gPicture} alt="" className='userProfileImg' />
          <div>
            <div className='f14'>{gName}</div>
            <div className='grey f10'>{emailId}</div>
            </div>
         
         </div>
         <div className='hvGreen grey c-pointer flex align-item-center' onClick={onLogout}><PowerSettingsNewIcon /><div>Logout </div></div>
        </div>
        <hr className='mt-1' />
        <div className='mt-1'>
          <div>
          <div className='grey f8'>Phone Number</div>
          <div>+91 630061656</div>
          </div>
          <div className='mt-1'>
          <div className='grey f8'>User ID</div>
          <div>{gSubId}</div>
          </div>
          <div className="mt-3 flex flex-end">
            <button className='deleteButton c-pointer'>Delete Account</button>
            
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default userAccount