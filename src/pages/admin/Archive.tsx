import React, { useEffect, useState } from "react";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { format } from "date-fns";
import { get } from "@/services/ApiHelper";

type Course = {
  course_id: number;
  instructor_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
type Exam = {
  exam_id: number;
  course_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
type Certificate = {
  certificate_id: number;
  course_id: number;
  student_id: number;
  issued_date: string;
  deleted_at: string;
};

const ArchivePage: React.FC = () => {
  const formatDate = (dateString: string) => {
    return dateString
      ? format(new Date(dateString), "dd/MM/yyyy HH:mm")
      : "N/A";
  };
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [courseData, examData, userData, certificateData] =
        await Promise.all([
          get("/Archive/Courses"),
          get("/Archive/Exams"),
          get("/Archive/Users"),
          get("/Archive/Certificates"),
        ]);
      setCourses(courseData);
      setExams(examData);
      setUsers(userData);
      setCertificates(certificateData);
    };
    fetchData();
  }, []);

  const renderTable = () => {
    switch (activeTab) {
      case "courses":
        return (
          <DataTable
            data={courses.map((course) => ({
              ...course,
              created_at: formatDate(course.created_at),
              updated_at: formatDate(course.updated_at),
              deleted_at: formatDate(course.deleted_at),
            }))}
            columns={[
              { header: "Course ID", key: "course_id" },
              { header: "Instructor ID", key: "instructor_id" },
              { header: "Title", key: "title" },
              { header: "Description", key: "description" },
              { header: "Created At", key: "created_at" },
              { header: "Updated At", key: "updated_at" },
              { header: "Deleted At", key: "deleted_at" },
            ]}
            idKey="course_id"
          />
        );
      case "exams":
        return (
          <DataTable
            data={exams.map((exam) => ({
              ...exam,
              created_at: formatDate(exam.created_at),
              updated_at: formatDate(exam.updated_at),
              deleted_at: formatDate(exam.deleted_at),
            }))}
            columns={[
              { header: "Exam ID", key: "exam_id" },
              { header: "Course ID", key: "course_id" },
              { header: "Title", key: "title" },
              { header: "Description", key: "description" },
              { header: "Created At", key: "created_at" },
              { header: "Updated At", key: "updated_at" },
              { header: "Deleted At", key: "deleted_at" },
            ]}
            idKey="exam_id"
          />
        );
      case "users":
        return (
          <DataTable
            data={users.map((user) => ({
              ...user,
              created_at: formatDate(user.created_at),
              updated_at: formatDate(user.updated_at),
              deleted_at: formatDate(user.deleted_at),
            }))}
            columns={[
              { header: "User ID", key: "user_id" },
              { header: "Name", key: "name" },
              { header: "Email", key: "email" },
              { header: "Role", key: "role" },
              { header: "Created At", key: "created_at" },
              { header: "Updated At", key: "updated_at" },
              { header: "Deleted At", key: "deleted_at" },
            ]}
            idKey="user_id"
          />
        );
      case "certificates":
        return (
          <DataTable
            data={certificates.map((certificate) => ({
              ...certificate,
              issued_date: formatDate(certificate.issued_date),
              deleted_at: formatDate(certificate.deleted_at),
            }))}
            columns={[
              { header: "Certificate ID", key: "certificate_id" },
              { header: "Course ID", key: "course_id" },
              { header: "Student ID", key: "student_id" },
              { header: "Issued Date", key: "issued_date" },
              { header: "Deleted At", key: "deleted_at" },
            ]}
            idKey="certificate_id"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <AdminHeader title="Archive">
        <div className="flex space-x-4 mt-4">
          {["courses", "exams", "users", "certificates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </AdminHeader>
      {renderTable()}
    </div>
  );
};

export default ArchivePage;
