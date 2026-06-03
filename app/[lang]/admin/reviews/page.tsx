"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Trash2, 
  CornerDownRight, 
  Loader2, 
  Star,
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { reviewService, ReviewResponse } from "@/services/reviewService";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Reply Modal State
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
  const [replyText, setReplyText] = useState("");

  // Delete Confirm State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  // Zoom Image State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const fetchReviews = async (currentPage: number) => {
    try {
      setIsLoading(true);
      const res = await reviewService.adminGetAllReviews(currentPage, pageSize);
      setReviews(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load customer reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleOpenReply = (review: ReviewResponse) => {
    setSelectedReview(review);
    setReplyText(review.replyComment || "");
    setIsReplyOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedReview) return;
    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.adminReplyReview(selectedReview.id, replyText);
      toast.success(t("admin.reviews.replyModal.success") || "Reply posted successfully!");
      setIsReplyOpen(false);
      fetchReviews(page);
    } catch (err) {
      console.error("Failed to reply review:", err);
      toast.error(t("admin.reviews.replyModal.error") || "Failed to post reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDelete = (id: number) => {
    setReviewToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (reviewToDelete === null) return;

    try {
      setIsSubmitting(true);
      await reviewService.adminDeleteReview(reviewToDelete);
      toast.success(t("admin.reviews.delete.success") || "Review deleted successfully!");
      setIsDeleteOpen(false);
      
      // If deleting the last item on the page, go to the previous page
      const nextReviewsCount = reviews.length - 1;
      if (nextReviewsCount === 0 && page > 0) {
        setPage(page - 1);
      } else {
        fetchReviews(page);
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error(t("admin.reviews.delete.error") || "Failed to delete review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-warning">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "text-warning" : "text-outline-variant"} 
          />
        ))}
      </div>
    );
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in duration-300">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-on-surface-variant font-mono font-medium text-sm tracking-wider uppercase">
          Loading athlete feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 animate-in fade-in duration-500 text-left">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-2xl border-outline-variant hover:border-primary hover:text-primary transition-all duration-300 shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-on-surface uppercase leading-none flex items-center gap-3">
              <MessageSquare className="text-primary h-8 w-8" />
              {t("admin.reviews.title") || "Customer Reviews"}
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mt-1.5 leading-relaxed max-w-xl">
              {t("admin.reviews.subtitle") || "Track, moderate, and reply to athlete feedback"}
            </p>
          </div>
        </div>
        
        {/* Total Reviews Count Badge */}
        <div className="bg-surface-variant/40 border border-outline-variant/60 rounded-2xl px-5 py-3 self-start md:self-auto flex items-center gap-3">
          <MessageCircle className="text-primary" size={20} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">Total Feedback</p>
            <p className="font-lexend font-black text-lg text-on-surface leading-none mt-0.5">{totalElements}</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
          <MessageSquare size={48} className="mx-auto text-outline-variant mb-4 opacity-40 animate-pulse" />
          {t("admin.reviews.table.noReviews") || "No reviews found in the system."}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Reviews List */}
          <div className="bg-surface rounded-[2rem] border-2 border-outline-variant shadow-sm overflow-hidden divide-y divide-outline-variant">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 md:p-8 space-y-4 hover:bg-surface-variant/5 transition-colors">
                
                {/* Top Section: Author Details & Review Stars */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-on-surface-variant/60" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface font-lexend">{review.userName}</h4>
                      <p className="text-[10px] font-bold text-on-surface-variant/60 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {renderStars(review.rating)}
                    <span className="font-mono text-[10px] font-black text-on-surface-variant opacity-50">ID: #{review.id}</span>
                  </div>
                </div>

                {/* Mid Section: Comment & Attached Images */}
                <div className="space-y-3 pl-0 sm:pl-13">
                  <p className="text-sm font-semibold text-on-surface leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                  
                  {/* Photo Gallery */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {review.images.map((imgUrl, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setZoomedImage(imgUrl)}
                          className="w-20 h-20 rounded-xl overflow-hidden border border-outline-variant cursor-zoom-in hover:brightness-90 transition-all shadow-sm"
                        >
                          <img src={imgUrl} alt={`Attached action photo ${idx+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Section: Reply and Delete Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-outline-variant/40 pl-0 sm:pl-13">
                  
                  {/* Reply Details */}
                  <div className="flex-grow">
                    {review.replyComment ? (
                      <div className="bg-surface-variant/30 rounded-2xl border border-outline-variant/50 p-4 space-y-2 relative">
                        <CornerDownRight size={16} className="absolute left-4 top-4.5 text-primary shrink-0" />
                        <div className="pl-6 text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Sport Pro Response</p>
                          <p className="text-xs font-semibold text-on-surface-variant mt-1.5">{review.replyComment}</p>
                          <button
                            onClick={() => handleOpenReply(review)}
                            className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/80 hover:text-primary transition-colors mt-2 underline"
                          >
                            Edit Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenReply(review)}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/90 transition-colors"
                      >
                        <MessageSquare size={14} />
                        Add official Response
                      </button>
                    )}
                  </div>

                  {/* Delete button */}
                  <div className="shrink-0 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(review.id)}
                      className="h-9 px-4 rounded-xl border-outline-variant text-error hover:bg-error/10 hover:border-error/30 hover:text-error transition-all gap-1.5 font-bold text-xs uppercase"
                    >
                      <Trash2 size={14} />
                      Delete Review
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-surface border border-outline-variant p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-on-surface-variant">
                Showing page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl border-outline-variant"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl border-outline-variant"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        title={t("admin.reviews.replyModal.title") || "Reply to Review"}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsReplyOpen(false)}
              className="rounded-xl font-bold h-11 border-outline-variant"
              disabled={isSubmitting}
            >
              {t("admin.reviews.replyModal.cancel") || "Cancel"}
            </Button>
            <Button 
              onClick={handleSendReply}
              className="rounded-xl font-bold h-11 shadow-md bg-primary text-on-primary hover:bg-primary/95"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {t("admin.reviews.replyModal.submit") || "Send Reply"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {selectedReview && (
            <div className="bg-surface-variant/20 rounded-xl border border-outline-variant p-4 text-xs space-y-1.5">
              <p className="font-bold text-on-surface font-lexend">{selectedReview.userName}:</p>
              <p className="italic text-on-surface-variant">{selectedReview.comment}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Response Message</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full min-h-[120px] p-4 rounded-xl border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold bg-surface"
              placeholder={t("admin.reviews.replyModal.placeholder") || "Type your response..."}
              maxLength={1000}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Review"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl font-bold h-11 border-outline-variant"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="rounded-xl font-bold h-11 shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
          {t("admin.reviews.delete.confirm") || "Are you sure you want to delete this review? This action is permanent."}
        </p>
      </Modal>

      {/* Zoom Image Modal */}
      <Modal
        isOpen={zoomedImage !== null}
        onClose={() => setZoomedImage(null)}
        title="Photo Viewer"
        className="max-w-2xl"
      >
        {zoomedImage && (
          <div className="flex items-center justify-center overflow-hidden rounded-xl bg-black/5 p-2">
            <img src={zoomedImage} alt="Zoomed View" className="max-h-[60vh] max-w-full object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
}
