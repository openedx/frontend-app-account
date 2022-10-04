import { useEffect, useRef } from "react";
import { getConfig, } from "@edx/frontend-platform";
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';


const MobileDropDownRight = (props) => {
    const username = getAuthenticatedUser().username;
    const config = getConfig();
    const lmsBaseUrl = config.LMS_BASE_URL
    const profileUrl = `${lmsBaseUrl}/u/${username}`
    const accountUrl = `${lmsBaseUrl}/account/settings`
    const lmsDashboardUrl = `${lmsBaseUrl}/dashboard/`
    const logoutUrl = config.LOGOUT_URL;
    const orderHistoryUrl = config.ORDER_HISTORY_URL;

    let menuRightRef = useRef()

    useEffect(() => {
        let handler = (event) => {
            if (!menuRightRef.current.contains(event.target)) {
                props.closeDropDown()
                console.log("dropdown")
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        }
    })

    return (
        <div className="tw-inset-0 tw-absolute">
            <div ref={menuRightRef} className="tw-mobile-dropdown-right md:tw-hidden tw-inset-x-0 tw-absolute tw-top-24 tw-bg-white tw-z-20 tw-shadow-all">
                <a href={lmsDashboardUrl}><div>Dashboard</div></a>
                <a href={profileUrl}><div>Profile</div></a>
                <a href={accountUrl}><div>Account</div></a>
                <a href={orderHistoryUrl}><div>Order History</div></a>
                <a href={logoutUrl}><div>Logout</div></a>
            </div>
        </div>
    )
}

export default MobileDropDownRight