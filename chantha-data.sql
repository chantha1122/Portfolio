--
-- PostgreSQL database dump
--

\restrict WPSZAnH5RAaJaMaUl1tRgeEbhMSEK0DPwuEgLU4NzhBAWJgYwJKmNBpVOuANUGV

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activities (id, slug, type, "titleEn", "titleKm", "summaryEn", "summaryKm", "descriptionEn", "descriptionKm", "activityDate", "datePrecision", "coverImage", "locationEn", "locationKm", "organizationEn", "organizationKm", featured, published, "createdAt", "updatedAt", "credentialId", "demoUrl", "endDate", "externalUrl", "githubUrl", "isCurrent", "sortOrder", technologies) FROM stdin;
3	introduction-to-artificial-intelligence-mt1d1c7b	CERTIFICATE	Introduction to Artificial Intelligence	វិញ្ញាបនបត្រណែនាំអំពីបញ្ញាសិប្បនិម្មិត	Certificate awarded after completing a practical introduction to artificial intelligence and machine learning.	វិញ្ញាបនបត្រដែលទទួលបានបន្ទាប់ពីបញ្ចប់វគ្គណែនាំអនុវត្តអំពីបញ្ញាសិប្បនិម្មិត និង Machine Learning។	\N	\N	2026-08-07 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/certificates/1787220661509-685804ab.png	\N	\N	AI Learning Academy	មជ្ឈមណ្ឌលបណ្តុះបណ្តាល AI	t	t	2026-08-20 10:11:01.513	2026-09-06 13:27:57.696	AI-2026-00125	\N	\N	https://example.com/certificate/AI-2026-00125	\N	f	0	\N
11	get-gife-for-grade-a-mt1grznn-0	PHOTO	Get Gife for grade A	ទៅទទូលរង្វាន់និទ្ទេសា A	\N	\N	\N	\N	2025-05-10 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787226943809-eb02495c.jpg	\N	\N	\N	\N	t	t	2026-08-20 11:55:43.812	2026-09-06 13:28:08.527	\N	\N	\N	\N	\N	f	0	\N
6	ai-workshop-2026-3-mt1d3219-2	PHOTO	AI Workshop 2026 3	សិក្ខាសាលា AI ឆ្នាំ ២០២៦	Highlights from my practical AI and computer vision workshop.	រូបភាពសកម្មភាពពីសិក្ខាសាលាអនុវត្ត AI និង Computer Vision របស់ខ្ញុំ។	\N	\N	2026-08-14 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787223828329-9b1338e8.jpg	\N	\N	\N	\N	t	t	2026-08-20 10:12:21.672	2026-09-06 13:28:00.26	\N	\N	\N	\N	\N	f	2	\N
7	ai-workshop-2026-4-mt1d3219-3	PHOTO	AI Workshop 2026 4	សិក្ខាសាលា AI ឆ្នាំ ២០២៦	Highlights from my practical AI and computer vision workshop.	រូបភាពសកម្មភាពពីសិក្ខាសាលាអនុវត្ត AI និង Computer Vision របស់ខ្ញុំ។	\N	\N	2026-08-14 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787223849006-d3928a12.jpg	\N	\N	\N	\N	t	t	2026-08-20 10:12:21.673	2026-09-06 13:28:02.769	\N	\N	\N	\N	\N	f	3	\N
4	ai-workshop-2026-1-mt1d3219-0	PHOTO	AI Workshop 2026 1	សិក្ខាសាលា AI ឆ្នាំ ២០២៦	Highlights from my practical AI and computer vision workshop.	រូបភាពសកម្មភាពពីសិក្ខាសាលាអនុវត្ត AI និង Computer Vision របស់ខ្ញុំ។	\N	\N	2026-08-14 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787223876516-00fd6f26.jpg	\N	\N	\N	\N	t	t	2026-08-20 10:12:21.667	2026-09-06 13:28:06.398	\N	\N	\N	\N	\N	f	0	\N
5	ai-workshop-2026-2-mt1d3219-1	PHOTO	AI Workshop 2026 2	សិក្ខាសាលា AI ឆ្នាំ ២០២៦	Highlights from my practical AI and computer vision workshop.	រូបភាពសកម្មភាពពីសិក្ខាសាលាអនុវត្ត AI និង Computer Vision របស់ខ្ញុំ។	\N	\N	2026-08-14 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787225186559-92ba5cfa.jpg	\N	\N	\N	\N	t	t	2026-08-20 10:12:21.671	2026-09-06 13:28:07.402	\N	\N	\N	\N	\N	f	1	\N
9	get-gife-for-grade-a-1-mt1gqecp-0	PHOTO	Get Gife for grade A 1	ទៅទទូលរង្វាន់និទ្ទេសា A	\N	\N	\N	\N	2025-05-10 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787226869541-b43f9d46.jpg	\N	\N	\N	\N	t	t	2026-08-20 11:54:29.562	2026-09-06 13:28:07.787	\N	\N	\N	\N	\N	f	0	\N
10	get-gife-for-grade-a-2-mt1gqecp-1	PHOTO	Get Gife for grade A 2	ទៅទទូលរង្វាន់និទ្ទេសា A	\N	\N	\N	\N	2025-05-10 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/1787226869543-1995788f.jpg	\N	\N	\N	\N	t	t	2026-08-20 11:54:29.566	2026-09-06 13:28:08.18	\N	\N	\N	\N	\N	f	1	\N
21	full-stack-developer-mt2yx23j	WORK	Full-Stack Developer	អ្នកអភិវឌ្ឍកម្មវិធី Full-Stack	Building full-stack web applications and practical digital solutions using modern frontend, backend, database, and API technologies.	អភិវឌ្ឍកម្មវិធីវេប Full-Stack និងដំណោះស្រាយឌីជីថលជាក់ស្តែង ដោយប្រើបច្ចេកវិទ្យា Frontend, Backend, Database និង API ទំនើបៗ។	Develop and maintain full-stack web applications using Next.js, TypeScript, Spring Boot, PostgreSQL, and REST APIs. Design responsive user interfaces, integrate frontend applications with backend services, manage database structures, troubleshoot technical issues, and improve application performance and usability.	អភិវឌ្ឍ និងថែទាំកម្មវិធីវេប Full-Stack ដោយប្រើ Next.js, TypeScript, Spring Boot, PostgreSQL និង REST API។ រចនា User Interface ដែលអាចឆ្លើយតបតាមទំហំអេក្រង់ ភ្ជាប់ Frontend ជាមួយ Backend គ្រប់គ្រងរចនាសម្ព័ន្ធ Database ដោះស្រាយបញ្ហាបច្ចេកទេស និងកែលម្អល្បឿន ព្រមទាំងភាពងាយស្រួលក្នុងការប្រើប្រាស់ប្រព័ន្ធ។	2026-05-01 05:00:00	MONTH	\N	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	Personal & University Projects	គម្រោងផ្ទាល់ខ្លួន និងគម្រោងសាកលវិទ្យាល័យ	f	t	2026-08-21 13:11:19.52	2026-08-21 13:11:19.52	\N	\N	\N	\N	\N	t	1	\N
22	web-development-intern-mt2yyp0p	WORK	Web Development Intern	អ្នកហាត់ការផ្នែកអភិវឌ្ឍវេប	\N	\N	\N	\N	2026-07-01 05:00:00	MONTH	\N	\N	\N	Technology Company	ក្រុមហ៊ុនបច្ចេកវិទ្	f	t	2026-08-21 13:12:35.883	2026-08-21 13:12:35.883	\N	\N	2026-12-01 05:00:00	\N	\N	f	0	\N
25	bachelor-of-information-technology-mt4gpkr6	EDUCATION	Bachelor of Information Technology	បរិញ្ញាបត្របច្ចេកវិទ្យាព័ត៌មាន	Studying Information Technology with a focus on software development, databases, networking, web technologies, and practical digital solutions.	កំពុងសិក្សាផ្នែកបច្ចេកវិទ្យាព័ត៌មាន ដោយផ្តោតលើ Software Development, Database, Networking, Web Technologies និងការអភិវឌ្ឍដំណោះស្រាយឌីជីថលជាក់ស្តែង។	Learning and applying core Information Technology concepts including web development, database systems, software engineering, networking, and system analysis. Building practical projects using modern frontend, backend, API, and database technologies.	សិក្សា និងអនុវត្តមូលដ្ឋានគ្រឹះសំខាន់ៗនៃ Information Technology រួមមាន Web Development, Database Systems, Software Engineering, Networking និង System Analysis។ អភិវឌ្ឍគម្រោងជាក់ស្តែងដោយប្រើ Frontend, Backend, API និង Database Technologies ទំនើបៗ។	2024-12-01 05:00:00	MONTH	\N	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	f	t	2026-08-22 14:17:09.72	2026-08-22 14:17:09.72	\N	\N	\N	\N	\N	t	1	\N
26	high-school-education-mt4h33jc	EDUCATION	High School Education	ការសិក្សាថ្នាក់វិទ្យាល័យ	Completed upper secondary education at Samdech Ov High School from 2021 to 2024.	បានបញ្ចប់ការសិក្សាថ្នាក់វិទ្យាល័យនៅវិទ្យាល័យសម្តេចឪ ចាប់ពីឆ្នាំ 2021 ដល់ឆ្នាំ 2024។	Completed upper secondary education and developed a strong academic foundation before continuing to university studies in Information Technology.	បានបញ្ចប់ការសិក្សាកម្រិតមធ្យមសិក្សាទុតិយភូមិ និងទទួលបានមូលដ្ឋានចំណេះដឹងសម្រាប់បន្តការសិក្សានៅកម្រិតសាកលវិទ្យាល័យផ្នែកបច្ចេកវិទ្យាព័ត៌មាន។	2021-12-01 05:00:00	MONTH	\N	Takeo, Cambodia	ខេត្តតាកែវ ប្រទេសកម្ពុជា	Samdech Ov High School	វិទ្យាល័យសម្តេចឪ	f	t	2026-08-22 14:27:40.586	2026-08-22 14:27:40.586	\N	\N	2024-10-01 05:00:00	\N	\N	f	2	\N
27	lower-secondary-education-mt4h58k9	EDUCATION	Lower Secondary Education	ការសិក្សាថ្នាក់អនុវិទ្យាល័យ	Completed lower secondary education at Ang Kdei Secondary School from 2018 to 2021.	បានបញ្ចប់ការសិក្សាថ្នាក់អនុវិទ្យាល័យនៅអនុវិទ្យាល័យអង្គក្តី ចាប់ពីឆ្នាំ 2018 ដល់ឆ្នាំ 2021។	Studied general secondary education subjects and developed foundational academic, communication, teamwork, and problem-solving skills.	បានសិក្សាមុខវិជ្ជាទូទៅនៅកម្រិតអនុវិទ្យាល័យ និងអភិវឌ្ឍមូលដ្ឋានចំណេះដឹង ជំនាញទំនាក់ទំនង ការងារជាក្រុម និងការដោះស្រាយបញ្ហា។	2018-12-01 05:00:00	MONTH	\N	Takeo, Cambodia	ខេត្តតាកែវ ប្រទេសកម្ពុជា	Ang Kdei Secondary School	អនុវិទ្យាល័យអង្គក្តី	f	t	2026-08-22 14:29:20.41	2026-08-22 14:29:20.41	\N	\N	2021-08-01 05:00:00	\N	\N	f	3	\N
19	generative-ai-for-business-mt2yof6h	CERTIFICATE	Generative AI for Business	Generative AI for Business	\N	\N	\N	\N	2026-08-21 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/certificates/1787317476567-dc14e968.png	\N	\N	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	t	t	2026-08-21 13:04:36.575	2026-09-06 13:28:09.203	\N	\N	\N	\N	\N	f	0	\N
20	introduction-to-ai-agents-mt2ypz80	CERTIFICATE	Introduction to AI Agents	Introduction to AI Agents	\N	\N	\N	\N	2026-06-24 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/certificates/1787317549198-46e07f7e.png	\N	\N	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	f	t	2026-08-21 13:05:49.202	2026-09-06 13:28:09.749	\N	\N	\N	\N	\N	f	0	\N
23	basic-application-development-mt304q3b	CERTIFICATE	Basic Application Development	Basic Application Development	\N	\N	\N	\N	2026-08-21 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/certificates/1787319916821-79bec2d8.png	\N	\N	\N	\N	t	t	2026-08-21 13:45:16.833	2026-09-06 13:28:10.023	\N	\N	\N	\N	\N	f	0	\N
24	basic-application-development-course-2-mt306j99	CERTIFICATE	Basic Application Development Course 2	Basic Application Development Course 2	\N	\N	\N	\N	2026-08-21 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/certificates/1787320001275-f3830108.png	\N	\N	\N	\N	t	t	2026-08-21 13:46:41.278	2026-09-06 13:28:10.324	\N	\N	\N	\N	\N	f	0	\N
28	primary-education-mt4h6ray	EDUCATION	Primary Education	ការសិក្សាថ្នាក់បឋមសិក្សា	Completed primary education at Tuol Ta Mong Primary School from 2012 to 2018.	បានបញ្ចប់ការសិក្សាថ្នាក់បឋមសិក្សានៅបឋមសិក្សាទួលតាម៉ោង ចាប់ពីឆ្នាំ 2012 ដល់ឆ្នាំ 2018។	Completed primary education and built fundamental skills in reading, writing, mathematics, communication, and general knowledge.	បានបញ្ចប់ការសិក្សាកម្រិតបឋមសិក្សា និងទទួលបានមូលដ្ឋានចំណេះដឹងលើការអាន ការសរសេរ គណិតវិទ្យា ការទំនាក់ទំនង និងចំណេះដឹងទូទៅ។	2012-12-01 05:00:00	MONTH	\N	Takeo, Cambodia	ខេត្តតាកែវ ប្រទេសកម្ពុជា	Tuol Ta Mong Primary School	បឋមសិក្សាទួលតាម៉ោង	f	t	2026-08-22 14:30:31.354	2026-08-22 14:30:31.354	\N	\N	2018-08-01 05:00:00	\N	\N	f	4	\N
29	ai-machine-learning-instructor-mt4hxpz9	TEACHING	AI & Machine Learning Instructor	គ្រូបង្រៀន AI និង Machine Learning	Teaching practical AI and Computer Vision concepts through dataset preparation, object detection, model training, evaluation, and real-time OpenCV applications.	បង្រៀនអំពី AI និង Computer Vision តាមរយៈការអនុវត្តជាក់ស្តែង រួមមាន Dataset Preparation, Object Detection, Model Training, Evaluation និងការបង្កើត Real-time Application ជាមួយ OpenCV។	Designed and delivered hands-on lessons that guide students from collecting and preparing datasets to training YOLO models and testing object detection with cameras and video. Students also learn Precision, Recall, mAP, Confusion Matrix, Data Augmentation, and model improvement.	រៀបចំ និងបង្រៀនមេរៀនអនុវត្តដែលណែនាំសិស្សចាប់ពីការប្រមូល និងរៀបចំ Dataset រហូតដល់ការបណ្តុះ YOLO Model និងសាកល្បង Object Detection ជាមួយ Camera និង Video។ សិស្សក៏បានសិក្សាអំពី Precision, Recall, mAP, Confusion Matrix, Data Augmentation និង Model Improvement ផងដែរ។	2026-05-01 05:00:00	MONTH	\N	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	f	t	2026-08-22 14:51:29.359	2026-08-22 14:51:29.359	\N	\N	2026-07-01 05:00:00	\N	\N	f	1	Python, OpenCV, YOLO, Machine Learning, Computer Vision
30	computer-vision-workshop-mentor-mt4i0iak	TEACHING	Computer Vision Workshop Mentor	អ្នកណែនាំ Workshop ផ្នែក Computer Vision	Mentored students in a practical Computer Vision workshop focused on collecting images, annotating datasets, training YOLO models, and testing real-time object detection.	ណែនាំសិស្សក្នុង Workshop ផ្នែក Computer Vision ដោយផ្តោតលើការប្រមូលរូបភាព, Dataset Annotation, YOLO Model Training និងការសាកល្បង Real-time Object Detection។	Supported students during hands-on activities including webcam image collection, bounding-box annotation, train/validation/test splitting, YOLO training, and OpenCV-based detection. Helped students understand how dataset quality affects model performance.	ជួយណែនាំសិស្សក្នុងការអនុវត្តដូចជា Webcam Image Collection, Bounding-box Annotation, ការបែងចែក Train/Validation/Test, YOLO Training និងការធ្វើ Detection ជាមួយ OpenCV។ ក៏បានពន្យល់ពីរបៀបដែល Dataset Quality មានឥទ្ធិពលលើ Model Performance។\r\n\r\nOrder\r\n2	2026-01-01 05:00:00	MONTH	\N	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	AI & Robotics Training Program	កម្មវិធីបណ្តុះបណ្តាល AI និង Robotics	f	t	2026-08-22 14:53:39.357	2026-08-22 14:53:39.357	\N	\N	2026-07-01 05:00:00	\N	\N	f	2	Python, OpenCV, YOLOv8, Dataset Annotation, Object Detection
31	web-development-mentor-mt4i1z3f	TEACHING	Web Development Mentor	អ្នកណែនាំផ្នែក Web Development	Mentoring students in building modern web applications, from frontend UI development to API integration and project structure.	ណែនាំសិស្សក្នុងការអភិវឌ្ឍ Modern Web Application ចាប់ពី Frontend UI Development រហូតដល់ API Integration និង Project Structure។	Help students understand responsive UI design, component-based development, frontend-backend integration, REST API usage, debugging, and clean project organization. Provide guidance during project development and problem solving.	ជួយសិស្សយល់អំពី Responsive UI Design, Component-based Development, Frontend-Backend Integration, REST API Usage, Debugging និងការរៀបចំ Project ឱ្យមានរបៀបរៀបរយ។ ផ្តល់ការណែនាំក្នុងអំឡុងពេលអភិវឌ្ឍគម្រោង និងដោះស្រាយបញ្ហា។	2025-05-01 05:00:00	MONTH	\N	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	Student Project Mentoring	កម្មវិធីណែនាំគម្រោងនិស្សិត	f	t	2026-08-22 14:54:47.788	2026-08-22 14:54:47.788	\N	\N	2025-12-01 05:00:00	\N	\N	f	3	HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, REST API
32	programming-fundamentals-tutor-mt4i3rcw	TEACHING	Programming Fundamentals Tutor	អ្នកបង្រៀនមូលដ្ឋានគ្រឹះ Programming	Introduced beginners to programming fundamentals and logical problem solving using Python.	បង្រៀនអ្នកចាប់ផ្តើមអំពីមូលដ្ឋានគ្រឹះ Programming និង Logical Problem Solving ដោយប្រើ Python។	Covered variables, data types, conditions, loops, functions, basic debugging, and small programming exercises. Focused on helping students build confidence in computational thinking and writing simple programs independently.	បង្រៀនអំពី Variables, Data Types, Conditions, Loops, Functions, Basic Debugging និងលំហាត់ Programming តូចៗ។ ផ្តោតលើការជួយសិស្សអភិវឌ្ឍ Computational Thinking និងអាចសរសេរកម្មវិធីសាមញ្ញដោយខ្លួនឯង។	2026-01-01 05:00:00	MONTH	\N	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	Beginner Programming Sessions	វគ្គបង្រៀន Programming សម្រាប់អ្នកចាប់ផ្តើម	f	t	2026-08-22 14:56:11.072	2026-08-22 14:56:11.072	\N	\N	2026-04-01 05:00:00	\N	\N	f	4	Python, Variables, Conditions, Loops, Functions, Problem Solving
39	thnal-brorchum-event-management-system-mtcgzn55	ACHIEVEMENT	Thnal BrorChum Event Management System	Basic Application Development	\N	\N	\N	\N	2026-08-20 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/achievements/achievement-1788678790092-d1837cd0.png	\N	\N	\N	\N	t	t	2026-08-28 04:47:08.783	2026-09-06 07:13:11.497	\N	\N	\N	\N	\N	f	0	\N
35	best-project-award-mt6t900p	ACHIEVEMENT	Best Project Award	ពានរង្វាន់គម្រោងឆ្នើម	Recognized for developing an innovative and practical technology project.	ទទួលបានការទទួលស្គាល់ចំពោះការអភិវឌ្ឍគម្រោងបច្ចេកវិទ្យាដែលមានភាពច្នៃប្រឌិត និងអាចប្រើប្រាស់បានជាក់ស្តែង។	Awarded for demonstrating strong technical implementation, problem-solving, teamwork and presentation through a practical software project.	ទទួលបានពានរង្វាន់ដោយសារការអនុវត្តបច្ចេកទេស ការដោះស្រាយបញ្ហា ការងារជាក្រុម និងការបង្ហាញគម្រោងបានល្អ។	2026-08-14 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/achievements/1787550223703-6c0cefb6.png	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	t	t	2026-08-24 05:43:43.712	2026-09-06 13:28:11.136	\N	\N	\N	https://example.com/achievement-1	\N	f	1	\N
36	1st-place-ai-innovation-challenge-mt6tb0gm	ACHIEVEMENT	1st Place — AI Innovation Challenge	ជ័យលាភីលេខ១ — ការប្រកួតប្រជែងនវានុវត្តន៍ AI	Achieved first place for presenting an AI-based solution to a practical problem.	ទទួលបានជ័យលាភីលេខ១ សម្រាប់ការបង្ហាញដំណោះស្រាយដែលប្រើ AI ដើម្បីដោះស្រាយបញ្ហាជាក់ស្តែង។	Designed and demonstrated an AI application using computer vision and machine learning concepts.	\N	2026-02-07 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/achievements/1787550317588-e20fcca1.png	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	Technology Innovation Program	កម្មវិធីនវានុវត្តន៍បច្ចេកវិទ្យា	t	t	2026-08-24 05:45:17.591	2026-09-06 13:28:11.386	\N	\N	\N	https://example.com/achievement-2	\N	f	2	\N
38	programming-competition-finalist-mt6tefo8	ACHIEVEMENT	Programming Competition Finalist	បេក្ខជនវគ្គផ្តាច់ព្រ័ត្រការប្រកួត Programming	Reached the final stage of a programming competition through problem-solving and coding challenges.	បានឈានដល់វគ្គផ្តាច់ព្រ័ត្រនៃការប្រកួត Programming តាមរយៈការដោះស្រាយបញ្ហា និង Coding Challenge។	\N	\N	2025-07-10 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/achievements/1787550477270-9c4967ca.png	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	University Technology Competition	ការប្រកួតបច្ចេកវិទ្យាសាកលវិទ្យាល័យ	t	t	2026-08-24 05:47:57.273	2026-09-06 13:28:11.655	\N	\N	\N	\N	\N	f	4	\N
37	outstanding-student-recognition-mt6tct7x	ACHIEVEMENT	Outstanding Student Recognition	ការទទួលស្គាល់និស្សិតឆ្នើម	Recognized for academic commitment, active participation and continuous learning.	ទទួលបានការទទួលស្គាល់ចំពោះការខិតខំប្រឹងប្រែងក្នុងការសិក្សា ការចូលរួមសកម្ម និងការរៀនសូត្រជាបន្តបន្ទាប់។	\N	\N	2026-01-20 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/achievements/1787550401513-4286ca56.png	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	National University of Management	\N	t	t	2026-08-24 05:46:41.519	2026-09-06 13:28:12.661	\N	\N	\N	\N	\N	f	0	\N
41	screenshot-2026-09-06-134131-mtpgnopf-0	PHOTO	Screenshot 2026 09 06 134131	\N	\N	\N	\N	\N	2026-09-03 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/gallery/gallery-1788677929611-dc4a2850.png	\N	\N	\N	\N	f	t	2026-09-06 06:58:51.234	2026-09-06 06:58:51.234	\N	\N	\N	\N	\N	f	0	\N
1	ai-learner-mt1cn9m9	EVENT	AI & Computer Vision Workshop	សិក្ខាសាលា AI និង Computer Vision	A practical workshop introducing students to AI, YOLO and computer vision.	សិក្ខាសាលាអនុវត្តដែលណែនាំនិស្សិតអំពី AI, YOLO និង Computer Vision។	I organized and delivered a practical AI and computer vision workshop covering dataset preparation, YOLO object detection, OpenCV and real-time camera testing.	ខ្ញុំបានរៀបចំ និងបង្រៀនសិក្ខាសាលាអនុវត្តអំពី AI និង Computer Vision ដែលរួមមានការរៀបចំ Dataset ការប្រើ YOLO សម្រាប់ Object Detection ការប្រើ OpenCV និងការសាកល្បងតាមកាមេរ៉ាជាក់ស្តែង។	2026-08-01 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/activities/1787220004974-e6954f26.jpg	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	t	t	2026-08-20 10:00:04.983	2026-09-06 13:27:56.949	\N	\N	2026-08-01 05:00:00	\N	\N	f	0	\N
2	thnal-brorchum-event-management-system-mt1cyh0m	PROJECT	Thnal BrorChum	ប្រព័ន្ធគ្រប់គ្រងព្រឹត្តិការណ៍ Thnal BrorChum	A full-stack university event management platform for event creation, room booking, invitations, attendance and media management.	ប្រព័ន្ធ Full-Stack សម្រាប់គ្រប់គ្រងព្រឹត្តិការណ៍សាកលវិទ្យាល័យ ដូចជាការបង្កើតព្រឹត្តិការណ៍ កក់បន្ទប់ អញ្ជើញអ្នកចូលរួម វត្តមាន និងមេឌៀ។	This project manages the complete university event lifecycle. It includes role-based dashboards, room approval, email and Telegram invitations, QR attendance, media uploads, reports and multilingual support.	គម្រោងនេះគ្រប់គ្រងដំណើរការព្រឹត្តិការណ៍សាកលវិទ្យាល័យទាំងមូល។ វាមាន Dashboard តាមតួនាទី ការអនុម័តបន្ទប់ ការអញ្ជើញតាម Email និង Telegram ការចុះវត្តមានតាម QR ការបញ្ចូលមេឌៀ របាយការណ៍ និងការគាំទ្រភាសាច្រើន។	2026-06-21 05:00:00	DAY	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/projects/1787220527780-352e57d5.jpg	\N	\N	National University of Management	សាកលវិទ្យាល័យជាតិគ្រប់គ្រង	t	t	2026-08-20 10:08:47.783	2026-09-06 13:28:13.173	\N	https://example.com/demo	2026-08-30 05:00:00	https://example.com	https://github.com/example/tnal-brorchum	t	0	Next.js, TypeScript, Tailwind CSS, Spring Boot, PostgreSQL, Docker
\.


--
-- Data for Name: activity_media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_media (id, "activityId", "fileUrl", type, "captionEn", "captionKm", "sortOrder", "createdAt") FROM stdin;
1	2	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/project-media/1788625842319-3d782dbe.png	IMAGE	\N	\N	0	2026-09-05 16:30:42.364
2	2	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/project-media/1788625842323-686c45ff.png	IMAGE	\N	\N	1	2026-09-05 16:30:42.364
3	2	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/project-media/1788625842326-ceee9419.png	IMAGE	\N	\N	2	2026-09-05 16:30:42.364
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_users (id, name, email, "passwordHash", "isActive", "createdAt", "updatedAt") FROM stdin;
1	Chantha	tha754688@gmail.com	$2b$12$fCFP9m07/UMC7VChzH2LjemRHOJWQ.uR7n6eBhJP4y5CLVkPuRjKu	t	2026-08-17 14:47:19.224	2026-08-18 01:35:47.39
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, "activityId", name, email, message, "isApproved", "createdAt", "updatedAt") FROM stdin;
1	2	chay chantha	tha754688@gmail.com	hi	t	2026-08-23 13:30:56.465	2026-08-23 13:31:13.487
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, subject, message, status, "createdAt", "updatedAt", "repliedAt", "replyMessage", "sourceIpHash") FROM stdin;
1	Hong Lyhour	tha754688@gmail.com	Contact	I want to hired you to join our team	READ	2026-08-23 13:33:47.745	2026-08-23 13:34:31.302	\N	\N	\N
3	sgd	yuuukisa1122@gmail.com	Contact for ask information	dafjhgfdsghg	ARCHIVED	2026-08-23 14:02:39.435	2026-08-23 14:08:51.308	\N	\N	1bb071b1499266ea163608553a76f98bcfaf2e17b9cd24c3d43740769b0f44ce
4	yuukisa	yuuukisa1122@gmail.com	Contact for ask information	hhgfdsg	ARCHIVED	2026-08-23 14:02:57.208	2026-08-23 14:08:55.635	\N	\N	1bb071b1499266ea163608553a76f98bcfaf2e17b9cd24c3d43740769b0f44ce
2	yuukisa	yuuukisa1122@gmail.com	Contact for ask information	I want to invited you	REPLIED	2026-08-23 13:58:55.944	2026-08-23 14:13:17.384	2026-08-23 14:13:17.383	yes it good	1bb071b1499266ea163608553a76f98bcfaf2e17b9cd24c3d43740769b0f44ce
5	yuuu	yuuki1@gmail.com	Contact	hi i'm yuuuuuuuuuuuu	NEW	2026-08-23 14:13:59.819	2026-08-23 14:13:59.819	\N	\N	1bb071b1499266ea163608553a76f98bcfaf2e17b9cd24c3d43740769b0f44ce
6	chay chantha	tha754688@gmail.com	Contact for ask information	hi hi hi hi	NEW	2026-09-06 13:04:43.632	2026-09-06 13:04:43.632	\N	\N	1bb071b1499266ea163608553a76f98bcfaf2e17b9cd24c3d43740769b0f44ce
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.likes (id, "activityId", "visitorKey", "createdAt") FROM stdin;
7	2	cf24ef23-39b4-483d-a282-644205714cec	2026-08-24 02:30:00.616
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.login_attempts (id, "keyHash", "createdAt") FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, "fullName", "headlineEn", "headlineKm", "bioEn", "bioKm", email, phone, telegram, github, linkedin, "locationEn", "locationKm", "profileImage", "cvFile", "createdAt", "updatedAt", "profileKey", "badgeImage", "currentFocusEn", "currentFocusKm", "currentRoleEn", "currentRoleKm", facebook, instagram, "shortBioEn", "shortBioKm", "yearsExperience", youtube, "githubContributionImage", "githubUsername", "showTeachingSection") FROM stdin;
1	Chay Chantha	Full-Stack Developer • AI Enthusiast • Educator	អ្នកអភិវឌ្ឍន៍ Full-Stack • ចាប់អារម្មណ៍លើ AI • អ្នកអប់រំ	I am a full-stack developer with an interest in artificial intelligence, web development, and practical technology solutions. I enjoy building complete systems from frontend interfaces to backend APIs and databases. I also enjoy teaching and sharing practical knowledge about AI, computer vision, and software development.	ខ្ញុំជាអ្នកអភិវឌ្ឍន៍ Full-Stack ដែលមានចំណាប់អារម្មណ៍លើបញ្ញាសិប្បនិម្មិត ការអភិវឌ្ឍគេហទំព័រ និងដំណោះស្រាយបច្ចេកវិទ្យាដែលអាចប្រើប្រាស់បានជាក់ស្តែង។ ខ្ញុំចូលចិត្តបង្កើតប្រព័ន្ធពេញលេញចាប់ពី Frontend, Backend API រហូតដល់ Database។ ខ្ញុំក៏ចូលចិត្តបង្រៀន និងចែករំលែកចំណេះដឹងអំពី AI, Computer Vision និង Software Development ផងដែរ។	tha754688@gmail.com	0975915907	https://t.me/chaychantha55	https://github.com/chantha1122	https://www.linkedin.com/in/chay-chantha	Phnom Penh, Cambodia	រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/profile/profile-1787029002032-4b2650a7.png	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/cv/cv-1787029666754-dc08a508.pdf	2026-08-17 15:11:16.112	2026-09-06 13:27:56.497	main	\N	Building full-stack portfolio and event management systems, developing practical AI projects with YOLO and OpenCV, and improving my skills in modern web development.	កំពុងផ្តោតលើការបង្កើតប្រព័ន្ធ Full-Stack សម្រាប់ Portfolio និង Event Management ការអភិវឌ្ឍគម្រោង AI ជាក់ស្តែងដោយប្រើ YOLO និង OpenCV និងការពង្រឹងជំនាញអភិវឌ្ឍគេហទំព័រទំនើប។	Full-Stack Developer & AI Instructor	អ្នកអភិវឌ្ឍន៍ Full-Stack និងគ្រូបង្រៀន AI	https://www.facebook.com/chantha	https://www.instagram.com/chantha	Full-stack developer and AI enthusiast focused on building practical web systems and computer vision applications.	អ្នកអភិវឌ្ឍន៍ Full-Stack និងចាប់អារម្មណ៍លើ AI ដោយផ្តោតលើការបង្កើតប្រព័ន្ធវេប និងកម្មវិធី Computer Vision ដែលអាចប្រើប្រាស់បានជាក់ស្តែង។	1	https://www.youtube.com/@chantha	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/github/github-contributions-1787232549048-ff17de71-d490-4244-bb7e-9309e1730590.png	\N	f
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills (id, name, "categoryEn", "categoryKm", level, icon, published, "sortOrder", "createdAt", "updatedAt", "isCore") FROM stdin;
5	REST API Development	\N	\N	ADVANCED	\N	t	0	2026-08-20 14:56:49.077	2026-08-20 14:56:49.077	f
7	Docker Deployment	\N	\N	INTERMEDIATE	\N	t	0	2026-08-20 14:57:28.748	2026-08-20 14:57:28.748	f
9	Problem Solving	\N	\N	ADVANCED	\N	t	0	2026-08-20 14:57:46.715	2026-08-20 14:57:46.715	f
10	Data Processing	\N	\N	INTERMEDIATE	\N	t	0	2026-08-20 14:57:55.379	2026-08-20 14:57:55.379	f
11	Responsive Design	\N	\N	ADVANCED	\N	t	0	2026-08-20 15:19:12.768	2026-08-20 15:19:12.768	f
12	Authentication	\N	\N	ADVANCED	\N	t	0	2026-08-20 15:19:35.689	2026-08-20 15:19:35.689	f
13	Cloud & Deployment	\N	\N	INTERMEDIATE	\N	t	0	2026-08-20 15:33:07.807	2026-08-20 15:33:07.807	f
3	Backend Development	Backend	ការអភិវឌ្ឍផ្នែកខាងក្រោយ	ADVANCED	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/skill-1787236284320-eea77f31.png	t	0	2026-08-20 13:37:12.655	2026-09-06 13:28:15.695	f
2	Frontend Development	Frontend	ការអភិវឌ្ឍផ្នែកខាងមុខ	ADVANCED	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/skill-1787236359958-711f75e1.png	t	0	2026-08-20 13:36:22.231	2026-09-06 13:28:15.904	f
1	Full-Stack Development	Development	ការអភិវឌ្ឍកម្មវិធី	ADVANCED	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/skill-1787236353824-930713f5.png	t	1	2026-08-20 13:35:44.82	2026-09-06 13:28:16.133	t
8	Git & Version Control	\N	\N	ADVANCED	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/skill-1787238119806-c4aba85b.webp	t	2	2026-08-20 14:57:37.39	2026-09-06 13:28:16.558	t
6	UI/UX Implementation	\N	\N	ADVANCED	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/skill-1787238126127-9e110ca8.png	t	3	2026-08-20 14:57:18.628	2026-09-06 13:28:17.251	t
4	Database Design	Database	ការរចនាមូលដ្ឋានទិន្នន័យ	ADVANCED	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/skill-1787236347740-572e6246.png	t	4	2026-08-20 13:37:38.95	2026-09-06 13:28:17.533	t
\.


--
-- Data for Name: tools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tools (id, name, category, icon, url, published, "sortOrder", "createdAt", "updatedAt") FROM stdin;
1	Next.js	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787236096647-7bca17c4.webp	\N	t	0	2026-08-20 13:38:03.633	2026-09-06 13:28:17.76
3	TypeScript	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787236104725-dfb4c398.webp	\N	t	0	2026-08-20 13:38:36.28	2026-09-06 13:28:18.033
2	React	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787236114074-ce7040e7.webp	\N	t	0	2026-08-20 13:38:14.034	2026-09-06 13:28:18.324
4	Tailwind CSS	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787236120478-e6192ff9.webp	\N	t	0	2026-08-20 13:38:51.746	2026-09-06 13:28:18.55
5	Java	BACKEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238449373-d42391f3.png	\N	t	0	2026-08-20 15:07:29.376	2026-09-06 13:28:18.94
6	Spring Boot	BACKEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238468928-26ecbf26.webp	\N	t	0	2026-08-20 15:07:48.929	2026-09-06 13:28:19.218
7	PostgreSQL	DATABASE	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238487044-382d9867.webp	\N	t	0	2026-08-20 15:08:07.046	2026-09-06 13:28:19.464
8	Prisma	DATABASE	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238501371-dadaca05.png	\N	t	0	2026-08-20 15:08:21.373	2026-09-06 13:28:19.681
9	Vs Code	DEVELOPMENT	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238625211-4bdb60da.png	\N	t	0	2026-08-20 15:10:25.213	2026-09-06 13:28:20.095
10	Swagger	DEVELOPMENT	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238643297-ac459a18.jpg	\N	t	0	2026-08-20 15:10:43.299	2026-09-06 13:28:20.322
11	Postman	DEVELOPMENT	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238653554-8499fa83.jpg	\N	t	0	2026-08-20 15:10:53.556	2026-09-06 13:28:20.605
12	Git	DEVELOPMENT	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238660823-1df18fe6.png	\N	t	0	2026-08-20 15:11:00.826	2026-09-06 13:28:20.822
13	intellij	DEVELOPMENT	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238698185-7d1d2212.jpg	\N	t	0	2026-08-20 15:11:38.187	2026-09-06 13:28:21.058
14	javaScript	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238773556-006773dd.webp	\N	t	0	2026-08-20 15:12:53.559	2026-09-06 13:28:21.316
15	HTML	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238796160-e70fd42b.png	\N	t	0	2026-08-20 15:13:16.162	2026-09-06 13:28:21.553
16	CSS	FRONTEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238824755-d7603998.png	\N	t	0	2026-08-20 15:13:44.757	2026-09-06 13:28:21.859
17	JWT	BACKEND	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238884021-bcc94890.png	\N	t	0	2026-08-20 15:14:44.023	2026-09-06 13:28:22.094
18	Figma	DESIGN	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787238930323-98c8d118.png	\N	t	0	2026-08-20 15:15:30.326	2026-09-06 13:28:22.33
19	Draw.io	DATABASE	https://iixffnlkidhyhjzlngid.supabase.co/storage/v1/object/public/portfolio/skills-tools/tool-1787239007145-3b7c5d99.png	\N	t	0	2026-08-20 15:16:47.147	2026-09-06 13:28:22.558
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activities_id_seq', 41, true);


--
-- Name: activity_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_media_id_seq', 3, true);


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 3, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 6, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.likes_id_seq', 7, true);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.login_attempts_id_seq', 5, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.profiles_id_seq', 32, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skills_id_seq', 13, true);


--
-- Name: tools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tools_id_seq', 19, true);


--
-- PostgreSQL database dump complete
--

\unrestrict WPSZAnH5RAaJaMaUl1tRgeEbhMSEK0DPwuEgLU4NzhBAWJgYwJKmNBpVOuANUGV

