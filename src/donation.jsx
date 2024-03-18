import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from 'xlsx';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";


import "./index.css";
import { Edit } from "@mui/icons-material";
const donation = ({emailId,gPicture,gSubId,gName,serverUrl}) => {
  const navigate = useNavigate();
  const [donatorName, setDonatorName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donations, setDonations] = useState([]);
  const [editingDonationId, setEditingDonationId] = useState(null);
  const [editedDonationName, setEditedDonationName] = useState("");
  const [editDonationAmount, setEditDonationAmount] = useState("");
  const [yearGroups, setYearGroups] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [totalDonationForYear, setTotalDonationForYear] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loadingDonation, setLoadingDonation] = useState(false);
  const [bankFetch, setBankFetch] = useState(false);
  const [orgFetch, setOrgFetchData] = useState(false);
  const [typeFetch, setTypeFetch] = useState(false);
  const [occasionFetch,setOccassionFetch] = useState(false);
  const [fetchMem,serFetchMem] = useState(false);
  const [showError,setShowError] = useState('');

  const donatorNameRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await axios.get(
          `${serverUrl}/api/getDonations`
        );
        setDonations(dataResponse.data);
        setLoadingDonation(true);
        const years = Array.from(
          new Set(
            dataResponse.data.map((donation) =>
              new Date(donation.createdAt).getFullYear()
            )
          )
        );
        setYearGroups(years.sort((a, b) => b - a));

        const totalDonationsByYear = {};
        years.forEach((year) => {
          const donationsForYear = dataResponse.data.filter(
            (donation) => new Date(donation.createdAt).getFullYear() === year
          );
          const totalAmount = donationsForYear.reduce(
            (total, donation) => total + donation.donationAmount,
            0
          );
          totalDonationsByYear[year] = totalAmount;
        });
        setTotalDonationForYear(totalDonationsByYear);

        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [bankDetails, setBankDetails] = useState([]);
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const bankDetailsResponse = await axios.get(
          `${serverUrl}/api/getBankDetails`
        );
        setBankDetails(bankDetailsResponse.data);
        setBankFetch(true);
      } catch (error) {
        console.error(error);
      }
    };

    // Initial fetch
    fetchBankData();

    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(() => {
      fetchBankData();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    const filtered = donations
      .filter(
        (donation) =>
          new Date(donation.createdAt).getFullYear() === parseInt(selectedYear)
      )
      .filter((donation) =>
        donation.donatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredDonations(filtered);
  }, [donations, selectedYear, searchTerm]);

  const displayDonationsForYear = (year) => {
    setSelectedYear(year);
  };

  const handleAddDonation = async () => {
    if(donatorName === '' || donationAmount === ''){
      setShowError('Please fill all feilds!');
      const timeoutId = setTimeout(() => {
        setShowError('');
      }, 5000);

      useEffect(() => {
        return () => clearTimeout(timeoutId);
      }, []);
    }else{
      try {
        const dataResponse = await axios.post(
          `${serverUrl}/api/addDonation`,
          {
            donatorName: donatorName,
            donationAmount: donationAmount,
          }
        );
        setDonations([...donations, dataResponse.data]);
  
        const year = new Date(dataResponse.data.createdAt).getFullYear();
        if (!yearGroups.includes(year)) {
          setYearGroups([...yearGroups, year].sort((a, b) => b - a));
        }
  
        const newTotalDonationForYear = { ...totalDonationForYear };
        newTotalDonationForYear[year] =
          (newTotalDonationForYear[year] || 0) + dataResponse.data.donationAmount;
        setTotalDonationForYear(newTotalDonationForYear);
        setDonationAmount("");
        setDonatorName("");
        donatorNameRef.current.focus();
      } catch (error) {
        console.error(error);
      }
    }

  };

  const handleEditDonation = (id) => {
    setEditingDonationId(id);
    const donationToEdit = donations.find((donation) => donation._id === id);
    setEditedDonationName(donationToEdit.donatorName);
    setEditDonationAmount(donationToEdit.donationAmount);
  };

  const handleUpdateDonation = async (id) => {
    try {
      const updatedDonationIndex = donations.findIndex(
        (donation) => donation._id === id
      );

      // Create a copy of the donation to update in the state
      const updatedDonation = {
        ...donations[updatedDonationIndex],
        donatorName: editedDonationName,
        donationAmount: editDonationAmount,
      };

      // Update the state immediately
      const updatedDonations = [...donations];
      updatedDonations[updatedDonationIndex] = updatedDonation;
      setDonations(updatedDonations);

      // Make the API call
      await axios.put(`${serverUrl}/api/editDonation/${id}`, {
        donatorName: editedDonationName,
        donationAmount: editDonationAmount,
      });

      const year = new Date(updatedDonation.createdAt).getFullYear();

      // Update the total donation for the year in the state
      const updatedTotalDonationForYear = { ...totalDonationForYear };
      updatedTotalDonationForYear[year] =
        (updatedTotalDonationForYear[year] || 0) +
        (updatedDonation.donationAmount -
          donations[updatedDonationIndex].donationAmount);
      setTotalDonationForYear(updatedTotalDonationForYear);

      // Clear the editing state
      setEditingDonationId(null);
      setEditedDonationName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDonation = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/deleteDonation/${id}`);
      setDonations(donations.filter((donation) => donation._id !== id));

      const year = new Date().getFullYear();
      const updatedTotalDonationForYear = { ...totalDonationForYear };
      updatedTotalDonationForYear[year] -= donations.find(
        (donation) => donation._id === id
      ).donationAmount;
      setTotalDonationForYear(updatedTotalDonationForYear);
    } catch (error) {
      console.error(error);
    }
  };

  // Dailog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddDonation();
    }
  };
const exportDonationsToExcel = () => {
  // Filtered donations based on selected filters
  const filteredData = filteredDonations
    .filter((donation) => new Date(donation.createdAt).getFullYear() === parseInt(selectedYear));

  // Calculate total donation amount
  const totalDonationAmount = filteredData.reduce((total, donation) => total + donation.donationAmount, 0);


  // Create an array to hold the data
  const dataToExport = filteredData.map((donation) => ({
    Name: editingDonationId === donation._id ? editedDonationName : donation.donatorName,
    Donation: editingDonationId === donation._id ? editDonationAmount : donation.donationAmount,
    CreatedAt: new Date(donation.createdAt).toLocaleString(),
    ID: donation._id,
  }));

  // Add a row for the total donation amount
  dataToExport.push({
    Name: 'Total Donation Amount',
    Donation: totalDonationAmount,
    CreatedAt: '',
    ID: '',
  });
  dataToExport.push({
    Name: '',
    Donation: '',
    CreatedAt: '',
    ID: '',
  });


  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet([...dataToExport]);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Donations');

  // Save the workbook as an Excel file
  XLSX.writeFile(wb, `donations_${selectedYear}.xlsx`);
};




const [typeData, setTypeData] = useState([]);
useEffect(() => {
  const fetchTypeData = async () => {
    try {
      const responseTypeData = await axios.get(
        `${serverUrl}/api/getType`
      );
      setTypeData(responseTypeData.data);
      setTypeFetch(true);
    } catch (error) {
      console.error(error);
    }
  };
  fetchTypeData();
}, []);

const [occassionData, setOccassionData] = useState([]);
useEffect(() => {
  const fetchOccassion = async () => {
    try {
      const occassionDataResponse = await axios.get(
        `${serverUrl}/api/getOccassion`
      );
      setOccassionData(occassionDataResponse.data);
      console.log(occassionDataResponse.data);
      setOccassionFetch(true);
    } catch (error) {
      console.error(error);
    }
  };
  fetchOccassion();
}, []);
const [orgData, setOrgData] = useState([]);
useEffect(() => {
  const fetchOrgData = async () => {
    try {
      const getOrgData = await axios.get(`${serverUrl}/api/getOrg`);
      setOrgData(getOrgData.data);
      setOrgFetchData(true);
    } catch (error) {
      cosnole.error(error);
    }
  };
  fetchOrgData();
}, []);

const [memberData, setMemberData] = useState([]);
useEffect(() => {
  const fetchMemberData = async () => {
    try {
      const responseMemberData = await axios.get(
        `${serverUrl}/api/getMembers`
      );
      setMemberData(responseMemberData.data);
      serFetchMem(true);
    } catch (error) {
      console.error(error);
    }
  };
  fetchMemberData();
}, []);
const handleAddDonationFirst = () => {
  window.location.reload();
  handleAddDonation();
}
  return (
    <div className="pd1">
      
       {orgFetch && typeFetch && bankFetch && loadingDonation && occasionFetch && fetchMem ? (
        <div>
        {donations.length !== 0 ? (
        <div>
            {(bankDetails.length &&
            orgData.length &&
            typeData.length &&
            occassionData.length &&
            memberData.length) === 0 ? (
              <div className="flex justify-content-center">
              <div className="flex justify-content-center completeSetupBox">
                <div>
                  <div className="f14">Please Complete the setup</div>

                  {(bankDetails.length && orgData.length) === 0 && (
                    <div
                      className="mt-2 hvGreen c-pointer secondary"
                      onClick={() => navigate("/bankDetails")}
                    >
                      Set Bank Details and Profile
                    </div>
                  )}
                  {(typeData.length && occassionData.length) === 0 && (
                    <div
                      className="mt-1 hvGreen c-pointer secondary"
                      onClick={() => navigate("/addCategories")}
                    >
                      Add Categories
                    </div>
                  )}
                  {memberData.length === 0 && (
                    <div
                      className="mt-1 hvGreen c-pointer secondary"
                      onClick={() => navigate("/members")}
                    >
                      Add Members
                    </div>
                  )}
                </div>
              </div>
            </div>
            ):(
              <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Add Donation"}</DialogTitle>
        <DialogContent>
          <div>
            <label>Donator Name </label>
            <div>
              <input
                type="text"
                className="txtBox"
                value={donatorName}
                onChange={(e) => setDonatorName(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={donatorNameRef}
                required
              />
            </div>
          </div>
          <div className="mt-1">
            <label>Donation Amount </label>
            <div>
              <input
                type="number"
                className="txtBox"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="button" onClick={handleAddDonation}>
            Add Donation
          </button>
        </DialogActions>
      </Dialog>
      <div className="flex space-between align-item-center">
        <div className="f20 primary">Donations</div>
        <div className="flex g1 align-item-center">
          <div className="flex align-item-center">
            <input
              type="text"
              name=""
              className="searchTxtBox"
              id=""
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by Donator Name"
            />
          </div>
          <button className="button-outline c-pointer" onClick={exportDonationsToExcel}>
            Export to Excel
          </button>
          <button className="button c-pointer" onClick={handleClickOpen}>
            Add New Donation
          </button>
        </div>
      </div>
      <div className="flex space-evenly boxMain mt-1 g1">
        <div>
          <div className="box-l">
            {yearGroups.map((year) => (
              <div onClick={() => displayDonationsForYear(year)}>
                <div
                  className="displayMenuCard flex space-between mt-1 c-pointer"
                  key={year}
                >
                  {totalDonationForYear[year] && (
                    <div>{`Total Donation in ${year}`}</div>
                  )}
                  <div className="f12 primary fw-200">
                    ₹{totalDonationForYear[year]}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex g2 mt-1">
            <div className="box-showBalance bg-primary">
              <div className="white">
                <div className="f12">Total Savings</div>
                <div className="f25 mt-1">
                  {bankDetails.map((bank) => (
                    <div>₹{bank.balance}</div>
                  ))}
                </div>
                <div className="flex flex-end">
                  <img
                    src="https://purepng.com/public/uploads/large/purepng.com-flower-vectorflower-clipart-vector-floral-96152467976291dkh.png"
                    alt=""
                    className="flowerImg"
                  />
                </div>
              </div>
            </div>
            <div className="boxTotalBalance bg-white">
              {selectedYear && (
                <div className="primary">
                  <div className="f12">Total Donation in {selectedYear}</div>
                  <div className="f25 mt-1">
                    ₹{totalDonationForYear[selectedYear] || 0}
                  </div>

                  {/* Additional content related to the selected year */}
                </div>
              )}
              <div className="flex flex-end">
                <img
                  src="https://cdn.pixabay.com/photo/2016/05/26/18/11/lawn-1417835_640.png"
                  alt=""
                  className="grassImg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="box-r flex flex-wrap g2">
          {filteredDonations
            .filter(
              (donation) =>
                new Date(donation.createdAt).getFullYear() ===
                parseInt(selectedYear)
            )
            .map((donation) => (
              <div key={donation._id}>
                {editingDonationId === donation._id ? (
                  <div className="displayRowCard">
                    <div className="flex space-between align-item-center">
                      <div>
                        <div className="flex sapce-between">
                          <div>
                            <div>
                              <div className="primary f8">Name</div>
                              <input
                                type="text"
                                className="editTextBox"
                                value={editedDonationName}
                                onChange={(e) =>
                                  setEditedDonationName(e.target.value)
                                }
                                required={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-1">
                          <div>
                            <div>
                              <div className="primary f8">Donation</div>
                              <input
                                type="text"
                                className="editTextBox"
                                value={editDonationAmount}
                                onChange={(e) =>
                                  setEditDonationAmount(e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-end">
                        <div
                          onClick={() => handleUpdateDonation(donation._id)}
                          className="button mt-1 c-pointer"
                        >
                          Save
                        </div>
                      </div>
                    </div>

                    <hr />
                    <div className="mt-1 flex space-between align-item-center">
                      <div className="f10 secondary">
                        {new Date(donation.createdAt).toLocaleString()}
                      </div>
                      <div className="f8 grey">{donation._id}</div>
                    </div>
                  </div>
                ) : (
                  <div className="displayRowCard">
                    <div className="flex space-between align-item-center">
                      <div>
                        <div className="flex sapce-between">
                          <div>
                            <div>
                              <div className="primary f8">Name</div>
                              <div>{donation.donatorName}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-1">
                          <div>
                            <div>
                              <div className="primary f8">Donation</div>
                              <div className="f14 primary">
                                ₹{donation.donationAmount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-end">
                        <div className="">
                          <div
                            onClick={() => handleEditDonation(donation._id)}
                            className="button-outline c-pointer"
                          >
                            Edit
                          </div>

                          <div
                            onClick={() => handleDeleteDonation(donation._id)}
                            className="button mt-1 c-pointer"
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <div className="mt-1 flex space-between align-item-center">
                      <div className="f10 secondary">
                        {new Date(donation.createdAt).toLocaleString()}
                      </div>
                      <div className="f8 grey">{donation._id}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      </div>
            )}
        </div>
       ):(
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "75vh",
        }}>
          <div className="firstAddWindow"  style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "75vh",
        }}>
          <div className="text-align-center f16 primary">Add Donation</div>
           <div className="mt-2">
            
            <label>Donator Name </label>
            <div>
              <input
                type="text"
                className="txtBox"
                value={donatorName}
                onChange={(e) => setDonatorName(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={donatorNameRef}
                required
              />
            </div>
          </div>
          <div className="mt-1">
            <label>Donation Amount </label>
            <div>
              <input
                type="number"
                className="txtBox"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
            <div className="red mt-1">{showError}</div>
          </div>
          <button className="button mt-1" onClick={handleAddDonationFirst}>
            Add Donation
          </button>
        </div>
        </div>
       )}
               </div>
      ):(
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "75vh",
        }}
      >
          <CircularProgress color="success" />
      </div>
      )}
    </div>
  );
};

export default donation;
