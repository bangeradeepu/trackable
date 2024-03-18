{bankDetails.length === 1 && orgData.length === 1 && typeData.length === 1 &&  occassionData.lengt === 1 && memberData.length === 1  ? (
  <div className="flex justify-content-center">
  <div className="flex justify-content-center completeSetupBox">
    <div>
      <div className="f14">Please Complete the setup</div>
      {bankDetails.length === 0 && orgData.length === 0 && (
        <div
          className="mt-2 hvGreen c-pointer secondary"
          onClick={() => navigate("/bankDetails")}
        >
          Set Bank Details and Profile
        </div>
      )}
      {typeData.length === 0 && occassionData.length === 0 && (
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
              {/* <option value="" disabled selected>Select Occassion</option> */}
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
              {/* <option value="" disabled selected>Select Type</option> */}
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
        <div className="mt-1">
          <label>Spends Name </label>
          <div>
            <input
              type="text"
              className="txtBox"
              value={spendsName}
              onChange={(e) => setSpendsName(e.target.value)}
              onKeyPress={handleKeyPress}
              ref={spendsNameRef}
              required
            />
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

85214789295-vvmbdtnt433opvfrta4bo99botregnfr.apps.googleusercontent.com


https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQ1LTMtMDktbmFwXzEuanBn.jpg