var express = require("express");
var router = express.Router();
var data = require("./data.js");
const userModel = require("./users.js");
const notesModel = require("./notes.js");
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// First add the middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Then mount the router
app.use("/", router);

// Set the view engine
app.set('view engine', 'ejs');
app.use(express.static('./public')); // Serve static files from the public directory

// Optional: Set views directory (default is 'views')
app.set('views', 'C:/Users/godha/Downloads/web-app-for-mental-health-well-being-main/web-app-for-mental-health-well-being-main/views');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/test', (req, res) => {
  res.send('Hello World');
});

router.get("/getdata/:user", async function (req, res) {
  try {
    const userID = req.params.user || req.query.user;

    if (userID) {
      const user = await userModel.findById(userID).populate("notes");

      if (user) {
        const moodData = user.mood.map(mood => {
          return {
            mood: mood.mood,
            timestamp: mood.time,
          };
        });

        const userData = {moods: moodData};

        res.json(userData);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid user ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





/* GET home page. */
router.get("/", function (req, res) {
  /*const userID = req.query.user;
  if (userID) {
    res.render("index", { user: userID });
  } else {
    res.redirect("/login");
  }*/
 res.render("landing", { user: null });
});
router.get("/index", function (req, res) {
  const userID = req.query.user;
  if (userID) {
    res.render("index", { user: userID });
  } else {
    res.redirect("/login");
  }
 //res.render("landing", { user: null });
});

router.get("/register", function (req, res) {
  res.render("register");
});


router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/logout", function (req, res) {
  res.redirect("login");
});



router.post("/register", async function (req, res) {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
      username: username,
      email: email,
      password: password,
    });

    if (existingUser) {
     res.render("/register",{error:"account already exist"})
    } else {
      const user = await userModel.create({
        username: username,
        email: email,
        password: password,
      });
      const userID = user._id;
      res.redirect(`/index?user=${userID}`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const user = await userModel.findOne({
    username: username,
    password: password,
  });
  if(user)
{  const userID = user._id;
  console.log(username);
  console.log(password);
  console.log(user);

  if (user.username === username && user.password === password) {
    res.redirect(`/index?user=${userID}`);
  } else {
    res.redirect("/login");
  }
}else{
  res.redirect("/login")
}
});


router.get("/mood_update/:Currentmood/:user", async function (req, res) {
  const Currentmood = req.params.Currentmood;
  const userID = req.params.user;
  try {
    let user = await userModel.findOne({ _id: userID });
    if (user) {
      if (!user.mood) {
        user.mood = [];
      }
      user.mood.unshift({ mood: Currentmood, time: Date.now() });
      await user.save();
      res.redirect(`/home?user=${userID}`);
    } else {
      res.send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
});



router.get("/meditation/:user/",function(req,res){
  const userID = req.params.user;
  if (userID) {
    res.render("meditation", { user: userID });
  } else {
    res.redirect("/login");
  }
})
router.get("/meditation/:user/",function(req,res){
  const userID = req.params.user;
  if (userID) {
    res.render("meditation", { user: userID });
  } else {
    res.redirect("/login");
  }
})
router.get("/chatbot/:user/",function(req,res){
  const userID = req.params.user;
  if (userID) {
    res.render("chatbot", { user: userID });
  } else {
    res.redirect("/login");
  }
})

router.get("/relaxation/:user",function(req,res){
  const userID = req.params.user;
  video="default.mp4"
  btn="mount-btn.png"
  img_src=['w1.jpg','w2.jpg','w3.jpg','w4.jpg','w5.jpg','w6.jpg']
  if (userID) {
    res.render("relaxation", { user: userID,video: video ,btn: btn,img_src:img_src});
  } else {
    res.redirect("/login");
  }
})
router.get("/relaxation2/:user/:folder",function(req,res){
  const userID = req.params.user;
  const foldername=req.params.folder;
  console.log(foldername)
  if (userID) {
    res.render("relaxation2", { user: userID,folder:foldername});
  } else {
    res.redirect("/login");
  }
})


router.get("/exercise/:user",function(req,res){
  const userID = req.params.user;
  video="default.mp4"
  if (userID) {
    res.render("exercise", { user: userID,video: video });
  } else {
    res.redirect("/login");
  }
})





router.get("/home/:user", function (req, res) {
  const userID = req.params.user;
  if (userID) {
    res.render("home", { user: userID });
  } else {
    res.redirect("/login");
  }
});


router.get("/home", async function (req, res) {
  const userID = req.query.user;
  if (userID) {
    res.render("home", { user: userID });
  } else {
    res.redirect("/login");
  }
});

// routes/recommendations.js
router.get("/music/:user", async (req, res) => {
  const userID = req.params.user;
  if (userID) {
    user = await userModel.findOne({ _id: userID });
    console.log(user);
    const mood = user.mood[0].mood;
    console.log(mood);
    moodSection = "music";
    const randomMusic = getRandomItem("music", mood);
    res.render("recommend", {
      title: "Musics",
      category: "music",
      items: randomMusic,
      mood,
      user:userID,
      folder:"music"
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/movie/:user", async (req, res) => {
  const userID = req.params.user;
  if (userID) {
    user = await userModel.findOne({ _id: userID });
    const mood = user.mood[0].mood;
    moodSection = "movie";
    const randomMovie = getRandomItem("movie", mood);
    res.render("recommend", {
      title: "Movies",
      category: "movie",
      items: randomMovie,
      mood,
      user:userID,
      folder:"movie"
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/book/:user", async (req, res) => {
  const userID = req.params.user;
  if (userID) {
    user = await userModel.findOne({ _id: userID });
    const mood = user.mood[0].mood;
    moodSection = "book";
    const randomBooks = getRandomItem("book", mood);
    res.render("recommend", {
      title: "Books",
      category: "book",
      items: randomBooks,
      mood,
      user:userID,
      folder:"book"
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/profile/:user", async function (req, res) {
  const userID = req.params.user;
  const user = await userModel.findOne({ _id: userID });
  if (user) {
    const username = user.username;
    console.log(username);
    res.render("profile", { username: username });
  } else {
    res.status(404).send("User not found");
  }
});


router.get("/journal/:user", async function (req, res) {
  try {
    const userID = req.params.user || req.query.user;

    console.log(userID)
    if (userID) {
      const user = await userModel.findById(userID).populate("notes");
      if (user) {
        const notes = user.notes || []; 
        res.render("journal", { user: { _id: userID, notes: notes },userID:userID });
        console.log(user._id)
      } else {
        res.status(404).send("User not found");
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



router.post("/add-entry/:user", async function (req, res) {
  try {
    const userID = req.params.user;

    if (!userID) {
      res.redirect("/login");
      return;
    }

    const title = req.body.title;
    const desc = req.body.content;
    console.log(userID)
    console.log(title)
    console.log(desc)

    const note = await notesModel.create({
      title: title,
      desc: desc,
      user: userID
    });
    console.log(note)
    const user = await userModel.findOne({ _id: userID });
    console.log(user)
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.notes.unshift(note._id);
    await user.save();
    res.redirect(`/journal/${userID}`);

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});


function getRandomIndices(length, count) {
  const indices = [];
  while (indices.length < count) {
    const randomIndex = Math.floor(Math.random() * length);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices;
}

function getRandomItem(section, mood) {
  const sectionData = data[section];
  const moodSpecificItems = sectionData[mood] || sectionData.happy;

  const randomIndices = getRandomIndices(moodSpecificItems.length, 6);
  return randomIndices.map((index) => moodSpecificItems[index]);
}

module.exports = router;
