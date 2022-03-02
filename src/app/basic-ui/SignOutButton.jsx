import React from "react";
import { useMsal } from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { FaList, FaSignOutAlt } from "react-icons/fa";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }
    return (

        <>
   
        <DropdownButton id="dropdown-item-button" className="ml-auto" drop="left" title={<FaList/>}>
            <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
            <Dropdown.Item as="button">Action</Dropdown.Item>
            <Dropdown.Divider />
            {/*<Dropdown.Item as="button" onClick={() => handleLogout("popup")}>Sign out using Popup</Dropdown.Item>*/}
            <Dropdown.Item as="button" onClick={() => handleLogout("redirect")}> <FaSignOutAlt/> Sign out using Redirect</Dropdown.Item>
        </DropdownButton>
        </>
    )
}