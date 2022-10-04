import '../output.css'
import { getConfig } from '@edx/frontend-platform'
import { getAuthenticatedUser } from '@edx/frontend-platform/auth'
import { useRef } from 'react';
import { useEffect } from 'react';


export const DropDown = (props) => {
    const username = getAuthenticatedUser().username;
    const config = getConfig();
    const lmsBaseUrl = config.LMS_BASE_URL
    const profileUrl = `${lmsBaseUrl}/u/${username}`
    const accountUrl = `${lmsBaseUrl}/account/settings`
    const lmsDashboardUrl = `${lmsBaseUrl}/dashboard/`
    const logoutUrl = config.LOGOUT_URL;
    const orderHistoryUrl = config.ORDER_HISTORY_URL;
    

    let menuRef = useRef()

    useEffect(() => {
        let handler = (event) => {
            if (!menuRef.current.contains(event.target)) {
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
        <div className='tw-absolute tw-inset-0'>
        <div ref={menuRef} className='tw-bg-white tw-overflow-hidden tw-rounded-md tw-shadow-all tw-w-44 tw-z-50 tw-absolute tw-top-12 tw-right-0'> 
            <div className='tw-main-dropdown tw-list-none tw-flex tw-flex-col tw-dropdown-link'>
                <a href={lmsDashboardUrl}><div>Dashboard</div></a>
                <a href={profileUrl}><div>Profile</div></a>
                <a href={accountUrl}><div>Account</div></a>
                <a href={orderHistoryUrl}><div>Order History</div></a>
                <a href={logoutUrl}><div>Logout</div></a>
            </div>
        </div>
        </div>
    )
   
}