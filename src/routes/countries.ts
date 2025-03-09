import { Router } from "express";
import axios from "axios";
import { error } from "console";

const router = Router();

if (!process.env.EXTERNAL_API_1) throw new Error("EXTERNAL_API_1 is not set");


router.route('/')
	.get((_, res) => {
		axios.get(`${process.env.EXTERNAL_API_1}/AvailableCountries`)
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
			fetchBorders(req.params.country),
			fetchPopulation(req.params.country),
			fetchFlagURL(req.params.country)
		]

		Promise.all(promises)
			.then(values => {

				res.json({
					flagURL: values[2],
					borders: values[0],
					population: values[1]
				});
			})
			.catch(error => {
				res.status(500).send(error);
			});
	});

async function fetchBorders(country: string) {
	const allRoute = `${process.env.EXTERNAL_API_1}/AvailableCountries`
	const code = await axios.get(allRoute)
		.then(res => {
			return res.data
				.find((elem: { countryCode: string, name: string }) => elem.name === country)
				.countryCode;
		});

	const specRoute = `${process.env.EXTERNAL_API_1}/CountryInfo/${code}`
	return axios.get(specRoute)
		.then(res => {
			return res.data.borders.map((elem: { commonName: string }) => elem.commonName) as Array<any>
		});
}

async function fetchPopulation(country: string) {
	const route = `${process.env.EXTERNAL_API_2}/population`;

	return axios.get(route)
		.then(res => {
			return res.data.data.find((elem: { country: string }) => elem.country === country).populationCounts as Array<any>
		})
}

async function fetchFlagURL(country: string) {
	const route = `${process.env.EXTERNAL_API_2}/flag/images`;

	return axios.get(route)
		.then(res => {
			return res.data.data.find((elem: { name: string }) => elem.name === country).flag as string
		})
}

//async function 

export default router;
