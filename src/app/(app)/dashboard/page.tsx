"use client"
import MessageCart from '@/components/MessageCart'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const {toast} = useToast()

  const handleDeleteMessage = async (messageId: string) =>{
    setMessages(messages.filter(message => message._id !== messageId))
  }

  const {data:session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const {register,watch,setValue} = form

  const acceptMessage = watch("acceptMessage")

  const fetchAcceptMessage = useCallback(
   async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-messages')
      setValue("acceptMessage", response.data.isAcceptingMessages);    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: '🚨 Connection Failed',
        description: axiosError.response?.data.message || 'Unable to access mission control',
        variant: 'destructive'
      });
    }
    finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async (refresh:boolean = false) => {
    setIsLoading(true)
    try {      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages || [])
      console.log("response is ");
      if(refresh){
        toast({
          title: '🔄 Intel Updated',
          description: 'Latest classified messages retrieved',
          variant: 'success'
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "🚨 Data Breach",
        description: axiosError.response?.data.message || "Unable to retrieve classified messages",
        variant: "destructive",
      });
    }
    finally{
      setIsLoading(false)
      
    }
  },[setIsLoading,setMessages,toast])


  useEffect(() => {
    if(!session || !session.user){
      return
  }
  fetchMessages()
  fetchAcceptMessage()
  },[session,setValue,fetchMessages,fetchAcceptMessage])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessage,
      });

      setValue("acceptMessage", !acceptMessage);      toast({
        title: "⚙️ Settings Updated",
        description: "Your message reception preferences have been modified",
        variant: "success",
      });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "🚨 Configuration Error",
        description: axiosError.response?.data.message || "Unable to update settings",
        variant: "destructive",
      });
    }
  }

  const [profileUrl, setProfileUrl] = useState<string>("");

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    setProfileUrl(`${window.location.origin}/u/${session.user.username}`);
  }, [session]);


  function copyToClipboar(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    console.log("Text copied to clipboard");
  }
  const copyToClipboard = () => {
    copyToClipboar(profileUrl);

    toast({
      title: '📋 Link Copied',
      description: 'Secure message endpoint copied to clipboard',
      variant: 'info'
    })
  }

  if(!session || !session.user){
    return <div className='w-screen h-screen'>Unauthorized</div>
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                <span className="text-xl">🕶️</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-thin text-white tracking-tight">
                  Mission Control
                </h1>
                <p className="text-slate-300">Welcome back, {session?.user?.username}</p>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              disabled={isLoading}
              className="bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Syncing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Share Link Card */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl "></div>
              <div className="relative p-6 bg-slate-800/40  border border-slate-700/50 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                    <span className="text-blue-400">🔗</span>
                  </div>
                  <h3 className="text-xl font-medium text-white">Your Mystery Link</h3>
                </div>
                <p className="text-slate-300 mb-4">Share this secret URL to receive anonymous messages</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={profileUrl}
                      disabled
                      className="w-full bg-slate-900/50 border border-slate-600/50 text-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <Button 
                    onClick={copyToClipboard}
                    className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  >
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Message Settings Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl "></div>
            <div className="relative p-6 bg-slate-800/40  border border-slate-700/50 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                  <span className="text-green-400">⚡</span>
                </div>
                <h3 className="text-xl font-medium text-white">Message Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 font-medium">Accept Messages</p>
                    <p className="text-slate-400 text-sm">Control incoming messages</p>
                  </div>
                  <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                <div className="pt-3 border-t border-slate-700/50">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    acceptMessage 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      acceptMessage ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    {acceptMessage ? "Receiving Messages" : "Messages Paused"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl "></div>
          <div className="relative p-6 bg-slate-800/40  border border-slate-700/50 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                  <span className="text-purple-400">💬</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Anonymous Messages</h3>
                  <p className="text-slate-400 text-sm">{messages.length} total messages</p>
                </div>
              </div>
            </div>

            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {messages.map((message, index) => (
                  <MessageCart
                    key={index}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📭</span>
                </div>
                <h4 className="text-xl font-medium text-white mb-3">No Messages Yet</h4>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Your mystery inbox is empty. Share your unique link to start receiving anonymous messages.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={copyToClipboard}
                    className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 mx-auto block"
                  >
                    Copy & Share Your Link
                  </Button>
                  <p className="text-slate-500 text-sm">
                    Or refresh to check for new messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage
