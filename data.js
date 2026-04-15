const ESCAPE_ROOMS = [
  {
    id: 1,
    name: "The Keypad Keep",
    image: "images/door1.jpg",
    audio: "room1.mp3",
    buttonText: "GET US OUT OF HERE",
    required: 3,
    alt: "A clean gray industrial room with smooth concrete flooring, white walls, exposed ceiling pipes, bright overhead lighting, and a closed gray metal door centered on the far wall with a keypad lock beside it."
  },
  {
    id: 2,
    name: "The Paperstorm Office",
    image: "images/door2.jpg",
    audio: "room2.mp3",
    buttonText: "GET US OUT OF HERE",
    required: 3,
    alt: "The gray metal door now stands open into a larger room with a desk covered in scattered papers and an office chair in the foreground. Across the room is another closed gray door labeled STAIRS with keypad locks mounted nearby."
  },
  {
    id: 3,
    name: "The Climb of Consequence",
    image: "images/door3.jpg",
    audio: "room3.mp3",
    buttonText: "GET US OUT OF HERE",
    required: 4,
    alt: "A narrow indoor stairwell with white walls, gray handrails on both sides, striped caution markings on each stair edge, and a closed gray metal door at the top landing with a keypad lock."
  },
  {
    id: 4,
    name: "The Last Long Hall",
    image: "images/door4.jpg",
    audio: "room4.mp3",
    buttonText: "GET US OUT OF HERE",
    required: 3,
    alt: "The stairwell door now stands open at the top landing, revealing a long clean hallway with bright ceiling lights, white walls, gray flooring, and another closed gray door at the far end."
  },
  {
    id: 5,
    name: "The Foyer of Access",
    image: "images/door5.jpg",
    audio: "room5.mp3",
    buttonText: "GET US OUT OF HERE",
    required: 3,
    alt: "A warm residential foyer with wood flooring, a light area rug, beige walls, decorative trim, a side table with books and flowers, baskets near the wall, and a closed dark gray front door with keypad entry."
  },
  {
    id: 6,
    name: "The Voyage to Sunshine",
    image: "images/door6.jpg",
    audio: "room6.mp3",
    buttonText: "GET US OUT OF HERE",
    required: 4,
    alt: "The front door is now open, revealing a glass screen or storm door and a bright sunny outdoor view with green grass, trees, blue sky, and open fields beyond the threshold."
  }
];

const ESCAPE_QUESTIONS = [
  {
    id: 1,
    type: "defect",
    room: 1,
    question: "Why did a screen reader say 'image image image' when it encountered a photo?",
    acceptedKeywords: [
      "alt text",
      "alternative text",
      "image description",
      "description",
      "text alternative",
      "alt"
    ],
    hint: "Think about the short text a screen reader can announce for an image.",
    explanation: "Important images need a text alternative so people who cannot see the image still get the same essential meaning."
  },
  {
    id: 2,
    type: "ada_gaad",
    room: 1,
    question: "Define the acronym ADA.",
    acceptedKeywords: [
      "americans with disabilities act",
      "disabilities act"
    ],
    hint: "It is the name of a major United States civil rights law.",
    explanation: "ADA stands for Americans with Disabilities Act. It is a civil rights law often discussed alongside digital access obligations."
  },
  {
    id: 3,
    type: "defect",
    room: 1,
    question: "Only someone using the mouse can reach the main menu items on a page. Why?",
    acceptedKeywords: [
      "keyboard",
      "keyboard access",
      "mouse-dependent", "device-dependent", "keyboard accessibility",
      "screen reader support",
      "event listener for keyboard",
      "missing event listener", "keyboard navigation"
    ],
    hint: "Answer with the input method that should work without a mouse.",
    explanation: "Interactive content must be usable by keyboard alone. If menu links cannot be reached, keyboard access is broken."
  },
  {
    id: 4,
    type: "ada_gaad",
    room: 2,
    question: "Global Accessibility Awareness Day is meant for people with disabilities. True or false?",
    acceptedKeywords: [
     "for everyone",  "false", "it's for everyone"
    ],
    hint: "Think about who needs to know and the community digital barriers may shut out.",
    explanation: "GAAD focuses attention on digital access and inclusion for people with disabilities and on building better experiences for everyone."
  },
  {
    id: 5,
    type: "defect",
    room: 2,
    question: "When a dialog opens, the keyboard focus lands behind it on the page. Why?",
    acceptedKeywords: [
      "focus not trapped in the dialogue",
      "focus order",
      "focus",
      "incorrect focus order",
      "no focus management",
      "missing modal dialogue",
      "no aria-hidden true on main page content",
      "wrong focus order"
    ],
    hint: "The issue is about where keyboard attention moves next.",
    explanation: "Focus should move in a logical sequence. If it lands behind the dialog, users can lose context and control."
  },
  {
    id: 6,
    type: "ada_gaad",
    room: 2,
    question: "In what year did Global Accessibility Awareness Day begin?",
    acceptedKeywords: [
      "2012"
    ],
    hint: "A movie of the same name was released this year.",
    explanation: "GAAD began in 2012."
  },
  {
    id: 7,
    type: "defect",
    room: 3,
    question: "A text field only shows a disappearing placeholder. What is missing?",
    acceptedKeywords: [
      "label",
      "label for and id",
      "accessible name",
      "no programmatic association",
      "no visible label",
      "no aria label",
      "no aria labelledby",
      "form label",
      "field label"
    ],
    hint: "Think of the text that should identify the purpose of the field even before typing begins.",
    explanation: "Form controls need labels so users know what information belongs in the field and assistive technology can announce it reliably."
  },
  {
    id: 8,
    type: "ada_gaad",
    room: 3,
    question: "Pru's enterprise standard adheres to which conformance level of WCAG?",
    acceptedKeywords: [
      "2.2",
      "wcag 2.2",
      "wcag 2.2 aa",
      "wcag 2.2 level aa"
    ],
    hint: "When counting, it is relative to the second instance of a double digit of the same number.",
    explanation: "Pru's enterprise standard adheres to WCAG 2.2 AA."
  },
  {
    id: 9,
    type: "defect",
    room: 3,
    question: "When was the ADA signed into law?",
    acceptedKeywords: [
      "july 26 1990",
      "july 26, 1990",
      "7/26/1990",
      "in 1990",
      "july of 1990"
    ],
    hint: "Five days before Harry Potter's birthday and ten years before Y2K.",
    explanation: "The ADA was signed into law on July 26, 1990."
  },
  {
    id: 10,
    type: "ada_gaad",
    room: 3,
    question: "Define the acronym ATS. This is Pru-specific.",
    acceptedKeywords: [
      "accessibility testing specialists"
    ],
    hint: "A.....i....t. .e..... .p.....i...",
    explanation: "ATS stands for Accessibility Testing Specialists."
  },
  {
    id: 11,
    type: "defect",
    room: 4,
    question: "Several links on a page say only click here. What needs to improve?",
    acceptedKeywords: [
      "link text",
      "link purpose",
      "link label",
      "uniqueness",
      "descriptive links",
      "link description",
      "aria",
      "descriptive link text",
      "links"
    ],
    hint: "Users should know the destination or action without guessing.",
    explanation: "Links should be descriptive so users can understand where they go or what they do, especially when navigating by links alone."
  },
  {
    id: 12,
    type: "ada_gaad",
    room: 4,
    question: "Who started Global Accessibility Awareness Day?",
    acceptedKeywords: [
      "joe devon and jennison asuncion",
      "joe devon",
      "jennison asuncion"
    ],
    hint: "Two people did, but one is fine. One has a very common first name.",
    explanation: "GAAD was started by Joe Devon and Jennison Asuncion."
  },
  {
    id: 13,
    type: "defect",
    room: 4,
    question: "Light gray text on a white background is hard to read. What accessibility issue does that describe?",
    acceptedKeywords: [
      "color contrast",
      "contrast",
      "low contrast"
    ],
    hint: "This issue affects how strongly text stands apart from its background.",
    explanation: "Sufficient color contrast helps people read text more easily, including many users with low vision."
  },
  {
    id: 14,
    type: "ada_gaad",
    room: 5,
    question: "Global Accessibility Awareness Day is only about website access. True or false?",
    acceptedKeywords: [
      "false"
    ],
    hint: "Nice try! Good luck.",
    explanation: "GAAD is broader than website access alone."
  },
  {
    id: 15,
    type: "defect",
    room: 5,
    question: "A video includes speech only. What is missing?",
    acceptedKeywords: [
      "captions",
      "closed captions and transcripts",
      "transcripts",
      "closed captions",
      "captioning",
      "caption"
    ],
    hint: "Think about text that appears in time with the audio.",
    explanation: "A video with speech needs captions, and in some cases transcripts as well."
  },
  {
    id: 16,
    type: "ada_gaad",
    room: 5,
    question: "Define the acronym PWD in the world of ADA.",
    acceptedKeywords: [
      "people with disabilities",
      "persons with disabilities"
    ],
    hint: "People or persons with disabilities.",
    explanation: "PWD stands for people with disabilities."
  },
  {
    id: 17,
    type: "defect",
    room: 6,
    question: "A user is repeatedly pressing tab but is not being moved out of a dropdown box. What is going on?",
    acceptedKeywords: [
      "keyboard trap",
      "focus trap",
      "focus is trapped"
    ],
    hint: "If I can't get out, I'm trapped.",
    explanation: "This is a keyboard trap or focus trap."
  },
  {
    id: 18,
    type: "ada_gaad",
    room: 6,
    question: "Define the acronym WCAG.",
    acceptedKeywords: [
      "web content accessibility guidelines",
      "the web content accessibility guidelines"
    ],
    hint: "Starts with web.",
    explanation: "WCAG stands for Web Content Accessibility Guidelines."
  },
  {
    id: 19,
    type: "defect",
    room: 6,
    question: "A form shows a problem only in color and does not tell the user what is wrong. What issue does this create?",
    acceptedKeywords: [
      "no error in text",
      "color alone",
      "color cannot be the sole means to convey a message", "error identification",
      "error message",
      "form errors",
      "error not described in text",
      "errors"
    ],
    hint: "The problem is about clearly telling the user that something is wrong and what to fix.",
    explanation: "Users need clear error identification and helpful instructions. Color alone is not enough to communicate an error."
  },
  {
    id: 20,
    type: "ada_gaad",
    room: 6,
    question: "What Pru team can you contact for support for anything related to ADA?",
    acceptedKeywords: [
      "the digital accessibility office",
      "the dao",
      "digital accessibility office",
      "dao"
    ],
    hint: "Nice try! It's the obvious one.",
    explanation: "The Digital Accessibility Office can support ADA-related needs."
  }
];
