import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Ban, 
  HelpCircle 
} from "lucide-react";

// Returns background, text, and border colors based on status
// Uses 'bg-*-50' for a premium, subtle look that fits the glassmorphism design
export const getStatusColor = (status) => {
  switch (status) {
    case "Won":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Lost":
      return "bg-red-50 text-red-700 border-red-200";
    case "Follow Up":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Not Interested":
      return "bg-slate-50 text-slate-600 border-slate-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

// Returns an icon component based on status
// Note: Margins are removed here because the Parent component handles spacing
export const getStatusIcon = (status) => {
  switch (status) {
    case "Won":
      return <CheckCircle2 className="w-3.5 h-3.5" />;
    case "Lost":
      return <XCircle className="w-3.5 h-3.5" />;
    case "Follow Up":
      return <Clock className="w-3.5 h-3.5" />;
    case "New":
      // Replaced simple dot with 'Sparkles' for a premium feel
      return <Sparkles className="w-3.5 h-3.5" />;
    case "Not Interested":
      // Replaced dot with 'Ban' icon
      return <Ban className="w-3.5 h-3.5" />;
    default:
      return <HelpCircle className="w-3.5 h-3.5" />;
  }
};