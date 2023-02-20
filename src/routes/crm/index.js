/* eslint-disable prettier/prettier */
/**
 * Crm Routes
 */
 import React from "react";
 import PropTypes from "prop-types";
 import { Route, Switch } from "react-router-dom";
 
 import {
   AsyncMakes,
   AsyncAddEditCompany,
   AsyncBookings,
   AsyncUsers,
   AsyncCustomers,
   AsyncBookingDetails,
   AsyncCustomerDetails,
   AsyncUserDetails,
   AsyncCreateEditRental,
   AsyncCreateEditUser,
   AsyncCreateEditCustomer,
   AsyncChangeStatus,
   AsyncRoles,
   AsyncAddRole,
   AsyncEditRole,
   AsyncCars,
   AsyncCarEdit,
   AsyncCompanies,
   AsyncBranches,
   AsyncModels,
   AsyncCarProfile,
   AsyncModelProfile,
   AsyncBranchProfile,
   AsyncCompanyDetails,
   AsyncAddEditCar,
   AsyncAddEditModels,
   AsyncCarVersions,
   AsyncCreateVersions,
   AsyncAddEditBranch,
   AsyncVersionsDetails,
   AsyncViewRole,
   AsyncBanners,
   AsyncAddEditBanners,
   AsyncFeatures,
   AsyncAlliesRates,
   AsyncFeaturesAddEdit,
   AsyncViewFeature,
   AsyncManagers,
   AsyncAddManager,
   AsyncViewManager,
   AsyncRatesAddEdit,
   AsyncExtraService,
   AsyncExtraServiceDetails,
   AsyncEditExtraService,
   AsyncCrmComponent,
   AsyncEcommerceDashboardComponent,
   AsyncSaasDashboardComponent,
   AsyncAgencyDashboardComponent,
   AsyncProjectsComponent,
   AsyncReportsComponent,
   AsyncNewsDashboardComponent,
   AsyncUserChartsComponent,
   AsyncGeneralWidgetsComponent,
   AsyncCoupons,
   AsyncAddCoupon,
   AsyncCouponDetails,
   AsyncStatistics,
   AsyncBusinessRequests,
   AsyncBusinessRequestsDetails,
   AsyncRequestAddEditsComponent,
   AsyncBusinessBookings,
   AsyncBusinessBookingDetails,
 } from "components/AsyncComponent/AsyncComponent";
 
 const Crm = ({ match }) => {
   const { url } = match;
   return (
     <div className="Crm-wrapper">
       <Switch>
         <Route exact path={`${url}/sass`} component={AsyncSaasDashboardComponent} />
         <Route exact path={`${url}/agency`} component={AsyncAgencyDashboardComponent} />
         <Route exact path={`${url}/news`} component={AsyncNewsDashboardComponent} />
         <Route exact path={`${url}/projects`} component={AsyncProjectsComponent} />
         <Route exact path={`${url}/ecommerce`} component={AsyncEcommerceDashboardComponent} />
         <Route exact path={`${url}/reports`} component={AsyncReportsComponent} />
         <Route exact path={`${url}/crm`} component={AsyncCrmComponent} />
         <Route exact path={`${url}/charts`} component={AsyncUserChartsComponent} />
         <Route exact path={`${url}/widgets`} component={AsyncGeneralWidgetsComponent} />
         <Route exact path={`${url}/extraservice`} component={AsyncExtraService} />
         <Route exact path={`${url}/extraservice/:id/edit`} component={AsyncEditExtraService} />
         <Route exact path={`${url}/extraservice/add`} component={AsyncEditExtraService} />
         <Route exact path={`${url}/coupons`} component={AsyncCoupons} />
 
         <Route exact path={`${url}/extraservices/:id`} component={AsyncExtraServiceDetails} />
 
         <Route exact path={`${url}/features`} component={AsyncFeatures} />
         <Route exact path={`${url}/allies-rates`} component={AsyncAlliesRates} />
         <Route exact path={`${url}/managers`} component={AsyncManagers} />
         <Route exact path={`${url}/coupons`} component={AsyncCoupons} />
         <Route exact path={`${url}/coupons/add`} component={AsyncAddCoupon} />
         <Route exact path={`${url}/coupons/:id/edit`} component={AsyncAddCoupon} />
         <Route exact path={`${url}/coupons/:id/statistics`} component={AsyncStatistics} />
 
         <Route exact path={`${url}/coupons/:id`} component={AsyncCouponDetails} />
         <Route exact path={`${url}/managers/add`} component={AsyncAddManager} />
         <Route exact path={`${url}/coupons/add`} component={AsyncAddCoupon} />
         <Route exact path={`${url}/coupons/:id/edit`} component={AsyncAddCoupon} />
         <Route exact path={`${url}/coupons/:id/statistics`} component={AsyncStatistics} />
         <Route exact path={`${url}/coupons/:id`} component={AsyncCouponDetails} />
 
         <Route exact path={`${url}/manager/:managerId/edit`} component={AsyncAddManager} />
         <Route exact path={`${url}/managers/:managerId`} component={AsyncViewManager} />
 
         <Route exact path={`${url}/feature/add`} component={AsyncFeaturesAddEdit} />
         <Route exact path={`${url}/allies-rates/add`} component={AsyncRatesAddEdit} />
         <Route
           exact
           path={`${url}/allies-rates/:alliesRateId/edit`}
           component={AsyncRatesAddEdit}
         />
         <Route exact path={`${url}/features/:featureId/edit`} component={AsyncFeaturesAddEdit} />
         <Route exact path={`${url}/features/add`} component={AsyncFeaturesAddEdit} />
         <Route exact path={`${url}/features/:featureId`} component={AsyncViewFeature} />
 
         <Route exact path={`${url}/banners/:bannerId/edit`} component={AsyncAddEditBanners} />
 
         <Route exact path={`${url}/banners/add`} component={AsyncAddEditBanners} />
         <Route exact path={`${url}/banners`} component={AsyncBanners} />
 
         <Route exact path={`${url}/makes`} component={AsyncMakes} />
         <Route exact path={`${match.url}/versions`} component={AsyncCarVersions} />
         <Route exact path={`${url}/versions/add`} component={AsyncCreateVersions} />
         <Route exact path={`${url}/versions/:versionid/edit`} component={AsyncCreateVersions} />
         <Route exact path={`${url}/versions/:versionid`} component={AsyncVersionsDetails} />
         <Route exact path={`${url}/bookings/add`} component={AsyncCreateEditRental} />
         <Route exact path={`${url}/bookings/:bookingId`} component={AsyncBookingDetails} />
         <Route exact path={`${url}/bookings/:bookingId/edit`} component={AsyncCreateEditRental} />
         <Route path={`${url}/bookings`} component={AsyncBookings} />
         <Route exact path={`${url}/businessBookings`} component={AsyncBusinessBookings} />
         <Route
           exact
           path={`${url}/businessBookings/:businessBookingId`}
           component={AsyncBusinessBookingDetails}
         />
         <Route exact path={`${url}/cars/add`} component={AsyncAddEditCar} />
         <Route exact path={`${url}/companies/add`} component={AsyncAddEditCompany} />
         <Route exact path={`${url}/companies/:CompanyId`} component={AsyncCompanyDetails} />
         <Route exact path={`${url}/companies/:companyId/edit`} component={AsyncAddEditCompany} />
         <Route exact path={`${url}/branches/add`} component={AsyncAddEditBranch} />
         <Route exact path={`${url}/branches/:branchId`} component={AsyncBranchProfile} />
         <Route exact path={`${url}/branches/:branchId/edit`} component={AsyncAddEditBranch} />
         <Route exact path={`${url}/cars/:carId`} component={AsyncCarProfile} />
         <Route exact path={`${url}/bookings/:bookingId/extend`} component={AsyncBookingDetails} />
         <Route exact path={`${url}/branches`} component={AsyncBranches} />
         <Route exact path={`${url}/models/:modelId/edit`} component={AsyncAddEditModels} />
         <Route exact path={`${url}/models/add`} component={AsyncAddEditModels} />
         <Route exact path={`${url}/models`} component={AsyncModels} />
         <Route exact path={`${url}/models/:modelId`} component={AsyncModelProfile} />
         <Route exact path={`${url}/companies`} component={AsyncCompanies} />
         <Route exact path={`${url}/cars/:id/edit`} component={AsyncCarEdit} />
         <Route exact path={`${url}/cars`} component={AsyncCars} />
         <Route exact path={`${url}/roles`} component={AsyncRoles} />
         <Route exact path={`${url}/roles/add`} component={AsyncAddRole} />
         <Route exact path={`${url}/roles/:id/edit`} component={AsyncEditRole} />
         <Route exact path={`${url}/roles/:id`} component={AsyncViewRole} />
 
         <Route exact path={`${url}/changestatus/:bookingId`} component={AsyncChangeStatus} />
         <Route exact path={`${url}/customers/add`} component={AsyncCreateEditCustomer} />
         <Route
           exact
           path={`${url}/customers/:customerId/edit`}
           component={AsyncCreateEditCustomer}
         />
         <Route exact path={`${url}/customers/:customerId`} component={AsyncCustomerDetails} />
         <Route exact path={`${url}/customers/`} component={AsyncCustomers} />
         <Route exact path={`${url}/users/add`} component={AsyncCreateEditUser} />
         <Route exact path={`${url}/users/:userId/edit`} component={AsyncCreateEditUser} />
         <Route exact path={`${url}/users/:userId`} component={AsyncUserDetails} />
         <Route exact path={`${url}/users/`} component={AsyncUsers} />
         <Route exact path={`${url}/businessrequests/`} component={AsyncBusinessRequests} />
         <Route
           exact
           path={`${url}/businessrequests/add`}
           component={AsyncRequestAddEditsComponent}
         />
         <Route
           exact
           path={`${url}/businessrequests/:requestId/edit`}
           component={AsyncRequestAddEditsComponent}
         />
         <Route
           exact
           path={`${url}/businessrequests/:requestId`}
           component={AsyncBusinessRequestsDetails}
         />
       </Switch>
     </div>
   );
 };
 
 Crm.propTypes = {
   match: PropTypes.object,
 };
 
 export default Crm;
 