import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Send, FileText, Upload, LogOut, Sparkles, Loader2, Trash2 } from "lucide-react";import toast from "react-hot-toast";
import { askQuestion, getChatHistory } from "../api/chat";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";
import { uploadDocument, getDocuments, deleteDocument } from "../api/documents";

function Chat() {
  const { user, setUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteDocument = async (id, fileName) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success(`${fileName} deleted`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  useEffect(scrollToBottom, [messages]);

  // Load existing documents and chat history when the page mounts
  useEffect(() => {
    getDocuments()
      .then((res) =>
        setDocuments(
          res.data.documents.map((d) => ({ id: d._id, fileName: d.fileName }))
        )
      )
      .catch(() => {});

    getChatHistory()
      .then((res) => {
        const history = res.data.chats.flatMap((chat) => [
          { role: "user", text: chat.question },
          { role: "assistant", text: chat.answer },
        ]);
        setMessages(history);
      })
      .catch(() => {});
  }, []);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await uploadDocument(formData);
      toast.success(`${file.name} uploaded — ${res.data.document.totalChunks} chunks created`);
      setDocuments((prev) => [...prev, res.data.document]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!input.trim() || asking) return;

    const question = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setAsking(true);

    try {
      const res = await askQuestion(question);
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.answer }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get answer");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setAsking(false);
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <div className="h-screen flex bg-slate-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-slate-900/50">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-indigo-400" size={20} />
            <h1 className="text-white font-semibold text-lg">Study Buddy</h1>
          </div>
          <p className="text-slate-500 text-sm">Welcome, {user?.name?.split(" ")[0]}</p>
        </div>

        <div className="p-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              isDragActive
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="mx-auto text-indigo-400 animate-spin mb-2" size={24} />
            ) : (
              <Upload className="mx-auto text-slate-500 mb-2" size={24} />
            )}
            <p className="text-slate-400 text-sm">
              {uploading ? "Uploading..." : "Drop a PDF here, or click to browse"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <AnimatePresence>
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="group flex items-center gap-2 bg-white/5 rounded-lg p-3 text-sm"
              >
                <FileText size={16} className="text-indigo-400 shrink-0" />
                <span className="text-slate-300 truncate flex-1">{doc.fileName}</span>
                <button
                  onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                  className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                  title="Delete document"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-white transition shrink-0"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Sparkles className="text-indigo-500/50 mb-4" size={40} />
              <p className="text-slate-500">Upload a PDF, then ask a question about it.</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-lg rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                      : "bg-white/5 border border-white/10 text-slate-200"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-2">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {asking && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAsk} className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about your notes..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={asking}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-5 flex items-center justify-center disabled:opacity-50 transition"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
