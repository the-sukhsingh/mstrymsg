"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-xl border p-4 pr-12 shadow-2xl transition-all duration-500 ease-out  data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full hover:scale-[1.02] hover:shadow-3xl",
  {
    variants: {
      variant: {
        default: 
          "bg-slate-800/90 border-slate-600/50 text-white shadow-slate-900/25 hover:bg-slate-800/95 hover:border-slate-500/60",
        success:
          "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50 text-white shadow-green-900/25 hover:from-green-500/95 hover:to-emerald-500/95 hover:border-green-400/60",
        destructive:
          "bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400/50 text-white shadow-red-900/25 hover:from-red-500/95 hover:to-rose-500/95 hover:border-red-400/60",
        warning:
          "bg-gradient-to-r from-amber-500/90 to-yellow-500/90 border-amber-400/50 text-white shadow-amber-900/25 hover:from-amber-500/95 hover:to-yellow-500/95 hover:border-amber-400/60",
        info:
          "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 border-blue-400/50 text-white shadow-blue-900/25 hover:from-blue-500/95 hover:to-cyan-500/95 hover:border-blue-400/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ToastIcon = ({ variant }: { variant?: string | null }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-white/90" />,
    destructive: <XCircle className="h-5 w-5 text-white/90" />,
    warning: <AlertCircle className="h-5 w-5 text-white/90" />,
    info: <Info className="h-5 w-5 text-white/90" />,
    default: <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
  };
  
  return (
    <div className="flex-shrink-0 mt-0.5">
      {variant && icons[variant as keyof typeof icons] || icons.default}
    </div>
  );
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Icon */}
      <ToastIcon variant={variant} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-3 text-sm font-medium  transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5 text-white/70 opacity-0 transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 group-hover:opacity-100 ",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-white tracking-wide leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-white/80 leading-relaxed mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
