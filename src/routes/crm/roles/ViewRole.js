/**
 * View Role Page
 */
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
// page title bar
import { AllPrivileges } from "gql/queries/GetPrivileges.gql";
import { Role } from "gql/queries/GetRole.gql";
// component
import CircularProgress from "@material-ui/core/CircularProgress";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
export default function ViewRole() {
  const classes = useStyles();
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const [, SetenName] = useState("");
  const [enError] = useState(false);
  const [, SetarName] = useState("");
  const [, SetarDescription] = useState("");
  const [, SetenDescription] = useState("");
  const [changes, setChanges] = useState(false);
  const { data } = useQuery(AllPrivileges);

  const { data: role } = useQuery(Role, {
    variables: {
      id,
    },
  });
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

  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.RoleDetails" })}</title>
      </Helmet>
      {role && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          autoComplete="off"
        >
          <div className="row" style={{ gap: "15px" }}>
            <div className="col-md-4 align-items-center">
              <TextField
                disabled
                onChange={(e) => SetarName(e.target.value)}
                label={<FormattedMessage id="arabicnamerole" />}
                variant="outlined"
                required
                defaultValue={role.role.arName}
                InputProps={{ inputProps: { minlength: 1, maxlength: 150 } }}
              />
            </div>

            <div className="col-md-4" style={{ gap: "15px" }}>
              <TextField
                disabled
                label={<FormattedMessage id="arabicdescription" />}
                multiline
                rows={6}
                defaultValue={role.role.arDescription}
                variant="outlined"
                onChange={(e) => SetarDescription(e.target.value)}
                required
                InputProps={{ inputProps: { minlength: 10, maxlength: 500 } }}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-4 align-items-center">
              <TextField
                disabled
                label={<FormattedMessage id="englishrolename" />}
                onChange={(e) => SetenName(e.target.value)}
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
                disabled
                rows={6}
                variant="outlined"
                defaultValue={role.role.enDescription}
                onChange={(e) => SetenDescription(e.target.value)}
                InputProps={{ inputProps: { minlength: 10, maxlength: 500 } }}
                required
              />
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
                                  disabled
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
