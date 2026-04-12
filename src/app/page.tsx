import { Sidebar } from "@/components/sidebar/Sidebar";
import { Map } from "@/components/map/Map";

export default function Home() {
  return (
    <div className="flex h-screen bg-neutral-950">
      <Sidebar />
      <main className="flex-1 relative">
        <Map />
      </main>
    </div>
  );
}
