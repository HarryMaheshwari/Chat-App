import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  Thread,
  useChannelStateContext,
  Message,
  MessageInput
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";
import CallButton from "../components/CallButton.jsx";
import ChatNavbar from "../components/ChatNavbar.jsx";
import { getStreamClient } from "../lib/streamClient.js";
import CustomMessageInput from "../components/CustomInput.jsx";

const ChatPage = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();
  const client = getStreamClient();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const setupChannel = async () => {
      if (!authUser || !tokenData?.token) return;
      try {
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.name,
              image: authUser.profilePicture,
            },
            tokenData.token
          );
        }

        const channelId = [authUser._id, id].sort().join("-");
        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, id],
        });

        await currentChannel.watch();
        setChannel(currentChannel);
      } catch (err) {
        console.error("Error setting up chat:", err);
        toast.error("Failed to load chat. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    setupChannel();
  }, [authUser, id, tokenData, client]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({ text: `Join the video call: ${callUrl}` });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !channel) return <PageLoader />;

  return (
    <div className="flex flex-col h-[93vh] sm:h-screen">
      <Chat client={client}>
        <ChatNavbar />
        <div className="chat-overlay"></div>

        <Channel channel={channel}>
          <div className="flex flex-col flex-grow overflow-hidden">
            <ChannelHeader />
            <MessageList className="flex-grow overflow-y-auto" />
           <MessageInput />
            <Thread />
          </div>

          <CallButton handleVideoCall={handleVideoCall} />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
