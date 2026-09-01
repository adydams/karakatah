import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBell, FaLock, FaShieldAlt, FaUser, FaUserCircle } from "react-icons/fa";
import { useLogin } from "../../contexts/hooks/useLogin";
import { useModal } from "../../contexts/hooks/useModal";
import type { GetAdminByIdResponse } from "../../contexts/LoginContext";
import EditProfileModal from "../../components/adminDashboard/EditProfileModal";
import Spinner from "../../components/Spinner";
import { apiNotifications } from "../../services/apiNotifications";

type Tab = "Overview" | "Personal" | "Security" | "Notifications" | "Access & Permissions";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const { adminId, getAdmin } = useLogin();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const { data: adminInfo, isLoading } = useQuery<GetAdminByIdResponse>({
    queryKey: ["admin", adminId],
    queryFn: () => getAdmin(adminId as string),
    enabled: !!adminId,
  });
  const { data: notificationData, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiNotifications.getNotifications,
    refetchInterval: 30000,
  });
  const markRead = useMutation({
    mutationFn: apiNotifications.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner /></div>;
  if (!adminInfo) return <div className="flex h-full items-center justify-center text-gray-500">Profile information not found.</div>;

  const user = adminInfo.user;
  const notifications = notificationData?.data ?? [];
  const tabs: Array<{ name: Tab; icon: ReactNode }> = [
    { name: "Overview", icon: <FaUser size={14} /> },
    { name: "Personal", icon: <FaUser size={14} /> },
    { name: "Security", icon: <FaLock size={14} /> },
    { name: "Notifications", icon: <FaBell size={14} /> },
    { name: "Access & Permissions", icon: <FaShieldAlt size={14} /> },
  ];

  return (
    <div className="mx-auto max-w-6xl p-4 font-primary lg:p-8">
      <div className="mb-6 rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-orange-50/40 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=F59E0B&color=fff&rounded=true&size=256`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#574235]">{user.name}</h1>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-600">Verified</span>
              </div>
              <p className="text-sm text-gray-500">{user.role || "Admin"} • {user.department || "N/A"}, {user.phone || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600">{user.isActive ? "Active" : "Inactive"}</span>
            <button onClick={() => openModal(<EditProfileModal user={user} />)} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">Edit Profile</button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.name ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}>
            {tab.icon}{tab.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {activeTab === "Overview" && (
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard title="Account status" value={user.isActive ? "Active" : "Inactive"} icon={<FaShieldAlt />} />
            <InfoCard title="Role" value={user.role || "Admin"} icon={<FaUser />} />
            <InfoCard title="Email address" value={user.email} icon={<FaBell />} />
            <InfoCard title="Member since" value={new Date(user.createdAt).toLocaleDateString()} icon={<FaLock />} />
          </div>
        )}
        {activeTab === "Personal" && <InfoList items={[["Full name", user.name], ["Email address", user.email], ["Phone number", user.phone || "Not provided"], ["Department", user.department || "Not provided"]]} />}
        {activeTab === "Security" && <InfoList items={[["Account status", user.isActive ? "Active" : "Inactive"], ["Email verification", "Verified"], ["Last updated", new Date(user.updatedAt).toLocaleDateString()]]} />}
        {activeTab === "Notifications" && (
          notificationsLoading ? <Spinner /> : notifications.length === 0 ? <p className="text-sm text-gray-500">No notifications yet.</p> :
            <div className="divide-y divide-gray-100">{notifications.map((notification: { id: string; title: string; message: string; createdAt: string; isRead: boolean }) => (
              <button key={notification.id} onClick={() => !notification.isRead && markRead.mutate(notification.id)} className={`block w-full py-4 text-left ${!notification.isRead ? "bg-orange-50/50" : ""}`}>
                <div className="flex justify-between gap-4"><strong className="text-sm text-gray-800">{notification.title}</strong><span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span></div>
                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
              </button>
            ))}</div>
        )}
        {activeTab === "Access & Permissions" && (
          <div>
            <h2 className="mb-4 text-lg font-bold text-[#574235]">{user.role || "Admin"} permissions</h2>
            {user.permissions && user.permissions.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {user.permissions.map((permission: { id: string; name: string; description?: string }) => (
                  <div key={permission.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-800">{permission.name}</p>
                    <p className="text-xs text-gray-500">{permission.description || "Granted permission"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No permissions assigned.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"><span className="text-orange-500">{icon}</span><div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">{title}</p><p className="text-sm font-semibold text-gray-800">{value}</p></div></div>;
}

function InfoList({ items }: { items: Array<[string, string]> }) {
  return <div className="grid gap-6 md:grid-cols-2">{items.map(([label, value]) => <div key={label}><p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p><p className="mt-1 text-sm font-semibold text-gray-800">{value}</p></div>)}</div>;
}
