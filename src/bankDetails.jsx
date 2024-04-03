import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit'
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
const bankDetails = ({emailId,gPicture,gSubId,gName,serverUrl}) => {
  const navigate = useNavigate();

  const [bankDetails, setBankDetails] = useState([]);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");

  const [orgData, setOrgData] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationPhoneNumber, setOrganizationPhoneNumber] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [loadingBankData, setLoadingBankData] = useState(false);
  const [loadingOrgData, setLoadingOrgData] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
 
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const bankDetailsResponse = await axios.get(
          `${serverUrl}/api/getBankDetails`
        );
        setBankDetails(bankDetailsResponse.data);
        setLoadingBankData(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBankData();
  }, []);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const getOrgData = await axios.get(`${serverUrl}/api/getOrg`);
        setOrgData(getOrgData.data);
        setLoadingOrgData(true);
      } catch (error) {
        cosnole.error(error);
      }
    };
    fetchOrgData();
  }, []);

  const hanldeAddOrg = async () => {
    try {
      const postOrg = await axios.post(`${serverUrl}/api/postOrg`, {
        orgName: organizationName,
        orgPno: organizationPhoneNumber,
        orgAddress: organizationAddress,
      });
      setOrgData([...orgData, postOrg.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const hanldeAddBank = async () => {
    try {
      const postBankData = await axios.post(
        `${serverUrl}/api/postBankDetails`,
        {
          bankName: bankName,
          ifscCode: ifscCode,
          bankBranch: branchName,
          balance: currentBalance,
          acNumber: accountNumber,
        }
      );
      setBankDetails([...bankDetails, postBankData.data]);
    } catch (error) {
      console.error(error);
    }
  };


  const [editMode, setEditMode] = useState(false);
  const [updatedOrgName, setUpdatedOrgName] = useState('');
  const [updatedOrgPno, setUpdatedOrgPno] = useState('');
  const [updatedOrgAddress, setUpdatedOrgAddress] = useState('');

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const getOrgData = await axios.get("http://localhost:5000/api/getOrg");
        setOrgData(getOrgData.data);

        // Assuming orgData is an array and you want to set initial values
        if (getOrgData.data.length > 0) {
          const initialOrg = getOrgData.data[0]; // Use the first organization as an example
          setUpdatedOrgName(initialOrg.orgName);
          setUpdatedOrgPno(initialOrg.orgPno);
          setUpdatedOrgAddress(initialOrg.orgAddress);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrgData();
  }, []); // Empty dependency array means it runs only once on mount

  const handleUpdateOrg = async (id) => {
    try {
      const updateOrg = await axios.put(`${serverUrl}/api/putOrg/${id}`, {
        orgName: updatedOrgName,
        orgPno: updatedOrgPno,
        orgAddress: updatedOrgAddress,
      });
  

      setOrgData((prevOrgData) => {
        const updatedData = prevOrgData.map((org) => {
          if (org._id === id) {
            return { ...org, orgName: updatedOrgName, orgPno: updatedOrgPno, orgAddress: updatedOrgAddress };
          }
          return org;
        });
  
        return updatedData;
      });
  
      setEditMode(false); // Disable edit mode after update
    } catch (error) {
      console.error(error);
    }
  };

  const [editModeBank, setEditModeBank] = useState(false);
  const [updatedBankName, setUpdatedBankName] = useState('');
  const [updatedBankBranch, setUpdatedBankBranch] = useState('');
  const [updatedIfscCode, setUpdatedIfscCode] = useState('');
  const [updatedBalance, setUpdatedBalance] = useState('');
  const [updatedAcNumber, setUpdatedAcNumber] = useState('');

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const getBankData = await axios.get(`${serverUrl}/api/getBankDetails`);
        setBankDetails(getBankData.data);

        // Assuming bankDetails is an array and you want to set initial values
        if (getBankData.data.length > 0) {
          const initialBank = getBankData.data[0]; // Use the first bank as an example
          setUpdatedBankName(initialBank.bankName);
          setUpdatedBankBranch(initialBank.bankBranch);
          setUpdatedIfscCode(initialBank.ifscCode);
          setUpdatedBalance(initialBank.balance);
          setUpdatedAcNumber(initialBank.acNumber);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBankData();
  }, []); // Empty dependency array means it runs only once on mount

  const handleUpdateBank = async (id) => {
    try {
      const updateBank = await axios.put(`${serverUrl}/api/putBankDetails/${id}`, {
        bankName: updatedBankName,
        bankBranch: updatedBankBranch,
        ifscCode: updatedIfscCode,
        balance: updatedBalance,
        acNumber: updatedAcNumber
      });

      // Update the local state or trigger a re-fetch if necessary
      // (Assuming bankDetailsAdapter.findByIdAndUpdate returns the updated data)
      setBankDetails((prevBankDetails) => {
        // Update the state with the modified data
        const updatedData = prevBankDetails.map((bank) => {
          if (bank._id === id) {
            return {
              ...bank,
              bankName: updatedBankName,
              bankBranch: updatedBankBranch,
              ifscCode: updatedIfscCode,
              balance: updatedBalance,
              acNumber: updatedAcNumber,
            };
          }
          return bank;
        });

        return updatedData;
      });

      setEditModeBank(false); // Disable edit mode after update
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="pd1">
      <div className="flex space-between g2">
        <div className="bankDetailsWhiteBox bg-white">
        {loadingBankData ? (
          <div>
          {bankDetails.length === 0 ? (
            <div>
              <div>
                <div className="primary f20">Bank Details</div>
                <div className="mt-1">
                  <div className="grey f10">Bank Name</div>
                  <div>
                    <input
                      type="text"
                      className="txtBoxProfile"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="grey f10">Account Number</div>
                  <div>
                    <input
                      type="number"
                      className="txtBoxProfile"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="grey f10">IFSC Code</div>
                  <div>
                    <input
                      type="text"
                      className="txtBoxProfile"
                      value={ifscCode}
                      onChange={(e) => setIFSCCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="grey f10">Branch Name</div>
                  <div>
                    <input
                      type="text"
                      className="txtBoxProfile"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="grey f10">Current balance in bank</div>
                  <div>
                    <input
                      type="number"
                      className="txtBoxProfile"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="mt-1  button c-pointer"
                  onClick={hanldeAddBank}
                >
                  Add Bank Details
                </button>
              </div>
            </div>
          ) : (
            bankDetails.map((bank) => (
              <div key={bank._id}>
                <div className="flex space-between align-item-center">
                <div className="primary f20">Bank Details</div>
                {!editModeBank && (
                <EditIcon onClick={() => setEditModeBank(!editModeBank)} className="icon c-pointer" />
                )}
                </div>
                <div className="flex space-between">
                  <div className="mt-2">
                    <div className="grey">Bank Name</div>
                    {editModeBank ? (
                      <input
                        type="text"
                        className="f16 editTextBox"
                        value={updatedBankName}
                        onChange={(e) => setUpdatedBankName(e.target.value)}
                      />
                    ) : (
                      <div className="f16">{bank.bankName}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-between">
                  <div className="mt-2">
                    <div className="grey">A/C Number</div>
                    {editModeBank ? (
                      <input
                        type="text"
                        className="f16 editTextBox "
                        value={updatedAcNumber}
                        onChange={(e) => setUpdatedAcNumber(e.target.value)}
                      />
                    ) : (
                      <div className="f16">{bank.acNumber}</div>
                    )}
                  </div>
                  
                </div>
                <div className="mt-2">
                    <div className="grey">IFSC Code</div>
                    {editModeBank ? (
                      <input
                        type="text"
                        className="f16 editTextBox"
                        value={updatedIfscCode}
                        onChange={(e) => setUpdatedIfscCode(e.target.value)}
                      />
                    ) : (
                      <div className="f16">{bank.ifscCode}</div>
                    )}
                  </div>
                <div className="flex space-between">
                  <div className="mt-2">
                    <div className="grey">Branch</div>
                    {editModeBank ? (
                      <input
                        type="text"
                        className="f16 editTextBox "
                        value={updatedBankBranch}
                        onChange={(e) => setUpdatedBankBranch(e.target.value)}
                      />
                    ) : (
                      <div className="f16">{bank.bankBranch}</div>
                    )}
                  </div>
                </div>
                <div className="mt-2 bankDetailsBalanceBox bg-primary white">
                  <div>Balance in account</div>
                  <div className="f25 fw-600">
                  {editModeBank ? (
                      <div>
                        <input
                        type="text"
                        className="f16"
                        value={updatedBalance}
                        onChange={(e) => setUpdatedBalance(e.target.value)}
                      />
                      <div className="red f10">If you change here it will effect all account</div>
                      </div>
                    ) : (
                      <div className="f30">{bank.balance}</div>
                    )}
                  </div>
                </div>
                {editModeBank && (
                  <button className="mt-1 button c-pointer" onClick={() => handleUpdateBank(bank._id)}>
                    Save
                  </button>
                )}
              </div>
            ))
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
        <div className="bankDetailsWhiteBox bg-white">
          {loadingOrgData ? (
          <div>
          {orgData.length === 0 ? (
            <div>
              <div className="primary f20">Organisation Profile</div>
              <div className="mt-1">
                <div className="grey f10">Organisation Name</div>
                <div>
                  <input
                    type="text"
                    className="txtBoxProfile"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-1">
                <div className="grey f10">Organisation Phone Number</div>
                <div>
                  <input
                    type="number"
                    className="txtBoxProfile"
                    value={organizationPhoneNumber}
                    onChange={(e) => setOrganizationPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-1">
                <div className="grey f10">Organisation Address</div>
                <div>
                  <input
                    type="text"
                    className="txtBoxProfile"
                    value={organizationAddress}
                    onChange={(e) => setOrganizationAddress(e.target.value)}
                  />
                </div>
              </div>
              <button className="mt-1 button c-pointer" onClick={hanldeAddOrg}>
                Add Bank Details
              </button>
            </div>
          ) : (
            orgData.map((org) => (
              <div key={org._id}>
              <div className="flex space-between align-item-center">
                <div className="primary f20">Organization Profile</div>
                {!editMode && (
                <EditIcon onClick={() => setEditMode(!editMode)} className="c-pointer icon" />
                )}
              </div>
              <div className="mt-2">
                <div className="grey">Organization Name</div>
                {editMode ? (
                  <input
                    type="text"
                    className="f16 editTextBox"
                    value={updatedOrgName}
                    onChange={(e) => setUpdatedOrgName(e.target.value)}
                  />
                ) : (
                  <div className="f16">{org.orgName}</div>
                )}
              </div>
              <div className="mt-2">
                <div className="grey">Organization Phone Number</div>
                {editMode ? (
                  <input
                    type="text"
                    className="f16 editTextBox"
                    value={updatedOrgPno}
                    onChange={(e) => setUpdatedOrgPno(e.target.value)}
                  />
                ) : (
                  <div className="f16">{org.orgPno}</div>
                )}
              </div>
              <div className="mt-2">
                <div className="grey">Organization Address</div>
                {editMode ? (
                  <input
                    type="text"
                    className="f16 editTextBox"
                    value={updatedOrgAddress}
                    onChange={(e) => setUpdatedOrgAddress(e.target.value)}
                  />
                ) : (
                  <div className="f16">{org.orgAddress}</div>
                )}
              </div>
              {editMode && (
                <button className="mt-1 button c-pointer" onClick={() => handleUpdateOrg(org._id)}>
                  Save
                </button>
              )}
             
            </div>
            ))
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
        <div className="flex  justify-content-center">
          <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQyMi0wMzIyLW5hbS5qcGc.jpg" className="" alt="" style={{width:'30vw',height:'85vh',borderRadius:'1vw'}} />
        </div>
      </div>
    </div>
  );
};

export default bankDetails;
