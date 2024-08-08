import React, { Fragment, useState } from 'react'

const ModalFile = ({openModal,setOpenModal}) => {
  return (
    <Fragment>
   {
    openModal && 
    <div className='modal-box'>
      <input className='custom-input' type="text"placeholder='Enter Name'/>
      <button className='continue-btn'>Continue</button>
      <button className='continue-btn skip' onClick={()=>setOpenModal(false)}>Skip</button>
    </div>
}
</Fragment>
  )
}

export default ModalFile
