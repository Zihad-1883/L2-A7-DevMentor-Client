// "use client";

// import Link from "next/link";
// import { DollarSign, Clock, CheckCircle2, Wallet, Hourglass } from "lucide-react";

// export default function AdminPayoutsPage() {
//   return (
//     <div className="space-y-8 animate-in fade-in duration-300 pb-12">
//       <div className="pb-6 border-b border-border/80">
//         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
//           <DollarSign className="size-3.5" /> Payout Moderation
//         </div>
//         <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
//           Payout Request Approvals
//         </h1>
//         <p className="text-sm text-text-secondary mt-1 max-w-xl">
//           Review mentor BDT withdrawal requests and mark them as processed.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {[
//           { label: "Pending Requests", Icon: Clock, color: "text-amber", bg: "bg-amber-light border-amber/20" },
//           { label: "Processed", Icon: CheckCircle2, color: "text-emerald", bg: "bg-emerald-light border-emerald/20" },
//           { label: "Total Paid Out", Icon: Wallet, color: "text-text-primary", bg: "bg-surface-raised border-border" },
//         ].map(({ label, Icon, color, bg }) => (
//           <div
//             key={label}
//             className="p-4 rounded-2xl bg-surface border border-border/80 flex items-center justify-between shadow-2xs"
//           >
//             <div>
//               <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//                 {label}
//               </span>
//               <span className={`text-2xl font-bold font-mono mt-1 block ${color}`}>—</span>
//             </div>
//             <div className={`size-10 rounded-xl flex items-center justify-center border ${bg} ${color}`}>
//               <Icon className="size-5" />
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="p-16 rounded-3xl border border-border/80 bg-surface text-center space-y-3">
//         <div className="size-14 rounded-2xl bg-amber-light text-amber flex items-center justify-center mx-auto shadow-2xs">
//           <Hourglass className="size-7" />
//         </div>
//         <h3 className="font-serif text-lg font-bold text-text-primary">
//           Withdrawal Requests Coming Soon
//         </h3>
//         <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
//           Mentor payout requests aren&apos;t available in the API yet. Once the
//           payout backend ships, pending BDT withdrawals will appear here for
//           review.
//         </p>
//         <Link
//           href="/admin/users"
//           className="inline-block mt-2 text-xs font-bold text-amber hover:underline"
//         >
//           Go to Users Directory →
//         </Link>
//       </div>
//     </div>
//   );
// }
