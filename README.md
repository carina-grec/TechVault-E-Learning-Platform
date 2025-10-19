# TechVault 🚀

An interactive e-learning platform designed to teach kids the fundamentals of coding and technology through a fun, gamified approach.

## 👥 Team Members

* Barabas Catalin-Gabriel
* Dan Maria-Andrada
* Grec Carina-Gabriela

---

## 📖 About The Project

**TechVault** makes learning to code fun and accessible for young learners. With a gamified approach, it helps children develop critical problem-solving and logical thinking skills.

The platform includes a variety of hands-on coding challenges, allowing children to build real-world projects while learning at their own pace. A dedicated admin panel allows for managing user accounts, updating lessons, and tracking progress, ensuring the platform evolves with the needs of both students and educators.

---

### Target users

* **Learners:** 8–14 y/o students starting with code and computational thinking.
* **Guardians/Teachers:** Monitor progress, assign quests, and review submissions.
* **Admins/Content Authors:** Curate content, manage users, and evolve the curriculum.

## ✨ Core Features

* **User Authentication & Roles:** Student, Guardian/Teacher, Admin (`Spring Security`).
* **Gamified Lessons:** Vaults → Levels → Quests; XP, coins, badges, streaks.
* **Progress Profiles:** Track XP, badges, completed quests, mastery per topic.
* **Adaptive Difficulty:** Strategy-driven progression (see Design Patterns).
* **Lesson Authoring:** Admins create/edit lessons, quizzes, code challenges.
* **Code Challenges:** Embedded coding playground (`JS`/`Python` snippets) with tests.
* **Feedback Engine:** Automatic grading, hints, and solution explanations.
* **Content Moderation:** Review flags, safe-content filters.
* **Responsive UI:** `React` + `Bootstrap`, accessible and mobile-friendly.
* **Containerized Deployment:** `Docker`-based for parity across envs.

---

## 🛠️ Tech Stack

This project is built with a modern, robust tech stack:

* **Backend:** [Spring Boot](https://spring.io/projects/spring-boot) (Java)
* **Frontend:** [React.js](https://reactjs.org/) (JavaScript)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **Authentication:** [Spring Security](https://spring.io/projects/spring-security)
* **Deployment:** [Docker](https://www.docker.com/)

---

## 🏗️ Design Patterns

This project will utilize several key design patterns to ensure a clean, scalable, and maintainable architecture.

### 1. Factory Method Pattern (Creational)

* **Project-Specific Problem:** The "Admin panel for managing content" needs to create various types of "coding lessons" and "challenges." These are not all uniform; we might have `MultipleChoiceChallenge`, `CodeBlockChallenge`, `VideoTutorialLesson`, and `DragAndDropQuiz`. The admin's service layer shouldn't need to know the specific constructor for every new lesson type we invent.

* **Our Solution:** We will use the **Factory Method Pattern**. We'll define a common `ILesson` interface (or abstract class) that all lesson types implement. Then, we'll create a `LessonFactory` that has a method like `createLesson(String lessonType, LessonData data)`. The admin panel's controller will receive a request from the React frontend, and it will simply pass the `lessonType` (e.g., "QUIZ") to this factory. The factory will handle the `new MultipleChoiceChallenge(...)` or `new CodeBlockChallenge(...)` logic internally.

* **Advantage Over Simpler Alternatives:** A simpler alternative would be a large `switch` statement or `if-else` block inside the `AdminService` class. This is problematic because **it violates the Open/Closed Principle**. Every time we add a new lesson type (e.g., `TypingSpeedChallenge`), we would have to modify the `AdminService` class, increasing the risk of bugs. The Factory Method decouples the creation logic from the service. We can add new lesson types just by adding a new class and updating the factory, without ever touching the service layer that *uses* it.

### 2. Strategy Pattern (Behavioral)

* **Project-Specific Problem:** The "gamified approach" implies that "progress tracking" isn't just about completion. We need different ways to calculate scores or award points. For example, a `CodeBlockChallenge` might be scored based on **code correctness and efficiency**, while a `Quiz` is scored based on **accuracy and speed**. A simple "pass/fail" isn't enough.

* **Our Solution:** We will use the **Strategy Pattern** to define interchangeable scoring algorithms. We'll create a `ScoringStrategy` interface with an `execute(UserAttempt attempt)` method. We will then have concrete implementations like `AccuracyScoringStrategy`, `SpeedBonusScoringStrategy`, and `CodeEfficiencyStrategy`. When a user submits a challenge, the `ProgressTrackingService` will select the *appropriate* strategy for that challenge type and use it to calculate the score.

* **Advantage Over Simpler Alternatives:** The simple alternative is to put all scoring logic into one massive method within the `ProgressTrackingService` (e.g., `if (challenge.type == 'QUIZ') { ... } else if (challenge.type == 'CODE') { ... }`). This makes the service class bloated, hard to test, and difficult to maintain. The Strategy Pattern isolates each scoring algorithm into its own class. This makes them **independently testable**, **reusable**, and **swappable at runtime**. We can add new, complex scoring rules without breaking existing ones.

### 3. Observer Pattern (Behavioral)

* **Project-Specific Problem:** When a user completes a lesson, several different parts of the application need to react. For example, upon lesson completion, we must:
    1.  Update the user's total points in their `UserProfile`.
    2.  Check if this completion unlocks a new `Badge` or `Achievement`.
    3.  Unlock the next lesson in the `Course` module.
    4.  Log the completion for the admin's `ProgressTracking` dashboard.

* **Our Solution:** We will use the **Observer Pattern**. The `LessonCompletionService` will act as the "Subject" (or "Publisher"). Other services, like `ProfileService`, `AchievementService`, and `CourseService` will act as "Observers" (or "Subscribers"). When a user completes a lesson, the `LessonCompletionService` will simply process the completion and then "notify" all its registered observers. Each observer will then perform its own independent logic in response. Spring Boot has built-in support for this via `ApplicationEventPublisher`.

* **Advantage Over Simpler Alternatives:** The simple (and highly coupled) alternative is for the `LessonCompletionService` to *know about and directly call* every other service. The code would look like: `profileService.addPoints(points); achievementService.checkAndAwardBadges(user); courseService.unlockNextLesson(user, lessonId);`. This is a maintenance nightmare. If we add a new "send email notification" feature, we have to modify the `LessonCompletionService`. The Observer Pattern **decouples** these components entirely. The `LessonCompletionService` has *no idea* what the `AchievementService` does; it just sends a generic "lesson completed" event. This makes the system incredibly extensible and follows the **Single Responsibility Principle**.

### 4. Facade Pattern (Structural)

* **Project-Specific Problem:** The "User registration and authentication" flow involves multiple services. When a new user signs up from the React frontend, the backend must:
    1.  Validate the input data (username, password).
    2.  Check if the username is already taken (`UserService`).
    3.  Encode the password (`Spring Security`'s `PasswordEncoder`).
    4.  Save the new user to the database (`UserRepository`).
    5.  Assign a default "STUDENT" role (`RoleService`).
    6.  Create an associated empty `UserProfile` (`ProfileService`).
    7.  Generate a JWT token for the new session (`JwtService`).

* **Our Solution:** We will use the **Facade Pattern**. We'll create an `AuthFacade` (or `AuthService`) that provides a single, simple method to the `AuthController`, such as `registerNewUser(RegistrationRequest dto)`. This method will, *internally*, coordinate all the complex steps listed above (calling `UserService`, `PasswordEncoder`, `ProfileService`, etc.). The `AuthController` itself remains clean and simple, only responsible for handling the HTTP request and response.

* **Advantage Over Simpler Alternatives:** The simpler alternative is to put all this orchestration logic *directly into the `AuthController`*. This makes the controller "fat," mixes web-layer concerns (like `@PostMapping` and `ResponseEntity`) with business-layer logic, and makes the registration workflow impossible to test without making a full HTTP request. The Facade Pattern provides a **clean API boundary** for the web layer, **encapsulates the complex workflow**, and makes the business logic **independently testable** with unit tests.


## 🚀 Deployment

This project is containerized using **Docker** for easy and consistent deployment.

### Goals

* Deliver an intuitive, safe, and fun environment for learning coding fundamentals.
* Provide adaptive challenges with clear feedback and gradual skill ramp-up.
* Offer robust progress tracking and reporting for guardians/teachers.
* Supply an admin panel for managing content, users, and platform operations.

## User Stories

### Students

* As a student, I can sign up and start a Vault with a tutorial that teaches basics.
* As a student, I earn XP and badges when I complete lessons and challenges.
* As a student, I can retry a failed challenge and receive hints.

### Guardians/Teachers

* As a teacher, I can view a dashboard of my students’ progress and assign Vaults.
* As a parent, I get weekly progress summaries and recommended next steps.

### Admins/Authors

* As an admin, I can create a new Vault, add lessons, and publish changes safely.
* As a moderator, I can review flagged content or comments and take action.

