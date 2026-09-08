# SHB Logistics — Cold Chain Ops Console

An internal operations web app for SHB's frozen fruit distribution fleet (Thermo, Coldspace, Luxio, Glacia), rebuilt from the existing mobile Loading Plan / Petty Cash screens into a fuller cross-device console.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Router, Recharts, lucide-react icons. All data is in-memory mock data (`src/data/seed.ts`) wired through a React context store (`src/store/AppStore.tsx`) — no backend yet, everything resets on reload.

## Pages

- **Dashboard** — fleet status, KPIs, and an auto-generated attention list (temp excursions, over-budget petty cash, expiring driver licenses).
- **Route Planner** — assign each Sales Order to an armada for the delivery date.
- **Loading Plan** — the original screen: per-armada driver/helper entry, qty kirim / keranjang / styrofoam per SKU line, and the Armada Berangkat → Ubah jam berangkat / Ubah (Management) / Batalkan Berangkat flow.
- **Fleet Tracking** *(new)* — live location, ETA, and a reefer temperature chart per armada with cold-chain excursion alerts.
- **Petty Cash** — the original screen: Perlu Verifikasi → Siap Refill → Nunggu Approval Finance pipeline, itemized receipts, over-budget flagging.
- **Drivers** *(new)* — performance scorecards (on-time rate, temp-excursion average, incidents, SIM expiry) to support rotation and bonus decisions.
- **Reports** *(new)* — on-time delivery trend, petty cash spend vs. budget, SKU volume, and a plain-language weekly insight list.

## Why these additions

The screenshots showed two screens (Loading Plan, Petty Cash) that assume driver/helper assignment and cash spend are already known — Route Planner closes the gap of *how* SOs get assigned to a truck in the first place. Because the fleet names (Thermo, Coldspace, Luxio) and SKUs are all frozen/chilled fruit product, cold-chain temperature integrity is the highest-leverage efficiency risk that wasn't represented anywhere, so Fleet Tracking adds live reefer temp monitoring and excursion alerts. Drivers and Reports turn the operational data that's already being captured (on-time delivery, petty cash, SO volume) into scorecards and trends that support staffing, budgeting, and routing decisions instead of living only as unreviewed transaction logs.

## Run locally

```bash
npm install
npm run dev
```
