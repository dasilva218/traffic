import { divIcon } from "leaflet"

export const createCustomIcon = (status?: string) => {
    const isReport = !status || status === "SIGNALER"
    const color = isReport ? "#ef4444" : status === "EN_COURS" ? "#f97316" : "#22c55e"

    return divIcon({
        html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <div style="
          position: relative;
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      </div>
    `,
        className: "custom-traffic-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    })
}