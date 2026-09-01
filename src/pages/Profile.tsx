import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUser, FaLock, FaBell, FaShieldAlt, FaEdit, FaCalendar, FaBuilding, FaIdCard } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Spinner from "../components/Spinner";
import { getProfile, getActivity } from "../services/apiUsers";
import { apiNotifications } from "../services/apiNotifications";
import { useModal } from "../contexts/hooks/useModal";
import EditProfileModal from "../components/adminDashboard/EditProfileModal";

type ActivityEvent = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  newValue: any;
  createdAt: string;
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { openModal } = useModal();

  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfile,
  });

  const { data: activityData } = useQuery({
    queryKey: ["userActivity"],
    queryFn: getActivity,
  });

  const { data: notificationsData, isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiNotifications.getNotifications,
    refetchInterval: 30000,
  });

  const user = profileData?.data;
  const activity = activityData?.data || [];
  const notifications = notificationsData?.data || [];
  const permissionList = Array.isArray(user?.role?.permissions)
    ? user.role.permissions
    : Array.isArray(user?.permissions)
      ? user.permissions
      : [];
  //const avatarUrl = user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=F59E0B&color=fff&rounded=true&size=256`;
  const avatarUrl =
  user?.profilePicture ||
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";
  
  if (loadingProfile) return <Spinner />;

  if (!user) return <div className="flex h-screen items-center justify-center">User not found.</div>;

  const defaultAddress = user.addresses?.[0] || {
    addressLine1: "No address provided",
    city: "N/A",
    state: "N/A",
    country: "N/A",
  };

  const tabs = [
    { name: "Overview", icon: <FaUser size={16} /> },
    { name: "Personal", icon: <FaUser size={16} /> },
    { name: "Security", icon: <FaLock size={16} /> },
    { name: "Notifications", icon: <FaBell size={16} /> },
    { name: "Access & Permissions", icon: <FaShieldAlt size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-primary">
     
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-500">Manage your account details, security, and permissions.</p>
        </div>

        {/* User Header Card */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm border border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg bg-orange-100">
              <img
                src={avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=F59E0B&color=fff&rounded=true&size=256`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <div className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">Verified</div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="font-medium text-gray-700">{user.role?.name || "User"}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MdLocationOn size={14} />
                  <span>{defaultAddress.city}, {defaultAddress.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
              Active
            </span>
            <button
              onClick={() => openModal(<EditProfileModal user={user} />)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FaEdit size={14} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.name
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {activeTab === "Overview" && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 2FA Card */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                      <FaShieldAlt size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">2FA Enabled</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your account is secured with authenticator app.</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Manage Settings</button>
                </div>

                {/* Active Sessions Card */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                      <FaLock size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">3 Active Sessions</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Logged in across desktop and mobile devices.</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Review Devices</button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <FaEdit size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Full Name</p>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-800">{user.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-800">{defaultAddress.city}, {defaultAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Account Details</h3>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-gray-50 p-2 text-gray-400">
                      <FaIdCard size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Account ID</p>
                      <p className="text-sm font-medium text-gray-800">ADM-{user.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-gray-50 p-2 text-gray-400">
                      <FaBuilding size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Department</p>
                      <p className="text-sm font-medium text-gray-800">{user.department || "Operations"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-gray-50 p-2 text-gray-400">
                      <FaCalendar size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Joined Date</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {activity.length > 0 ? (
                    activity.map((event: ActivityEvent, idx: number) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${idx === 0 ? "bg-blue-600 ring-4 ring-blue-100" : "bg-gray-300"}`} />
                          {idx !== activity.length - 1 && <div className="h-full w-0.5 bg-gray-100 mt-1" />}
                        </div>
                        <div className="pb-6">
                          <p className="text-sm font-medium text-gray-800">
                            {event.action} <span className="text-gray-400 font-normal">{event.entityType}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity found.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "Personal" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Full Name</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Email Address</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Phone Number</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Department</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.department || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Location</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{defaultAddress.city}, {defaultAddress.country}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Account Status</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
          )}

          {activeTab === "Security" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Security</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Account Status</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Email Verification</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">Verified</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Two-Factor Authentication</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">Enabled</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Last Updated</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">{new Date(user.updatedAt || user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          )}

          {activeTab === "Notifications" && (
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Notifications</h3>
              {loadingNotifications ? (
                <div className="flex h-40 items-center justify-center"><Spinner /></div>
              ) : notifications.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-500">
                  No notifications yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`rounded-xl border p-4 ${notification.isRead ? "border-gray-100 bg-gray-50" : "border-orange-100 bg-orange-50/40"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-gray-800">{notification.title || "Update"}</p>
                        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                          {notification.isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{notification.message}</p>
                      <p className="mt-3 text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Access & Permissions" && (
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Access & Permissions</h3>
              {permissionList.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-500">
                  No permissions assigned yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {permissionList.map((permission: any, index: number) => (
                    <div key={permission.id || `${permission.name}-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-bold text-gray-800">{permission.name}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {permission.description || "Granted access to this account."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
