export const dummyPosts = [
  {
    id: 1,
    username: "chitambala",
    bookTitle: "The Salt Path",
    author: "Raynor Winn",
    coverImage: "https://placehold.co/300x400",
    description:
      "A quite, devastating memoir about walking the South West Coast Path after losing everything.",
    hashtags: ["#memoir", "#nature", "#doingthisreadingthing4real"],
    createdAt: "2026-09-03T10:00:00Z",
    comments: [
      {
        id: 1,
        username: "lerato",
        text: "Adding this to my list!",
        createdAt: "2026-08-28T11:00:00Z",
      },
      {
        id: 2,
        username: "tumelo",
        text: "One of my favourites this year.",
        createdAt: "2026-08-28T15:20:00Z",
      },
    ],
  },
  {
    id: 2,
    username: "lerato",
    bookTitle: "Piranesi",
    author: "Susanna Clarke",
    coverImage: "https://placehold.co/300x400",
    description:
      "Strange, dreamlike, and completely unlike anything else I've read this year.",
    hashtags: ["#fantasy", "#weird-fiction"],
    createdAt: "2026-08-27T14:30:00Z",
    comments: [
      {
        id: 3,
        username: "chitambala",
        text: "Been meaning to read this.",
        createdAt: "2026-08-27T16:00:00Z",
      },
    ],
  },
  {
    id: 3,
    username: "chitambala",
    bookTitle: "Sapiens",
    author: "Yuval Noah Harari",
    coverImage: "https://placehold.co/300x400",
    description:
      "Rereading this for the third time, it still makes me rethink everything.",
    hashtags: ["#nonfiction", "#history"],
    createdAt: "2026-08-25T09:15:00z",
    comments: [],
  },
];

export const dummyUser = {
  id: 1,
  username: "chitambala",
  name: "Chitambala J. Sikazwe",
  pronouns: "he/him",
  bio: "Second-year student, currently working through a stack of nonfiction.",
  profilePic: "https://placehold.co/150x150",
};

export const dummyFriends = [
  {
    id: 2,
    username: "lerato",
    name: "Lerato M. Phethla",
    profilePic: "https://placehold.co/150x150",
    friendsSince: "2026-03-14",
  },
  {
    id: 3,
    username: "tumelo",
    name: "Tumelo K. Motlakeng",
    profilePic: "https://placehold.co/150x150",
    friendsSince: "2026-05-02",
  },
];
