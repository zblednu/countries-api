import "dotenv/config";

import express from "express";
import countriesRouter from './routes/countries';

const app = express();
app.use('/countries', countriesRouter);

if (!process.env.PORT) throw new Error('PORT is not set');
if (!process.env.BASE_URL) throw new Error('BASE_URL is not set');

app.listen(Number(process.env.PORT), process.env.BASE_URL, () => console.log(`${process.env.BASE_URL}:${process.env.PORT}`));

