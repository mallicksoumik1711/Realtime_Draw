import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, X } from "lucide-react";
import {
  acceptInviteAPI,
  rejectInviteAPI,
  getMyNotificationsAPI,
  deleteNotificationAPI,
} from "../../api/invite";
import { setNotifications } from "../../store/notificationsSlice";
import { showToast } from "../../store/toastSlice";

export default function Notification() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  useEffect(() => {
    // initial load of notifications from backend
    (async () => {
      try {
        const list = await getMyNotificationsAPI();
        dispatch(setNotifications(list));
      } catch (e) {
        // silently ignore for now, no console noise
        console.log(e);
      }
    })();
  }, [dispatch]);

  const handleAccept = async (notif) => {
    if (notif.status !== "pending") return;
    await acceptInviteAPI(notif._id); // backend call
    dispatch(showToast({ message: "Invite accepted", type: "success" }));
    // UI will update via socket event
  };

  const handleReject = async (notif) => {
    if (notif.status !== "pending") return;
    await rejectInviteAPI(notif._id);
    dispatch(showToast({ message: "Invite declined", type: "warning" }));
    // UI will update via socket event
  };

  return (
    <div className="mx-auto mt-6 bg-white/80 backdrop-blur-xl rounded-3xl px-2 sm:px-10 py-6 shadow-lg">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {notifications.length} Notifications
      </h1>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                {n.fromName?.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className="text-gray-800 font-medium truncate">
                  {n.fromName}
                </p>
                <p className="text-gray-600 text-sm truncate">
                  {n.status === "pending"
                    ? "sent you an invite"
                    : n.status === "accepted"
                    ? n.role === "inviter"
                      ? "accepted your invite"
                      : "You accepted the invite"
                    : n.status === "declined"
                    ? n.role === "inviter"
                      ? "declined your invite"
                      : "You declined the invite"
                    : n.status === "cancelled"
                    ? "Invite was cancelled"
                    : ""}
                </p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 flex-wrap">
              {n.status === "pending" && (
                <>
                  <button
                    className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition flex-shrink-0"
                    onClick={() => handleAccept(n)}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition flex-shrink-0"
                    onClick={() => handleReject(n)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              {/* Show status text for accepted/declined invites and a dismiss X */}
              {n.status !== "pending" && (
                <>
                  <span
                    className={`text-sm font-medium ${
                      n.status === "accepted"
                        ? "text-green-600"
                        : n.status === "declined"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {n.status === "accepted"
                      ? "Accepted"
                      : n.status === "declined"
                      ? "Declined"
                      : "Cancelled"}
                  </span>
                  <button
                    aria-label="Dismiss notification"
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex-shrink-0"
                    onClick={async () => {
                      if (n.role === "inviter") {
                        dispatch(
                          setNotifications(
                            notifications.filter((item) => item._id !== n._id)
                          )
                        );
                        return;
                      }
                      try {
                        await deleteNotificationAPI(n._id);
                        dispatch(
                          setNotifications(
                            notifications.filter((item) => item._id !== n._id)
                          )
                        );
                        dispatch(
                          showToast({
                            message: "Notification removed",
                            type: "info",
                          })
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
