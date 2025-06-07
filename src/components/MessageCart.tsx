import React, { useState } from "react";
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
import { X, Eye, Calendar, Trash2, Share2, Download } from "lucide-react";
import { Message } from "@/model/User";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Image from "next/image";

type MessageCartProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCart = ({ message, onMessageDelete }: MessageCartProps) => {
  const { toast } = useToast();
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );    if (response.data.success === false) {
      toast({
        title: "🚫 Mission Failed",
        description: response.data.message || "Unable to delete classified message",
        variant: "destructive",
      });
      return;
    }

    onMessageDelete(message._id);
    toast({
      title: "🗑️ Message Eliminated",
      description: "Classified data has been securely wiped from the system",
      variant: "success",
    });
  };

  // Format date in a more readable way
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  // Truncate message for preview
  const truncateMessage = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Generate preview image without sharing
  const generatePreviewImage = async () => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions
      const width = 600;
      const height = 400;
      canvas.width = width;
      canvas.height = height;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a'); // slate-900
      gradient.addColorStop(0.5, '#1e293b'); // slate-800
      gradient.addColorStop(1, '#0f172a'); // slate-900
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle pattern overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let x = 0; x < width; x += 60) {
        for (let y = 0; y < height; y += 60) {
          ctx.beginPath();
          ctx.arc(x + 10, y + 10, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Add main card background
      const cardX = 40;
      const cardY = 60;
      const cardWidth = width - 80;
      const cardHeight = height - 120;
      
      ctx.fillStyle = 'rgba(51, 65, 85, 0.4)'; // slate-700/40
      
      // Create rounded rectangle using path (fallback for older browsers)
      const radius = 16;
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardWidth - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
      ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight);
      ctx.lineTo(cardX + radius, cardY + cardHeight);
      ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();

      // Add border
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Add header
      ctx.fillStyle = '#10b981'; // green-500
      ctx.beginPath();
      ctx.arc(cardX + 20, cardY + 25, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('ANONYMOUS MESSAGE', cardX + 35, cardY + 30);

      // Add brand
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('🕶️ Mystery Messages', cardX + 20, cardY + cardHeight - 20);

      // Add message content
      ctx.fillStyle = '#e2e8f0'; // slate-200
      ctx.font = '18px Inter, sans-serif';
      
      // Word wrap the message
      const words = message.content.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = cardWidth - 80;
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      // Draw the text lines
      const lineHeight = 24;
      const startY = cardY + 70;
      const maxLines = Math.floor((cardHeight - 120) / lineHeight);
      
      lines.slice(0, maxLines).forEach((line, index) => {
        if (index === maxLines - 1 && lines.length > maxLines) {
          line = line + '...';
        }
        ctx.fillText(line, cardX + 40, startY + (index * lineHeight));
      });

      // Add date
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(formatDate(message.createdAt), cardX + 40, cardY + cardHeight - 50);

      // Convert to data URL for preview
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImageUrl(dataUrl);

    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  // Generate and share message as image
  const generateMessageImage = async () => {
    setIsGeneratingImage(true);
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions
      const width = 600;
      const height = 400;
      canvas.width = width;
      canvas.height = height;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a'); // slate-900
      gradient.addColorStop(0.5, '#1e293b'); // slate-800
      gradient.addColorStop(1, '#0f172a'); // slate-900
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle pattern overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let x = 0; x < width; x += 60) {
        for (let y = 0; y < height; y += 60) {
          ctx.beginPath();
          ctx.arc(x + 10, y + 10, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }      // Add main card background
      const cardX = 40;
      const cardY = 60;
      const cardWidth = width - 80;
      const cardHeight = height - 120;
      
      ctx.fillStyle = 'rgba(51, 65, 85, 0.4)'; // slate-700/40
      
      // Create rounded rectangle using path (fallback for older browsers)
      const radius = 16;
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardWidth - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
      ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight);
      ctx.lineTo(cardX + radius, cardY + cardHeight);
      ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();

      // Add border
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Add header
      ctx.fillStyle = '#10b981'; // green-500
      ctx.beginPath();
      ctx.arc(cardX + 20, cardY + 25, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('ANONYMOUS MESSAGE', cardX + 35, cardY + 30);

      // Add brand
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('🕶️ Mystery Messages', cardX + 20, cardY + cardHeight - 20);

      // Add message content
      ctx.fillStyle = '#e2e8f0'; // slate-200
      ctx.font = '18px Inter, sans-serif';
      
      // Word wrap the message
      const words = message.content.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = cardWidth - 80;
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      // Draw the text lines
      const lineHeight = 24;
      const startY = cardY + 70;
      const maxLines = Math.floor((cardHeight - 120) / lineHeight);
      
      lines.slice(0, maxLines).forEach((line, index) => {
        if (index === maxLines - 1 && lines.length > maxLines) {
          line = line + '...';
        }
        ctx.fillText(line, cardX + 40, startY + (index * lineHeight));
      });

      // Add date
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(formatDate(message.createdAt), cardX + 40, cardY + cardHeight - 50);

      // Convert to blob and download/share
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Could not generate image');
        }

        // Check if Web Share API is supported and can share files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'message.png')] })) {
          const file = new File([blob], 'mystery-message.png', { type: 'image/png' });
          try {
            await navigator.share({
              title: 'Anonymous Message',
              text: 'Check out this mystery message!',
              files: [file]
            });            toast({
              title: "📤 Share Successful",
              description: "Message image transmitted to your chosen app",
              variant: "success",
            });
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              // Fallback to download if sharing fails
              downloadImage(blob);
            }
          }
        } else {
          // Fallback to download
          downloadImage(blob);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Error generating image:', error);      toast({
        title: "🚨 Transmission Error",
        description: "Failed to generate encrypted message image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Download image fallback
  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mystery-message-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
      toast({
      title: "💾 Download Complete",
      description: "Encrypted message saved to your device. Ready for manual transmission.",
      variant: "info",
    });
  };
  return (
    <>
      {/* Main Message Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-slate-700/20 rounded-xl  transition-all duration-300"></div>
        <Card className="relative bg-slate-800/30  border border-slate-700/50 hover:bg-slate-800/40 transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-xs font-medium tracking-wide">ANONYMOUS MESSAGE</span>
              </div>              <div className="flex items-center space-x-1">                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowFullMessage(true);
                    // Also generate preview when opening from the card
                    generatePreviewImage();
                  }}
                  className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateMessageImage}
                  disabled={isGeneratingImage}
                  className="h-8 w-8 p-0 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <Download className="h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Message?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-300">
                        This anonymous message will be permanently deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleDeleteConfirm}
                      >
                        Delete Forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardTitle className="text-slate-200 text-base font-normal leading-relaxed">
              {truncateMessage(message.content)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(message.createdAt)}</span>
              </div>              {message.content.length > 120 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowFullMessage(true);
                    generatePreviewImage();
                  }}
                  className="text-slate-400 hover:text-white text-xs h-auto p-1"
                >
                  Read More
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>      {/* Full Message Modal */}
      <AlertDialog open={showFullMessage} onOpenChange={(open) => {
        setShowFullMessage(open);
        if (open) {
          // Generate preview when modal opens
          generatePreviewImage();
        } else {
          // Clean up preview when modal closes
          if (previewImageUrl) {
            setPreviewImageUrl(null);
          }
        }
      }}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/50 max-w-6xl max-h-[95vh] shadow-2xl overflow-auto">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full  animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full  animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-500/5 rounded-full  animate-pulse delay-500"></div>
          </div>

          {/* Header Section */}
          <div className="relative">
            <AlertDialogHeader className="pb-2">
              <AlertDialogTitle className="text-transparent bg-clip-text flex items-center justify-between mb-2 gap-3 bg-gradient-to-r from-white to-slate-300 text-2xl font-light tracking-wide">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400/30 rounded-full animate-pulse"></div>
                    <div className="relative w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-green-400 text-xs font-bold tracking-wider">CLASSIFIED MESSAGE</span>
                    <div className="h-px w-24 bg-gradient-to-r from-green-400 to-transparent"></div>
                  </div>
                </div>
                <div className="text-right text-slate-400 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-700/50 rounded-full text-xs">ENCRYPTED</span>
                    <span className="text-slate-500">🕶️</span>
                  </div>
                </div>
              </AlertDialogTitle>
              <div className="h-px bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 mt-3"></div>
            </AlertDialogHeader>
          </div>

          {/* Main Content */}
          <div className="relative flex-1 grid grid-cols-1 xl:grid-cols-5 gap-4 my-2">
            {/* Left side - Message Display (3 columns) */}
            <div className="xl:col-span-3 space-y-6">
              {/* Message Content Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-800/40  border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-slate-600/30">
                      <span className="text-sm">📝</span>
                    </div>
                    <div>
                      <h3 className="text-slate-200 font-medium">Message Content</h3>
                      <p className="text-slate-400 text-xs">Tap to reveal full transmission</p>
                    </div>
                  </div>
                  
                  <div className="relative max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-800/20 pointer-events-none rounded-lg"></div>
                    <p className="text-slate-100 text-lg leading-relaxed whitespace-pre-wrap font-light tracking-wide selection:bg-blue-500/30">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Metadata */}
              <div className="relative">
                <div className="bg-slate-800/20  border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Intercepted</span>
                      </div>
                      <span className="text-slate-200 font-mono text-sm">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Share Preview (2 columns) */}
            <div className="xl:col-span-2 space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-800/40  border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-slate-600/30">
                      <Share2 className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-slate-200 font-medium">Share Preview</h3>
                      <p className="text-slate-400 text-xs">How it appears when shared</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 min-h-[300px] flex items-center justify-center">
                      {previewImageUrl ? (
                        <div className="space-y-2 text-center">
                          <div className="relative group/img">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg transition-all duration-300"></div>
                            <Image
                              width={600}
                              height={400}
                              src={previewImageUrl} 
                              alt="Message preview" 
                              className="relative max-w-full h-auto rounded-lg border border-slate-600/30 shadow-2xl hover:scale-105 transition-transform duration-300"
                              style={{ maxHeight: '280px' }}
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-slate-300 text-sm font-medium">Ready to transmit</p>
                            <p className="text-slate-500 text-xs">Encrypted for secure sharing</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-400 mx-auto"></div>
                            <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-pulse"></div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-300 text-sm font-medium">Encoding transmission...</p>
                            <p className="text-slate-500 text-xs">Preparing secure format</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="relative border-t border-slate-700/30 pt-6">
            <AlertDialogFooter className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Secure transmission ready</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={generateMessageImage}
                  disabled={isGeneratingImage}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-slate-600/50 text-black hover:border-blue-500/50 transition-all duration-300 px-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {isGeneratingImage ? (
                    <>
                      <Download className="h-4 w-4 mr-2 animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Initiate Share
                    </>
                  )}
                </Button>
                
                <AlertDialogCancel className="bg-slate-700/50 text-white hover:text-white hover:bg-slate-600/50  border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 px-6">
                  <X className="h-4 w-4 mr-2" />
                  Close Terminal
                </AlertDialogCancel>
              </div>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessageCart;
