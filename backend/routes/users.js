/**
 * Route for users.
 */

import express from 'express';
const router = express.Router()

// router.get("/", (req, res) => {
//   console.log(req.query.name)
//   res.json({ message: "User List" })
// })

// router.get("/new", (req, res) => {
//   res.json({ message: "Create new user" })
// })

// router.post("/", (req, res) => {
//   const isValid = false
//   if (isValid) {
//     users.push({ firstName: req.body.firstName })
//     res.redirect(`/users/${users.length - 1}`)
//   } else {
//     console.log("Error")
//     res.render("users/new", { firstName: req.body.firstName })
//   }
// })

router
  .route("/:id")
  .get((req, res) => {
    console.log(req.user.name)
    res.json({ message: `Get User With ID ${req.params.id}` })
  })
  .put((req, res) => {
    res.send(`Update User With ID ${req.params.id}`)
  })
  .delete((req, res) => {
    res.send(`Delete User With ID ${req.params.id}`)
  })

const users = [{ name: "Eric" }, { name: "Adam" }]
router.param("id", (req, res, next, id) => {
  req.user = users[id]
  next()
})

export { router };
// module.exports = router
