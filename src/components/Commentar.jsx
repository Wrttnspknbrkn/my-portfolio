import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  addDoc, collection, onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase-comment";
import { UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X } from "lucide-react";

const Comment = memo(({ comment, formatDate }) => {
  const { profileImage, userName, createdAt, content } = comment;

  return (
    <motion.div
      className="p-4 border-b border-border last:border-b-0 hover:bg-accent/5 transition-colors duration-300 w-full min-w-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        {profileImage ? (
          <img
            src={profileImage}
            alt={`${userName}'s profile`}
            className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <UserCircle2 className="w-5 h-5 text-accent" strokeWidth={1.5} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 w-full">
            <h4 className="font-sans text-body-sm text-foreground font-medium truncate">{userName}</h4>
            <span className="font-sans text-caption text-foreground-muted whitespace-nowrap flex-shrink-0">
              {formatDate(createdAt)}
            </span>
          </div>
          <p className="font-sans text-body-sm text-foreground-muted leading-relaxed break-words">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

Comment.displayName = "Comment";

Comment.propTypes = {
  comment: PropTypes.shape({
    profileImage: PropTypes.string,
    userName: PropTypes.string.isRequired,
    createdAt: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  formatDate: PropTypes.func.isRequired,
};

const CommentForm = memo(({ onSubmit, isSubmitting }) => {
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleTextareaChange = useCallback((e) => {
    setNewComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newComment.trim() || !userName.trim()) return;
      onSubmit({ newComment, userName, imageFile });
      setNewComment("");
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    [newComment, userName, imageFile, onSubmit]
  );

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="w-full">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 font-sans text-body text-foreground placeholder:text-foreground-muted transition-colors duration-300"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="w-full">
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write a message..."
          className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 font-sans text-body text-foreground placeholder:text-foreground-muted transition-colors duration-300 resize-none min-h-[80px]"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center gap-4">
        {imagePreview ? (
          <div className="flex items-center gap-3">
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-10 h-10 rounded-full object-cover border border-accent flex-shrink-0"
            />
            <button
              type="button"
              onClick={removeImage}
              className="font-sans text-caption text-foreground-muted hover:text-accent transition-colors duration-300 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-sans text-caption text-foreground-muted hover:text-accent transition-colors duration-300 flex items-center gap-2"
              disabled={isSubmitting}
            >
              <ImagePlus className="w-4 h-4" strokeWidth={1.5} />
              Add photo
            </button>
          </div>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Posting...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Post Comment</span>
          </>
        )}
      </motion.button>
    </form>
  );
});

CommentForm.displayName = "CommentForm";

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const Komentar = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const commentsRef = collection(db, "portfolio-comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    });
  }, []);

  const uploadImage = useCallback(async (imageFile) => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `profile-images/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  }, []);

  const handleCommentSubmit = useCallback(
    async ({ newComment, userName, imageFile }) => {
      setError("");
      setIsSubmitting(true);
      try {
        const profileImageUrl = await uploadImage(imageFile);
        await addDoc(collection(db, "portfolio-comments"), {
          content: newComment,
          userName,
          profileImage: profileImageUrl,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        setError("Failed to post comment. Please try again.");
        console.error("Error adding comment: ", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [uploadImage]
  );

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
  }, []);

  return (
    <div className="space-y-6 w-full min-w-0">
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 p-4 border border-red-500/20 bg-red-500/5 w-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="font-sans text-body-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />

      <div className="border-t border-border" />

      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden w-full">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <UserCircle2 className="w-10 h-10 text-foreground-muted/50 mx-auto mb-3" />
            <p className="font-sans text-body-sm text-foreground-muted">
              No comments yet. Be the first to share your thoughts.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>

      {comments.length > 0 && (
        <p className="font-sans text-caption text-foreground-muted text-center">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </p>
      )}
    </div>
  );
};

export default Komentar;