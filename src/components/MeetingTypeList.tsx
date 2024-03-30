'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast'

const MeetingTypeList = () => {
    const router = useRouter()
    const {toast} = useToast()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
  const [callDetails, setCallDetails] = useState<Call>()
    const {user} = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
      dateTime: new Date(),
      description:'',
      link:''
    })


    const createMeeting =async () =>{
      if (!client || !user) return;
      try {
        if (!values.dateTime) {
          toast({ title: 'Please select a date and time' });
          return;
        }
        const id = crypto.randomUUID();
        const call = client.call('default', id);
        if (!call) throw new Error('Failed to create meeting');
        const startsAt =
          values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Instant Meeting';
        await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
            },
          },
        });
        setCallDetails(call);
        if (!values.description) {
          console.log(`/meeting/${call.id}`);
          
          await router.push(`/meeting/${call.id}`);
        }
        toast({
          title: 'Meeting Created',
        });
      } catch (error) {
        console.error(error);
        toast({ title: 'Failed to create Meeting' });
      }
    }
  return (
    <section className='grid grid-col-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      <MeetingModal 
        isOpen={meetingState ===  'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList