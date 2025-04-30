import TodoApp from "@/todo-app";

// Sample data that would normally be passed as props
const sampleData = {
  targetDetails: [
    {
      id: "main",
      title: "Main",
      targets: [
        {
          id: "inbox",
          title: "Inbox",
          icon: "inbox",
          count: 2,
        },
        {
          id: "today",
          title: "Today",
          icon: "today",
          count: 8,
          highlighted: true,
        },
        {
          id: "upcoming",
          title: "Upcoming",
          icon: "upcoming",
        },
        {
          id: "anytime",
          title: "Anytime",
          icon: "anytime",
        },
        {
          id: "someday",
          title: "Someday",
          icon: "someday",
        },
        {
          id: "logbook",
          title: "Logbook",
          icon: "logbook",
        },
        {
          id: "trash",
          title: "Trash",
          icon: "trash",
        },
      ],
    },
    {
      id: "family",
      title: "Family",
      targets: [
        {
          id: "vacation-rome",
          title: "Vacation in Rome",
          icon: "target",
        },
        {
          id: "buy-new-car",
          title: "Buy a New Car",
          icon: "target",
        },
        {
          id: "throw-party",
          title: "Throw Party for Eve",
          icon: "target",
        },
      ],
    },
    {
      id: "work",
      title: "Work",
      targets: [
        {
          id: "prepare-presentation",
          title: "Prepare Presentation",
          icon: "target",
          description:
            "Keep the talk and slides simple: what are the three things about this that everyone should remember?",
          sections: [
            {
              id: "slides",
              title: "Slides and notes",
              tasks: [
                {
                  id: "task1",
                  title: "Revise introduction",
                  completed: false,
                  hasAttachment: true,
                },
                {
                  id: "task2",
                  title: "Simplify slide layouts",
                  completed: false,
                },
                {
                  id: "task3",
                  title: "Review quarterly data with Olivia",
                  completed: false,
                  starred: true,
                },
                {
                  id: "task4",
                  title: "Print handouts for attendees",
                  completed: false,
                  date: "May 25",
                },
              ],
            },
            {
              id: "preparation",
              title: "Preparation",
              tasks: [
                {
                  id: "task5",
                  title: "Email John for presentation tips",
                  completed: false,
                },
                {
                  id: "task6",
                  title: "Check out book recommendations",
                  completed: false,
                  hasAttachment: true,
                },
                {
                  id: "task7",
                  title: "Time a full rehearsal",
                  completed: false,
                  important: true,
                },
                {
                  id: "task8",
                  title: "Do a practice run with Eric",
                  completed: false,
                },
                {
                  id: "task9",
                  title: "Confirm presentation time",
                  completed: false,
                  important: true,
                },
              ],
            },
          ],
        },
        {
          id: "onboard-james",
          title: "Onboard James",
          icon: "target",
        },
        {
          id: "attend-conference",
          title: "Attend Conference",
          icon: "target",
        },
        {
          id: "order-tshirts",
          title: "Order Team T-Shirts",
          icon: "target",
        },
      ],
    },
    {
      id: "hobbies",
      title: "Hobbies",
      targets: [
        {
          id: "learn-italian",
          title: "Learn Basic Italian",
          icon: "target",
        },
        {
          id: "run-marathon",
          title: "Run a Marathon",
          icon: "target",
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main>
      <TodoApp targetDetails={sampleData.targetDetails} />
    </main>
  );
}
