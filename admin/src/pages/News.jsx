import { useState, useEffect } from "react";
import {
  Newspaper,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Megaphone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import Spinner from "../components/Spinner";

const NewsManager = () => {
  const { axios } = useAdminContext();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    headline: "",
    tag: "",
    link: "",
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/news/get-all");
      if (data.success) setNewsList(data.news);
    } catch (err) {
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/news/add", formData);
      if (data.success) {
        toast.success(data.message);
        setFormData({ headline: "", tag: "", link: "" });
        fetchNews();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding news");
    }
  };

  const toggleVisibility = async (id) => {
    try {
      const { data } = await axios.put(`/api/news/visibility/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchNews();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      const { data } = await axios.delete(`/api/news/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchNews();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 space-y-10 max-w-6xl mx-auto min-h-screen bg-slate-50/50">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Megaphone size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            News <span className="text-primary italic">Console</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Manage announcements and student updates
          </p>
        </div>
      </div>

      <section className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
        <form
          onSubmit={handleAddNews}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Headline
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TCS Ninja Recruitment 2026 Started"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
              value={formData.headline}
              onChange={(e) =>
                setFormData({ ...formData, headline: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Category Tag
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Placement"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              External Link (Optional)
            </label>
            <div className="relative">
              <LinkIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="url"
                placeholder="https://..."
                className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-blue-600"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-1 cursor-pointer"
            >
              <Plus size={20} /> Publish News
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 ml-2 flex items-center gap-2">
          <Newspaper size={20} /> Existing Updates
        </h3>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-[2rem] border border-slate-100">
            <Spinner />
            <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
              Syncing latest updates...
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {newsList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                No news entries found.
              </div>
            ) : (
              newsList.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white border border-slate-100 p-5 rounded-3xl flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`p-3 rounded-2xl ${
                        item.isVisible
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Newspaper size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-800 text-lg leading-tight">
                          {item.headline}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 font-medium italic">
                        Added on:{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(item._id)}
                      title={item.isVisible ? "Hide News" : "Show News"}
                      className={`p-3 rounded-xl transition-colors cursor-pointer ${
                        item.isVisible
                          ? "text-primary bg-primary/5 hover:bg-primary/10"
                          : "text-slate-400 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {item.isVisible ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteNews(item._id)}
                      className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsManager;
