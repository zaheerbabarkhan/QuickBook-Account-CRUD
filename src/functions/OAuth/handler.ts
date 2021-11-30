import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const OAuthClient = require('intuit-oauth');
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoClient = process.env.IS_OFFLINE
	? new AWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000',
	  })
	: new AWS.DynamoDB.DocumentClient();

let oauthClient = new OAuthClient({
	clientId: '<client id>',
	clientSecret: '<client secret>',
	environment: 'sandbox',
	redirectUri: 'http://localhost:3000/dev/callback',
});

let path = 'callback';
const getAuthCode: Handler = async (
	event: APIGatewayProxyEvent,
	context: Context,
	callback: Callback
) => {
	// Instance of client

	// AuthorizationUri
	const authUri = oauthClient.authorizeUri({
		scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
		state: 'testState',
	}); // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}

	// Redirect the authUri
	// res.redirect(authUri);

	// console.log(process.env)
	const response = {
		statusCode: 301,
		headers: {
			Location: authUri,
		},
	};

	return callback(null, response);
};

export const authCode = middyfy(getAuthCode);

const callbackHandler: Handler = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	const authCode = event.queryStringParameters.code;
	const realmId = event.queryStringParameters.realmId;
	const state = event.queryStringParameters.state;
	await dynamoClient
		.put({
			TableName: 'TokenTable',
			Item: {
				Code: authCode,
				realmId: realmId,
				state: state,
			},
		})
		.promise();
	const response = {
		statusCode: 301,
		headers: {
			Location: 'http://localhost:3000/dev/getToken',
		},
	};

	return callback(null, response);
};

export const callback = middyfy(callbackHandler);

const tokenHandler: Handler = async () => {
	const data = await dynamoClient
		.scan({
			TableName: 'TokenTable',
		})
		.promise();

	const authCode = data.Items[0].Code;
	const realmId = data.Items[0].realmId;
	const state = data.Items[0].state;
	const redirectUri = `/${path}?code=${authCode}&state=${state}&realmId=${realmId}`;
	const token = await oauthClient.createToken(redirectUri);
	// console.log(token.getJson());

	const message = token.getJson();
	console.log(message);
	await dynamoClient
		.put({
			TableName: 'TokenTable',
			Item: {
				Code: authCode,
				realmId: realmId,
				state: state,
				refreshToken: message.refresh_token,
				accessToken: message.access_token,
			},
		})
		.promise();
	return formatJSONResponse({
		data: message,
	});
};

export const getToken = middyfy(tokenHandler);
