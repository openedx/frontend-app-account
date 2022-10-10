import '../output.css';
import { getConfig } from '@edx/frontend-platform';


export const MyFooter = () => {
    
    
    let lmsBaseUrl = getConfig().LMS_BASE_URL;
    const ingenuityDarkLogo = `${lmsBaseUrl}/static/hackademy-theme/images/ingenuity-dark-logo.png`;
    const tesdaLogo = `${lmsBaseUrl}/static/hackademy-theme/images/tesda-logo.png`;
    const icons8Logo = `${lmsBaseUrl}/static/hackademy-theme/images/icons8-logo.png`;
    let hackademyLogo = `${lmsBaseUrl}/static/hackademy-theme/images/logo.png`
    const openedxLogo = `${lmsBaseUrl}/static/hackademy-theme/images/openedx-logo.png`;
    const tutorLogo = `${lmsBaseUrl}/static/hackademy-theme/images/tutor-logo.png`;

    
    return (
        <div className="tw-bg-gray-100 tw-font-nunito">
           
            <footer className="tw-py-20 tw-mx-auto tw-container tw-flex tw-flex-col lg:tw-flex-row tw-items-center lg:tw-items-start tw-px-5 tw-gap-5 lg:tw-justify-between">
                <div className='tw-flex-col tw-flex-none'>
                    <div className='tw-w-30 tw-h-16'>
                        <a href={lmsBaseUrl}>
                        <img className='tw-w-full tw-h-full'
                            src={hackademyLogo}
                            alt="hackademy-logo" />
                        </a>
                    </div>
		            <div className='tw-w-28 tw-h-16'>
                        <a href="https://openedx.org/" target="_blank">
                        <img className="tw-object-contain tw-h-full tw-w-full"
                            src={openedxLogo} 
                            alt="openedx-logo" />
                        </a>
                    </div>
                    <div>
                        <a href="https://docs.tutor.overhang.io" rel="noopener" target="_blank">
                        <img src={tutorLogo} height="42" />
                        </a>
                    </div>
                </div>

                <div className='tw-mt-8 lg:tw-mt-0'>
                    <div className='tw-text-2xl tw-font-semibold tw-text-primaryCrimson'>Courses Offered</div>
                    <div className="tw-flex tw-gap-20">
                        <div>
                            <ul className='tw-footer-link tw-list-none'>
                                <li><a href='#'>Artificial Intelligence</a></li>
                                <li><a href='#'>Advanced Algorithms</a></li>
                                <li><a href='#'>C/C++ Programming</a></li>
                                <li><a href='#'>Dev Ops</a></li>
                                <li><a href='#'>Database</a></li>
                                <li><a href='#'>Data Structures and Algorithms</a></li>
                                <li><a href='#'>Fundamentals of Programming</a></li>
                                <li><a href='#'>Machine Learning</a></li>
                            </ul>
                        </div>

                        <div>
                            <ul className='tw-footer-link tw-list-none'>
                                <li><a href='#'>Networks</a></li>
                                <li><a href='#'>Operating Systems</a></li>
                                <li><a href='#'>Product Design</a></li>
                                <li><a href='#'>Programming</a></li>
                                <li><a href='#'>Python Programming</a></li>
                                <li><a href='#'>Systems Analysis and Design</a></li>
                                <li><a href='#'>UI/UX Design</a></li>
                            </ul>
                        </div>

                    </div>
                </div>

                
                {/* only visible in mobile view */}
                <div className='lg:tw-hidden tw-gap-40 tw-flex'>
                    <div className=''>
                        <div className='tw-text-2xl tw-font-semibold tw-text-primaryCrimson'>Contact Us</div>
                        <div className='tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-2'><span className='fa-solid fa-envelope'></span> hello@hackademy.ph </div>
                        <div className='tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-2'><span className='fa-solid fa-phone'></span> (082) 222 2222 </div>
                        
                    </div>
                    
                    {/* this element is hidden */}
                    <div className='tw-opacity-0'>
                        <div className='tw-text-2xl tw-font-semibold tw-text-primaryCrimson'>Contact Us</div>
                        <ul className='tw-list-none'>
                            <li className='tw-text-sm tw-font-semibold -tw-ml-10'><span className='fa-solid fa-envelope'></span> hello@hackademy.ph </li>
                            <li className='tw-text-sm tw-font-semibold -tw-ml-10'><span className='fa-solid fa-phone'></span> (082) 222 2222 </li>
                        </ul>
                    </div>
                </div>
                
                
                
                <div className=''>
                    <div>
                        <div className='tw-hidden lg:tw-block'>
                            <div className='tw-text-2xl tw-font-semibold tw-text-primaryCrimson'>Contact Us</div>
                            <div className='tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-2'><span className='fa-solid fa-envelope'></span> hello@hackademy.ph </div>
                            <div className='tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-2'><span className='fa-solid fa-phone'></span> (082) 222 2222 </div>
                        </div>

                        <div className="tw-flex tw-gap-3 tw-mt-20 tw-items-center">
                            <a href="https://ingenuity.ph" rel="noopener" target="_blank">
                                <img src={ingenuityDarkLogo} />
                            </a>
                            <a href="https://www.tesda.gov.ph" rel="noopener" target="_blank">
                                <img src={tesdaLogo} />
                            </a>
                            <a href="https://icons8.com" rel="noopener" target="_blank">
                                <img src={icons8Logo} />
                            </a>
          
                        </div>
                    </div>
                </div>
            </footer>  
            
        </div>
    )
}
