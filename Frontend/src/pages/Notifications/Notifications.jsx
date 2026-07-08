import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";
import { notificationsApi } from "../../services/api";

import "./Notifications.css";
const Notifications = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await notificationsApi.list(user.id || user._id);
      setNotifications(data.notifications || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const markRead = async (id) => {
    await notificationsApi.markRead(id);
    setNotifications((items) => items.map((item) => item._id === id ? { ...item, isRead: true } : item));
  };

  const remove = async (id) => {
    await notificationsApi.remove(id);
    setNotifications((items) => items.filter((item) => item._id !== id));
  };

  return (
    <section className="section-pad">
      <Container>
        <SectionHeader eyebrow="Notifications" title="Your alerts" description="Track application updates, interview schedules, and job activity." />
        {!user ? (
          <div className="glass rounded-3xl p-8 text-center">
            <h2 className="text-xl font-bold">Login to view notifications</h2>
            <Button to="/login" className="mt-5">Login</Button>
          </div>
        ) : loading ? (
          <div className="glass rounded-3xl p-8 text-center">Loading notifications...</div>
        ) : notifications.length ? (
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <article key={notification._id} className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-950 dark:text-white">{notification.title}</h3>
                    <Badge tone={notification.isRead ? "slate" : "teal"}>{notification.isRead ? "Read" : "New"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                </div>
                <div className="flex gap-2">
                  {!notification.isRead ? (
                    <Button onClick={() => markRead(notification._id)} variant="secondary" className="px-3"><CheckCheck size={16} /></Button>
                  ) : null}
                  <Button onClick={() => remove(notification._id)} variant="secondary" className="px-3"><Trash2 size={16} /></Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <Bell size={44} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">No notifications yet</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">You will see application and interview updates here.</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Notifications;
