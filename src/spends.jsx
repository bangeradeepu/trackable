import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import GetAppIcon from "@mui/icons-material/GetApp";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import "./index.css";
import { Edit } from "@mui/icons-material";
const spends = ({emailId,gPicture,gSubId,gName,serverUrl}) => {
  const navigate = useNavigate();
  const [spendsName, setSpendsName] = useState("");
  const [spendsQuantity, setSpendsQuantity] = useState("");
  const [spendsType, setSpendsType] = useState("");
  const [spendsAmount, setSpendsAmount] = useState("");
  const [spends, setSpends] = useState([]);
  const [editingSpendsId, setEditingSpendsId] = useState(null);
  const [editedSpendsName, setEditedSpendsName] = useState("");
  const [editSpendsQuantity, setEditSpendsQuantity] = useState("");
  const [editSpendsType, setEditSpendsType] = useState("");
  const [editSpendsAmount, setEditSpendsAmount] = useState("");
  const [editSpendsOccassion, setEditSpendsOccassion] = useState("");
  const [bankBalance, setBankBalance] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredSpends, setFilteredSpends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSpendingForYear, setTotalSpendingForYear] = useState({});
  const [yearGroups, setYearGroups] = useState([]);
  const [selectedSpendType, setSelectedSpendType] = useState("");
  let spendsCat = {};
  const spendsNameRef = useRef(null);
  const [spendsOccassion, setSpendsOccassion] = useState("");
  const [spendOccassionAdd, setSpendOccassionAdd] = useState("");
  const [loadingSpends, setLoadingSpends] = useState(false);
  const [bankFetch, setBankFetch] = useState(false);
  const [orgFetch, setOrgFetchData] = useState(false);
  const [typeFetch, setTypeFetch] = useState(false);
  const [occasionFetch,setOccassionFetch] = useState(false);
  const [fetchMem,serFetchMem] = useState(false);
  const [showError,setShowError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const spendsResponse = await axios.get(
          `${serverUrl}/api/getSpends`
        );
        setSpends(spendsResponse.data);
        setLoadingSpends(true);
        // Fetch bank balance
        const bankDetailsResponse = await axios.get(
          `${serverUrl}/api/getBankDetails`
        );
        setBankBalance(bankDetailsResponse.data.balance);

        // Get unique years from spends
        const years = Array.from(
          new Set(
            spendsResponse.data.map((spend) =>
              new Date(spend.createdAt).getFullYear()
            )
          )
        );
        setYearGroups(years.sort((a, b) => b - a));

        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Calculate total spending for each year
    const totalSpending = {};
    spends.forEach((spend) => {
      const year = new Date(spend.createdAt).getFullYear();
      const spendsAmount = parseFloat(spend.spendsAmount); // Convert to number
      totalSpending[year] = (totalSpending[year] || 0) + spendsAmount;
    });


    setTotalSpendingForYear(totalSpending);
  }, [spends]);

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
    // Filter spends based on selected year
    const filtered = spends
      .filter(
        (spend) =>
          new Date(spend.createdAt).getFullYear() === parseInt(selectedYear)
      )
      .filter((spend) =>
        spend.spendsName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredSpends(filtered);
  }, [spends, selectedYear, searchTerm]);

  const displaySpendsForYear = (year) => {
    setSelectedYear(year);
  };

  const handleAddSpends = async () => {
    if(spendsType === '' ||   spendsName === '' || spendsAmount === '' || spendOccassionAdd === '' || spendsQuantity ===''){
      setShowError('Pelase fill all feilds!');
      const timeoutId = setTimeout(() => {
        setShowError('');
      }, 5000);

      useEffect(() => {
        return () => clearTimeout(timeoutId);
      }, []);
    }else{
      try {
        const spendsResponse = await axios.post(
          `${serverUrl}/api/postSpends`,
          {
            spendsName,
            spendsQuantity,
            spendsType,
            spendsAmount,
            spendsOccassion: spendOccassionAdd,
          }
        );
  
        setSpends([...spends, spendsResponse.data]);
        setBankBalance(bankBalance - spendsAmount);
  
        setSpendsName("");
        setSpendsQuantity("");
        setSpendsAmount("");
        spendsNameRef.current.focus();
      } catch (error) {
        console.error(error);
      }
    }

  };

  const handleEditSpends = (id) => {
    setEditingSpendsId(id);
    const spendsToEdit = spends.find((spend) => spend._id === id);
    setEditedSpendsName(spendsToEdit.spendsName);
    setEditSpendsQuantity(spendsToEdit.spendsQuantity);
    setEditSpendsType(spendsToEdit.spendsType);
    setEditSpendsAmount(spendsToEdit.spendsAmount);
    setEditSpendsOccassion(spendsToEdit.spendsOccassion);
  };

  const handleUpdateSpends = async (id) => {
    try {
      const updatedSpendsIndex = spends.findIndex((spend) => spend._id === id);
      const oldSpendsAmount = spends[updatedSpendsIndex].spendsAmount;

      // Create a copy of the spends to update in the state
      const updatedSpends = {
        ...spends[updatedSpendsIndex],
        spendsName: editedSpendsName,
        spendsQuantity: editSpendsQuantity,
        spendsType: editSpendsType,
        spendsAmount: editSpendsAmount,
        spendsOccassion: editSpendsOccassion,
      };

      // Update the state immediately
      const updatedSpendsList = [...spends];
      updatedSpendsList[updatedSpendsIndex] = updatedSpends;
      setSpends(updatedSpendsList);

      // Recalculate total spending for the updated spend's year
      const updatedYear = new Date(updatedSpends.createdAt).getFullYear();
      const totalSpendingCopy = { ...totalSpendingForYear };
      totalSpendingCopy[updatedYear] =
        totalSpendingCopy[updatedYear] - oldSpendsAmount + editSpendsAmount;
      setTotalSpendingForYear(totalSpendingCopy);

      // Make the API call
      await axios.put(`${serverUrl}/api/editSpends/${id}`, {
        spendsName: editedSpendsName,
        spendsQuantity: editSpendsQuantity,
        spendsType: editSpendsType,
        spendsAmount: editSpendsAmount,
        spendsOccassion: editSpendsOccassion,
      });

      // Update bank balance
      setBankBalance(bankBalance + oldSpendsAmount - editSpendsAmount);

      // Clear the editing state
      setEditingSpendsId(null);
      setEditedSpendsName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSpends = async (id) => {
    try {
      const deletedSpends = await axios.delete(
        `${serverUrl}/api/deleteSpends/${id}`
      );
      setSpends(spends.filter((spend) => spend._id !== id));

      // Update bank balance
      setBankBalance(bankBalance + deletedSpends.data.spendsAmount);
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
      handleAddSpends();
    }
  };
  const [typeData, setTypeData] = useState([]);
  const [occassionData, setOccassionData] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const fetchItemListResponse = await axios.get(`${serverUrl}/api/getItemList`);
        setItemList(fetchItemListResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchOccassionData = async () => {
      try {
        const fetchOccassionDataResponse = await axios.get(`${serverUrl}/api/getOccassion`);
        setOccassionData(fetchOccassionDataResponse.data);
        setOccassionFetch(true)
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTypeData = async () => {
      try {
        const fetchTypeDataResponse = await axios.get(`${serverUrl}/api/getType`);
        setTypeData(fetchTypeDataResponse.data);
        setTypeFetch(true)
      } catch (error) {
        console.error(error);
      }
    };

    fetchItemList();
    fetchOccassionData();
    fetchTypeData();
  }, []);

  filteredSpends
    .filter(
      (spend) =>
        new Date(spend.createdAt).getFullYear() === parseInt(selectedYear) &&
        (selectedSpendType === "" || spend.spendsType === selectedSpendType) &&
        (spendsOccassion === "" || spend.spendsOccassion === spendsOccassion)
    )
    .forEach((spend) => {
      spendsCat[spend.spendsType] = spendsCat[spend.spendsType]
        ? spendsCat[spend.spendsType] + spend.spendsAmount
        : spend.spendsAmount;
    });

  const exportToExcel = () => {
    // Filtered spends based on selected filters
    const filteredData = filteredSpends.filter(
      (spend) =>
        new Date(spend.createdAt).getFullYear() === parseInt(selectedYear) &&
        (selectedSpendType === "" || spend.spendsType === selectedSpendType) &&
        (spendsOccassion === "" || spend.spendsOccassion === spendsOccassion)
    );

    // Calculate total spends for each type
    const spendsCat = {};
    filteredData.forEach((spend) => {
      spendsCat[spend.spendsType] = spendsCat[spend.spendsType]
        ? spendsCat[spend.spendsType] + spend.spendsAmount
        : spend.spendsAmount;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((spend) => ({
        Name:
          editingSpendsId === spend._id ? editedSpendsName : spend.spendsName,
        Spends:
          editingSpendsId === spend._id ? editSpendsAmount : spend.spendsAmount,
        Quantity: spend.spendsQuantity,
        Type: spend.spendsType,
        Occasion: spend.spendsOccassion,
        CreatedAt: new Date(spend.createdAt).toLocaleString(),
        ID: spend._id,
      }))
    );

    // Add row for total spends
    const totalRow = {
      Name: "Total",
      Spends: Object.values(spendsCat).reduce(
        (total, amount) => total + amount,
        0
      ),
    };

    // Append the total row to the worksheet
    XLSX.utils.sheet_add_json(ws, [totalRow], { skipHeader: true, origin: -1 });

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    // Export to Excel
    XLSX.writeFile(wb, "exportedData.xlsx");
  };

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







  const handleSpendsNameChange = (value) => {
    setSpendsName(value);
  
    // Filter the suggestions based on the input value
    const filteredSuggestions = itemList
      .filter(item => item.itemName.toLowerCase().includes(value.toLowerCase()))
      .map(item => item.itemName);
  
    setSuggestions(filteredSuggestions);
    
    // Clear suggestions when the input is empty
    if (value.trim() === '') {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setSpendsName(suggestion);
    setSuggestions([]);
  };

  const handleAddSpendsFirst = () =>  {
    // window.location.reload();
    handleAddSpends();
  }
  return (
    <div className="pd1">
      
    
      {orgFetch && typeFetch && bankFetch && loadingSpends && occasionFetch && fetchMem ? (
        <div>
          {spends.length !== 0 ? (
        <div>
          {(bankDetails.length &&
            orgData.length &&
            typeData.length &&
            occassionData.length &&
            memberData.length) === 0  ? (
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
          ) : (
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
              >
                <DialogTitle id="alert-dialog-title">
                  {"Add Spends"}
                </DialogTitle>
                <DialogContent>
                  <div>
                    <label>Spends Occasssion </label>
                    <div>
                      <select
                        className="txtBoxDD"
                        value={spendOccassionAdd}
                        onChange={(e) => setSpendOccassionAdd(e.target.value)}
                      >
                        <option value="" disabled selected>Select Occassion</option>
                        {occassionData.map((occassion) => (
                          <>
                            <option
                              key={occassion._id}
                              value={occassion.occassionName}
                            >
                              {occassion.occassionName}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-1">
                    <label>Spends Type </label>
                    <div>
                      <select
                        className="txtBoxDD"
                        value={spendsType}
                        onChange={(e) => setSpendsType(e.target.value)}
                      >
                        <option value="" disabled selected>Select Type</option>
                        {typeData.map((type) => (
                          <>
                            <option key={type._id} value={type.typeName}>
                              {type.typeName}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-1 f10 grey hvGreen c-pointer flex flex-end" onClick={() => navigate("/addCategories")}>Add New Occasssions and Types</div>
                  <hr className="mt-2" />
                  <div className="mt-2">
        <label>Spends Name</label>
        <div>
          <input
            type="text"
            className="txtBox"
            value={spendsName}
            onChange={(e) => handleSpendsNameChange(e.target.value)}
            required
          />
        
        {suggestions.length > 0 && (
        <div className="spendsSuggession sb">
      {suggestions.map((suggestion, index) => (
        <div className="bgHover hvGreen pd-05 c-pointer" key={index} onClick={() => handleSuggestionClick(suggestion)}>
          {suggestion}
        </div>
      ))}
  
</div>
)}
          
        </div>
      </div>
                  <div className="mt-1">
                    <label>Spends Quantity </label>
                    <div>
                      <input
                        type="number"
                        className="txtBox"
                        value={spendsQuantity}
                        onChange={(e) => setSpendsQuantity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-1">
                    <label>Spends Amount </label>
                    <div>
                      <input
                        type="number"
                        className="txtBox"
                        value={spendsAmount}
                        onChange={(e) => setSpendsAmount(e.target.value)}
                        onKeyPress={handleKeyPress}
                        required
                      />
                    </div>
                  </div>
                  <div className="red mt-1">{showError}</div>
                </DialogContent>
                <DialogActions>
                  <button className="button" onClick={handleAddSpends}>
                    Add Spends
                  </button>
                </DialogActions>
              </Dialog>
              <div className="flex space-between align-item-center">
                <div className="f20 primary">Spends</div>
                <div className="flex g1 align-item-center">
                  <div className="flex align-item-center">
                    <input
                      type="text"
                      name=""
                      className="searchTxtBoxSpends"
                      id=""
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search by Spends Name"
                    />
                  </div>
                  {/* Add this code where you want to display the dropdown */}
                  <select
                    className="dropdownFilterSpends"
                    value={selectedSpendType}
                    onChange={(e) => setSelectedSpendType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {typeData.map((type) => (
                      <>
                        <option key={type._id} value={type.typeName}>
                          {type.typeName}
                        </option>
                      </>
                    ))}
                  </select>
                  {/* <select
        className="dropdownFilterSpends"
        value={selectedSpendType}
        onChange={(e) => setSelectedSpendType(e.target.value)}
      >
        <option value="">All Types</option>
        {(() => {
          // Create a Set to keep track of unique spend types
          const uniqueSpendTypes = new Set();

          // Filter out duplicates and populate the Set
          occasions.forEach((spendType) => {
            uniqueSpendTypes.add(spendType.spendsType);
          });

          // Convert the Set back to an array
          const uniqueSpendTypesArray = [...uniqueSpendTypes];

          // Render the options
          return uniqueSpendTypesArray.map((uniqueSpendType, index) => (
            <option key={index} value={uniqueSpendType}>
              {uniqueSpendType}
            </option>
          ));
        })()}
      </select> */}

                  <select
                    className="dropdownFilterSpends"
                    value={spendsOccassion}
                    onChange={(e) => setSpendsOccassion(e.target.value)}
                  >
                    <option value="">All Occasions</option>
                    {occassionData.map((occassion) => (
                      <>
                        <option
                          key={occassion._id}
                          value={occassion.occassionName}
                        >
                          {occassion.occassionName}
                        </option>
                      </>
                    ))}
                  </select>

                  <button
                    className="button c-pointer"
                    onClick={handleClickOpen}
                  >
                    Add New Spends
                  </button>
                </div>
              </div>
              <div className="flex space-evenly boxMain mt-1 g1">
                <div>
                  <div className="box-l">
                    {yearGroups.map((year, index) => (
                      <div
                        key={index}
                        onClick={() => displaySpendsForYear(year)}
                      >
                        <div className="displayMenuCard flex space-between mt-1 c-pointer">
                          {totalSpendingForYear[year] && (
                            <div>{`Total Spends in ${year}`}</div>
                          )}

                          {/* Add this log */}
                          <div className="f12 primary fw-200">
                            ₹{totalSpendingForYear[year]}
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
                    <div className="boxTotalBalance bg-red">
                      {selectedYear && (
                        <div className="red">
                          <div className="f12">
                            Total Spends in {selectedYear}
                          </div>
                          <div className="f25 mt-1">
                            ₹{totalSpendingForYear[selectedYear] || 0}
                          </div>

                          {/* Additional content related to the selected year */}
                        </div>
                      )}
                      <div className="flex flex-end">
                        <img
                          src="https://freepngimg.com/download/flower/139593-vector-flower-art-wedding-png-free-photo.png"
                          alt=""
                          className="spend-flower-img"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box-r">
                  {filteredSpends
                    .filter(
                      (spend) =>
                        new Date(spend.createdAt).getFullYear() ===
                          parseInt(selectedYear) &&
                        (selectedSpendType === "" ||
                          spend.spendsType === selectedSpendType) &&
                        (spendsOccassion === "" ||
                          spend.spendsOccassion === spendsOccassion)
                    )
                    .map((spend) => (
                      <div key={spend._id}>
                        {editingSpendsId === spend._id ? (
                          <div className="displayRowCard-spends">
                            <div className="flex space-between align-item-center">
                              <div>
                                <div className="flex sapce-between">
                                  <div>
                                    <div>
                                      <div className="primary f8">Name</div>
                                      <input
                                        type="text"
                                        className="editTextBox"
                                        value={editedSpendsName}
                                        onChange={(e) =>
                                          setEditedSpendsName(e.target.value)
                                        }
                                        required={true}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <div>
                                    <div>
                                      <div className="primary f8">Spends</div>
                                      <input
                                        type="text"
                                        className="editTextBox"
                                        value={editSpendsAmount}
                                        onChange={(e) =>
                                          setEditSpendsAmount(e.target.value)
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-end">
                                <div
                                  onClick={() => handleUpdateSpends(spend._id)}
                                  className="button mt-1 c-pointer"
                                >
                                  Save
                                </div>
                              </div>
                            </div>

                            <hr />
                            <div className="mt-1 flex space-between align-item-center">
                              <div className="f10 secondary">
                                {new Date(spend.createdAt).toLocaleString()}
                              </div>
                              <div className="f8 grey">{spend._id}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="displayRowCard-spends">
                            <div className="flex space-between align-item-center">
                              <div>
                                <div className="flex space-between">
                                  <div>
                                    <div>
                                      <div className="primary f8">Name</div>
                                      <div>{spend.spendsName}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-1 flex g3 aling-item-center">
                                  <div>
                                    <div>
                                      <div className="primary f8">Quantity</div>
                                      <div className="">
                                        {spend.spendsQuantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div>
                                      <div className="primary f8">Type</div>
                                      <div className="f10">
                                        {spend.spendsType}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div>
                                      <div className="primary f8">
                                        Occasssion
                                      </div>
                                      <div className="f10">
                                        {spend.spendsOccassion}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <div>
                                    <div>
                                      <div className="primary f8">Spends</div>
                                      <div className="f12 primary">
                                        ₹{spend.spendsAmount}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-end">
                                <div className="">
                                  <div
                                    onClick={() => handleEditSpends(spend._id)}
                                    className="button-outline c-pointer"
                                  >
                                    Edit
                                  </div>

                                  <div
                                    onClick={() =>
                                      handleDeleteSpends(spend._id)
                                    }
                                    className="button mt-1 c-pointer"
                                  >
                                    Delete
                                  </div>
                                </div>
                              </div>
                            </div>

                            <hr />
                            <div className="mt-1 flex space-between align-item-center">
                              <div className="f8 secondary">
                                {new Date(spend.createdAt).toLocaleString()}
                              </div>
                              <div className="f8 grey">{spend._id}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div>
                  <div className="box-spends">
                    <div className="f12 primary">Spends based on filters</div>
                    <div className="mt-1">
                      {Object.keys(spendsCat).map((type, index) => (
                        <div key={index}>
                          <div className="mt-1 primary">{type}</div>
                          <div className="f20">₹{spendsCat[type]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="box-spends primary mt-1">
                    <div className="mt-1 flex justify-content-center align-item-center">
                      <button
                        onClick={exportToExcel}
                        className="button c-pointer flex align-item-center g1"
                      >
                        <span className="f9">Export to Excel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "85vh",
        }}>
          <div className="firstAddWindow sb"  style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "85vh",
        }}>
          <div className="text-align-center f16 primary">Add Spends</div>
           <div className="mt-2">
                    <label>Spends Occasssion </label>
                    <div>
                      <select
                        className="txtBoxDD"
                        value={spendOccassionAdd}
                        onChange={(e) => setSpendOccassionAdd(e.target.value)}
                      >
                        <option value="" disabled selected>Select Occassion</option>
                        {occassionData.map((occassion) => (
                          <>
                            <option
                              key={occassion._id}
                              value={occassion.occassionName}
                            >
                              {occassion.occassionName}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-1">
                    <label>Spends Type </label>
                    <div>
                      <select
                        className="txtBoxDD"
                        value={spendsType}
                        onChange={(e) => setSpendsType(e.target.value)}
                      >
                        <option value="" disabled selected>Select Type</option>
                        {typeData.map((type) => (
                          <>
                            <option key={type._id} value={type.typeName}>
                              {type.typeName}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="mt-1 f10 grey hvGreen c-pointer flex flex-end" onClick={() => navigate("/addCategories")}>Add New Occasssions and Types</div>
                  </div>
                 
                  <hr className="mt-2" />
                  <div className="mt-2">
        <label>Spends Name</label>
        <div>
          <input
            type="text"
            className="txtBox"
            value={spendsName}
            onChange={(e) => handleSpendsNameChange(e.target.value)}
            required
          />
        
        {suggestions.length > 0 && (
        <div className="spendsSuggession sb">
      {suggestions.map((suggestion, index) => (
        <div className="bgHover hvGreen pd-05 c-pointer" key={index} onClick={() => handleSuggestionClick(suggestion)}>
          {suggestion}
        </div>
      ))}
  
</div>
)}
          
        </div>
      </div>
                  <div className="mt-1">
                    <label>Spends Quantity </label>
                    <div>
                      <input
                        type="number"
                        className="txtBox"
                        value={spendsQuantity}
                        onChange={(e) => setSpendsQuantity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-1">
                    <label>Spends Amount </label>
                    <div>
                      <input
                        type="number"
                        className="txtBox"
                        value={spendsAmount}
                        onChange={(e) => setSpendsAmount(e.target.value)}
                        onKeyPress={handleKeyPress}
                        required
                      />
                    </div>
                    <div className="red mt-1">{showError}</div>
                  </div>
                  
                  <button className="button" onClick={handleAddSpendsFirst}>
                    Add Spends
                  </button>
          </div>
          </div>
        
      )}
        </div>
      ) : (
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

export default spends;
