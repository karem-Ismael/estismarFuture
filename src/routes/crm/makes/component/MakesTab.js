/**
 * Clients tab section
 */
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Typography, Button } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import { RctCard, RctCardContent } from "components/RctCard";
import { NotificationManager } from "react-notifications";
import { GetMakesQuery } from "gql/queries/Cars.queries.gql";
import { DeleteMakeMutation, UpdateMakeMutation } from "gql/mutations/Make.mutations.gql";
import { useQuery, useMutation } from "@apollo/client";
import PerPage from "components/shared/PerPage";
import CustomDialog from "components/CustomDialog/CustomDialog";
import ToggleButton from "components/shared/ToggleButton";
import NoImage from "assets/img/no-image.png";
import { userCan, getPageFromHash } from "functions";
import ConfirmationDialog from "./ConfirmationDialog";
import UpdateMake from "./UpdateClient";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.any,
  dir: PropTypes.string,
};

function MakesList({ requestData }) {
  const history = useHistory();
  const { locale } = useIntl();
  // states
  const [tabOptions, setTabOptions] = useSetState({
    limit: 20,
    page: getPageFromHash(history) || 1,
    value: 0,
    makeToChange: null,
    isUpdated: false,
    toggleDialogOpen: false,
  });
  const { page, limit, makeToChange, isUpdated, toggleDialogOpen } = tabOptions;
  const [makesData, setMakesData] = useState({});
  // refs
  const confirmationDialog = useRef();
  // gql
  const { data: makesRes, refetch } = useQuery(GetMakesQuery, { variables: { page, limit } });
  const [updateMakeMutation] = useMutation(UpdateMakeMutation);
  const [deleteMake] = useMutation(DeleteMakeMutation);

  React.useEffect(() => {
    setMakesData(makesRes?.makes);
  }, [makesRes]);

  React.useEffect(() => {
    if (page || limit || requestData) {
      refetch();
    }
  }, [page, limit, requestData]);

  const deleteMakePermanent = (confirm) => {
    if (confirm) {
      deleteMake({ variables: { makeId: makeToChange.id } })
        .then(() => {
          refetch();
        })
        .catch((err) => {
          NotificationManager.error(err?.message);
        });
    } else {
      setTabOptions({ makeToChange: null });
    }
  };

  const toggleMakeStatus = () => {
    updateMakeMutation({ variables: { makeId: makeToChange.id, status: !makeToChange.status } })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        NotificationManager.error(err?.message);
      })
      .finally(() => {
        setTabOptions({ toggleDialogOpen: false });
      });
  };

  const onCloseDialog = () => {
    setTabOptions({
      makeToChange: null,
      isUpdated: false,
    });
  };

  const handleClickEdit = (makeToChange) => {
    setTabOptions({
      makeToChange,
      isUpdated: true,
    });
  };

  const ondeleteMake = (makeToChange) => {
    setTabOptions({
      makeToChange,
    });
    confirmationDialog.current.openDialog();
  };

  return (
    <div className="client-tab-wrap p-15 Tab-wrap">
      {isUpdated && makeToChange && (
        <UpdateMake make={makeToChange} handleCloseEdit={onCloseDialog} refetch={refetch} />
      )}
      <div className="card mb-0 transaction-box w-100">
        <TabContainer>
          <div className="p-sm-20 pt-sm-30 p-10 pt-15">
            <div className="row">
              {makesData?.collection &&
                makesData?.collection?.map((data, index) => (
                  <div key={JSON.stringify(index)} className="col-sm-12 col-md-6 col-lg-3">
                    <RctCard>
                      <RctCardContent>
                        <div className="client-post text-center">
                          <div className="client-thumb mb-20">
                            <img
                              className="rounded"
                              src={data.logo || NoImage}
                              alt="client"
                              width="95"
                              height="95"
                              style={{ objectFit: "contain", width: "100%" }}
                            />
                          </div>
                          <div className="client-content">
                            <h4 className="fw-bold text-capitalize text-primary">{data.name}</h4>
                            <span className="d-block">
                              {locale === "ar" ? data.arName : data.enName}
                            </span>
                          </div>
                          <div className="client-action d-flex mt-2">
                            {userCan("makes.update") && (
                              <Button
                                className="rounded-circle mr-5"
                                onClick={() => handleClickEdit(data)}
                              >
                                <i className="material-icons">edit</i>
                              </Button>
                            )}
                            {userCan("makes.delete") && (
                              <Button className="rounded-circle" onClick={() => ondeleteMake(data)}>
                                <i className="material-icons">delete</i>
                              </Button>
                            )}
                            {/* IT MIGHT CHANGE TO makes.activation when it's ready from the backend */}
                            {userCan("makes.update") && (
                              <ToggleButton
                                isActive={data.status}
                                handleOpenDialog={() => selectToggleItem(data)}
                              />
                            )}
                          </div>
                        </div>
                      </RctCardContent>
                    </RctCard>
                  </div>
                ))}
            </div>
            {makesData?.metadata && (
              <div className="d-flex justify-content-around">
                <Pagination
                  showFirstButton
                  showLastButton
                  count={Math.ceil(makesData?.metadata?.totalCount / limit)}
                  page={makesData?.metadata?.currentPage}
                  onChange={(e, value) => {
                    setTabOptions({ page: value });
                    history.replace({ hash: `page=${value}` });
                  }}
                />
                <PerPage
                  specialPagination={[20, 40, 80, 100]}
                  handlePerPageChange={(value) => {
                    setTabOptions({ limit: value });
                    setTabOptions({ page: 1 });
                    history.replace({ hash: `page=1` });
                  }}
                  perPage={limit}
                />
              </div>
            )}
          </div>
        </TabContainer>
      </div>
      {/* Toggle Confirmation */}
      <CustomDialog
        title={
          <FormattedMessage
            id="deactivate.item"
            values={{ item: `${makeToChange?.[`${locale}Name`]}` }}
          />
        }
        content={<FormattedMessage id="toggle.confirmMessage" />}
        handleCancel={() => setTabOptions({ toggleDialogOpen: false })}
        open={toggleDialogOpen}
        withaction
        handleOk={toggleMakeStatus}
      />
      {/* Delete Confirmation */}
      <ConfirmationDialog
        dialogmessageid="delete.make.dialog.msg"
        dialogtitle={
          <FormattedMessage
            id="common.deleteSomething"
            values={{ something: locale === "ar" ? makeToChange?.arName : makeToChange?.enName }}
          />
        }
        ref={confirmationDialog}
        onConfirm={(confirm) => deleteMakePermanent(confirm)}
      />
    </div>
  );

  function selectToggleItem(data) {
    return setTabOptions({
      toggleDialogOpen: !toggleDialogOpen,
      makeToChange: data,
    });
  }
}

MakesList.propTypes = {
  requestData: PropTypes.func,
};

export default MakesList;
