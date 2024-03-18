import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
const Report = ({emailId,gPicture,gSubId,gName,serverUrl}) => {
  const navigate = useNavigate();
  const [hide, setHide] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [spendsData, setSpendsData] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [totalSpendAmount, setTotalSpendAmount] = useState(0);
  const [totalDonationAmount, setTotalDonationAmount] = useState(0);
  const [prevBalanceFinal, setPrevBalanceFinal] = useState(0);
  const [memberData, setMemberData] = useState([]);
  const [bankFetch, setBankFetch] = useState(false);
  const [orgFetch, setOrgFetchData] = useState(false);
  const [fetchMem,serFetchMem] = useState(false);
  const [spendFetch,setSpendFetch] =  useState(false);
  const [fetchDonation,setFetchDonation] = useState(false);
  const [total, setTotal] = useState(0);
  const handlePrint = () => {
    setHide(true);
    setTimeout(() => {
      window.print();
      setHide(false);
    }, 1); // Adjust the delay as needed
  };
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const bankDetailsResponse = await axios.get(
          `${serverUrl}/api/getBankDetails`
        );
        setBankFetch(true);
        const currentBalance = bankDetailsResponse.data[0].balance;
        console.log(currentBalance);
        // Calculate previous balance
        const prevBalance =
          currentBalance + totalSpendAmount - totalDonationAmount;
        setPrevBalanceFinal(prevBalance);

        const totalBal = prevBalance + totalDonationAmount;
        setTotal(totalBal);
        setBankDetails(bankDetailsResponse.data);
        
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSpendsData = async () => {
      try {
        const spendsResponse = await axios.get(
          `${serverUrl}/api/getSpends`
        );
        setSpendsData(spendsResponse.data);
        setSpendFetch(true);
        // Extract unique years from spend data
        const uniqueYears = [
          ...new Set(
            spendsResponse.data.map((spend) =>
              new Date(spend.createdAt).getFullYear()
            )
          ),
        ];
        setYears(uniqueYears);

        console.log(spendsResponse.data);
        
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDonationData = async () => {
      try {
        const donationResponse = await axios.get(
          `${serverUrl}/api/getDonations`
        );
        setDonationData(donationResponse.data);
          
        // Extract unique years from donation data
        const uniqueYears = [
          ...new Set(
            donationResponse.data.map((donation) =>
              new Date(donation.createdAt).getFullYear()
            )
          ),
        ];
        setYears(uniqueYears);
        setFetchDonation(true);
        console.log(donationResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    // Initial fetch
    fetchBankData();
    fetchSpendsData();
    fetchDonationData();
  }, [totalSpendAmount, totalDonationAmount]);

  useEffect(() => {
    // Calculate total spendAmount for the selected year
    if (selectedYear) {
      const spendsForSelectedYear = spendsData.filter(
        (spend) =>
          new Date(spend.createdAt).getFullYear().toString() ===
          selectedYear.toString()
      );

      const totalSpend = spendsForSelectedYear.reduce(
        (total, spend) => total + (spend.spendsAmount || 0),
        0
      );

      setTotalSpendAmount(totalSpend);
    }
  }, [selectedYear, spendsData]);

  useEffect(() => {
    // Calculate total donationAmount for the selected year
    if (selectedYear) {
      const donationsForSelectedYear = donationData.filter(
        (donation) =>
          new Date(donation.createdAt).getFullYear().toString() ===
          selectedYear.toString()
      );

      const totalAmount = donationsForSelectedYear.reduce(
        (total, donation) => total + (donation.donationAmount || 0),
        0
      );

      setTotalDonationAmount(totalAmount);
    }
  }, [selectedYear, donationData]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const responseMemberData = await axios.get(
          `${serverUrl}/api/getMembers`
        );

        // Filter the data for specific roles (President, Accountant, Vice-President)
        const filteredData = responseMemberData.data.filter(
          (member) =>
            member.memberRole === "President" ||
            member.memberRole === "Accountant" ||
            member.memberRole === "Vice-President"
        );

        setMemberData(filteredData);
        serFetchMem(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMemberData();
  }, []);

  // Calculate total spendAmount
  const overallSpendAmount = spendsData.reduce(
    (total, spend) => total + (spend.spendsAmount || 0),
    0
  );

  const [currentLanguage, setCurrentLanguage] = useState("english");

  const handleLanguageChange = () => {
    setCurrentLanguage(currentLanguage === "english" ? "kannada" : "english");
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
  return (
    <div className="pd1">
      {fetchDonation && spendFetch && fetchMem && bankFetch && orgFetch ? (
      <div>
        
      {(bankDetails.length && spendsData.length && donationData.length && orgData.length && memberData.length) === 0 ? (
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
      {!hide &&(
      <div className="flex space-between">
        <div className="f20 primary">Reports</div>
        <div className="flex g1">
          <button className="button c-pointer" onClick={handlePrint}>
            Print Report
          </button>
          <button className="button c-pointer" onClick={handleLanguageChange}>
            {currentLanguage === "english" ? "Kannada" : "English"}
          </button>
        </div>
      </div>
      )}

      <div className="flex g2 mt-1">
        {!hide &&(
        <div className="reportFirstSection sb">
          <div className="primary">Years</div>
          <div className="mt-1"></div>
          {years
            .sort((a, b) => b - a) // Sort the years in ascending order
            .map((year) => (
              <div
                key={year}
                onClick={() => setSelectedYear(year.toString())}
                style={{ cursor: "pointer" }}
              >
                <div className="reportYears secondary bgHover fw-500 hvGreen">
                  {year}
                </div>
              </div>
            ))}
        </div>
        )}
        {!hide &&(
        <div className="reportSecondSection g1">
          <div className="reportGraphSection"></div>
          <div className="flex g1">
            <div className="box-showBalance bg-primary">
              <div className="white">
                <div className="f12">Total Savings</div>
                <div className="f25 mt-1">
                  {bankDetails.map((bank) => (
                    <div key={bank._id}>₹{bank.balance}</div>
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
            <div className="box-showBalance bg-red">
              <div className="red">
                <div className="f12">Total Spends</div>
                <div className="f25 mt-1">{overallSpendAmount}</div>
                <div className="flex flex-end">
                  <img
                    src="https://freepngimg.com/download/flower/139593-vector-flower-art-wedding-png-free-photo.png"
                    alt=""
                    className="spend-flower-img"
                    style={{ width: "11vw" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {currentLanguage === "english" ? (
          <div className="reportThirdSection sb">
            {selectedYear ? (
              <div className="">
                {orgData.map((org) => (
 <div key={org._id}>
 <div className="text-align-center fw-600" style={{fontSize:'1.7rem'}}>
   {org.orgName}
 </div>
 <div className="mt-1 flex space-evenly text-align-center">
   <div>
     {org.orgAddress}
   </div>
 </div>
 <div className="text-align-center">{org.orgPno}</div>
 </div>
                ))}
               
                <div className="text-align-center mt-1 fw-600" style={{fontSize:'1.5rem'}}>
                  Annual Report - {selectedYear}
                </div>
                {/* <table className="bordered-table mt-2">
      <thead>
        <tr>
          <th>Sl No</th>
          <th>Description</th>
          <th>Debit</th>
          <th>Credit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Balance Before</td>
          <td className="primary">+{prevBalanceFinal}</td>
          <td></td>
        </tr>
        <tr>
          <td>2</td>
          <td>Spends</td>
          <td></td>
          <td className="red">-{totalSpendAmount}</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Donation</td>
          <td className="primary">+{totalDonationAmount}</td>
          <td></td>
        </tr>
        <tr>
          <td
            colSpan="2"
            className="fw-700"
            style={{ textAlign: "right" }}
          >
            Total
          </td>
          <td className="primary">{total}</td>
          <td className="red">{totalSpendAmount}</td>
        </tr>
        <tr>
          <td
            colSpan="2"
            className="fw-700"
            style={{ textAlign: "right" }}
          >
            Remaining Balance
          </td>
          <td colSpan="2" className="primary fw-600">
          {bankDetails.map((bank) => (
            <div>
                <div key={bank._id}>₹{bank.balance}</div>
                
            </div>
          ))} 
          </td>
        </tr>
      </tbody>
    </table> */}
                <table className="bordered-table mt-2">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2</td>
                      <td>Donation</td>
                      <td className="primary">{totalDonationAmount}</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Spends</td>
                      <td className="red">{totalSpendAmount}</td>
                    </tr>

                    <tr>
                      <td
                        colSpan="2"
                        className="fw-700"
                        style={{ textAlign: "right" }}
                      >
                        Balance In Bank
                      </td>
                      <td colSpan="2" className="primary fw-600">
                        {bankDetails.map((bank) => (
                          <div>
                            <div key={bank._id}>₹{bank.balance}</div>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-1 text-align-center secondary f8">
                  (For detailed donation and spends resport please contact
                  admin.)
                </div>

                <div className="flex space-evenly" style={{ marginTop: "6vw" }}>
                  {memberData.map((member, index) => (
                    <div className="text-align-center" key={index}>
                      {member.memberImage && (
                        <img
                          src={`${serverUrl}${member.memberImage}`}
                          alt={member.memberName}
                          className="signatureMemberReport"
                        />
                      )}
                      <div className="f10">{member.memberName}</div>
                      <div className="fw-700 f8">{member.memberRole}</div>
                    </div>
                  ))}
                </div>
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
                <div className="f16 grey">Please select a year </div>
              </div>
            )}
          </div>
        ) : (
          <div className="reportThirdSection sb">
            {selectedYear ? (
              <div className="">
                {orgData.map((org) => (
 <div key={org._id}>
 <div className="text-align-center fw-600" style={{fontSize:'1.7rem'}}>
   {org.orgName}
 </div>
 <div className="mt-1 flex space-evenly text-align-center">
   <div>
     {org.orgAddress}
   </div>
 </div>
 <div className="text-align-center">{org.orgPno}</div>
 </div>
                ))}
                <div className="text-align-center mt-1 fw-600" style={{fontSize:'1.5rem'}}>
                  ವಾರ್ಷಿಕ ವರದಿ - {selectedYear}
                </div>
                <table className="bordered-table mt-2">
                  <thead>
                    <tr>
                      <th>ಕ್ರಮ ಸಂಖ್ಯೆ</th>
                      <th>ವಿವರಣೆ</th>
                      <th>ಮೊತ್ತ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>ಸಂಗ್ರಹಿಸಿದ ಮೊತ್ತ</td>
                      <td className="primary">{totalDonationAmount}</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>ಖರ್ಚಾದ ಮೊತ್ತ</td>
                      <td className="red">{totalSpendAmount}</td>
                    </tr>

                    <tr>
                      <td
                        colSpan="2"
                        className="fw-700"
                        style={{ textAlign: "right" }}
                      >
                        ಬ್ಯಾಂಕ್ ಖಾತೆಯಲ್ಲಿ ಉಳಿದಿರುವ ಮೊತ್ತ
                      </td>
                      <td colSpan="2" className="primary fw-600">
                        {bankDetails.map((bank) => (
                          <div>
                            <div key={bank._id}>₹{bank.balance}</div>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-1 text-align-center secondary" style={{fontSize:'0.7rem'}}>
                  (ವಿವರವಾದ ದೇಣಿಗೆ ಮತ್ತು ಖರ್ಚುಗಳ ವರದಿಗಾಗಿ ದಯವಿಟ್ಟು ನಿರ್ವಾಹಕರನ್ನು
                  ಸಂಪರ್ಕಿಸಿ.)
                </div>

                <div className="flex space-evenly" style={{ marginTop: "6vw" }}>
                  {memberData.map((member, index) => (
                    <div className="text-align-center" key={index}>
                      {member.memberImage && (
                        <img
                          src={`${serverUrl}${member.memberImage}`}
                          alt={member.memberName}
                          className="signatureMemberReport"
                        />
                      )}
                      <div className="" style={{fontSize:'0.9rem'}}>{member.memberName}</div>
                      <div className="fw-700" style={{fontSize:'1rem'}}> {member.memberRole}</div>
                    </div>
                  ))}
                </div>
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
                <div className="f16 grey">Please select a year </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      ) }
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

export default Report;
