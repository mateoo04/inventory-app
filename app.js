require('dotenv').config();
const express = require('express');
const path = require('node:path');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
