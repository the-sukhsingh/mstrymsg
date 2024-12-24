import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCartProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCart = ({ message, onMessageDelete }: MessageCartProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );

    if (response.data.success === false) {
      toast({
        title: "Error",
        description: response.data.message,
        variant: "destructive",
      });
      return;
    }

    onMessageDelete(message._id);
    toast({
      title: "Message Deleted",
      description: "Message has been deleted successfully",
      variant: "success",
      duration: 5000,
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl">{message.content}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row-reverse justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="
                bg-red-500
                " onClick={handleDeleteConfirm}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardDescription>
            <p>{new Date(message.createdAt).toLocaleString()}</p>{" "}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCart;
