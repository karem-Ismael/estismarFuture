/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/state-in-constructor */
/* eslint-disable prettier/prettier */
/**
 * Nav Menu Item
 */
import React, { Fragment, Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import Chip from "@material-ui/core/Chip";
import { withRouter } from "react-router";
import "./style.css";
// intl messages
import IntlMessages from "Util/IntlMessages";

class NavMenuItem extends Component {
  state = {
    subMenuOpen: "",
    location: "",
  };
  // const location = useLocation();

  /**
   * On Toggle Collapse Menu
   */
  onToggleCollapseMenu(index) {
    if (this.state.subMenuOpen === "") {
      this.setState({
        subMenuOpen: index,
      });
    } else if (this.state.subMenuOpen !== index) {
      this.setState({
        subMenuOpen: index,
      });
    } else {
      this.setState({ subMenuOpen: "" });
    }
  }

  render() {
    const { menu, onToggleMenu } = this.props;
    const { subMenuOpen } = this.state;
    const { match, location, history } = this.props;
    if (menu.child_routes != null) {
      return (
        <>
          <ListItem
            button
            component="li"
            onClick={onToggleMenu}
            className={`list-item ${classNames({ "item-active": menu.open })}`}
          >
            <ListItemIcon className="menu-icon">
              <i className={menu.menu_icon} />
            </ListItemIcon>
            <span className="menu text-capitalize">
              <IntlMessages id={menu.menu_title} />
            </span>
            {menu.new_item && menu.new_item === true ? (
              <Chip label="new" className="new-item" color="secondary" />
            ) : (
              ""
            )}
          </ListItem>
          <Collapse in={menu.open} timeout="auto" className="sub-menu">
            <>
              {menu.type_multi == null ? (
                <List className="list-unstyled py-0">
                  {menu.child_routes.map((subMenu, index) => (
                    <ListItem button component="li" key={index}>
                      <NavLink to={subMenu.path} activeClassName="item-active">
                        <span className="menu">
                          <IntlMessages id={subMenu.menu_title} />
                        </span>
                        {subMenu.new_item && subMenu.new_item === true ? (
                          <Chip label="new" className="new-item" color="secondary" />
                        ) : (
                          ""
                        )}
                      </NavLink>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List className="list-unstyled py-0">
                  {menu.child_routes.map((subMenu, index) => (
                    <Fragment key={index}>
                      <ListItem
                        button
                        component="li"
                        onClick={() => this.onToggleCollapseMenu(index)}
                        className={`list-item ${classNames({
                          "item-active": subMenuOpen === index,
                        })}`}
                      >
                        <span className="menu">
                          <IntlMessages id={subMenu.menu_title} />
                        </span>
                      </ListItem>
                      <Collapse in={subMenuOpen === index} timeout="auto">
                        <List className="list-unstyled py-0">
                          {subMenu.child_routes.map((nestedMenu, nestedKey) => (
                            <ListItem button component="li" key={nestedKey}>
                              <NavLink activeClassName="item-active" to={nestedMenu.path}>
                                <span className="menu pl-10 d-inline-block">
                                  <IntlMessages id={nestedMenu.menu_title} />
                                </span>
                              </NavLink>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </Fragment>
                  ))}
                </List>
              )}
            </>
          </Collapse>
        </>
      );
    }
    return (
      <ListItem
        button
        component="li"
        className={
          location.pathname == menu.path ||
          location.pathname.includes(menu.menu_title.split(".")[1])
            ? "activelink"
            : ""
        }
      >
        <NavLink
          activeClassName="item-active"
          onClick={() => this.setState({ location: menu.path })}
          to={menu.path}
        >
          <ListItemIcon className="menu-icon">
            <i className={menu.menu_icon} />
          </ListItemIcon>
          <span className="menu">
            <IntlMessages id={menu.menu_title} />
          </span>
        </NavLink>
      </ListItem>
    );
  }
}

export default withRouter(NavMenuItem);
