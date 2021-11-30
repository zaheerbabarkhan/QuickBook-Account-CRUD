import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';
import axios from 'axios';

const hello: Handler = async (event) => {
	try {
		const data = event.body;
		const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/<realmid here>/query?query=select * from Account where Name > '${data.Name}'&minorversion=1`;
		const response: any = await axios.get(url, {
			headers: {
				'Authorization': `Bearer <token here>`,
			},
		});
		// console.log(response.data);

		return formatJSONResponse({
			message: response.data,
		});
	} catch (error) {
		return formatJSONResponse({
			message: error,
		});
	}
};

export const main = middyfy(hello);
