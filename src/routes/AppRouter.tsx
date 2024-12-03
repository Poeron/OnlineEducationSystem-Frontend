import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import Signup from "@/pages/Signup";
import MyCourses from "@/pages/UserCourses";
import CourseDetails from "@/pages/CourseDetails";
import Materials from "@/pages/Materials";
import AssignmentDetails from "@/pages/AssignmentDetails";
import Forum from "@/pages/Forum";
import Quiz from "@/pages/Quiz";
import AllCourses from "@/pages/AllCourses";
import CourseRegistration from "@/pages/CourseRegistration";
import Assignments from "@/pages/Assignments";
import InstructorCourses from "@/pages/Forum";
import InstructorForum from "@/pages/Forum";
import InstructorQuiz from "@/pages/Forum";
import AdminHome from "@/pages/admin/Home";
import Welcome from "@/pages/Welcome";
import CourseStudents from "@/pages/CourseStudents";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role={"student"}>
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
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute role="instructor">
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
                <Route
                  path="courses/:courseId/forum"
                  element={<InstructorForum />}
                />
                <Route
                  path="assignments/:assignmentId"
                  element={<AssignmentDetails />}
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <Routes>
                <Route path="home" element={<AdminHome />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
