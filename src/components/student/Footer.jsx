import React from 'react'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <div>
        <footer className="bg-gray-900 py-10 px-4 md:px-36 text-left w-full mt-10">
          <div className='flex flex-col md:flex-row items-start px-8 md:px-0 gap-10 md:gap-32 py-10 justify-between mb-10'>
             <div>
              <img src={assets.logo_dark} alt="logo" />
              <p>Lorem Ipsum is simple dummy text of the printing and typesetting industry. Lorem Ipsum has been the inductry's standard dummy text.          
              </p>
             </div>
             <div></div>
             <div></div>
          </div>
          <p className='text-center text-gray-500'>
            &copyright; 2026 IP Academy. All rights reserved.
          </p>
        </footer>
    </div>
  )
}

export default Footer
