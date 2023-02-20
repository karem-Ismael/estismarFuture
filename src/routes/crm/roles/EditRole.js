/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable eqeqeq */
/* eslint-disable react/button-has-type */
/**
 * Bookings/Rentals Page
 */
 import React, { useEffect, useState } from "react";
 import TextField from "@material-ui/core/TextField";
 import { FormattedMessage, useIntl } from "react-intl";
 import { useLocation, useHistory, useParams } from "react-router-dom";
 import { useQuery, useMutation } from "@apollo/client";
 // page title bar
 import { AllPrivileges } from "gql/queries/GetPrivileges.gql";
 import { Role } from "gql/queries/GetRole.gql";
 import { NotificationManager } from "react-notifications";
 // component
 import CircularProgress from "@material-ui/core/CircularProgress";
 import { EditRole } from "gql/mutations/EditRole.gql";
 
 import Table from "@material-ui/core/Table";
 import TableBody from "@material-ui/core/TableBody";
 import TableCell from "@material-ui/core/TableCell";
 import TableContainer from "@material-ui/core/TableContainer";
 import TableHead from "@material-ui/core/TableHead";
 import TableRow from "@material-ui/core/TableRow";
 import Paper from "@material-ui/core/Paper";
 import { makeStyles } from "@material-ui/core/styles";
 import { Helmet } from "react-helmet";
 import { AddRole } from "gql/mutations/AddRole.gql";
 import FormControlLabel from "@material-ui/core/FormControlLabel";
 import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
 import IntlMessages from "util/IntlMessages";
 import PageTitleBar from "components/PageTitleBar/PageTitleBar";
 const useStyles = makeStyles({
   table: {
     minWidth: 650,
   },
 });
 export default function EditRoles() {
   const classes = useStyles();
   const { id } = useParams();
   const history = useHistory();
   const { formatMessage, messages } = useIntl();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);
   const [arError, SetarError] = useState(false);
   const [enName, SetenName] = useState("");
   const [enError, SetenError] = useState(false);
   const [arName, SetarName] = useState("");
   const [arDescription, SetarDescription] = useState("");
   const [enDescription, SetenDescription] = useState("");
   const [changes, setChanges] = useState(false);
   const { data } = useQuery(AllPrivileges);
 
   const { data: role, refetch } = useQuery(Role, {
     variables: {
       id,
     },
   });
   const [editRole] = useMutation(EditRole);
   const [ids, setDataids] = useState([]);
   const header = [...new Set(data?.privileges?.map((priv) => priv.name.split(".")[1]))];
   const col = [...new Set(data?.privileges?.map((priv) => priv.name.split(".")[0]))];
   const GetChangeData = (data) => {
     const selectedroles = role.role.privileges.map((piv) => piv.id);
     if (role.role.privileges.find((role) => role.id == data.id && ids.length == 0 && !changes)) {
       const removeselect = role.role.privileges
         .filter((role) => role.id != data.id)
         .map((role) => role.id);
       setDataids([...ids, ...removeselect]);
       setChanges(true);
     } else if (ids.length != 0 && ids.includes(data.id)) {
       const remain = ids.filter((role) => role != data.id);
       setDataids([...remain]);
       setChanges(true);
     } else if (ids.length == 0 && changes) {
       setDataids([...ids, data.id]);
     } else if (!ids.length) {
       setDataids([...ids, ...selectedroles, data.id]);
       setChanges(true);
     } else {
       setDataids([...ids, data.id]);
       setChanges(true);
     }
   };
   const selected = (data) => {
     let selectedidss = [];
     selectedidss = role?.role.privileges.map((role) => role.id);
     return selectedidss && selectedidss?.includes(data);
     // return true;
   };
   useEffect(() => {
     if (role?.role) {
       SetarDescription(role?.role?.arDescription);
       SetenDescription(role?.role?.enDescription);
     }
   }, [role?.role]);
   const handelEditRole = () => {
     // debugger
     // if (
     //   !arName.length &&
     //   !enName.length &&
     //   !ids.length &&
     //   !changes
     // ) {
     //   NotificationManager.warning(<FormattedMessage id="NoChangestoEdit" />);
     //   history.push("/cw/dashboard/roles");
     //   return;
     // }
     if (!arName.length && !enName.length && !ids.length && changes) {
       NotificationManager.error(<FormattedMessage id="youmustselectrole" />);
       return;
     }
     const roles = role.role.privileges.map((role) => role.id);
     editRole({
       variables: {
         id,
         arName: arName.length ? arName : role.role.arName,
         arDescription,
         enDescription,
         enName: enName.length ? enName : role.role.enName,
         privileges: ids.length ? ids : roles,
       },
     })
       .then((res) => {
         NotificationManager.success(<FormattedMessage id="RoleEditSuccessfully" />);
         refetch().then(() => setTimeout(() => history.push("/cw/dashboard/roles"), 1000));
       })
       .catch((err) => NotificationManager.error(err?.message));
   };
 
   return (
     <div className="clients-wrapper">
       <Helmet>
         <title>{formatMessage({ id: "sidebar.EditRole" })}</title>
       </Helmet>
       <PageTitleBar
         title={<IntlMessages id="sidebar.EditRole" />}
         match={location}
         lastElement={id}
         enableBreadCrumb
       />
       {role && (
         <form
           onSubmit={(e) => {
             e.preventDefault();
             handelEditRole();
           }}
           autoComplete="off"
         >
           <div className="row">
             <div className="col-md-4 align-items-center">
               <TextField
                 onBlur={(e) => SetarName(e.target.value)}
                 label={<FormattedMessage id="arabicnamerole" />}
                 variant="outlined"
                 required
                 defaultValue={role.role.arName}
                 InputProps={{ inputProps: { minlength: 1, maxlength: 150 } }}
               />
             </div>
 
             <div className="col-md-4">
               <TextField
                 label={<FormattedMessage id="arabicdescription" />}
                 multiline
                 rows={6}
                 defaultValue={role.role.arDescription}
                 variant="outlined"
                 onBlur={(e) => SetarDescription(e.target.value)}
               />
             </div>
           </div>
           <div className="row mt-3">
             <div className="col-md-4 align-items-center">
               <TextField
                 label={<FormattedMessage id="englishrolename" />}
                 onBlur={(e) => SetenName(e.target.value)}
                 variant="outlined"
                 helperText={enError ? "en Name required " : null}
                 required
                 defaultValue={role.role.enName}
                 InputProps={{ inputProps: { minlength: 1, maxlength: 150 } }}
               />
             </div>
             <div className="col-md-4">
               <TextField
                 label={<FormattedMessage id="englishroledescription" />}
                 multiline
                 rows={6}
                 variant="outlined"
                 defaultValue={role.role.enDescription}
                 onBlur={(e) => SetenDescription(e.target.value)}
               />
             </div>
 
             <div className="col-md-4 align-items-center">
               <div className="row">
                 <div className="col-lg-6 col-md-12 mt-2">
                   <button type="submit" className="btn btn-primary text-white">
                     <FormattedMessage id="save" />
                   </button>
                 </div>
                 <div className="col-lg-6 col-md-12 mt-2">
                   <button
                     onClick={() => history.push("/cw/dashboard/roles")}
                     className="btn btn-danger text-white"
                   >
                     <FormattedMessage id="cancel" />
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </form>
       )}
       <div className="row justify-content-center">
         {role ? (
           <div className="col-12">
             <TableContainer component={Paper}>
               <Table className={classes.table} size="small" aria-label="a dense table">
                 <TableHead>
                   <TableRow>
                     <TableCell>
                       <FormattedMessage id="name" />
                     </TableCell>
                     {header.map((data) => (
                       <TableCell>
                         <FormattedMessage id={data} />
                       </TableCell>
                     ))}
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {col.map((col) => (
                     <TableRow>
                       <TableCell>
                         <FormattedMessage id={col} />
                       </TableCell>
                       {header.map((head) => (
                         <TableCell>
                           {role &&
                           data?.privileges
                             .filter((data) => data.name.split(".")[0] == col)
                             .find((data) => data.name == `${col}.${head}`) ? (
                             <FormControlLabel
                               control={
                                 <Checkbox
                                   defaultChecked={selected(
                                     data?.privileges.find((data) => data.name == `${col}.${head}`)
                                       .id,
                                   )}
                                   onChange={() =>
                                     GetChangeData(
                                       data?.privileges.find(
                                         (data) => data.name == `${col}.${head}`,
                                       ),
                                     )
                                   }
                                 />
                               }
                             />
                           ) : (
                             role && <FormControlLabel control={<Checkbox disabled />} />
                           )}
                         </TableCell>
                       ))}
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           </div>
         ) : (
           <CircularProgress />
         )}
       </div>
     </div>
   );
 }
 