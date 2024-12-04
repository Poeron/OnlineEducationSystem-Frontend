// AdminForumComments.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type ForumComment = {
  comment_id: number;
  course_id: number;
  author_id: number;
  comment_text: string;
  created_at: string;
};

const AdminForumComments: React.FC = () => {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<ForumComment | null>(
    null
  );

  const fetchComments = async () => {
    try {
      const data = await get("/ForumComments");
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCreateComment = async (
    newComment: Omit<ForumComment, "comment_id" | "created_at">
  ) => {
    try {
      await post("/ForumComments", newComment);
      await fetchComments();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating comment: ", error);
    }
  };

  const handleUpdateComment = async (updatedComment: ForumComment) => {
    try {
      await patch(`/ForumComments`, updatedComment);
      await fetchComments();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating comment: ", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await remove(`/ForumComments/${commentId}`);
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
    <div className="admin-forum-comments">
      <AdminHeader
        title="Forum Comments Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={comments}
        columns={[
          { header: "ID", key: "comment_id" },
          { header: "Course ID", key: "course_id" },
          { header: "Author ID", key: "author_id" },
          { header: "Comment Text", key: "comment_text" },
          { header: "Created At", key: "created_at" },
        ]}
        idKey="comment_id"
        onEdit={(comment) => {
          setSelectedComment(comment);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteComment}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Comment"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Author ID", key: "author_id", type: "number" },
            { label: "Comment Text", key: "comment_text", type: "text" },
          ]}
          initialValues={{ course_id: 0, author_id: 0, comment_text: "" }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateComment(
              values as Omit<ForumComment, "comment_id" | "created_at">
            )
          }
        />
      )}
      {isEditModalOpen && selectedComment && (
        <FormModal
          title="Edit Comment"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Author ID", key: "author_id", type: "number" },
            { label: "Comment Text", key: "comment_text", type: "text" },
          ]}
          initialValues={selectedComment}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateComment(values as ForumComment)}
        />
      )}
    </div>
  );
};

export default AdminForumComments;
