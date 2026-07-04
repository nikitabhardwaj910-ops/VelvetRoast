import AdminAuthGuard from "@/components/admin/admin-auth-guard";

export const metadata = {
  title: "Executive Admin Suite | Velvet Roast",
  description: "Unified Enterprise Management Dashboard for Velvet Roast Luxury Sanctuary",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-cream font-sans selection:bg-accent selection:text-primary">
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </div>
  );
}

