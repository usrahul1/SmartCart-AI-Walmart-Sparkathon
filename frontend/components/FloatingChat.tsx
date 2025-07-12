"use client";

import type React from "react";

import { useState } from "react";
import { MessageCircle, X, Send, Paperclip } from "lucide-react";
import { sendChatMessage, uploadImage } from "@/lib/api";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function cleanText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold
    .replace(/\*(.*?)\*/g, "$1") // remove italic
    .replace(/`(.*?)`/g, "$1"); // remove code ticks
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId] = useState("rahul123");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageResult, setImageResult] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await sendChatMessage(userId, inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text:
          cleanText(response.message) ||
          "Sorry, I could not process your request.", // ✅ FIXED
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setImageLoading(true);

    try {
      const response = await uploadImage(file, userId);
      setImageResult(response);

      // Add a system message about the image upload
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Image uploaded successfully! Found ${
          response.cart_items?.length || 0
        } items.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Sorry, there was an error processing your image. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setImageLoading(false);
      setSelectedImage(null);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">SmartCart AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm text-center">
                Hi! I'm your SmartCart AI assistant. How can I help you today?
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-left">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t">
            {/* Image Results Display */}
            {imageResult && (
              <div className="p-4 border-b bg-gray-50 max-h-32 overflow-y-auto">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Image Analysis Results:
                </div>
                {imageResult.extracted_text && (
                  <div className="text-xs text-gray-600 mb-2">
                    <strong>Text:</strong>{" "}
                    {imageResult.extracted_text.substring(0, 100)}...
                  </div>
                )}
                {imageResult.cart_items &&
                  imageResult.cart_items.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <strong>Items found:</strong>{" "}
                      {imageResult.cart_items
                        .map((item: any) => item.name)
                        .join(", ")}
                    </div>
                  )}
              </div>
            )}

            <div className="p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={loading || imageLoading}
                />

                {/* Image Upload Button */}
                <label className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-200 cursor-pointer disabled:opacity-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading || imageLoading}
                  />
                  {imageLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </label>

                <button
                  type="submit"
                  disabled={loading || imageLoading || !inputMessage.trim()}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
