import { Router } from "express";
import axios from "axios";
import { error } from "console";

const router = Router();

if (!process.env.EXTERNAL_API) throw new Error("EXTERNAL_API is not set");


router.route('/')
	.get((_, res) => {
		axios.get(`${process.env.EXTERNAL_API}/AvailableCountries`)
			.then(response => {
				const countries = response.data.map(
					(elem: { name: string, countryCode: string }) => elem.name);
				res.json(countries);
			})
			.catch(error => {
				res.status(500).send(error);
			})
	})

router.route('/:country')
	.get((req, res) => {
		const promises = [
			axios.get(`${process.env.EXTERNAL_API}/CountryInfo/${req.params.country}`),
			//axios.get(`${process.env.EXTERNAL_API!}/countries/population`),
			//axios.get(`${process.env.EXTERNAL_API!}/countries/flag/images`)
		]

		Promise.all(promises)
			.then(values => {
				const data = values.map(elem => elem.data);
				const borderCountries = (data[0].borders as Array<any>)
					.map((elem: { commonName: string }) => elem.commonName);

				res.send(borderCountries);
			})
			.catch(error => {
				res.status(500).send(error);
			});
	});

export default router;
