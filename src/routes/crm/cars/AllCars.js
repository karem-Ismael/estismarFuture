/* eslint-disable prettier/prettier */
/** Cars Page */
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation } from "@apollo/client";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import { RctCard, RctCardContent } from "Components/RctCard";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DraftsIcon from "@material-ui/icons/Drafts";
import { AllyCars } from "gql/queries/CarList.gql";
import DeleteIcon from "@material-ui/icons/Delete";
import { userCan, getPageFromHash } from "functions";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import swal from "sweetalert";
import { BulkDeleteCars } from "gql/mutations/BulkDeleteCars.gql";
import { BulkActivateCars } from "gql/mutations/BulkActivate.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Modal from "@material-ui/core/Modal";
// import store from "../../../../store";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Collapse } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import store from "../../../store";
import CarList from "./CarList";
import ChangeData from "./ChangeDataModal";
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
export default function AllCars() {
  const { is_super_user } = store.getState()?.authUser.user;
  const location = useLocation();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState({});
  const [carIds, setCarIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [allchecked, setAllChecked] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [bulkDeleteCars] = useMutation(BulkDeleteCars);
  const [bulkActivateCars] = useMutation(BulkActivateCars);
  const [orderBy, setOrderBy] = useState();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: allyCars, refetch: refetchallycars, loading } = useQuery(AllyCars, {
    variables: {
      page,
      limit,
      ...query,
      availabilityStatus:
        query.availabilityStatus == "false" ? false : query.availabilityStatus ? true : undefined,
      branchId: query.branchId == "null" ? null : Array.isArray(query.branchId)? undefined :query.branchId,
      sortBy:orderBy,
    },
  });
  const ActivateCars = (isActive) => {
    const filtered = carIds.filter(function (el) {
      return el != null;
    });
    if (!filtered.length) {
      NotificationManager.error(<FormattedMessage id="you.must.select.car" />);
      return;
    }
    bulkActivateCars({
      variables: {
        availabilityStatus: isActive,
        carIds: filtered,
      },
    })
      .then(() => {
        refetchallycars();
        setAnchorEl(null);
        setCarIds([]);
        setAllChecked(false);
      })
      .then(() => NotificationManager.success(<FormattedMessage id="StatusSucessfully" />))
      .catch((err) => NotificationManager.error(err?.message));
  };

  const handelDelete = () => {
    const filtered = carIds.filter(function (el) {
      return el != null;
    });
    if (!filtered.length) {
      NotificationManager.error(<FormattedMessage id="you.must.select.car" />);
      return;
    }
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: "u.want.delete.item" }),
      icon: "warning",
      buttons: [formatMessage({ id: "cancel" }), formatMessage({ id: "delete" })],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        bulkDeleteCars({
          variables: {
            carIds: filtered,
          },
        })
          .then(() => {
            refetchallycars();
            setAllChecked(false);
          })
          .then((res) =>
            swal(formatMessage({ id: "carsdeletedsuccessfully" }), {
              icon: "success",
            }),
          )
          .then(() => {
            setAnchorEl(undefined);
            setCarIds([]);
          })
          .catch((error) => {
            NotificationManager.error(`${error?.message}`);
          });
      }
    });
  };

  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.cars" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.cars" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <div className="d-flex" style={{ gap: "10px" }}>
            {userCan("cars.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("cars/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.addcar }} />
              </Button>
            )}
            {/* <Button 
             variant="contained"
            color="primary"
            className="mx-sm-15 btn btn-danger">Actions</Button> */}

            <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              className="mx-sm-15 btn btn-danger"
              onClick={handleClick}
            >
              <FormattedMessage id="common.actions" />
            </Button>
            <StyledMenu
              id="customized-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {is_super_user && (
                <StyledMenuItem onClick={() => handelDelete()}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id="delete" />} />
                </StyledMenuItem>
              )}
              <StyledMenuItem
                onClick={() => {
                  const filtered = carIds.filter(function (el) {
                    return el != null;
                  });
                  if (!filtered.length) {
                    NotificationManager.error(<FormattedMessage id="you.must.select.car" />);
                    return;
                  }
                  setOpen(true);
                }}
              >
                <ListItemIcon>
                  <DraftsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={<FormattedMessage id="updatecars" />} />
              </StyledMenuItem>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>
                    <FormattedMessage id="ChangeStatus" />
                  </Typography>
                </AccordionSummary>
                <StyledMenuItem onClick={() => ActivateCars(true)}>
                  <ListItemText primary={<FormattedMessage id="active" />} />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => ActivateCars(false)}>
                  <ListItemText primary={<FormattedMessage id="inactive" />} />
                </StyledMenuItem>
              </Accordion>
            </StyledMenu>
          </div>
        }
      />
      <ChangeData
        open={open}
        setOpen={setOpen}
        ids={carIds}
        refetch={refetchallycars}
        setAllChecked={setAllChecked}
        setCarIds={setCarIds}
      />
      <>
        <div className="search-bar-wrap">
          <div className="d-flex justify-content-end">
            <Button
              className="d-flex justify-content-end mb-2 align-items-center"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <FilterListIcon />
              <span>
                <FormattedMessage id="Filter" />
              </span>
              {!isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </Button>
          </div>
          <Collapse in={isCollapsed} timeout="auto">
            <RctCard>
              <RctCardContent>
                <div className="row">
                  <FiltersAndSearches
                    make="make"
                    refetch={refetchallycars}
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    submitbtnid="search.filter"
                    fields={[{}]}
                    filters={[
                      "makesId",
                      "ally",
                      "availabillity_status",
                      "model",
                      "branch",
                      "year",
                      "trans",
                      "vehicle",
                      "dailyprice",
                      "cities",
                    ]}
                    model="model"
                    car="car"
                  />
                </div>
              </RctCardContent>
            </RctCard>
          </Collapse>
        </div>
        <CarList
          refetch={refetchallycars}
          loading={loading}
          setPage={setPage}
          setLimit={setLimit}
          limit={limit}
          allCars={allyCars}
          url={`${location.pathname}${location.search}`}
          setCarIds={setCarIds}
          carIds={carIds}
          allchecked={allchecked}
          setAllChecked={setAllChecked}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      </>
    </div>
  );
}
