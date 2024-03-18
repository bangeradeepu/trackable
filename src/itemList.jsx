import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const itemList = ({emailId,gPicture,gSubId,gName,serverUrl}) => {
  const [hide, setHide] = useState(false);
  const [itemAddName, setItemAddName] = useState("");
  const [itemAddOccassion, setItemAddOccassion] = useState("");
  const [itemAddQuantity, setItemAddQuantity] = useState("");
  const [itemAddType, setItemAddType] = useState("");
  const [itemList, setItemList] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const spendsNameRef = useRef(null);

  const handlePrint = () => {
    setHide(true);
    setTimeout(() => {
      window.print();
      setHide(false);
    }, 1); // Adjust the delay as needed
  };

  // Dailog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [occassionData, setOccassionData] = useState([]);
  useEffect(() => {
    const fetchOccassion = async () => {
      try {
        const occassionDataResponse = await axios.get(
          `${serverUrl}/api/getOccassion`
        );
        setOccassionData(occassionDataResponse.data);
        console.log(occassionDataResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOccassion();
  }, []);

  const [typeData, setTypeData] = useState([]);
  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        const responseTypeData = await axios.get(
          `${serverUrl}/api/getType`
        );
        setTypeData(responseTypeData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTypeData();
  }, []);
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const fetchItemListResponse = await axios.get(
          `${serverUrl}/api/getItemList`
        );
        setItemList(fetchItemListResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItemList();
  }, []);

  const handleAddItem = async () => {
    try {
      const postItem = await axios.post(
        `${serverUrl}/api/postItemList`,
        {
          itemName: itemAddName,
          itemQty: itemAddQuantity,
          itemType: itemAddType,
          itemOccassion: itemAddOccassion,
        }
      );
      setItemList([...itemList, postItem.data]);
      setItemAddName("");
      setItemAddQuantity("");
      spendsNameRef.current.focus();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportToExcel = () => {
    const filteredData = itemList.filter((item) => {
      return (
        (!selectedOccasion || item.itemOccassion === selectedOccasion) &&
        (!selectedType || item.itemType === selectedType)
      );
    });

    if (filteredData.length === 0) {
      // If no data to export, you can show a message or handle it accordingly
      console.log("No data to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredItemList");
    XLSX.writeFile(wb, "filtered_item_list.xlsx");
  };

  const [editItemId, setEditItemId] = useState(null);
  const [editedItemName, setEditedItemName] = useState("");
  const [editedItemQty, setEditedItemQty] = useState("");
  const handleEditItem = (itemId) => {
    const selectedItem = itemList.find((item) => item._id === itemId);
    setEditItemId(itemId);
    setEditedItemName(selectedItem.itemName);
    setEditedItemQty(selectedItem.itemQty);
  };

  const handleUpdateItem = async (itemId) => {
    try {
      const updateItemList = await axios.put(
        `${serverUrl}/api/putItemList/${itemId}`,
        {
          itemName: editedItemName,
          itemQty: editedItemQty,
        }
      );
      // After successful update, reset the state and fetch updated item list
      setEditItemId(null);
      setEditedItemName("");
      setEditedItemQty("");
      // Update the itemList state with the updated data
      setItemList((prevItemList) =>
        prevItemList.map((item) =>
          item._id === itemId
            ? { ...item, itemName: editedItemName, itemQty: editedItemQty }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const hanldeDelteItem = async (id) => {
    try {
      const deleteItemList = await axios.delete(
        `${serverUrl}/api/deleteItemList/${id}`
      );
      if (deleteItemList.status === 200) {
        setItemList((prevList) => prevList.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pd1">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Add Item List"}</DialogTitle>
        <DialogContent>
          <div>
            <label>Occasssion</label>
            <div>
              <select
                className="txtBoxDD"
                value={itemAddOccassion}
                onChange={(e) => setItemAddOccassion(e.target.value)}
              >
                <option value="" disabled>
                  Select Occassion
                </option>
                {occassionData.map((occassion) => (
                  <option key={occassion._id} value={occassion.occassionName}>
                    {occassion.occassionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-1">
            <label>Type</label>
            <div>
              <select
                className="txtBoxDD"
                value={itemAddType}
                onChange={(e) => setItemAddType(e.target.value)}
              >
                <option value="" disabled>
                  Select Type
                </option>
                {typeData.map((type) => (
                  <option key={type._id} value={type.typeName}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-1">
            <label>Item Name </label>
            <div>
              <input
                type="text"
                className="txtBox"
                value={itemAddName}
                onChange={(e) => setItemAddName(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={spendsNameRef}
                required
              />
            </div>
          </div>

          <div className="mt-1">
            <label>Item Quantity </label>
            <div>
              <input
                type="number"
                className="txtBox"
                value={itemAddQuantity}
                onChange={(e) => setItemAddQuantity(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="button" onClick={handleAddItem}>
            Add Item
          </button>
        </DialogActions>
      </Dialog>
      {!hide && (
        <div className="flex space-between align-item-center">
          <div className="f20 primary">Item List</div>
          <div className="flex g1">
            <button className="button c-pointer" onClick={handleClickOpen}>
              Add Item
            </button>
          </div>
        </div>
      )}
      <div className="flex space-evenly mt-2">
        {!hide && (
          <div className="flex g2">
            <select
              name=""
              id=""
              className="dropdownFilterItemList"
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
            >
              <option value="" disabled>
                Select Occassion
              </option>
              {occassionData.map((occassion) => (
                <option key={occassion._id} value={occassion.occassionName}>
                  {occassion.occassionName}
                </option>
              ))}
            </select>
            <select
              name=""
              id=""
              className="dropdownFilterItemList"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="" disabled>
                Select Item List
              </option>
              {typeData.map((type) => (
                <option key={type._id} value={type.typeName}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="mt-3 flex space-evenly">
        {selectedOccasion && selectedType && (
          <div>
            <div>Grocery List</div>
            <table className="mt-1 tableList ">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Item Name</th>
                  <th>Item Qty</th>
                  <th>Item Price</th>
                  {/* <th>Update/Delete</th> */}
                </tr>
              </thead>
              <tbody>
                {itemList
                  .filter((item) => {
                    return (
                      (!selectedOccasion ||
                        item.itemOccassion === selectedOccasion) &&
                      (!selectedType || item.itemType === selectedType)
                    );
                  })
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        {editItemId === item._id ? (
                          <input
                            type="text"
                            value={editedItemName}
                            className="editTextBox"
                            onChange={(e) => setEditedItemName(e.target.value)}
                          />
                        ) : (
                          item.itemName
                        )}
                      </td>
                      <td>
                        {editItemId === item._id ? (
                          <input
                            type="text"
                            value={editedItemQty}
                            className="editTextBox"
                            onChange={(e) => setEditedItemQty(e.target.value)}
                          />
                        ) : (
                          item.itemQty
                        )}
                      </td>
                      <td></td>
                      {!hide && (
                        <td className="borderLessTd flex g1">
                          {editItemId === item._id ? (
                            <SaveIcon
                              onClick={() => handleUpdateItem(item._id)}
                              className="icon c-pointer"
                            />
                          ) : (
                            <EditIcon
                              onClick={() => handleEditItem(item._id)}
                              className="icon c-pointer"
                            />
                          )}
                          <DeleteIcon
                            onClick={() => hanldeDelteItem(item._id)}
                            className="icon c-pointer"
                          />
                        </td>
                      )}
                    </tr>
                  ))}

                <tr>
                  <td
                    colSpan="3"
                    className="fw-700"
                    style={{ textAlign: "right" }}
                  >
                    Total:
                  </td>
                  <td className="fw-700"></td>
                </tr>
              </tbody>
            </table>
            <div className="flex space-evenly mt-2">
              {!hide && (
                <div className="flex g1 align-item-center">
                  <button className="button c-pointer" onClick={handlePrint}>
                    Print
                  </button>
                  <button
                    className="button-outline c-pointer"
                    onClick={handleExportToExcel}
                  >
                    Export to Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {!hide && (
        <div className="flex align-item-center">
          <img
            src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQyMi0wMzIwLXBvci5qcGc.jpg"
            alt=""
            className="itemListImg"
          />
        </div>
      )}
    </div>
  );
};

export default itemList;
