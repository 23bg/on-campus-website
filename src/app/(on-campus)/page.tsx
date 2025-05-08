"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hero5 } from "@/components/custom/hero-section";

const courses = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Understand core DSA concepts and ace technical interviews.",
  },
  {
    id: 4,
    title: "Cloud Computing",
    description: "Deploy scalable apps using AWS, GCP, and Azure.",
  },
  {
    id: 5,
    title: "Flutter Development",
    description: "Create cross-platform mobile apps using Flutter and Dart.",
  },
  {
    id: 6,
    title: "Machine Learning",
    description: "Build ML models and learn with hands-on projects.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Understand core DSA concepts and ace technical interviews.",
  },
  {
    id: 4,
    title: "Cloud Computing",
    description: "Deploy scalable apps using AWS, GCP, and Azure.",
  },
  {
    id: 5,
    title: "Flutter Development",
    description: "Create cross-platform mobile apps using Flutter and Dart.",
  },
  {
    id: 6,
    title: "Machine Learning",
    description: "Build ML models and learn with hands-on projects.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its applications.",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Build modern websites with HTML, CSS, and JavaScript.",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Understand core DSA concepts and ace technical interviews.",
  },
  {
    id: 4,
    title: "Cloud Computing",
    description: "Deploy scalable apps using AWS, GCP, and Azure.",
  },
  {
    id: 5,
    title: "Flutter Development",
    description: "Create cross-platform mobile apps using Flutter and Dart.",
  },
  {
    id: 6,
    title: "Machine Learning",
    description: "Build ML models and learn with hands-on projects.",
  },
];

export default function CoursesPage() {
  return (
   <>
   <Hero5/>
   
   <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-primary">Available Courses</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>
              <Button>Explore</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
   </>
  );
}
