import Image from 'next/image'
import React from 'react'

interface props {
  title: string
  iconSrc: string
  value: string
  borderColor: string
}

const PriceInfoCard = ({ title, iconSrc, value, borderColor }: props) => {
  return (
    <div className={`price-info_card border-l-[#4CB9E7]`}>
      <p className='text-base text-black-100'>{title}</p>
      <div className='flex gap-1'>
        <Image
          src={iconSrc}
          alt={title}
          width={35}
          height={35}
        />
        <p className='text-2xl font-bold text-secondary'>{value}</p>
      </div>
    </div>
  )
}

export default PriceInfoCard
