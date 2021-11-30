import { handlerPath } from '@libs/handlerResolver';

export const callback = {
	handler: `${handlerPath(__dirname)}/handler.callback`,
	events: [
		{
			http: {
				method: 'get',
				path: 'callback',
			},
		},
	],
};

export const authCode = {
	handler: `${handlerPath(__dirname)}/handler.authCode`,
	events: [
		{
			http: {
				method: 'get',
				path: 'authCode',
			},
		},
	],
};



export const getToken = {
	handler: `${handlerPath(__dirname)}/handler.getToken`,
	events: [
		{
			http: {
				method: 'get',
				path: 'getToken',
			},
		},
	],
};