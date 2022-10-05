import '../output.css';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useState } from 'react';
import { DropDown } from './DropDown';
import BurgerIcon from './BurgerIcon';
import MobileDropDownLeft from './MobileDropDownLeft';
import MobileDropDownRight from './MobileDropDownRight';
import { useEffect } from 'react';




export const MyHeader = () => {
    const lmsBaseUrl = getConfig().LMS_BASE_URL;
    const dashboardUrl = `${lmsBaseUrl}/dashboard/`;
    const hackademyLogo = `${lmsBaseUrl}/static/hackademy-theme/images/logo.png`;
    const authenticatedUser = getAuthenticatedUser();

    const [username, setUsername] = useState("anonymousUser")
    // imageUrl not working hardcode default avatar for now
    // const [imageAvatar, setImageAvatar] = useState("")
    

    // this code is use for getting the Avatar.url
    // const profileImageObj = new Map();
    // for (const key in authenticatedUser.profileImage) {
    //     profileImageObj.set(key, authenticatedUser.profileImage[key]);
    // }

    useEffect(()=> {
        setUsername(authenticatedUser.username);
    },[username]);
    
   

    
    

    // this code is use for toggling the dropdown menu
    const [show, setShow] = useState(false)
    const [showLeftDrop, setShowLeftDrop] = useState(false)
    const [showRightDrop, setShowRightDrop] = useState(false)
    

    function closeDropDown() {
        setShow(false);
    }

    function closeRightDropDown(event) {
        setShowRightDrop(false);
           
    }

    function closeLeftDropDown(event) {
        setShowLeftDrop(false);
           
    }
    

    return (
        <div className='tw-relative tw-font-nunito'>
            <div className="tw-container tw-mx-auto tw-py-5">
                <div className='tw-wrapper tw-items-center tw-flex tw-justify-between'>
                   
                    <div onClick={ () => { setShowLeftDrop(true) } } className='p-2 hover:tw-bg-gray-200 tw-cursor-pointer md:tw-hidden'>
                        <BurgerIcon />
                    </div>
                    
                    <a className='tw-no-underline' href={dashboardUrl}>
                        <div className='tw-cursor-pointer tw-h-10 tw-flex tw-gap-5 tw-items-center'>
                            <img className='tw-w-full tw-h-full' src={hackademyLogo} alt="hackademy-logo" />
                            <div className='tw-border-course tw-cursor-pointer tw-hidden md:tw-block tw-border-bottom'>
                                <a className="tw-no-underline tw-text-primaryNavy" href={dashboardUrl}>Course</a>
                            </div>
                        </div>  
                    </a>          
                    <div className='tw-flex tw-gap-4 tw-items-center'>
                        {/* help icon */}
                        <div className='tw-hidden md:tw-block tw-px-1 hover:tw-bg-gray-200'>
                            <a href="https://edx.readthedocs.io/projects/open-edx-learner-guide/en/open-release-maple.master/SFD_dashboard_profile_SectionHead.html">
                            <span class="tw-text-gray-700 fa fa-question-circle"></span>
                            </a>
                        </div>
                        {/* username */}
                        <div className='tw-hidden md:tw-block tw-cursor-pointer hover:tw-bg-gray-200 tw-px-1'>
                            <a href={dashboardUrl} className='tw-text-primaryNavy tw-no-underline'>{username}</a>
                        </div>

                        {/* mobile avatar dropdown*/}
                        <div onClick={ () => { setShowRightDrop(true) } } className='p-1 tw-relative md:tw-hidden hover:tw-bg-gray-200'>
                            <div className='tw-cursor-pointer tw-h-12 tw-w-12 tw-rounded-full tw-shadow-all tw-overflow-hidden'>
                                <img className='tw-w-full tw-h-full tw-object-cover' src="http://local.overhang.io:8000/static/images/profiles/default_30.png" alt="" />  
                            </div>
                            
                        </div>

                        {/* avatar */}
                        <div className='p-1 tw-hidden md:tw-block hover:tw-bg-gray-200'>
                            <div className='tw-cursor-pointer tw-h-12 tw-w-12 tw-rounded-full tw-shadow-all tw-overflow-hidden'>
                                <a href={dashboardUrl}>
                                    <img className='tw-w-full tw-h-full tw-object-cover' src="http://local.overhang.io:8000/static/images/profiles/default_30.png" alt="" />
                                </a>
                            </div>
                        </div>

                        {/* dropdown button */}
                        <div id='btn' onClick={ () => {setShow(true)} } className='tw-hidden md:tw-block tw-relative hover:tw-bg-gray-200 tw-px-1 tw-cursor-pointer'>
                            <svg width="20px" height="20px" viewBox="0 0 16 16" version="1.1" role="img" aria-hidden="true" focusable="false">
                                <path d="M7,4 L7,8 L11,8 L11,10 L5,10 L5,4 L7,4 Z" fill="currentColor" transform="translate(8.000000, 7.000000) rotate(-45.000000) translate(-8.000000, -7.000000) "></path>
                            </svg>
                            <div className={`tw-transition tw-duration-150 tw-ease-in ${show ? 'tw-opacity-100' : 'tw-opacity-0'}`}>
                            {show? <DropDown closeDropDown={closeDropDown} />: null}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className={`tw-transition tw-duration-150 tw-ease-in ${showLeftDrop ? 'tw-opacity-100' : 'tw-opacity-0'}`}>{showLeftDrop ? <MobileDropDownLeft closeDropDown={closeLeftDropDown} />:null}</div>
            
            <div className={`tw-transition tw-duration-150 tw-ease-in ${showRightDrop ? 'tw-opacity-100' : 'tw-opacity-0'}`}>{showRightDrop ? <MobileDropDownRight closeDropDown={closeRightDropDown} />:null}</div>
        </div>
    )

}