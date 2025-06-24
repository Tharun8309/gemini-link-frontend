import {useParams, useNavigate} from "react-router-dom";
import { ChatContext } from "../store/ChatContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

const Chat = () => {
  const { id } = useParams();
  const { chats, addChat, updateChat } = useContext(ChatContext);
  const [chat, setChat] = useState(null);
  const messageRef = useRef(null);
  const modelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setChat(chats.find((chat) => chat._id === id));
    } else {
      setChat(null);
    }
  }, [id, chats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = id ? `https://gemini-link-backend.onrender.com/api/conversation/${id}` 
                   : "https://gemini-link-backend.onrender.com/api/conversation";
    const method = id ? "PUT" : "POST";
    
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: messageRef.current.value,
        model: modelRef.current.value,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
        toast.error("Limit Exceeded try other models");
        return;
      }
      if (id) {
        updateChat(data);
      } else {
        addChat(data);
      }
      messageRef.current.value = '';
      navigate(`/conversation/${data._id}`);
    })
    .catch((err) => {
      toast.error('Network error or server unavailable');
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center md:text-left md:ml-0 ml-12">
          {chat ? (
            <>
              {chat.title}
              <span className="text-gray-400"> - {chat.model}</span>
            </>
          ) : "New Conversation"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat ? (
          chat.messages.map((message) => (
            <div 
              key={message._id}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[70%] rounded-lg p-4 shadow-sm ${
                message.role === 'user' 
                  ? 'bg-white' 
                  : 'bg-blue-100'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    {message.role === 'user' ? 'You' : 'Gemini'}
                  </span>
                </div>
                <ReactMarkdown className="text-gray-800">{ message.content}</ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Send a message to start conversation
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4">
        <form className="flex flex-wrap gap-2 items-center justify-between">
          
          <div className="flex flex-1 gap-2 min-w-[250px]">
            <input 
              type="text" 
              name="prompt" 
              ref={messageRef}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Type your message..."
            />
            {!chat && (
              <select 
                name="model" 
                id="model" 
                ref={modelRef}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 min-w-[95px]"
              > 
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast & Free-Tier Friendly)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Balanced Performance)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (High Quality, May Be Slower)</option>
              </select>
            )}
          

          <button 
            type="submit" 
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap min-w-[80px]"
          >
            
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
            ) : (
              "Send"
            )}
          </button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default Chat