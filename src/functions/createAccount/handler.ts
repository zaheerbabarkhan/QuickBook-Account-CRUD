import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';
import axios from 'axios';

const hello: Handler = async (event) => {
	try {
		const data = event.body;
		const url =
			'https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365207003380/account?minorversion=1';
		const response = await axios.post(
			url,
			{
				'Name': data.Name,
				'AccountType': data.AccountType,
			},
			{
				headers: {
					'Authorization': `Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..rZHezgzBddubJtyLKMK4Dw.0CiWuH561OlPdnkn9hXv8BcgvSB0tVEEj8pBM3XwqLbY9uPVyg2njAcYisy99U9QTEQfqrfdhgchNBocIgH0A1KV1dSKlt3d8aHCiXFm6GSCVuKw5AtSLKER-j6KMJLLotTLLUfL5HYhamfvRnv2To3Pe2voW1FdIoS5WKhIgNI_5an34Pu--LIvt5d3SIE9mp_DnIw8nwyasQ7Pj0kMaBwdv7u2jtD9H2qTKbFGS5naljaO5_ehEezRvxSA6Tpzpz4ryraoevs7dbaLfSWSmRkTXzrOocPWk8BVik5CTicNySAExfVn7OcS0VMXxx-Xl0thsufJRyTpctDg37T2Kv01FitP4oLhrMaSB7W-OkxfcqmiPT4FWVlThLPhT_ZHmlWIeggLo_Km7KFGr8YtDMUu9WSHplRpdktp6b9nNXECCqTKbizZSDzlaMhqsB7Ut1Dbc-c53AasqoTojHanz2r9m5oKU3LJf_jgG_cBD0-rlE2fRbdSRf2jb0WpdcnB43hyBZRwcrEotEqvBlboUU7gIUiYTPpg411UDUuD5_Gc_CQaXZQWi86-Exq_knLE6JaEYzDmLt0zh5omtArYP_iXkpFlsLKiQbha1hA6tMWWv47rYH5bgUEDFgosO1jZYZnN-iGJmPpkozcqJJ0wwFBzlMU0rqA3NUlBsw2EWSOSAAGdjIMF2rW6VmFS_hLqWxy1OxNh8HbOnSS4xHodutdrqi0FiBS5ZVdh0XAreczLSah6hexCk8gDKEUuOnj621jNNKAW-va0czBKOA6sjJ-SJuezItSbH9hCndfyvzAne02WFyAM9Hbt6bGXiDtFg0hxlQf4DgDvoQLcjHJLCQ.VSPMsBi5AI6LbnudTH9Trg`,
				},
			}
		);
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
