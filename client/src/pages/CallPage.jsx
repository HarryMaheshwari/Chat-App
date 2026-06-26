import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../components/PageLoader"; // Optional loader

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { authUser, isLoading: userLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

// Inside CallPage
useEffect(() => {
  let isMounted = true;
  let videoClient = null;
  let callInstance = null;

  const initCall = async () => {
    if (!tokenData?.token || !authUser || !callId) return;
    setIsConnecting(true);

    try {
      videoClient = new StreamVideoClient({
        apiKey: import.meta.env.VITE_STREAM_API_KEY,
        user: {
          id: authUser._id,
          name: authUser.name,
          image: authUser.profilePicture,
        },
        token: tokenData.token,
      });

      callInstance = videoClient.call("default", callId);
      await callInstance.join({ create: true });

      if (isMounted) {
        setClient(videoClient);
        setCall(callInstance);
      }
    } catch (error) {
      console.error("Error initializing call:", error);
    } finally {
      if (isMounted) setIsConnecting(false);
    }
  };

  initCall();

  return () => {
    isMounted = false;
    // Disconnect properly
    if (callInstance) callInstance.leave();
    if (videoClient) videoClient.disconnectUser();
  };
}, [tokenData?.token, authUser?._id, callId]); // Be specific with dependencies
  if (userLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <p className="text-red-500 text-center">
            Could not initialize call. Please refresh or try again.
          </p>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    // Only navigate if we actually left an active session
    if (callingState === CallingState.LEFT) {
      // Small timeout to prevent aggressive redirects on load
      const timer = setTimeout(() => navigate("/"), 500);
      return () => clearTimeout(timer);
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
