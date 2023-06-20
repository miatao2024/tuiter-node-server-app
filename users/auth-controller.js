import * as usersDao from "./users-dao.js";

var currentUserVar;

const AuthController = (app) => {
    const register = async (req, res) => {
        const username = req.body.username;
        // console.log(username)               // 这是什么意思？
        const user = await usersDao.findUserByUsername(username);
        // const user = usersDao.findUserByUsername(username);
        if (user) {
            res.sendStatus(409);
            return;
        }
        const newUser = await userDao.createUser(req.body);
        currentUserVar = newUser;
        // const newUser = usersDao.createUser(req.body);
        // const newUser = {  _id: new Date().getTime() + "", firstName:req.body.firstName, lastName:req.body.lastName, username:req.body.username, password:req.body.password  }
        // req.session["currentUser"] = newUser;
        // usersDao.createUser(newUser)
        // console.log(newUser)
        res.json(newUser);
    };
     
    const login = async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
            const user = await usersDao.findUserByCredentials(username, password);
            if (user) {
            // req.session["currentUser"] = user;
                currentUserVar = user;
                res.json(user);
            } else {
                res.sendStatus(403);
            }
        } else {
                res.sendStatus(403);
        }
    };
        
    //     const user = usersDao.findUserByCredentials(username, password);
    //     if (user) {
    //         // req.session["currentUser"] = user;
    //         currentUserVar = user
    //         res.json(user);
    //     } else {
    //         res.sendStatus(404);
    //     }
    // };
     
    const profile = (req, res) => {
        // const currentUser = req.session["currentUser"]; 啥意思
        const currentUser = currentUserVar
        if (!currentUser) {
            res.sendStatus(404);
            return;
        }
        res.json(currentUser);
    };
     
    const logout = async (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    
    //implemented
    const update = (req, res) => {
        const username = req.body.username;
        const updateInfo = req.body;
        const user = usersDao.findUserByUsername(username);
        if (!user) {
            res.sendStatus(404)
        } else {
            const userId = user._id;
            usersDao.updateUser(userId, updateInfo);
            res.sendStatus(200);
        }
    };

    app.post("/api/users/register", register);
    app.post("/api/users/login",    login);
    app.post("/api/users/profile",  profile);
    app.post("/api/users/logout",   logout);
    app.put ("/api/users",          update);
};

export default AuthController;