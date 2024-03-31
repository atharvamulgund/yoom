'use client'
import MeetingTypeList from '@/components/MeetingTypeList';
import React from 'react'

const Home = () => {
  const now = new Date()
const time = now.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit' });
const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);
  const upcomingMeetting = localStorage.getItem('upcoming')
  
  
  return (
   <section className="flex size-full flex-col gap-5 text-white">
    <div className="w-full h-[300px] rounded-[20px] bg-hero bg-cover">
      <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
        <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>{upcomingMeetting ? 'Upcoming Meeting At: ' + upcomingMeetting: 'No Meetings Scheduled For Today'}</h2>
        <div className="flex flex-col gap-2">
          <h1 className='text-4xl font-extrabold lg:text-7xl' >
            {time} {ampm}
          </h1>
          <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
        </div>
      </div>
    </div>
    <MeetingTypeList />
   </section> 
  )
}

export default Home
