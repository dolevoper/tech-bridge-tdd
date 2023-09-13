import express from "express";
import * as bodyParser from "body-parser";
import auth from "express-basic-auth";

export const app = express();

interface Post {
    content: string;
    createdAt: Date;
}

const timelines = new Map<string, Post[]>();

app.use(auth({
    users: {
        "alice": "1234",
        "bob": "1234"
    }
}));
app.use(bodyParser.json());

app.param("username", (req, res, next, username) => {
    if (!timelines.has(username)) {
        timelines.set(username, []);
    }

    (req as any).timeline = timelines.get(username);

    next();
});

app.post("/timeline/:username", (req, res) => {
    if ((req as any).auth.user !== req.params.username) {
        res.status(403);
        res.end();
        return;
    }

    (req as any).timeline.push({
        content: req.body.content,
        createdAt: new Date()
    });

    res.status(200);
    res.end();
});

app.get("/timeline/:username", (req, res) => {
    res.json((req as any).timeline);
});
