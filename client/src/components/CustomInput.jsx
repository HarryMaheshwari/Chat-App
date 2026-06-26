import React, { useState, useRef } from "react";
import {
  useChannelStateContext,
  useTypingContext,
} from "stream-chat-react";
import { Paperclip, SendHorizonal, X } from "lucide-react";

const CustomMessageInput = () => {
  const { channel } = useChannelStateContext();
  const { typing } = useTypingContext();

  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  if (!channel) return null;

  // --- Send message ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    try {
      await channel.sendMessage({
        text: message.trim(),
        attachments: attachments.length ? attachments : undefined,
      });
      setMessage("");
      setAttachments([]);
      channel.stopTyping();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // --- File upload handler ---
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const response = await channel.sendFile(file);
          return {
            type: file.type.startsWith("image/") ? "image" : "file",
            asset_url: response.file,
            title: file.name,
          };
        })
      );
      setAttachments((prev) => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- Remove attachment ---
  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Typing users (excluding yourself) ---
  const typingUsers = Object.values(typing || {}).filter(
    (u) => u?.user?.id !== channel?.getClient()?.user?.id
  );

  // --- Handle Enter to send ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="w-full px-4 pt-1 pb-3 bg-white border-t border-gray-200">
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="text-xs text-gray-500 mb-1 ml-2">
          {typingUsers.map((u) => u.user.name).join(", ")}{" "}
          {typingUsers.length > 1 ? "are typing..." : "is typing..."}
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 mb-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span className="truncate max-w-[120px]">{file.title}</span>
              <X
                className="w-4 h-4 cursor-pointer hover:text-red-500"
                onClick={() => removeAttachment(index)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Input + buttons */}
      <form
        onSubmit={handleSend}
        className="w-full flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full shadow-sm"
      >
        {/* Attach icon */}
        <label className="cursor-pointer text-gray-500 hover:text-[#0095f6] transition">
          <Paperclip className="w-5 h-5" />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Text input */}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            channel.keystroke(); // tells Stream “user is typing”
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-transparent focus:outline-none"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() && attachments.length === 0}
          className={`p-2 rounded-full transition ${
            !message.trim() && attachments.length === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-[#0095f6] hover:text-[#007cd2]"
          }`}
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};



export default CustomMessageInput;
