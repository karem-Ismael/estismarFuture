/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * Language Select Dropdown
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { useRemember } from "react-remember";

import Tooltip from "@material-ui/core/Tooltip";

// actions
import { setLanguage, rtlLayoutAction } from "Actions";

import { FormattedMessage } from "react-intl";

class LanguageProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langDropdownOpen: false,
    };
  }

  // function to toggle dropdown menu
  toggle = () => {
    this.setState({
      langDropdownOpen: !this.state.langDropdownOpen,
    });
  };

  // on change language
  onChangeLanguage = (lang) => {
    this.setState({ langDropdownOpen: false });
    this.props.setLanguage(lang);
    localStorage.setItem("locale", JSON.stringify(lang));
    if (lang.locale === "ar" || lang.locale === "he") {
      this.rtlLayoutHanlder(true);
    } else {
      this.rtlLayoutHanlder(false);
    }
  };

  /**
   * Rtl Layout Event Hanlder
   * Use to Enable rtl Layout
   * @param {*object} event
   */
  rtlLayoutHanlder = (isTrue) => {
    const root = document.getElementsByTagName("html")[0];
    if (isTrue) {
      root.setAttribute("dir", "rtl");
      document.body.classList.add("rtl");
    } else {
      root.setAttribute("dir", "ltr");
      document.body.classList.remove("rtl");
    }
    this.props.rtlLayoutAction(isTrue);
  };

  render() {
    const { locale } = this.props;

    return (
      <Dropdown
        nav
        className="list-inline-item language-dropdown tour-step-5"
        isOpen={this.state.langDropdownOpen}
        toggle={this.toggle}
      >
        <DropdownToggle caret nav className="header-icon language-icon">
          <Tooltip title="Languages" placement="bottom">
            <img
              src={require(`Assets/flag-icons/${locale.icon}.png`)}
              className="mr-10"
              width="25"
              height="16"
              alt="lang-icon"
            />
          </Tooltip>
        </DropdownToggle>
        <DropdownMenu>
          <div className="dropdown-content">
            <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
              <span className="text-white font-weight-bold">
                <FormattedMessage id="languages" />
              </span>
            </div>
            <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
              <LanguagesSelection onChangeLanguage={this.onChangeLanguage} />
            </Scrollbars>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.object,
  rtlLayoutAction: PropTypes.func,
  setLanguage: PropTypes.func,
};
// map state to props
const mapStateToProps = ({ settings }) => settings;

export default connect(mapStateToProps, {
  setLanguage,
  rtlLayoutAction,
})(LanguageProvider);

const LanguagesSelection = ({ onChangeLanguage }) => {
  const [, remember] = useRemember();
  const { settings } = useSelector((state) => state);
  const { languages } = settings;
  return (
    <ul className="list-unstyled mb-0 dropdown-list d-flex">
      {languages.map((language, key) => (
        <li
          key={JSON.stringify(key)}
          onKeyDown={() => onChangeLanguage(language)}
          onClick={() => {
            onChangeLanguage(language);
            remember({ locale: language.locale });
          }}
        >
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img
              src={require(`Assets/flag-icons/${language.icon}.png`)}
              className="mr-10"
              width="25"
              height="16"
              alt="lang-icon"
            />
            <FormattedMessage id={language.name} />
          </a>
        </li>
      ))}
    </ul>
  );
};

LanguagesSelection.propTypes = {
  onChangeLanguage: PropTypes.func,
};
