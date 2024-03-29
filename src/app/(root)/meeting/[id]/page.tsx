import React from 'react'

const Meeting = ({params}:{params:{id:number}}) => {
  return (
    <div>
      {params?.id}
    </div>
  )
}

export default Meeting
