import axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useGoogleLogin } from '@react-oauth/google';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import "./App.css";
import Home from "./home";
import Donation from "./donation";
import Spends from "./spends";
import BankDatas from "./bankDetails";
import Members from "./members";
import AddCategories from "./addCategories";
import ItemList from './itemList';
import Report from './report';
import UserAccount from './userAccount';
export default function App() {
  const SERVER_URL = import.meta.env.VITE_REACT_APP_API_URL;
    const [cred,setCred] = useState('');
    const [cookieEmail,setCookieEmail] = useState('');
    const [cookiePicture,setCookiePicture] = useState('');
    const [cookieName,setCookieName] = useState('');
    const [cookieSubId,setCookieSubId] = useState('');
    useEffect(() =>{
      const emailCookie = Cookies.get('email');
      if (emailCookie) {
        setCookieEmail(emailCookie);
      }
      const picture = Cookies.get('picture');
      if(picture){
        setCookiePicture(picture);
      }
      const name = Cookies.get('givenName');
      if(name){
        setCookieName(name);
      }
      const sub = Cookies.get('subId');
      if(sub){
        setCookieSubId(sub);
      }
    })

    const handleLogout = () => {
      Cookies.remove('email');
      Cookies.remove('givenName');
      Cookies.remove('picture');
      Cookies.remove('subId');
      setCred('');
      window.location.reload();
    };
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const closeDrawer=()=>{
    setState(false);
  }

  const [bankDetails, setBankDetails] = useState({});
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const bankDetailsResponse = await axios.get(
          `${SERVER_URL}/api/getBankDetails`
        );
        setBankDetails(bankDetailsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBankData();
  }, []);

 
  return (
    <div>
      {!cookieEmail &&( 
      <div className="pd1">
        <div  style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "85vh",
        }} >
        <div className="firstAddWindowLogin flex">
          <div>
            <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQ1LTMtMDktbmFwXzEuanBn.jpg" alt=""className="loginVector" />
          </div>
          <div className="pd1">
            <div className="oqfg">
            <div className="flex align-item-center space-between">
              <div className="f14">Login please</div>
              <div className="flex align-item-center">
              <img src="https://purepng.com/public/uploads/large/purepng.com-flower-vectorflower-clipart-vector-floral-96152467976291dkh.png" className="logoImg" alt="" />
              <div className="primary f14">Trackable</div>
              </div>
             
            </div>
            </div>

            <div className="oqfg mt-1 flex space-evenly" style={{marginTop:'10vh'}}>
             <div>
              <div className="mt-1 lgnbtn flex space-evenly">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                  Cookies.set('email', credentialResponseDecoded.email);
                  Cookies.set('givenName',credentialResponseDecoded.given_name);
                  Cookies.set('subId',credentialResponseDecoded.sub);
                  Cookies.set('picture',credentialResponseDecoded.picture)
                  setCred(credentialResponseDecoded.email);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                size="medium"
                shape="circle"
              />
              </div>
              <div className="text-align-center mt-2">OR</div>
             <div className="flex space-evenly mt-2">
             <input type="text" name="" className="loginBar" placeholder="Enter Email address" />
             </div>
             <div className="flex space-evenly mt-2">
             <input type="password" name="" className="loginBar" placeholder="Password" />
             </div>
             <div className="flex space-evenly">
             <button className="button c-pointer mt-1">Next</button>
             </div>
             </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      )}
    {cookieEmail &&(
      <Router>
        <Drawer
          anchor="right"
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          <Link to="/" className="text-decoration"><div className="primary f16 flex align-item-center pd1"><img src="https://purepng.com/public/uploads/large/purepng.com-flower-vectorflower-clipart-vector-floral-96152467976291dkh.png" className="logoImg" alt="" />Trackable</div></Link>
         <div className="sideNav f12">
         <div className="sideNavBack" >
            <Link to="/" className="sideNavLink" onClick={closeDrawer} >Home</Link>
          </div>
          <div>
            <Link to="/donation" className="sideNavLink"  onClick={closeDrawer} >Donation</Link>
          </div>
          <div>
            <Link to="/spends" className="sideNavLink"  onClick={closeDrawer} >Spends</Link>
          </div>
          <div>
            <Link to="/members" className="sideNavLink"  onClick={closeDrawer} >Members</Link>
          </div>
          <div>
            <Link to="/itemLists" className="sideNavLink"  onClick={closeDrawer} >Item Lists</Link>
          </div>
          <div>
            <Link to="/addCategories" className="sideNavLink"  onClick={closeDrawer} >Categories</Link>
          </div>
          <div>
            <Link to="/report" className="sideNavLink"  onClick={closeDrawer} >Report</Link>
          </div>
          <div>
            <Link to="/bankDetails" className="sideNavLink"  onClick={closeDrawer} >Organization Profile</Link>
          </div>

         
         </div>
         <div className="userProfile flex space-between align-item-center">
         <div className="flex g1 align-item-center">
         <img src={cookiePicture} className="userProfileImgThumb" alt="" />
          <div>
            <div className="f10">{cookieName}</div>
            <div ><Link className="grey hvGreen c-pointer f9 text-decoration" to="/userAccount" onClick={closeDrawer}>View Profile</Link></div>
          </div>
         </div>
          <div><PowerSettingsNewIcon onClick={handleLogout} className="icon c-pointer" /></div>
         </div>
         <div className="f8 fw-500 flex align-item-center justify-content-center mt-1">
          <div>
          <div>
          By Deepesh M Bangera
          </div>
          <div className="flex justify-content-center ">version: v1</div>
          </div>
         </div>
        </Drawer>
        <div className="flex space-between navigation bg-white align-item-center">
          <Link to="/" className="text-decoration"><div className="primary   f16 flex align-item-center "><img src="https://purepng.com/public/uploads/large/purepng.com-flower-vectorflower-clipart-vector-floral-96152467976291dkh.png" className="logoImg" alt="" />Trackable</div></Link>
          <MenuIcon className="primary c-pointer" onClick={toggleDrawer("right", true)} />
        </div>
        <Routes>
          <Route path="/" element={<Home emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} /> }></Route>
          <Route path="/donation" element={<Donation emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/spends" element={<Spends emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/bankDetails" element={<BankDatas emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/members" element={<Members emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/addCategories" element={<AddCategories emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/itemLists" element={<ItemList emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/report" element={<Report emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} />}></Route>
          <Route path="/userAccount" element={<UserAccount emailId={cookieEmail} gPicture={cookiePicture} gSubId={cookieSubId} gName={cookieName} serverUrl={SERVER_URL} onLogout={handleLogout} />}></Route>
        </Routes>
      </Router>
      )}
    </div>
  );
}

