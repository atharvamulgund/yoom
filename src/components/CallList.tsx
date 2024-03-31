'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';

import Loader from './Loader';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCalls } from '../../hooks/getCall';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
    {calls && calls.length > 0 ? (
      <>
        {calls.map((meeting: Call | CallRecording, index: number) => {
         if(index === 0){
          const upcomingMeetingTime = (meeting as Call)?.state?.startsAt?.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit' }) || '';
          const ampm = (meeting as Call)?.state?.startsAt?.getHours?.() ?? 0 >= 12 ? 'PM' : 'AM';
          const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format((meeting as Call)?.state?.startsAt);
          const upcomingMeeting = date + ', ' + upcomingMeetingTime + ampm;
          if (upcomingMeeting) {
            localStorage.setItem('upcoming', upcomingMeeting);
          }
         }
          return (
            <MeetingCard
              key={type === 'ended' ? (meeting as Call).id : index}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                'No Description'
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousMeeting={type === 'ended'}
              link={
                type === 'recordings'
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
              buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
              buttonText={type === 'recordings' ? 'Play' : 'Start'}
              handleClick={
                type === 'recordings'
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
            />
          );
        })}
      </>
    ) : (
      <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
    )}
  </div>
  
  );
};

export default CallList;