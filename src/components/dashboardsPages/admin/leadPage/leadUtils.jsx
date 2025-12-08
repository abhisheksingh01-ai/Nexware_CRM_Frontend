import { CheckCircle2, XCircle, Clock } from "lucide-react";

export const getStatusColor = (status) => {
  switch (status) {
    case "Won":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Lost":
      return "bg-red-50 text-red-600 border-red-100";
    case "Follow Up":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "New":
      return "bg-blue-50 text-blue-600 border-blue-100";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "Won":
      return <CheckCircle2 className="w-3 h-3 mr-1" />;
    case "Lost":
      return <XCircle className="w-3 h-3 mr-1" />;
    case "Follow Up":
      return <Clock className="w-3 h-3 mr-1" />;
    default:
      return <div className="w-1.5 h-1.5 rounded-full bg-current mr-2" />;
  }
};
