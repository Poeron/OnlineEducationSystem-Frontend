import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminAssignmentSubmissions from "@/pages/admin/AssignmentSubmissions";
import AdminAssignments from "@/pages/admin/Assignments";
import AdminCertificates from "@/pages/admin/Certificates";
import AdminCourseEnrollments from "@/pages/admin/CourseEnrollments";
import AdminCourseMaterials from "@/pages/admin/CourseMaterials";
import AdminCourses from "@/pages/admin/Courses";
import AdminExamQuestions from "@/pages/admin/ExamQuestions";
import AdminExamResults from "@/pages/admin/ExamResults";
import AdminExams from "@/pages/admin/Exams";
import AdminForumComments from "@/pages/admin/ForumComments";
import AdminHome from "@/pages/admin/Home";
import AdminLayout from "@/layouts/AdminLayout";
import AdminQuestionOptions from "@/pages/admin/QuestionOptions";
import AdminUsers from "@/pages/admin/Users";
import AllCourses from "@/pages/AllCourses";
import AssignmentDetails from "@/pages/AssignmentDetails";
import Assignments from "@/pages/Assignments";
import Certificates from "@/pages/Certificates";
import CourseDetails from "@/pages/CourseDetails";
import CourseRegistration from "@/pages/CourseRegistration";
import CourseStudents from "@/pages/CourseStudents";
import Forum from "@/pages/Forum";
import Home from "../pages/Home";
import InstructorCourses from "@/pages/Forum";
import InstructorQuiz from "@/pages/CreateExam";
import Login from "../pages/Login";
import Materials from "@/pages/Materials";
import MyCourses from "@/pages/UserCourses";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "../routes/ProtectedRoute";
import Quiz from "@/pages/Quiz";
import React from "react";
import Signup from "@/pages/Signup";
import UserLayout from "@/layouts/UserLayout";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role={"student"}>
              <UserLayout>
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="mycourses" element={<MyCourses />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route
                    path="assignments/:assignmentId"
                    element={<AssignmentDetails />}
                  />
                  <Route path="courses/:courseId" element={<CourseDetails />} />
                  <Route
                    path="courses/:courseId/materials"
                    element={<Materials />}
                  />
                  <Route
                    path="courses/:courseId/assignments"
                    element={<Assignments />}
                  />
                  <Route path="courses/:courseId/quiz" element={<Quiz />} />
                  <Route path="courses/:courseId/forum" element={<Forum />} />
                  <Route path="allcourses" element={<AllCourses />} />
                  <Route
                    path="courses/:courseId/register"
                    element={<CourseRegistration />}
                  />
                  <Route path="certificates" element={<Certificates />} />
                </Routes>
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute role="instructor">
              <UserLayout>
                <Routes>
                  <Route path="home" element={<MyCourses />} />
                  <Route path="courses" element={<InstructorCourses />} />
                  <Route path="courses/:courseId" element={<CourseDetails />} />
                  <Route
                    path="courses/:courseId/materials"
                    element={<Materials />}
                  />
                  <Route
                    path="courses/:courseId/assignments"
                    element={<Assignments />}
                  />
                  <Route
                    path="courses/:courseId/quiz"
                    element={<InstructorQuiz />}
                  />
                  <Route
                    path="courses/:courseId/students"
                    element={<CourseStudents />}
                  />
                  <Route path="courses/:courseId/forum" element={<Forum />} />
                  <Route
                    path="assignments/:assignmentId"
                    element={<AssignmentDetails />}
                  />
                </Routes>
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminHome />} />
                  <Route path="home" element={<AdminHome />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="exams" element={<AdminExams />} />
                  <Route path="assignments" element={<AdminAssignments />} />
                  <Route
                    path="assignment-submissions"
                    element={<AdminAssignmentSubmissions />}
                  />
                  <Route
                    path="course-enrollments"
                    element={<AdminCourseEnrollments />}
                  />
                  <Route
                    path="course-materials"
                    element={<AdminCourseMaterials />}
                  />
                  <Route
                    path="exam-questions"
                    element={<AdminExamQuestions />}
                  />
                  <Route path="exam-results" element={<AdminExamResults />} />
                  <Route
                    path="forum-comments"
                    element={<AdminForumComments />}
                  />
                  <Route
                    path="question-options"
                    element={<AdminQuestionOptions />}
                  />
                  <Route path="certificates" element={<AdminCertificates />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
