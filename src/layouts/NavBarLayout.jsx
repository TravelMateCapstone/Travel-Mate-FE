import React from 'react'
import Navbar from '../components/Shared/Navbar'

function NavBarLayout({children}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default NavBarLayout