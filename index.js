const express = require("express");
const ejs = require("ejs");
const { connectDB } = require("./core/connectDb.js");
const { User } = require("./core/user.js");
const { Item } = require("./core/item.js");
const { Quiz } = require("./core/quiz.js");

const session = require("express-session");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const saltRounds = 5;
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
const SNEAKERS_API_KEY = "ebcbd3bac2msh465439796d692c6p111c7ajsnd5c2af277498";

app.use(
  session({
    secret: "clothes app",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
    httpOnly: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.static("img"));

app.use(express.static(__dirname + "/assets"));
app.use(express.static("languages"));
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();

app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect("/main");
  } else {
    res.render("register");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/signup", async (req, res) => {
  const { Username, email, password } = req.body;

  if (!Username || !email || !password) {
    return res
      .status(400)
      .send(
        '<script>alert("All fields are required"); window.location.href="/";</script>'
      );
  }

  try {
    const existingUser = await User.findOne({ name: Username });
    if (existingUser) {
      return res
        .status(400)
        .send(
          '<script>alert("This username is already taken"); window.location.href="/";</script>'
        );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name: Username,
      email,
      password: hashedPassword,
      userId: generateRandomUserId(),
      creationDate: new Date(),
      updateDate: null,
      deletionDate: null,
      adminStatus: false,
    });

    await newUser.save();

    req.session.username = Username;
    req.session.email = email;
    req.session.userId = newUser._id;

    res.redirect("/main");
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send(
        '<script>alert("Internal Server Error"); window.location.href="/";</script>'
      );
  }
});

app.post("/login", async (req, res) => {
  const { Username, password } = req.body;

  if (!Username || !password) {
    return res.send(`<script>
            document.addEventListener('DOMContentLoaded', function() {
                const errorMessage = 'Username and password are required';
                document.getElementById('errorMessage').innerText = errorMessage;
                new bootstrap.Modal(document.getElementById('loginErrorModal')).show();
            });
        </script>`);
  }

  try {
    const user = await User.findOne({ name: Username });

    if (!user) {
      return res.send(
        '<script>alert("No user found with this username"); window.location.href = "/login"; </script>'
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.send(
        '<script>alert("Password is incorrect"); window.location.href = "/login"; </script>'
      );
    }

    req.session.username = user.name;
    req.session.email = user.email;
    req.session.userId = user._id;
    req.session.adminStatus = user.adminStatus;

    if (user.adminStatus) {
      res.redirect("/admin");
    } else {
      res.redirect("/main");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.send(
      '<script>alert("Internal Server Error"); window.location.href = "/login"; </script>'
    );
  }
});

app.post("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/main", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  res.render("index", {
    username: req.session.username,
    email: req.session.email,
    adminStatus: req.session.adminStatus,
  });
});

app.get("/faq", async (req, res) => {
  const users = await User.find();
  res.render("faq", {
    username: req.session.username,
    adminStatus: req.session.adminStatus,
  });
});

app.get("/item-changing", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    const items = await Item.find();
    res.render("item-changing", {
      items: items,
      adminStatus: req.session.adminStatus,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-item", async (req, res) => {
  const {
    name_en,
    name_ru,
    description_en,
    description_ru,
    pictureUrl,
    price,
  } = req.body;

  try {
    const newItem = new Item({
      name: { en: name_en, ru: name_ru },
      description: { en: description_en, ru: description_ru },
      pictureUrl,
      createdAt: new Date(),
      updatedAt: null,
      price: price,
    });
    await newItem.save();

    res.redirect("/item-changing");
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit-item/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.render("edit-item", { item, adminStatus: req.session.adminStatus });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/add-item", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }
  res.render("add-item");
});

app.post("/edit-item/:id", async (req, res) => {
  const { name_en, name_ru, description_en, description_ru, pictureUrl } =
    req.body;

  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    item.name = { en: name_en, ru: name_ru };
    item.description = { en: description_en, ru: description_ru };
    item.pictureUrl = pictureUrl;
    item.updatedAt = new Date();
    await item.save();

    res.redirect("/item-changing");
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete-item/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    await item.deleteOne();

    res.redirect("/item-changing");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contact", async (req, res) => {
  const users = await User.find();
  res.render("contact", {
    username: req.session.username,
    adminStatus: req.session.adminStatus,
  });
});

app.get("/cart", async (req, res) => {
  const locale = req.session.locale || "en";
  try {
    const currentUser = await User.findOne({
      _id: req.session.userId,
    }).populate("cart.itemId");
    if (!currentUser) {
      return res.status(404).send("User not found");
    }
    const cartItems = currentUser.cart.map((cartItem) => ({
      _id: cartItem.itemId._id,
      name: locale === "en" ? cartItem.itemId.name.en : cartItem.itemId.name.ru,
      description:
        req.session.locale === "en"
          ? cartItem.itemId.description.en
          : cartItem.itemId.description.ru,
      pictureUrl: cartItem.itemId.pictureUrl,
      price: cartItem.itemId.price,
      quantity: cartItem.quantity,
    }));
    let totalItems = 0;
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });
    res.render("cart", {
      username: req.session.username,
      adminStatus: req.session.adminStatus,
      cartItems: cartItems,
      totalItems: totalItems,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contacts", async (req, res) => {
  const users = await User.find();
  res.render("contacts", {
    username: req.session.username,
    adminStatus: req.session.adminStatus,
  });
});

app.get("/brands", async (req, res) => {
  const users = await User.find();
  res.render("brands", {
    username: req.session.username,
    adminStatus: req.session.adminStatus,
  });
});

app.post("/setlocale", (req, res) => {
  const locale = req.body.locale;
  req.session.locale = locale;
  res.sendStatus(200);
});

app.get("/shop", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }
  try {
    const locale = req.session.locale || "en";
    const data = await Item.find();
    const items = data.map((item) => {
      return {
        ...item._doc,
        name: locale === "en" ? item.name.en : item.name.ru,
        description:
          locale === "en" ? item.description.en : item.description.ru,
      };
    });

    res.render("shop", {
      items: items,
      username: req.session.username,
      adminStatus: req.session.adminStatus,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-to-cart/:itemId", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }
  try {
    const userId = req.session.userId;
    const itemId = req.params.itemId;

    const user = await User.findById(userId);

    const itemIndex = user.cart.findIndex(
      (item) => item.itemId.toString() === itemId
    );

    if (itemIndex !== -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ itemId: itemId, quantity: 1 });
    }

    await user.save();
    const alertMessage = `Item has been added to your cart.`;
    res.send(
      `<script>alert(\`${alertMessage}\`); window.location.href = '/shop';</script>`
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/remove-from-cart/:itemId", async (req, res) => {
  try {
    const userId = req.session.userId;
    const itemId = req.params.itemId;

    const user = await User.findById(userId);

    const itemIndex = user.cart.findIndex(
      (item) => item.itemId.toString() === itemId
    );

    if (itemIndex !== -1) {
      if (user.cart[itemIndex].quantity === 1) {
        user.cart.splice(itemIndex, 1);
      } else {
        user.cart[itemIndex].quantity -= 1;
      }
      await user.save();
      res.redirect("/cart");
    } else {
      res.status(404).send("Item not found in the cart");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin", async (req, res) => {
  const users = await User.find();
  res.render("admin", {
    users,
    username: req.session.username,
    adminStatus: req.session.adminStatus,
  });
});

app.get("/quiz", async (req, res) => {
  try {
    const locale = req.session.locale || "en";
    const quizQuestions = await Quiz.find({}, { _id: 0, __v: 0 });
    res.render("quiz", {
      quizQuestions,
      locale,
      adminStatus: req.session.adminStatus,
      username: req.session.username,
    });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/checkout1", async (req, res) => {
  res.render("checkout1", {
    username: req.session.username,
    adminStatus: req.session.adminStatus,
  });
});

app.get("/delete-user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

app.get("/edit-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("edit_user", { user, adminStatus: req.session.adminStatus });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update-user/:id", async (req, res) => {
  const { name, email, password, adminStatus } = req.body;

  try {
    
      const updates = {
        name,
        email,
        adminStatus: adminStatus === "on",
        updateDate: new Date(),
      };
  
      if (password) {
        updates.password = await bcrypt.hash(password, saltRounds);
      }
  
      await User.findByIdAndUpdate(req.params.id, updates);
  
      res.redirect("/admin");

    
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/setlocale", (req, res) => {
  const locale = req.body.locale;
  req.session.locale = locale;
  res.sendStatus(200);
});

let timerEndTime = 0;

app.post("/set-timer", (req, res) => {
  const timerDuration = req.body.timerValue * 1000;
  const currentTime = Date.now();
  timerEndTime = currentTime + timerDuration;
  res.status(200).json({ message: "Timer value updated successfully" });
});

app.get("/get-timer", (req, res) => {
  const currentTime = Date.now();
  let remainingTime = timerEndTime - currentTime;

  if (remainingTime < 0) {
    remainingTime = 0;
  } else {
    remainingTime = Math.floor(remainingTime / 1000);
  }

  res.status(200).json({ timerValue: remainingTime });
});

app.get("/sneakers", async (req, res) => {
  try {
    const brand = req.query.brand || "gucci";

    const options = {
      method: "GET",
      url: "https://v1-sneakers.p.rapidapi.com/v1/sneakers",
      params: {
        limit: "10",
        brand: brand.toLowerCase(),
        releaseYear: "2019",
      },
      headers: {
        "X-RapidAPI-Key": SNEAKERS_API_KEY,
        "X-RapidAPI-Host": "v1-sneakers.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const sneakersData = response.data;
    res.render("sneakers", {
      sneakersData: sneakersData,
      username: req.session.username,
      adminStatus: req.session.adminStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const ALI_EXPRESS_API_KEY =
  "675f005cd7msh9fca053488781a3p115ab9jsn6056aa6f98ab";

app.get("/product", async (req, res) => {
  try {
    const itemIds = [
      "1005005790281099",
      "1005005830008009",
      "1005006010502498",
      "1005006338797008",
      "1005005497346576",
      "1005006515767182",
      "1005005495108017",
      "1005004270893607",
      "1005006515767182",
      "1005006245207023",
      "1005006403258555",
    ];

    const itemsPromises = itemIds.map((itemId) => {
      const options = {
        method: "GET",
        url: "https://aliexpress-datahub.p.rapidapi.com/item_detail",
        params: {
          itemId: itemId,
          currency: "USD",
          region: "RU",
          locale: "en_US",
        },
        headers: {
          "X-RapidAPI-Key": ALI_EXPRESS_API_KEY,
          "X-RapidAPI-Host": "aliexpress-datahub.p.rapidapi.com",
        },
      };
      return axios.request(options);
    });

    const responses = await Promise.all(itemsPromises);
    const items = responses.map((response) => response.data.result.item);
    console.log(items);
    res.render("product", { items,adminStatus:req.session.adminStatus, username: req.session.username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function generateRandomUserId() {
  const length = 10;
  let randomUserId = "";

  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    randomUserId += randomDigit.toString();
  }

  return parseInt(randomUserId, 10);
}
