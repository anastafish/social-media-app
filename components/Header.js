import React from 'react'

function Header({user, children}) {
  return (
    <div className='flex items-center w-full p-5 justify-between'>
      <h1>{user.displayName}</h1>
      {children}
    </div>
  )
}

export default Header