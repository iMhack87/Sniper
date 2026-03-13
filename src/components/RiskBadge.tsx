import { ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';

export default function RiskBadge({ level, hints }: { level: string; hints: string[] }) {
  if (level === 'RED') {
    return (
      <div className="flex flex-col gap-1 items-start group relative">
         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
           <ShieldOff size={14} /> Élevé
         </span>
         {hints.length > 0 && (
           <div className="absolute right-0 sm:right-auto sm:left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-base-800 border border-red-500/30 rounded-lg shadow-xl text-xs z-20">
             <ul className="list-disc pl-4 text-red-300">
               {hints.map((h, i) => <li key={i}>{h}</li>)}
             </ul>
           </div>
         )}
      </div>
    );
  }
  
  if (level === 'YELLOW') {
    return (
      <div className="flex flex-col gap-1 items-start group relative">
         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
           <ShieldAlert size={14} /> Moyen
         </span>
         {hints.length > 0 && (
           <div className="absolute right-0 sm:right-auto sm:left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-base-800 border border-yellow-500/30 rounded-lg shadow-xl text-xs z-20">
             <ul className="list-disc pl-4 text-yellow-300">
               {hints.map((h, i) => <li key={i}>{h}</li>)}
             </ul>
           </div>
         )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-start group relative">
       <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
         <ShieldCheck size={14} /> Faible
       </span>
       {hints.length > 0 && (
         <div className="absolute right-0 sm:right-auto sm:left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-base-800 border border-green-500/30 rounded-lg shadow-xl text-xs z-20">
           <ul className="list-disc pl-4 text-green-300">
             {hints.map((h, i) => <li key={i}>{h}</li>)}
           </ul>
         </div>
       )}
    </div>
  );
}
