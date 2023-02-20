/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/** Bookings List */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Tooltip, Modal, Box, Button } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import useSetState from "hooks/useSetState";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import CustomTable from "components/shared/CustomTable";
import PerPage from "components/shared/PerPage";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { userCan } from "functions/userCan";
import { useMutation, useQuery } from "@apollo/client";
import Select, { createFilter } from "react-select";
import { DeleteAllyManager } from "gql/mutations/DeleteManager.gql";
import styled from "styled-components";
import { CreateBusinessRentalOffer } from "gql/mutations/BusinessRentals.gql";
import { GetBidOfferAllyDropDown } from "gql/queries/Ally.queries.gql";
import { BusinessRequestsData } from "./BusinessRequestsData";
import store from "../../../store";

const Input = styled.input`
  &:not([type="checkbox"]) {
    border: solid 1px #e2e2e2;
    border-radius: 5px;
    padding: 7px 10px;
    width: 100%;
    font-size: 14px;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
function BusinessRequestList({ businessRequests, loading, setPage, limit, setLimit, refetch }) {
  const { ally_id } = store.getState()?.authUser.user;
  const [businessRentalId, setBusinessRentalId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [standardInsurance, setStandardInsurance] = useState(false);
  const [fullInsurance, setFullInsurance] = useState(false);
  const { formatMessage } = useIntl();
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [models, setModelsStates] = useSetState({
    collection: [],
    metadata: {},
  });
  const { collection, metadata } = models;
  const [deleteAllyManager] = useMutation(DeleteAllyManager);
  const [createBusinessRentalOffer, { error: responseErr }] = useMutation(
    CreateBusinessRentalOffer,
    { errorPolicy: "all" },
  );
  const { data: alliesList, loading: loadingAlliesList } = useQuery(GetBidOfferAllyDropDown, {
    variables: {
      businessRequestId: businessRentalId,
      skip: !businessRentalId,
    },
  });

  useEffect(() => {
    setModelsStates({
      collection: businessRequests?.businessRequests?.collection,
      metadata: businessRequests?.businessRequests?.metadata,
    });
  }, [businessRequests]);
  useEffect(() => {
    refetch();
  }, []);
  const actions = ({ id }) => (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      {userCan("business_requests.view") && (
        <Tooltip title={formatMessage({ id: "common.details" })} placement="top">
          <Link to={`/cw/dashboard/businessrequests/${id}`}>
            <i className=" ti-eye"></i>
          </Link>
        </Tooltip>
      )}

      {userCan("business_requests.offer") && (
        <Tooltip title={formatMessage({ id: "offer" })} placement="top">
          <i
            className="ti-hand-open"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsModalOpen(true);
              setBusinessRentalId(id);
            }}
          ></i>
        </Tooltip>
      )}
      {userCan("business_requests.update") && (
        <Tooltip title={formatMessage({ id: "common.edit" })} placement="top">
          <Link to={`/cw/dashboard/businessrequests/${id}/edit`}>
            <i className=" ti-pencil-alt"></i>
          </Link>
        </Tooltip>
      )}
    </div>
  );

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fields = {
      businessRentalId: +businessRentalId,
      allyCompanyId: ally_id
        ? +ally_id
        : formData.get("allyCompanyId")
        ? +formData.get("allyCompanyId")
        : null,
      offerPrice: formData.get("offerPrice") ? +formData.get("offerPrice") : null,
      carInsuranceStandard: formData.get("carInsuranceStandard")
        ? +formData.get("carInsuranceStandard")
        : null,
      carInsuranceFull: formData.get("carInsuranceFull") ? +formData.get("carInsuranceFull") : null,
      kilometerPerMonth: formData.get("kilometerPerMonth")
        ? +formData.get("kilometerPerMonth")
        : null,
      additionalKilometer: formData.get("additionalKilometer")
        ? +formData.get("additionalKilometer")
        : null,
    };
    if (!standardInsurance) delete fields.carInsuranceStandard;
    if (!fullInsurance) delete fields.carInsuranceFull;
    if (!standardInsurance && !fullInsurance) {
      NotificationManager.error(
        formatMessage({ id: "Please choose at leaset one insurance type" }),
      );
    } else {
      Object.values(fields).map((i, index) => {
        if (!i) {
          NotificationManager.error(
            formatMessage({ id: `Please enter.${Object.keys(fields)[index]}` }),
          );
        }
      });
      if (
        !errors?.carInsuranceStandard &&
        !errors?.carInsuranceFull &&
        !errors?.offerPrice &&
        !errors?.additionalKilometer &&
        !errors?.kilometerPerMonth &&
        (ally_id || fields.allyCompanyId) &&
        fields.offerPrice &&
        fields.kilometerPerMonth &&
        fields.additionalKilometer &&
        (fields.carInsuranceStandard || fields.carInsuranceFull)
      ) {
        createBusinessRentalOffer({ variables: fields })
          .then((res) => {
            if (res?.data) {
              NotificationManager.success(formatMessage({ id: "Bid offer sent successfully" }));
              setFullInsurance(false);
              setStandardInsurance(false);
              setIsModalOpen(false);
            } else if (res?.errors) {
              return res?.errors.map((err) =>
                NotificationManager.error(formatMessage({ id: err?.message })),
              );
            }
          })
          .catch((err) => {
            NotificationManager.error(formatMessage({ id: err.message }));
          });
      }
    }
  }

  return (
    <>
      <Typography component="div" style={{ padding: 10 }}>
        <div>
          <RctCollapsibleCard fullBlock table>
            <CustomTable
              tableData={BusinessRequestsData}
              loading={loading}
              tableRecords={collection}
              actions={actions}
              actionsArgs={["id"]}
            />
          </RctCollapsibleCard>
        </div>
        <div className="d-flex justify-content-around">
          {metadata?.currentPage && (
            <>
              <Pagination
                count={Math.ceil(metadata?.totalCount / limit)}
                page={metadata?.currentPage}
                onChange={(e, value) => {
                  setPage(value);
                  history.replace({ hash: `page=${value}` });
                }}
              />
              <PerPage
                specialPagination={[10, 20, 40, 80, 100]}
                handlePerPageChange={(value) => setLimit(value)}
                perPage={limit}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </Typography>
      <Modal
        open={isModalOpen}
        onClose={null}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="custom-popup px-4 py-2 position-relative" style={{ minWidth: "30%" }}>
          <i
            style={{ cursor: "pointer" }}
            onClick={() => setIsModalOpen(false)}
            className="ti-close"
          ></i>
          <h2 style={{ textAlign: "center", fontWeight: "600", marginBottom: "20px" }}>
            <FormattedMessage id="offer" />
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="d-block m-0 mb-2 mt-3" style={{ fontWeight: "bold" }}>
                <FormattedMessage id="Car Insurance" />
              </label>
              <div className="d-flex" style={{ gap: "20px" }}>
                <div>
                  <div style={{ cursor: "pointer" }}>
                    <Input
                      id="Standard"
                      type="checkbox"
                      name="Standard"
                      value="Standard"
                      onChange={(e) => setStandardInsurance(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="d-inline-block m-0 mx-1 mb-2"
                      htmlFor="Standard"
                      style={{ cursor: "pointer" }}
                    >
                      <FormattedMessage id="Standard" />
                    </label>
                  </div>
                  {standardInsurance && (
                    <>
                      <Input
                        id="carInsuranceStandard"
                        name="carInsuranceStandard"
                        type="number"
                        step="0.01"
                        className="mb-4"
                        placeholder={formatMessage({ id: "Insurance value" })}
                        onChange={(e) => {
                          if (Number(e.target.value) > 999999.99) {
                            return setErrors({ ...errors, carInsuranceStandard: true });
                          }
                          return setErrors({ ...errors, carInsuranceStandard: false });
                        }}
                      />
                      {errors?.carInsuranceStandard && (
                        <p className="error" style={{ marginTop: "-20px" }}>
                          <FormattedMessage id="Max. is 999999.99" />
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <div className="-cursor-pointer">
                    <Input
                      id="Full"
                      type="checkbox"
                      name="Full"
                      value="Full"
                      onChange={(e) => setFullInsurance(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="d-inline-block m-0 mb-2 mx-1"
                      htmlFor="Full"
                      style={{ cursor: "pointer" }}
                    >
                      <FormattedMessage id="Full" />
                    </label>
                  </div>
                  {fullInsurance && (
                    <>
                      <Input
                        id="carInsuranceFull"
                        name="carInsuranceFull"
                        type="number"
                        className="mb-4"
                        placeholder={formatMessage({ id: "Monthly Insurance value" })}
                        step="0.01"
                        onChange={(e) => {
                          if (Number(e.target.value) > 999999.99) {
                            return setErrors({ ...errors, carInsuranceFull: true });
                          }
                          return setErrors({ ...errors, carInsuranceFull: false });
                        }}
                      />
                      {errors?.carInsuranceFull && (
                        <p className="error" style={{ marginTop: "-20px" }}>
                          <FormattedMessage id="Max. is 999999.99" />
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              {!ally_id ? (
                <>
                  <Select
                    name="allyCompanyId"
                    placeholder={formatMessage({
                      id: "bookings.list.allyName",
                    })}
                    isSearchable
                    // isClearable={() => null}
                    className="select required"
                    filterOption={createFilter({
                      matchFrom: "any",
                      stringify: (option) => `${option.label}`,
                    })}
                    options={
                      !loadingAlliesList
                        ? alliesList?.allyCompanies?.collection.map((item) => ({
                            label: item.name,
                            value: item.id,
                            enName: item.enName,
                            arName: item.arName,
                          }))
                        : null
                    }
                    isLoading={loadingAlliesList}
                  />
                </>
              ) : null}

              <label
                className="d-block m-0 mb-1 mt-2"
                style={{ fontWeight: "bold" }}
                htmlFor="offerPrice"
              >
                <FormattedMessage id="Offer Price" />
              </label>
              <div className="d-flex align-items-center">
                <Input
                  id="offerPrice"
                  name="offerPrice"
                  type="number"
                  step="0.01"
                  style={{ marginTop: "20px" }}
                  onChange={(e) => {
                    if (Number(e.target.value) > 9999999.99) {
                      return setErrors({ ...errors, offerPrice: true });
                    }
                    return setErrors({ ...errors, offerPrice: false });
                  }}
                  className="m-0"
                />
                <span className="mx-2" style={{ flexBasis: "97px" }}>
                  <FormattedMessage id="SAR / Month" />
                </span>
              </div>
              {errors?.offerPrice && (
                <p className="error">
                  <FormattedMessage id="Max. is 9999999.99" />
                </p>
              )}
            </div>
            <div>
              <label className="d-block m-0 mb-2 mt-3" style={{ fontWeight: "bold" }}>
                <FormattedMessage id="Kilometer allowed per month" />
              </label>
              <Input
                id="kilometerPerMonth"
                name="kilometerPerMonth"
                type="number"
                step="0.01"
                onChange={(e) => {
                  if (Number(e.target.value) > 999999.99) {
                    return setErrors({ ...errors, kilometerPerMonth: true });
                  }
                  return setErrors({ ...errors, kilometerPerMonth: false });
                }}
              />
              {errors?.kilometerPerMonth && (
                <p className="error">
                  <FormattedMessage id="Max. is 9999999.99" />
                </p>
              )}
            </div>
            <div>
              <label className="d-block m-0 mb-2 mt-3" style={{ fontWeight: "bold" }}>
                <FormattedMessage id="Additional distance cost" />
              </label>
              <Input
                id="additionalKilometer"
                name="additionalKilometer"
                type="number"
                step="0.01"
                onKeyPress={(e) =>
                  Number(e.target.value > 999999.9)
                    ? (e.preventDefault(), setErrors({ ...errors, additionalKilometer: true }))
                    : setErrors({ ...errors, additionalKilometer: false })
                }
              />
              {errors?.additionalKilometer && (
                <p className="error">
                  <FormattedMessage id="Max. is 9999999.99" />
                </p>
              )}
            </div>
            <div className="d-flex mt-4 mb-4" style={{ gap: "20px" }}>
              <Button
                variant="contained"
                className="w-100"
                type="submit"
                style={{ background: "#464d69", color: "#fff", fontWeight: "bold" }}
              >
                <FormattedMessage id="offer" />
              </Button>
              <Button
                variant="contained"
                className="w-100"
                type="button"
                style={{ background: "#464d69", color: "#fff", fontWeight: "bold" }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(false);
                  setFullInsurance(false);
                  setStandardInsurance(false);
                }}
              >
                <FormattedMessage id="cancel" />
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

BusinessRequestList.propTypes = {
  setPage: PropTypes.func,
  setLimit: PropTypes.func,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  businessRequests: PropTypes.object,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BusinessRequestList;
