// components/lead/LeadTabs.jsx
import React from "react";
import { 
  LayoutGrid, 
  PhoneIncoming, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PhoneOff 
} from "lucide-react";
import { motion } from "framer-motion";

const LeadTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  
  // Configuration: Matches your Mongoose Schema Statuses
  const tabs = [
    { 
      id: "All", 
      label: "All", 
      icon: LayoutGrid, 
      color: "text-slate-600",
      activeColor: "text-slate-900"
    },
    { 
      id: "Incoming", 
      label: "Incoming", 
      icon: PhoneIncoming, 
      color: "text-blue-500", 
      activeColor: "text-blue-600"
    },
    { 
      id: "Ring", 
      label: "Ringing", 
      icon: Phone, 
      color: "text-indigo-500", 
      activeColor: "text-indigo-600"
    },
    { 
      id: "Follow Up", 
      label: "Follow Up", 
      icon: Clock, 
      color: "text-amber-500", 
      activeColor: "text-amber-600"
    },
    { 
      id: "Sale Done", 
      label: "Converted", 
      icon: CheckCircle2, 
      color: "text-emerald-500", 
      activeColor: "text-emerald-600"
    },
    { 
      id: "Switch Off", 
      label: "Switch Off", 
      icon: PhoneOff, 
      color: "text-slate-400", 
      activeColor: "text-slate-600"
    },
    { 
      id: "Not Interested", 
      label: "Closed", 
      icon: XCircle, 
      color: "text-red-500", 
      activeColor: "text-red-600"
    }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-1">
      {/* Container: Glassy background */}
      <div className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur-sm border border-slate-200/60 rounded-xl gap-1 min-w-full sm:min-w-0">
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 
                shrink-0 select-none
                ${isActive ? tab.activeColor : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}
              `}
            >
              {/* Sliding White Background (Animation) */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-lg border border-slate-200/50"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}

              {/* Icon & Label (Z-Index keeps them above the background) */}
              <div className="relative z-10 flex items-center gap-2">
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? "scale-110" : "scale-100"} transition-transform`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                
                {/* Count Badge */}
                {(count > 0 || isActive) && (
                  <span className={`
                    ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors leading-none
                    ${isActive 
                      ? "bg-slate-100 text-slate-900" 
                      : "bg-slate-200/60 text-slate-500 group-hover:bg-slate-200"
                    }
                  `}>
                    {count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LeadTabs;