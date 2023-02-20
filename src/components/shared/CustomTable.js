/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/**
 * Custom Table
 */
 import React, { useState } from "react";
 import PropTypes from "prop-types";
 import { FormattedMessage, useIntl } from "react-intl";
 import { Box, CircularProgress, Dialog, Modal, Typography } from "@material-ui/core";
 import { Alert } from "constants/constants";
 import Checkbox from "@material-ui/core/Checkbox";
 import TableSortLabel from '@material-ui/core/TableSortLabel';
 import CellData from "./CellData";
 import SortByComponent from "./SortByComponent"
 function CustomTable({
   tableData,
   tableRecords,
   actions,
   loading,
   actionsArgs,
   setCarIds,
   carIds,
   AssignBooking,
   RefundBooking,
   withcheckbox = false,
   setAllChecked,
   allchecked,
   refetch,
   setSortBy,
   setOrderBy
 }) {
   const { locale } = useIntl();
   const [open, setOpen] = useState(false);
   const handleClose = () => setOpen(false);
 
   const onSelectAllClick = (e) => {
     if (e.target.checked) {
       setAllChecked(true);
       const ids = [];
       tableRecords.map((record) => ids.push(record.id));
       setCarIds(ids);
     } else {
       setAllChecked(false);
       setCarIds([]);
     }
   };
   const onSingleCheck = (e, index, record) => {
     const ids = [...carIds];
     if (e.target.checked) {
       setCarIds([...carIds, record.id]);
     } else {
       const filteredids = ids.filter((id) => id != record.id);
       setCarIds(filteredids);
     }
   };
   return (
     <>
       <div className="table-responsive" style={{position:"relative"}}>
         <table className="table table-hover">
           <thead>
             <tr data-testid="header-row">
               {withcheckbox && (
                 <th>
                   <Checkbox
                     // indeterminate={numSelected > 0 && numSelected < rowCount}
                     checked={allchecked}
                     onChange={onSelectAllClick}
                     inputProps={{ "aria-label": "select all desserts" }}
                   />
                 </th>
               )}
               <th>#</th>
               {tableData?.map((header, idx) => (
                 <th key={JSON.stringify(idx)} align="center">
                   <div
                     key={header?.headerId}
                     role="button"
                     className={`${header?.withAction ? "pointer" : ""}`}
                     // onKeyDown={() => header?.handleAction()}
                     // onClick={() => header?.handleAction()}
                     tabIndex={0}
                   >
                     <span data-testid="capitalized-header" style={{ textTransform: "capitalize" }}>
                       {header?.headerId && (
                        header.issortable ?
                        <SortByComponent orderBy={header.orderBy} setOrderBy={setOrderBy} setSortBy={setSortBy}>
 
                         
                         <FormattedMessage id={header?.headerId || Alert("Missing Header ID")} />
                         </SortByComponent>
                     
                         
                         :<FormattedMessage id={header?.headerId || Alert("Missing Header ID")} />
                       
                       )}
                     </span>
                   </div>
                 </th>
               ))}
             </tr>
           </thead>
 
           <tbody>
             {tableRecords?.map((record, idx) => (
               <tr key={JSON.stringify(idx)} data-testid={`data-tr-${idx}`}>
                 {withcheckbox && (
                   <td>
                     <Checkbox
                       checked={carIds?.includes(record.id)}
                       onChange={(e) => onSingleCheck(e, idx, record)}
                       inputProps={{ "aria-label": "select all desserts" }}
                     />
                   </td>
                 )}
                 <td> {idx + 1}</td>
                 {tableData.map((data, index) => (
                   <>
                     <td key={JSON.stringify(index)} align={`${data?.align || ""}`}>
                       {CellData({
                         data,
                         record,
                         locale,
                         actions,
                         actionsArgs,
                         AssignBooking,
                         RefundBooking,
                       })}
                       {data?.dataRef === "additionalNotes" && record?.additionalNotes?.length > 10 && (
                         <div className="d-inline-block">
                           <button
                             style={{ background: "none", border: "none", cursor: "pointer" }}
                             type="button"
                             onClick={() => setOpen(true)}
                           >
                             <span>..</span>
                             <FormattedMessage id="button.more" />
                           </button>
                           <Modal
                             open={open}
                             onClose={handleClose}
                             aria-labelledby="modal-modal-title"
                             aria-describedby="modal-modal-description"
                           >
                             <Box className="custom-popup px-4 py-2 position-relative">
                               <i
                                 style={{ cursor: "pointer" }}
                                 onClick={() => setOpen(false)}
                                 className="ti-close"
                               ></i>
                               <h4 style={{ textDecoration: "underline", fontWeight: "bold" }}>
                                 <FormattedMessage id="Additional notes" />
                               </h4>
                               <p className="m-0" style={{ fontSize: "18px" }}>
                                 {record?.additionalNotes}
                               </p>
                             </Box>
                           </Modal>
                         </div>
                       )}
                     </td>
                   </>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
         {tableRecords && tableRecords.length === 0 && (
           <div className="text-center mt-3 mb-4">
             <FormattedMessage id="No data found" />
           </div>
         )}
       </div>
       { loading && (
         <div className="d-flex justify-content-center align-items-center" style={{zIndex:"999",position:"fixed",top:0,width:"calc(100vw - 140px)",height:"100vh",left:locale =="ar" ? 0 : "",right:locale=="ar"? "":0 }}>
           <CircularProgress />
         </div>
       )}
     </>
   );
 }
 
 CustomTable.propTypes = {
   tableData: PropTypes.array,
   tableRecords: PropTypes.array,
   actionsArgs: PropTypes.array,
   actions: PropTypes.any,
   loading: PropTypes.bool,
 };
 
 export default CustomTable;
 
