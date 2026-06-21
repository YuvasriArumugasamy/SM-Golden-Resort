import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, ExternalLink, Upload, Trash2, Image, X } from "lucide-react";

export default function AdminGallery() {
  const [photos,     setPhotos]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [uploading,  setUploading]  = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [label,      setLabel]      = useState("");
  const [category,   setCategory]   = useState("rooms");
  const [preview,    setPreview]    = useState(null);
  const [file,       setFile]       = useState(null);
  const fileRef = useRef(null);

  const fetchPhotos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get("/api/gallery");
      setPhotos(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error("Failed to load gallery"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("photo", file);
      form.append("label", label || "Resort Photo");
      form.append("category", category);
      await api.post("/api/gallery", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photo uploaded!");
      setFile(null);
      setPreview(null);
      setLabel("");
      if (fileRef.current) fileRef.current.value = "";
      fetchPhotos(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo permanently?")) return;
    try {
      await api.delete(`/api/gallery/${id}`);
      toast.success("Photo deleted!");
      fetchPhotos(true);
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Gallery</h1>
            <p className="text-slate-400 text-sm mt-0.5">Upload and manage resort photos</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchPhotos(true)} disabled={refreshing}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
          </div>
        </div>

        {/* Upload Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" /> Upload New Photo
          </h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Title / Caption</label>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Deluxe Room View"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                  <option value="rooms">Rooms</option>
                  <option value="exterior">Exterior</option>
                  <option value="facilities">Facilities</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* File picker */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Select Image File</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" />
            </div>

            {/* Preview */}
            {preview && (
              <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <button type="submit" disabled={uploading || !file}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow disabled:opacity-60 disabled:cursor-not-allowed text-sm">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading…" : "Upload to Gallery"}
            </button>
          </form>
        </motion.div>

        {/* Gallery Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800">Gallery Photos ({photos.length})</h3>
          </div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Image className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No photos yet. Upload your first photo!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {photos.map((photo, i) => (
                  <motion.div key={photo._id}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.03 }}
                    className="relative group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="h-36 overflow-hidden">
                      <img src={photo.url} alt={photo.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-700 truncate">{photo.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{photo.category}</p>
                    </div>
                    <button onClick={() => handleDelete(photo._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
