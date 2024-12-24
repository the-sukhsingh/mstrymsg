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
      setValue("acceptMessage", response.data.isAcceptingMessages);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: 'Error',
        description: axiosError.response?.data.message || axiosError.message,
        variant: 'destructive'
      })
    }
    finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async (refresh:boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages || [])
      console.log("response is ")
      if(refresh){
        toast({
          title: 'Messages Refreshed',
          description: 'Showing latest messages',
          variant: 'success'
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description: axiosError.response?.data.message || axiosError.message,
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

      setValue("acceptMessage", !acceptMessage);

      toast({
        title: response.data.message,
        description: "Your settings have been updated",
        variant: "success",
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description: axiosError.response?.data.message || axiosError.message,
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
      title: 'Copied',
      description: 'Profile link copied to clipboard',
      variant: 'success'
    })
  }

  if(!session || !session.user){
    return <div className='w-screen h-screen'>Unauthorized</div>
  }

  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded md:max-w-6xl min-h-screen">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex justify-start items-center">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCart
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (<>
        <div className='col-span-1 md:col-span-2 flex flex-col items-center justify-center gap-4'>

          <div className='w-full text-center '>No messages to display.</div>
          <div className='w-full text-center '>Share your profile link to receive messages.</div>
          <div className='w-full text-center flex items-center justify-center gap-4'>

          <Button className='w-full md:w-1/5' onClick={copyToClipboard}> 
            Copy
          </Button>
          </div>
        </div>
        </>

        )}
      </div>
    </div>
  );
}

export default DashboardPage
