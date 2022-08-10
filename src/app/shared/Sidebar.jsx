import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';

class Sidebar extends Component {

  state = {
  };

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/usermanagement', state: 'userManagementOpen' },
      { path: '/flightdatarecords', state: 'fdrFilesOpen' },
      { path: '/airlinemanagement', state: 'airlineManagementOpen' },
      { path: '/fdalite', state: 'optimalCIOpen' }

    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a className="sidebar-brand brand-logo" href="">   <img height="45px" width="200px" src={require('../../assets/images/logo.png')} /></a>
          <a className="sidebar-brand brand-logo-mini" href=""><img src='https://nextek.com/wp-content/uploads/2014/10/boeing-logo.png' alt="logo" /></a>

        </div>
        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="">
                  <span className="count bg-success"></span>
                </div>
                <div className="profile-name">
                  <h5 className="mb-0 font-weight-normal"><Trans>{this.props.account}</Trans></h5>
                  <span className='text-warning'><Trans>{this.props.membership.replace("airline-", "").toUpperCase()}</Trans></span>
                </div>
              </div>
              {/*
              <Dropdown alignRight>
                <Dropdown.Toggle as="a" className="cursor-pointer no-caret">
                  <i className="mdi mdi-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sidebar-dropdown preview-list">
                  <a href="!#" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings text-primary"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>Account settings</Trans></p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="!#" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-onepassword  text-info"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>Change Password</Trans></p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="!#" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-calendar-today text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>To-do list</Trans></p>
                    </div>
                  </a>
                </Dropdown.Menu>
              </Dropdown>
            */}
            </div>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link"><Trans>Navigation</Trans></span>
          </li>
          <li className={this.isPathActive('/dashboard/Dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/dashboard/Dashboard">
              <span className="menu-icon"><i className="mdi mdi-speedometer text-primary"></i></span>
              <span className="menu-title"><Trans>Dashboard</Trans></span>
            </Link>
          </li>

          <li className={this.isPathActive('/usermanagement') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.userManagementOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('userManagementOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-account-multiple text-warning"></i>
              </span>
              <span className="menu-title"><Trans>User Management</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.userManagementOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/usermanagement/UserGrid') ? 'nav-link active' : 'nav-link'} to="/usermanagement/UserGrid"><Trans>Users</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/usermanagement/BulkLoad') ? 'nav-link active' : 'nav-link'} to="/usermanagement/BulkLoad"><Trans>Bulk Load</Trans></Link></li>
                  {
                    this.props.role == "superadmin"
                      ?
                      <>
                        <li className="nav-item"> <Link className={this.isPathActive('/usermanagement/Preferences') ? 'nav-link active' : 'nav-link'} to="/usermanagement/Preferences"><Trans>Preferences</Trans></Link></li>
                        <li className="nav-item"> <Link className={this.isPathActive('/usermanagement/Roles') ? 'nav-link active' : 'nav-link'} to="/usermanagement/Roles"><Trans>Roles</Trans></Link></li>
                      </>
                      :
                      <></>
                  }
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/flightdatarecords/FDR') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.fdrFilesOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('fdrFilesOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-file-tree text-danger"></i>
              </span>
              <span className="menu-title"><Trans>FDR Files</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.fdrFilesOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/flightdatarecords/FDR') ? 'nav-link active' : 'nav-link'} to="/flightdatarecords/FDR"><Trans>Download</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          {
            this.props.membership == "airline-fda"
              ?
              <li className={this.isPathActive('/airlinemanagement/Airlines') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
                <div className={this.state.airlineManagementOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('airlineManagementOpen')} data-toggle="collapse">
                  <span className="menu-icon">
                    <i className="mdi mdi-airplane-plus text-success"></i>
                  </span>
                  <span className="menu-title"><Trans>Airline Management</Trans></span>
                  <i className="menu-arrow"></i>
                </div>
                <Collapse in={this.state.airlineManagementOpen}>
                  <div>
                    <ul className="nav flex-column sub-menu">
                      <li className="nav-item"> <Link className={this.isPathActive('/airlinemanagement/Airlines') ? 'nav-link active' : 'nav-link'} to="/airlinemanagement/Airlines"><Trans>Create Airline</Trans></Link></li>
                    </ul>
                  </div>
                </Collapse>
              </li>
              :
              <></>
          }
          {
            this.props.role == "superadmin"
              ?
              <li className={this.isPathActive('/fdalite/OptimalCI') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
                <div className={this.state.optimalCIOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('optimalCIOpen')} data-toggle="collapse">
                  <span className="menu-icon">
                    <i className="mdi mdi-airplane-takeoff text-info"></i>
                  </span>
                  <span className="menu-title"><Trans>FDA Lite</Trans></span>
                  <i className="menu-arrow"></i>
                </div>
                <Collapse in={this.state.optimalCIOpen}>
                  <div>
                    <ul className="nav flex-column sub-menu">
                      <li className="nav-item"> <Link className={this.isPathActive('/fdalite/OptimalCI') ? 'nav-link active' : 'nav-link'} to="/fdalite/OptimalCI"><Trans>Optimal CI</Trans></Link></li>
                    </ul>
                  </div>
                </Collapse>
              </li>
              :
              <></>
          }
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);