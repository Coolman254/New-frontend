import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UserDistribution } from "@/components/dashboard/UserDistribution";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Users, GraduationCap, BookOpen, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Stats {
  students:  number;
  teachers:  number;
  parents:   number;
  classes:   number;
  materials: number;
  loading:   boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    students: 0, teachers: 0, parents: 0, classes: 0, materials: 0, loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, parents, classes, materials] = await Promise.allSettled([
          apiFetch("/students"),
          apiFetch("/teachers"),
          apiFetch("/parents"),
          apiFetch("/classes"),
          apiFetch("/content"),
        ]);

        const count = (result: PromiseSettledResult<any>) => {
          if (result.status === "rejected") return 0;
          const d = result.value;
          return Array.isArray(d) ? d.length : (d?.total ?? d?.data?.length ?? 0);
        };

        setStats({
          students:  count(students),
          teachers:  count(teachers),
          parents:   count(parents),
          classes:   count(classes),
          materials: count(materials),
          loading:   false,
        });
      } catch {
        setStats(s => ({ ...s, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const fmt = (n: number) => stats.loading ? "…" : n.toLocaleString();

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Admin! Here's your school overview.">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => navigate("/admin/users?role=student")}>
          <StatsCard title="Total Students" value={fmt(stats.students)}
            change={stats.loading ? "" : `${stats.students} enrolled`}
            changeType="positive" icon={GraduationCap} variant="primary" />
        </div>
        <div className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => navigate("/admin/users?role=teacher")}>
          <StatsCard title="Total Teachers" value={fmt(stats.teachers)}
            change={stats.loading ? "" : `${stats.teachers} active`}
            changeType="positive" icon={Users} variant="accent" />
        </div>
        <div className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => navigate("/admin/classes")}>
          <StatsCard title="Active Classes" value={fmt(stats.classes)}
            change={stats.loading ? "" : "All running"}
            changeType="neutral" icon={BookOpen} variant="success" />
        </div>
        <div className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => navigate("/admin/content")}>
          <StatsCard title="Materials Uploaded" value={fmt(stats.materials)}
            change={stats.loading ? "" : `${stats.materials} total`}
            changeType="positive" icon={FileText} variant="default" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2"><PerformanceChart /></div>
        <UserDistribution students={stats.students} teachers={stats.teachers} parents={stats.parents} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>

    </AdminLayout>
  );
}
