// "use client";

// import * as React from "react";
// import { Percent, Coins, Save, Info, Lock } from "lucide-react";

// const DEFAULT_COMMISSION = 15;
// const DEFAULT_CREDIT_RATE = 1;

// /**
//  * Commission & credit-rate form. Saving is disabled until the backend exposes
//  * a platform settings endpoint (see phases.md → "Backend: Platform Settings").
//  */
// export default function CommissionSettingsForm() {
//   const [commission, setCommission] = React.useState(String(DEFAULT_COMMISSION));
//   const [creditRate, setCreditRate] = React.useState(String(DEFAULT_CREDIT_RATE));

//   const commissionNum = Number(commission);
//   const rateNum = Number(creditRate);
//   const commissionValid =
//     commission !== "" && Number.isFinite(commissionNum) && commissionNum >= 0 && commissionNum <= 100;
//   const rateValid = creditRate !== "" && Number.isFinite(rateNum) && rateNum > 0;

//   const sample = 1000;
//   const platformCut = commissionValid ? Math.round((sample * commissionNum) / 100) : 0;

//   const inputCls =
//     "w-full px-3.5 py-2.5 rounded-xl text-sm bg-surface border border-border text-text-primary font-mono focus:outline-none focus:border-amber/50";

//   return (
//     <form
//       onSubmit={(e) => e.preventDefault()}
//       className="rounded-2xl border border-border/80 bg-surface shadow-2xs p-5 sm:p-6 space-y-6"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div className="space-y-2">
//           <label htmlFor="commission" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
//             <Percent className="size-3.5 text-amber" /> Platform Commission (%)
//           </label>
//           <input
//             id="commission"
//             type="number"
//             min={0}
//             max={100}
//             step={1}
//             value={commission}
//             onChange={(e) => setCommission(e.target.value)}
//             className={inputCls}
//           />
//           {!commissionValid && (
//             <p className="text-[11px] text-orange font-medium">Enter a value between 0 and 100.</p>
//           )}
//           <p className="text-[11px] text-text-muted">
//             Share retained by DevMentor from every mentor session payment.
//           </p>
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="creditRate" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
//             <Coins className="size-3.5 text-amber" /> Credit Rate (BDT per credit)
//           </label>
//           <input
//             id="creditRate"
//             type="number"
//             min={0}
//             step="0.01"
//             value={creditRate}
//             onChange={(e) => setCreditRate(e.target.value)}
//             className={inputCls}
//           />
//           {!rateValid && (
//             <p className="text-[11px] text-orange font-medium">Enter a rate greater than 0.</p>
//           )}
//           <p className="text-[11px] text-text-muted">
//             BDT value of one wallet credit when students top up.
//           </p>
//         </div>
//       </div>

//       <div className="p-4 rounded-xl bg-surface-raised border border-border/70 text-xs text-text-secondary">
//         <span className="font-semibold text-text-primary">Preview:</span> on a ৳{sample} session,
//         platform keeps ৳{platformCut} and the mentor receives ৳{sample - platformCut}.
//       </div>

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
//         <div className="flex items-start gap-2 text-xs text-text-secondary max-w-md">
//           <Info className="size-4 text-amber shrink-0 mt-0.5" />
//           <p>
//             Platform settings aren&apos;t editable through the API yet, so saving is disabled.
//             Values shown are the current defaults.
//           </p>
//         </div>
//         <button
//           type="submit"
//           disabled
//           className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber text-white opacity-50 cursor-not-allowed"
//         >
//           <Lock className="size-3.5" /> <Save className="size-3.5" /> Save Settings
//         </button>
//       </div>
//     </form>
//   );
// }
