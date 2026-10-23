import ContentMap from "@/components/maps/ContentMap";
import ReportForm from "./components/Form";

export default function pageSignaler() {
    return (
        <main className="flex-1 h-screen">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-stretch">
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl font-bold">Signaler un incident</h1>
                    <p>Signaler un incident sur la carte de trafic.</p>
                </div>
                <ReportForm />
                <ContentMap />
            </div>
        </main>
    );
}