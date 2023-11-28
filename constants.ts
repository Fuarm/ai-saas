import {
  CodeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  MusicIcon,
  SettingsIcon,
  VideoIcon
} from "lucide-react";

import type {LucideIcon} from "lucide-react";

export const MAX_FREE_COUNTS = 5;

interface Route {
  label: string;
  icon: LucideIcon;
  href: string;
  color?: string;
  bgColor?: string;
  desc?: string;
}

export const DASHBOARD: Route = {
  label: "Dashboard",
  icon: LayoutDashboardIcon,
  href: "/dashboard",
  color: "text-sky-500"
}

export const CONVERSATION: Route = {
  label: "Conversation",
  icon: MessageSquareIcon,
  href: "/conversation",
  color: "text-violet-500",
  bgColor: "bg-violet-500/10",
  desc: "Our most advanced conversation model."
}

export const MUSIC: Route = {
  label: 'Music Generation',
  icon: MusicIcon,
  href: '/music',
  color: "text-emerald-500",
  bgColor: "bg-emerald-500/10",
  desc: "Turn your prompt into music."
}

export const IMAGE: Route = {
  label: 'Image Generation',
  icon: ImageIcon,
  href: '/image',
  color: "text-pink-700",
  bgColor: "bg-pink-700/10",
  desc: "Turn your prompt into an image."
}

export const VIDEO: Route = {
  label: 'Video Generation',
  icon: VideoIcon,
  href: '/video',
  color: "text-orange-700",
  bgColor: "bg-orange-700/10",
  desc: "Turn your prompt into video."
}

export const CODE: Route = {
  label: 'Code Generation',
  icon: CodeIcon,
  href: '/code',
  color: "text-green-700",
  bgColor: "bg-green-700/10",
  desc: "Generate code using descriptive text."
}

export const SETTINGS: Route = {
  label: 'Settings',
  icon: SettingsIcon,
  href: '/settings',
  bgColor: "bg-gray-700/10",
  desc: "Manage account settings."
}

export const tools = [
  CONVERSATION,
  CODE,
  IMAGE,
  MUSIC,
  VIDEO,
];

export const routes = [
  DASHBOARD,
  CONVERSATION,
  CODE,
  IMAGE,
  MUSIC,
  VIDEO,
  SETTINGS
]
