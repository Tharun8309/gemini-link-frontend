import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatLayout from "./layout/ChatLayout";
import Chat from "./components/Chat";
import { ChatProvider } from "./store/ChatContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<ChatLayout />}>
              <Route path="/" element={<Chat />} />
              <Route path="/conversation/:id" element={<Chat />} />
            </Route>
          </Routes>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
