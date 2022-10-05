import { useEffect, useRef } from "react";
import { getConfig } from "@edx/frontend-platform";


const MobileDropDownLeft = (props) => {
    const lmsBaseUrl = getConfig().LMS_BASE_URL
    const lmsDashboardUrl = `${lmsBaseUrl}/dashboard/`
    let menuLeftRef = useRef()

    useEffect(() => {
        let handler = (event) => {
            if (!menuLeftRef.current.contains(event.target)) {
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
        <div className="tw-absolute tw-inset-0">

            <div ref={menuLeftRef} className="md:tw-hidden tw-z-40 tw-bg-white tw-top-24 tw-absolute tw-shadow-all tw-w-full tw-py-4">
                <a className="tw-no-underline tw-text-gray-800" href={lmsDashboardUrl}><div className="tw-cursor-pointer tw-py-2 hover:tw-bg-gray-200 tw-pl-5">Course</div></a>
            </div>
        </div>
    )
}

export default MobileDropDownLeft