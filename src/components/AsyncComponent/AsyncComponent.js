/* eslint-disable prettier/prettier */
/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
 import React from "react";
 import Loadable from "react-loadable";
 
 // rct page loader
 import RctPageLoader from "components/RctPageLoader/RctPageLoader";
 
 // Makes
 const AsyncMakes = Loadable({
   loader: () => import("routes/crm/makes"),
   loading: () => <RctPageLoader />,
 });
 // Banners
 const AsyncBanners = Loadable({
   loader: () => import("routes/crm/banners/banners"),
   loading: () => <RctPageLoader />,
 });
 // Add Edit Banner
 const AsyncAddEditBanners = Loadable({
   loader: () => import("routes/crm/banners/AddEditBanner"),
   loading: () => <RctPageLoader />,
 });
 const AsyncFeatures = Loadable({
   loader: () => import("routes/crm/features/Features"),
   loading: () => <RctPageLoader />,
 });
 // Allies Rates
 const AsyncAlliesRates = Loadable({
   loader: () => import("routes/crm/AlliesRates"),
   loading: () => <RctPageLoader />,
 });
 // Allies Rates Add Edit
 const AsyncRatesAddEdit = Loadable({
   loader: () => import("routes/crm/AlliesRates/add-edit"),
   loading: () => <RctPageLoader />,
 });
 // AsyncManagers
 const AsyncManagers = Loadable({
   loader: () => import("routes/crm/manager/AllManagers"),
   loading: () => <RctPageLoader />,
 });
 const AsyncAddManager = Loadable({
   loader: () => import("routes/crm/manager/add-edit/CreateEditManager"),
   loading: () => <RctPageLoader />,
 });
 const AsyncViewManager = Loadable({
   loader: () => import("routes/crm/manager/ManagerProfile"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncExtraService = Loadable({
   loader: () => import("routes/crm/extraservice/AllExtraService"),
   loading: () => <RctPageLoader />,
 });
 const AsyncExtraServiceDetails = Loadable({
   loader: () => import("routes/crm/extraservice/ExtraServiceDetails"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncEditExtraService = Loadable({
   loader: () => import("routes/crm/extraservice/add-edit/ExtraServiceAddEdit"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncFeaturesAddEdit = Loadable({
   loader: () => import("routes/crm/features/add-edit/FeatureAddEdit"),
   loading: () => <RctPageLoader />,
 });
 const AsyncCouponDetails = Loadable({
   loader: () => import("routes/crm/Coupons/CouponDetails"),
   loading: () => <RctPageLoader />,
 });
 const AsyncViewFeature = Loadable({
   loader: () => import("routes/crm/features/FeatureDetails"),
   loading: () => <RctPageLoader />,
 });
 
 // Bookings
 const AsyncBookings = Loadable({
   loader: () => import("routes/crm/bookings"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncBusinessBookings = Loadable({
   loader: () => import("routes/crm/businessBookings"),
   loading: () => <RctPageLoader />,
 });
 
 // Customers
 const AsyncCustomers = Loadable({
   loader: () => import("routes/crm/customers"),
   loading: () => <RctPageLoader />,
 });
 
 // Edit Role
 const AsyncEditRole = Loadable({
   loader: () => import("routes/crm/roles/EditRole"),
   loading: () => <RctPageLoader />,
 });
 
 // view Role
 const AsyncViewRole = Loadable({
   loader: () => import("routes/crm/roles/ViewRole"),
   loading: () => <RctPageLoader />,
 });
 // Customers
 const AsyncUsers = Loadable({
   loader: () => import("routes/crm/users"),
   loading: () => <RctPageLoader />,
 });
 
 // Cars
 const AsyncCars = Loadable({
   loader: () => import("routes/crm/cars/AllCars"),
   loading: () => <RctPageLoader />,
 });
 
 // Companies
 const AsyncCompanies = Loadable({
   loader: () => import("routes/crm/companies/AllCompanies"),
   loading: () => <RctPageLoader />,
 });
 
 // Companies
 const AsyncAddEditCompany = Loadable({
   loader: () => import("routes/crm/companies/add-edit/AddEditCompany"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncBranches = Loadable({
   loader: () => import("routes/crm/branches/AllBranches"),
   loading: () => <RctPageLoader />,
 });
 
 // models
 const AsyncModels = Loadable({
   loader: () => import("routes/crm/models/AllModels"),
   loading: () => <RctPageLoader />,
 });
 
 // models Add Edit
 const AsyncAddEditModels = Loadable({
   loader: () => import("routes/crm/models/add-edit"),
   loading: () => <RctPageLoader />,
 });
 
 // Car Versions
 const AsyncCarVersions = Loadable({
   loader: () => import("routes/crm/versions/AllVersions"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncCreateVersions = Loadable({
   loader: () => import("routes/crm/versions/add-edit/AddCreateVersion"),
   loading: () => <RctPageLoader />,
 });
 
 // edit version
 
 const AsyncVersionsDetails = Loadable({
   loader: () => import("routes/crm/versions/VersionDetails"),
   loading: () => <RctPageLoader />,
 });
 const AsyncCarProfile = Loadable({
   loader: () => import("routes/crm/cars/CarProfile"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncModelProfile = Loadable({
   loader: () => import("routes/crm/models/ModelProfile"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncBranchProfile = Loadable({
   loader: () => import("routes/crm/branches/BranchDetails"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncAddEditBranch = Loadable({
   loader: () => import("routes/crm/branches/add-edit/BranchesAddEdit"),
   loading: () => <RctPageLoader />,
 });
 
 // Edit Car
 const AsyncCarEdit = Loadable({
   loader: () => import("routes/crm/cars/EditCar"),
   loading: () => <RctPageLoader />,
 });
 
 // Booking Details
 const AsyncBookingDetails = Loadable({
   loader: () => import("routes/crm/bookings/booking-details"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncBusinessBookingDetails = Loadable({
   loader: () => import("routes/crm/businessBookings/components/Details"),
   loading: () => <RctPageLoader />,
 });
 const AsyncCoupons = Loadable({
   loader: () => import("routes/crm/Coupons/AllCoupons"),
   loading: () => <RctPageLoader />,
 });
 const AsyncAddCoupon = Loadable({
   loader: () => import("routes/crm/Coupons/add-edit/AddEditCoupons"),
   loading: () => <RctPageLoader />,
 });
 const AsyncStatistics = Loadable({
   loader: () => import("routes/crm/Coupons/Statistics"),
   loading: () => <RctPageLoader />,
 });
 
 // Add Edit Rental
 const AsyncCreateEditRental = Loadable({
   loader: () => import("routes/crm/bookings/AddEditBooking"),
   loading: () => <RctPageLoader />,
 });
 
 // company details
 const AsyncCompanyDetails = Loadable({
   loader: () => import("routes/crm/companies/CompanyDetails.js"),
   loading: () => <RctPageLoader />,
 });
 
 // Add Edit Car
 const AsyncAddEditCar = Loadable({
   loader: () => import("routes/crm/cars/AddCar.js"),
   loading: () => <RctPageLoader />,
 });
 
 // Change Status
 const AsyncChangeStatus = Loadable({
   loader: () => import("routes/crm/bookings/ChangeStatus"),
   loading: () => <RctPageLoader />,
 });
 
 // Roles
 
 const AsyncRoles = Loadable({
   loader: () => import("routes/crm/roles/AllRoles"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncAddRole = Loadable({
   loader: () => import("routes/crm/roles/AddRole"),
   loading: () => <RctPageLoader />,
 });
 
 // Add Edit Customer
 const AsyncCreateEditCustomer = Loadable({
   loader: () => import("routes/crm/customers/add-edit"),
   loading: () => <RctPageLoader />,
 });
 
 // Add Edit Customer
 const AsyncCreateEditUser = Loadable({
   loader: () => import("routes/crm/users/add-edit"),
   loading: () => <RctPageLoader />,
 });
 
 // Add Edit Customer
 const AsyncCustomerDetails = Loadable({
   loader: () => import("routes/crm/customers/components/CustomerDataDisplay"),
   loading: () => <RctPageLoader />,
 });
 
 // Add Edit Customer
 const AsyncUserDetails = Loadable({
   loader: () => import("routes/crm/users/components/UserDataDisplay"),
   loading: () => <RctPageLoader />,
 });
 
 // ecommerce dashboard
 const AsyncEcommerceDashboardComponent = Loadable({
   loader: () => import("Routes/dashboard/ecommerce"),
   loading: () => <RctPageLoader />,
 });
 
 // agency dashboard
 const AsyncSaasDashboardComponent = Loadable({
   loader: () => import("Routes/dashboard/saas"),
   loading: () => <RctPageLoader />,
 });
 
 // agency dashboard
 const AsyncAgencyDashboardComponent = Loadable({
   loader: () => import("Routes/dashboard/agency"),
   loading: () => <RctPageLoader />,
 });
 
 // boxed dashboard
 const AsyncNewsDashboardComponent = Loadable({
   loader: () => import("Routes/dashboard/news"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncUserWidgetComponent = Loadable({
   loader: () => import("Routes/widgets/user-widgets"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncUserChartsComponent = Loadable({
   loader: () => import("Routes/widgets/charts-widgets"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncGeneralWidgetsComponent = Loadable({
   loader: () => import("Routes/widgets/general-widgets"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncPromoWidgetsComponent = Loadable({
   loader: () => import("Routes/widgets/promo-widgets"),
   loading: () => <RctPageLoader />,
 });
 
 // about us
 const AsyncAboutUsComponent = Loadable({
   loader: () => import("Routes/about-us"),
   loading: () => <RctPageLoader />,
 });
 
 // chat app
 const AsyncChatComponent = Loadable({
   loader: () => import("Routes/chat"),
   loading: () => <RctPageLoader />,
 });
 
 // mail app
 const AsyncMailComponent = Loadable({
   loader: () => import("Routes/mail"),
   loading: () => <RctPageLoader />,
 });
 
 // todo app
 const AsyncTodoComponent = Loadable({
   loader: () => import("Routes/todo"),
   loading: () => <RctPageLoader />,
 });
 
 // gallery
 const AsyncGalleryComponent = Loadable({
   loader: () => import("Routes/pages/gallery"),
   loading: () => <RctPageLoader />,
 });
 
 // feedback
 const AsyncFeedbackComponent = Loadable({
   loader: () => import("Routes/pages/feedback"),
   loading: () => <RctPageLoader />,
 });
 
 // report
 const AsyncReportComponent = Loadable({
   loader: () => import("Routes/pages/report"),
   loading: () => <RctPageLoader />,
 });
 
 // faq
 const AsyncFaqComponent = Loadable({
   loader: () => import("Routes/pages/faq"),
   loading: () => <RctPageLoader />,
 });
 
 // pricing
 const AsyncPricingComponent = Loadable({
   loader: () => import("Routes/pages/pricing"),
   loading: () => <RctPageLoader />,
 });
 
 // blank
 const AsyncBlankComponent = Loadable({
   loader: () => import("Routes/pages/blank"),
   loading: () => <RctPageLoader />,
 });
 
 // google maps
 const AsyncGooleMapsComponent = Loadable({
   loader: () => import("Routes/maps/google-map"),
   loading: () => <RctPageLoader />,
 });
 
 // google maps
 const AsyncLeafletMapComponent = Loadable({
   loader: () => import("Routes/maps/leaflet-map"),
   loading: () => <RctPageLoader />,
 });
 
 // shop list
 const AsyncShoplistComponent = Loadable({
   loader: () => import("Routes/ecommerce/shop-list"),
   loading: () => <RctPageLoader />,
 });
 
 // shop grid
 const AsyncShopGridComponent = Loadable({
   loader: () => import("Routes/ecommerce/shop-grid"),
   loading: () => <RctPageLoader />,
 });
 
 // shop
 const AsyncShopComponent = Loadable({
   loader: () => import("Routes/ecommerce/shop"),
   loading: () => <RctPageLoader />,
 });
 
 // cart
 const AsyncCartComponent = Loadable({
   loader: () => import("Routes/ecommerce/cart"),
   loading: () => <RctPageLoader />,
 });
 
 // checkout
 const AsyncCheckoutComponent = Loadable({
   loader: () => import("Routes/ecommerce/checkout"),
   loading: () => <RctPageLoader />,
 });
 
 // invoice
 const AsyncInvoiceComponent = Loadable({
   loader: () => import("Routes/ecommerce/invoice"),
   loading: () => <RctPageLoader />,
 });
 
 // react dragula
 const AsyncReactDragulaComponent = Loadable({
   loader: () => import("Routes/drag-drop/react-dragula"),
   loading: () => <RctPageLoader />,
 });
 
 // react dnd
 const AsyncReactDndComponent = Loadable({
   loader: () => import("Routes/drag-drop/react-dnd"),
   loading: () => <RctPageLoader />,
 });
 
 // themify icons
 const AsyncThemifyIconsComponent = Loadable({
   loader: () => import("Routes/icons/themify-icons"),
   loading: () => <RctPageLoader />,
 });
 
 // Simple Line Icons
 const AsyncSimpleLineIconsComponent = Loadable({
   loader: () => import("Routes/icons/simple-line-icons"),
   loading: () => <RctPageLoader />,
 });
 
 // Material Icons
 const AsyncMaterialIconsComponent = Loadable({
   loader: () => import("Routes/icons/material-icons"),
   loading: () => <RctPageLoader />,
 });
 
 // Basic Table
 const AsyncBasicTableComponent = Loadable({
   loader: () => import("Routes/tables/basic"),
   loading: () => <RctPageLoader />,
 });
 
 // Basic Table
 const AsyncDataTableComponent = Loadable({
   loader: () => import("Routes/tables/data-table"),
   loading: () => <RctPageLoader />,
 });
 
 // Responsive Table
 const AsyncResponsiveTableComponent = Loadable({
   loader: () => import("Routes/tables/responsive"),
   loading: () => <RctPageLoader />,
 });
 
 // Users List
 const AsyncUsersListComponent = Loadable({
   loader: () => import("Routes/users/user-list"),
   loading: () => <RctPageLoader />,
 });
 
 // Users Profile
 const AsyncUserProfileComponent = Loadable({
   loader: () => import("Routes/users/user-profile"),
   loading: () => <RctPageLoader />,
 });
 
 // Users Profile 1
 const AsyncUserProfile1Component = Loadable({
   loader: () => import("Routes/users/user-profile-1"),
   loading: () => <RctPageLoader />,
 });
 
 // Users Management
 const AsyncUserManagementComponent = Loadable({
   loader: () => import("Routes/users/user-management"),
   loading: () => <RctPageLoader />,
 });
 
 /* --------------- Charts ----------------*/
 
 // Re charts
 const AsyncRechartsComponent = Loadable({
   loader: () => import("Routes/charts/recharts"),
   loading: () => <RctPageLoader />,
 });
 
 // ReactChartsjs2
 const AsyncReactChartsjs2Component = Loadable({
   loader: () => import("Routes/charts/react-chartjs2"),
   loading: () => <RctPageLoader />,
 });
 
 /* ---------------------- Calendar -----------*/
 
 // Basic Calendar
 const AsyncBasicCalendarComponent = Loadable({
   loader: () => import("Routes/calendar/BasicCalendar"),
   loading: () => <RctPageLoader />,
 });
 
 // Cultures Calendar
 const AsyncCulturesComponent = Loadable({
   loader: () => import("Routes/calendar/Cultures"),
   loading: () => <RctPageLoader />,
 });
 
 // Selectable Calendar
 const AsyncSelectableComponent = Loadable({
   loader: () => import("Routes/calendar/Selectable"),
   loading: () => <RctPageLoader />,
 });
 
 // Custom Calendar
 const AsyncCustomComponent = Loadable({
   loader: () => import("Routes/calendar/Custom"),
   loading: () => <RctPageLoader />,
 });
 
 /* ---------------- Session ------------------*/
 
 // Session Login
 const AsyncSessionLoginComponent = Loadable({
   loader: () => import("Routes/session/login"),
   loading: () => <RctPageLoader />,
 });
 
 // Session Register
 const AsyncSessionRegisterComponent = Loadable({
   loader: () => import("Routes/session/register"),
   loading: () => <RctPageLoader />,
 });
 
 // Session Lock Screen
 const AsyncSessionLockScreenComponent = Loadable({
   loader: () => import("Routes/session/lock-screen"),
   loading: () => <RctPageLoader />,
 });
 
 // Session Forgot Password
 const AsyncSessionForgotPasswordComponent = Loadable({
   loader: () => import("Routes/session/forgot-password"),
   loading: () => <RctPageLoader />,
 });
 
 // Session Page 404
 const AsyncSessionPage404Component = Loadable({
   loader: () => import("Routes/session/404"),
   loading: () => <RctPageLoader />,
 });
 
 // Session Page 404
 const AsyncSessionPage500Component = Loadable({
   loader: () => import("Routes/session/500"),
   loading: () => <RctPageLoader />,
 });
 
 // terms and condition
 const AsyncTermsConditionComponent = Loadable({
   loader: () => import("Routes/pages/terms-condition"),
   loading: () => <RctPageLoader />,
 });
 
 /* ---------------- Editor -------------------*/
 
 // editor quill
 const AsyncQuillEditorComponent = Loadable({
   loader: () => import("Routes/editor/quill-editor"),
   loading: () => <RctPageLoader />,
 });
 
 // editor Wysiwyg
 const AsyncWysiwygEditorComponent = Loadable({
   loader: () => import("Routes/editor/wysiwyg-editor"),
   loading: () => <RctPageLoader />,
 });
 
 /* ------------- Form Elemets -------------*/
 
 // forms elements
 const AsyncFormElementsComponent = Loadable({
   loader: () => import("Routes/forms/form-elements"),
   loading: () => <RctPageLoader />,
 });
 
 // forms TextField
 const AsyncTextFieldComponent = Loadable({
   loader: () => import("Routes/forms/material-text-field"),
   loading: () => <RctPageLoader />,
 });
 
 // forms TextField
 const AsyncSelectListComponent = Loadable({
   loader: () => import("Routes/forms/select-list"),
   loading: () => <RctPageLoader />,
 });
 
 /* ------------------ UI Components ---------------*/
 
 // components Alerts
 const AsyncUIAlertsComponent = Loadable({
   loader: () => import("Routes/components/alert"),
   loading: () => <RctPageLoader />,
 });
 
 // components Appbar
 const AsyncUIAppbarComponent = Loadable({
   loader: () => import("Routes/components/app-bar"),
   loading: () => <RctPageLoader />,
 });
 
 // components BottomNavigation
 const AsyncUIBottomNavigationComponent = Loadable({
   loader: () => import("Routes/components/bottom-navigation"),
   loading: () => <RctPageLoader />,
 });
 
 // components BottomNavigation
 const AsyncUIAvatarsComponent = Loadable({
   loader: () => import("Routes/components/avatar"),
   loading: () => <RctPageLoader />,
 });
 
 // components Buttons
 const AsyncUIButtonsComponent = Loadable({
   loader: () => import("Routes/components/buttons"),
   loading: () => <RctPageLoader />,
 });
 
 // components Badges
 const AsyncUIBadgesComponent = Loadable({
   loader: () => import("Routes/components/badges"),
   loading: () => <RctPageLoader />,
 });
 
 // components CardMasonary
 const AsyncUICardMasonaryComponent = Loadable({
   loader: () => import("Routes/components/card-masonry"),
   loading: () => <RctPageLoader />,
 });
 
 // components Cards
 const AsyncUICardsComponent = Loadable({
   loader: () => import("Routes/components/cards"),
   loading: () => <RctPageLoader />,
 });
 
 // components Chips
 const AsyncUIChipsComponent = Loadable({
   loader: () => import("Routes/components/chip"),
   loading: () => <RctPageLoader />,
 });
 
 // components Dialog
 const AsyncUIDialogComponent = Loadable({
   loader: () => import("Routes/components/dialog"),
   loading: () => <RctPageLoader />,
 });
 
 // components Dividers
 const AsyncUIDividersComponent = Loadable({
   loader: () => import("Routes/components/dividers"),
   loading: () => <RctPageLoader />,
 });
 
 // components Drawers
 const AsyncUIDrawersComponent = Loadable({
   loader: () => import("Routes/components/drawers"),
   loading: () => <RctPageLoader />,
 });
 
 // components Accordion
 const AsyncUIExpansionPanelComponent = Loadable({
   loader: () => import("Routes/components/expansion-panel"),
   loading: () => <RctPageLoader />,
 });
 
 // components Grid List
 const AsyncUIGridListComponent = Loadable({
   loader: () => import("Routes/components/grid-list"),
   loading: () => <RctPageLoader />,
 });
 
 // components List
 const AsyncUIListComponent = Loadable({
   loader: () => import("Routes/components/list"),
   loading: () => <RctPageLoader />,
 });
 
 // components Menu
 const AsyncUIMenuComponent = Loadable({
   loader: () => import("Routes/components/menu"),
   loading: () => <RctPageLoader />,
 });
 
 // components Popover
 const AsyncUIPopoverComponent = Loadable({
   loader: () => import("Routes/components/popover"),
   loading: () => <RctPageLoader />,
 });
 
 // components Progress
 const AsyncUIProgressComponent = Loadable({
   loader: () => import("Routes/components/progress"),
   loading: () => <RctPageLoader />,
 });
 
 // components Snackbar
 const AsyncUISnackbarComponent = Loadable({
   loader: () => import("Routes/components/snackbar"),
   loading: () => <RctPageLoader />,
 });
 
 // components SelectionControls
 const AsyncUISelectionControlsComponent = Loadable({
   loader: () => import("Routes/components/selection-controls"),
   loading: () => <RctPageLoader />,
 });
 
 /* ---------------- Advance UI Components -------------*/
 
 // advance components DateAndTimePicker
 const AsyncAdvanceUIDateAndTimePickerComponent = Loadable({
   loader: () => import("Routes/advance-ui-components/dateTime-picker"),
   loading: () => <RctPageLoader />,
 });
 
 // advance components Tabs
 const AsyncAdvanceUITabsComponent = Loadable({
   loader: () => import("Routes/advance-ui-components/tabs"),
   loading: () => <RctPageLoader />,
 });
 
 // advance components Stepper
 const AsyncAdvanceUIStepperComponent = Loadable({
   loader: () => import("Routes/advance-ui-components/stepper"),
   loading: () => <RctPageLoader />,
 });
 
 // advance components NotificationComponent
 const AsyncAdvanceUINotificationComponent = Loadable({
   loader: () => import("Routes/advance-ui-components/notification"),
   loading: () => <RctPageLoader />,
 });
 
 // advance components SweetAlert
 const AsyncAdvanceUISweetAlertComponent = Loadable({
   loader: () => import("Routes/advance-ui-components/sweet-alert"),
   loading: () => <RctPageLoader />,
 });
 
 // advance components autoComplete
 const AsyncAdvanceUIAutoCompleteComponent = Loadable({
   loader: () => import("Routes/advance-ui-components/autoComplete"),
   loading: () => <RctPageLoader />,
 });
 // crm dashboard
 const AsyncCrmComponent = Loadable({
   loader: () => import("Routes/crm/dashboard"),
   loading: () => <RctPageLoader />,
 });
 // projects
 const AsyncProjectsComponent = Loadable({
   loader: () => import("Routes/crm/projects"),
   loading: () => <RctPageLoader />,
 });
 // project detail
 const AsyncProjectDetailComponent = Loadable({
   loader: () => import("Routes/crm/project-detail"),
   loading: () => <RctPageLoader />,
 });
 
 // reports
 const AsyncReportsComponent = Loadable({
   loader: () => import("Routes/crm/reports"),
   loading: () => <RctPageLoader />,
 });
 const AsyncBusinessRequests = Loadable({
   loader: () => import("routes/crm/BusinessRequests/AllBusinessRequests"),
   loading: () => <RctPageLoader />,
 });
 const AsyncBusinessRequestsDetails = Loadable({
   loader: () => import("routes/crm/BusinessRequests/Details"),
   loading: () => <RctPageLoader />,
 });
 
 const AsyncRequestAddEditsComponent = Loadable({
   loader: () => import("Routes/crm/BusinessRequests/add-edit/AddEdit.js"),
   loading: () => <RctPageLoader />,
 });
 export {
   // Carwah
   AsyncMakes,
   AsyncBookings,
   AsyncBusinessBookings,
   AsyncUsers,
   AsyncCustomers,
   AsyncBookingDetails,
   AsyncBusinessBookingDetails,
   AsyncAddEditCompany,
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
   AsyncBusinessRequests,
   AsyncAddManager,
   AsyncViewManager,
   AsyncExtraService,
   AsyncExtraServiceDetails,
   AsyncCouponDetails,
   AsyncEditExtraService,
   AsyncCoupons,
   AsyncStatistics,
   AsyncRatesAddEdit,
   AsyncBusinessRequestsDetails,
   AsyncRequestAddEditsComponent,
   AsyncAddCoupon,
   // Theme
   AsyncUserWidgetComponent,
   AsyncUserChartsComponent,
   AsyncGeneralWidgetsComponent,
   AsyncPromoWidgetsComponent,
   AsyncAboutUsComponent,
   AsyncChatComponent,
   AsyncMailComponent,
   AsyncTodoComponent,
   AsyncGalleryComponent,
   AsyncFeedbackComponent,
   AsyncReportComponent,
   AsyncFaqComponent,
   AsyncPricingComponent,
   AsyncBlankComponent,
   AsyncGooleMapsComponent,
   AsyncLeafletMapComponent,
   AsyncShoplistComponent,
   AsyncShopGridComponent,
   AsyncInvoiceComponent,
   AsyncReactDragulaComponent,
   AsyncReactDndComponent,
   AsyncThemifyIconsComponent,
   AsyncSimpleLineIconsComponent,
   AsyncMaterialIconsComponent,
   AsyncBasicTableComponent,
   AsyncDataTableComponent,
   AsyncResponsiveTableComponent,
   AsyncUsersListComponent,
   AsyncUserProfileComponent,
   AsyncUserProfile1Component,
   AsyncUserManagementComponent,
   AsyncRechartsComponent,
   AsyncReactChartsjs2Component,
   AsyncBasicCalendarComponent,
   AsyncCulturesComponent,
   AsyncSelectableComponent,
   AsyncCustomComponent,
   AsyncSessionLoginComponent,
   AsyncSessionRegisterComponent,
   AsyncSessionLockScreenComponent,
   AsyncSessionForgotPasswordComponent,
   AsyncSessionPage404Component,
   AsyncSessionPage500Component,
   AsyncTermsConditionComponent,
   AsyncQuillEditorComponent,
   AsyncWysiwygEditorComponent,
   AsyncFormElementsComponent,
   AsyncTextFieldComponent,
   AsyncSelectListComponent,
   AsyncUIAlertsComponent,
   AsyncUIAppbarComponent,
   AsyncUIBottomNavigationComponent,
   AsyncUIAvatarsComponent,
   AsyncUIButtonsComponent,
   AsyncUIBadgesComponent,
   AsyncUICardMasonaryComponent,
   AsyncUICardsComponent,
   AsyncUIChipsComponent,
   AsyncUIDialogComponent,
   AsyncUIDividersComponent,
   AsyncUIDrawersComponent,
   AsyncUIExpansionPanelComponent,
   AsyncUIGridListComponent,
   AsyncUIListComponent,
   AsyncUIMenuComponent,
   AsyncUIPopoverComponent,
   AsyncUIProgressComponent,
   AsyncUISnackbarComponent,
   AsyncUISelectionControlsComponent,
   AsyncAdvanceUIDateAndTimePickerComponent,
   AsyncAdvanceUITabsComponent,
   AsyncAdvanceUIStepperComponent,
   AsyncAdvanceUINotificationComponent,
   AsyncAdvanceUISweetAlertComponent,
   AsyncAdvanceUIAutoCompleteComponent,
   AsyncShopComponent,
   AsyncCartComponent,
   AsyncCheckoutComponent,
   AsyncEcommerceDashboardComponent,
   AsyncSaasDashboardComponent,
   AsyncAgencyDashboardComponent,
   AsyncNewsDashboardComponent,
   AsyncCrmComponent,
   AsyncProjectsComponent,
   AsyncProjectDetailComponent,
   AsyncReportsComponent,
 };
 