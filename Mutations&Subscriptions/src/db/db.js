export const dummyData = {
    usersArray: [
      {
        id: "11",
        name: "Zubin Pratap",
        email: "zubin@fakemail.com"
      },
      {
        id: "22",
        name: "Rowena Horne",
        email: "rowena@fakemail.com"
      },
      {
        id: "33",
        name: "Maggie Hound",
        email: "maggie@fakemail.com",
        age: 13
      }
    ],
    postsArray: [
      {
        id: `post1`,
        title: "This is a post title!",
        body: "and this...is the body of the post that was posted",
        published: true,
        author: "11"
      },
      {
        id: `post2`,
        title: "What? Coding? Urk.",
        body: "this common reaction is unfortunate....",
        published: false,
        author: "11"
      },
      {
        id: `post3`,
        title: "What happened to Right Said Fred?",
        body: "I was deeply dippy about some of their songs...",
        published: true,
        author: "33"
      }
    ],
    comments: [
      {
        text: "this is comment #1",
        id: "comm1",
        author: "11",
        post: "post1"
      },
      {
        text: "this is comment #2",
        id: "comm2",
        author: "22",
        post: "post2"
      },
      {
        text: "this is comment #3",
        id: "comm3",
        author: "33",
        post: "post3"
      }
    ]
  };