/* eslint-disable prettier/prettier */
/**
 * Sidebar Content
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { onToggleMenu } from "Actions";
import { userCan } from "functions/userCan";
import NavMenuItem from "./NavMenuItem";
import "./style.css";
const sideBarContent = [
  // {
  //   permissions: [
  //     "rentals.list",
  //     "rentals.cancel",
  //     "rentals.update_status",
  //     "rentals.update",
  //     "rentals.create",
  //   ],
  //   menu_icon: "fas fa-home",
  //   path: "/cw/dashboard",
  //   new_item: false,
  //   menu_title: "sidebar.dashboardHome",
  // },
  {
    permissions: [
      
    ],
    menu_icon: "zmdi zmdi-bookmark",
    path: "/es/dashboard/bookings",
    new_item: false,
    menu_title: "الصفحة الرئيسية",
  },
  {
    permissions: [
      "business_rentals.list",
      "business_rentals.close",
      "business_rentals.view",
      "business_rentals.update",
    ],
    menu_icon: "zmdi zmdi-bookmark",
    path: "/cw/dashboard/businessBookings",
    new_item: false,
    menu_title: "businessBookings",
  },
  {
    permissions: [
      "users.list",
      "users.create",
      "users.show",
      "users.update",
      "users.activation",
      "users.delete",
    ],
    menu_icon: "fas fa-user-tie",
    path: "/cw/dashboard/customers",
    new_item: false,
    menu_title: "sidebar.customers",
  },
  {
    permissions: ["ally_companies.create", "ally_companies.update", "ally_companies.activation"],
    menu_icon: "fa fa-building-o",
    path: "/cw/dashboard/companies",
    new_item: false,
    menu_title: "sidebar.companies",
  },
  {
    permissions: ["ally_companies.create", "ally_companies.update", "ally_companies.activation"],
    menu_icon: "fas fa-user-shield",
    path: "/cw/dashboard/managers",
    new_item: false,
    menu_title: "sidebar.managers",
  },
  {
    permissions: ["branches.create", "branches.update", "branches.activation", "no.permission"],
    menu_icon: "zmdi zmdi-device-hub",
    path: "/cw/dashboard/branches",
    new_item: false,
    menu_title: "sidebar.branches",
  },
  {
    permissions: ["cars.create", "cars.update", "cars.activation"],
    menu_icon: "zmdi zmdi-car",
    path: "/cw/dashboard/cars",
    new_item: false,
    menu_title: "sidebar.cars",
  },
  {
    permissions: ["makes.delete", "makes.update", "makes.create"],
    menu_icon: "zmdi zmdi-labels",
    path: "/cw/dashboard/makes",
    new_item: false,
    menu_title: "sidebar.makes",
  },
  {
    permissions: ["car_models.create", "car_models.update", "car_models.delete"],
    menu_icon: "fa fa-car-side",
    path: "/cw/dashboard/models",
    new_item: false,
    menu_title: "sidebar.models",
  },
  {
    permissions: ["car_versions.create", "car_versions.update", "car_versions.delete"],
    menu_icon: "fas fa-trailer",
    path: "/cw/dashboard/versions",
    new_item: false,
    menu_title: "sidebar.versions",
  },
  {
    permissions: [
      "roles.list",
      "roles.create",
      "roles.show",
      "roles.update",
      "roles.activation",
      "roles.delete",
    ],
    menu_icon: "fas fa-user-tag",
    path: "/cw/dashboard/roles",
    new_item: false,
    menu_title: "sidebar.roles",
  },
  {
    permissions: [
      "users.list",
      "users.create",
      "users.show",
      "users.update",
      "users.activation",
      "users.delete",
    ],
    menu_icon: "fas fa-users-cog",
    path: "/cw/dashboard/users",
    new_item: false,
    menu_title: "sidebar.users",
  },
  {
    permissions: ["banners.delete", "banners.view", "banners.update", "banners.create"],
    menu_icon: "fas fa-ad",
    path: "/cw/dashboard/banners",
    new_item: false,
    menu_title: "sidebar.banners",
  },
  {
    permissions: [
      "users.list",
      "users.create",
      "users.show",
      "users.update",
      "users.activation",
      "users.delete",
    ],
    menu_icon: "fas fa-clipboard-list",
    path: "/cw/dashboard/features",
    new_item: false,
    menu_title: "sidebar.features",
  },
  {
    permissions: [
      "users.list",
      "users.create",
      "users.show",
      "users.update",
      "users.activation",
      "users.delete",
    ],
    menu_icon: "fas fa-star",
    path: "/cw/dashboard/allies-rates",
    new_item: false,
    menu_title: "sidebar.alliesRates",
  },
  {
    permissions: [
      "users.list",
      "users.create",
      "users.show",
      "users.update",
      "users.activation",
      "users.delete",
    ],
    menu_icon: "fab fa-ups",
    path: "/cw/dashboard/extraservice",
    new_item: false,
    menu_title: "sidebar.service",
  },
  {
    permissions: [
      "business_requests.list",
      "business_requests.view",
      "business_requests.offer",
      "business_requests.create",
      "business_requests.update",
    ],
    menu_icon: "fas fa-business-time",
    path: "/cw/dashboard/businessrequests",
    new_item: false,
    menu_title: "sidebar.businessrequests",
  },
  {
    permissions: ["coupons.list"],
    menu_icon: "zmdi zmdi-bookmark",
    path: "/cw/dashboard/coupons",
    new_item: false,
    menu_title: "coupons",
  },

  // { // TODO: Invocies
  // permissions: [""],
  //   menu_icon: "zmdi zmdi-receipt",
  //   path: "/cw/dashboard/invoices",
  //   new_item: false,
  //   menu_title: "sidebar.invoices",
  // },
  // { // TODO: Car List
  // permissions: [""],
  //   menu_icon: "zmdi zmdi-car",
  //   path: "/cw/dashboard/cars",
  //   new_item: false,
  //   menu_title: "sidebar.cars",
  // },
  // { // TODO: notifications List
  // permissions: [""],
  //   menu_icon: "zmdi zmdi-notifications",
  //   path: "/cw/dashboard/notifications",
  //   new_item: false,
  //   menu_title: "sidebar.notifications",
  // },
  // { // TODO: notifications List
  // permissions: ["ally_companies.create", "ally_companies.update", "ally_companies.activation"],
  //   menu_icon: "fa fa-handshake-o",
  //   path: "/cw/dashboard/ally",
  //   new_item: false,
  //   menu_title: "sidebar.ally",
  // },
];
class SidebarContent extends Component {
  toggleMenu(menu, stateCategory) {
    const data = {
      menu,
      stateCategory,
    };
    this.props.onToggleMenu(data);
  }

  render() {
    return (
      <div className="rct-sidebar-nav">
        <nav className="navigation">
          <List className="rct-mainMenu p-0 m-0 list-unstyled">
            {sideBarContent
              .filter((tab) => tab.permissions.find((doThat) => userCan(doThat)))
              .map((menu, key) => (
                <NavMenuItem
                  menu={menu}
                  key={JSON.stringify(key)}
                  onToggleMenu={() => this.toggleMenu(menu, "category1")}
                />
              ))}
          </List>
        </nav>
      </div>
    );
  }
}

SidebarContent.propTypes = {
  onToggleMenu: PropTypes.func,
};

// map state to props
const mapStateToProps = ({ sidebar }) => ({ sidebar });

export default withRouter(
  connect(mapStateToProps, {
    onToggleMenu,
  })(SidebarContent),
);
