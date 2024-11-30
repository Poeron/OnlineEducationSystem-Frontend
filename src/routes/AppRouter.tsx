import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import Signup from "@/pages/Signup";
import MyCourses from "@/pages/UserCourses";
import CourseDetails from "@/pages/CourseDetails";
import Materials from "@/pages/Materials";
import AssignmentPage from "@/pages/Assignment";
import Forum from "@/pages/Forum";
import Quiz from "@/pages/Quiz";
import AllCourses from "@/pages/AllCourses";
import CourseRegistration from "@/pages/CourseRegistration";
import AllAssignments from "@/pages/AllAssigments";
import TeacherHome from "@/pages/Forum";
import TeacherCourses from "@/pages/Forum";
import TeacherCourseDetails from "@/pages/Forum";
import TeacherMaterials from "@/pages/Forum";
import TeacherAssignments from "@/pages/Forum";
import TeacherForum from "@/pages/Forum";
import TeacherQuiz from "@/pages/Forum";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
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
                <Route path="assignments" element={<AllAssignments />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route
                  path="courses/:courseId/materials"
                  element={<Materials />}
                />
                <Route
                  path="courses/:courseId/assignments"
                  element={<AssignmentPage />}
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

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute role="teacher">
              <Routes>
                <Route path="home" element={<TeacherHome />} />
                <Route path="courses" element={<TeacherCourses />} />
                <Route
                  path="courses/:courseId"
                  element={<TeacherCourseDetails />}
                />
                <Route
                  path="courses/:courseId/materials"
                  element={<TeacherMaterials />}
                />
                <Route
                  path="courses/:courseId/assignments"
                  element={<TeacherAssignments />}
                />
                <Route
                  path="courses/:courseId/quiz"
                  element={<TeacherQuiz />}
                />
                <Route
                  path="courses/:courseId/forum"
                  element={<TeacherForum />}
                />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
