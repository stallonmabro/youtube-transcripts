import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardContent from "./DashboardContent";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?signin=true");
  }

  const { data: transcripts } = await supabase
    .from("transcripts")
    .select("id, video_id, video_title, channel_name, duration_minutes, word_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get today's usage count
  const today = new Date().toISOString().slice(0, 10);
  const { count: todayUsage } = await supabase
    .from("usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00Z`)
    .lte("created_at", `${today}T23:59:59Z`);

  // Get this month's usage count
  const monthStart = new Date();
  monthStart.setDate(1);
  const { count: monthUsage } = await supabase
    .from("usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString());

  return (
    <>
      <Header />
      <main className="flex-1">
        <DashboardContent
          transcripts={transcripts || []}
          todayUsage={todayUsage ?? 0}
          monthUsage={monthUsage ?? 0}
          totalTranscripts={transcripts?.length ?? 0}
        />
      </main>
      <Footer />
    </>
  );
}
