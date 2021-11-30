import type { AWS } from '@serverless/typescript';

import { callback, authCode, getToken } from '@functions/index';
import createAccount from '@functions/createAccount';
import queryAccount from '@functions/queryAccount';
import getAccount from '@functions/getAccount';
import updateAccount from '@functions/updateAccount';
const serverlessConfiguration: AWS = {
	service: 'quickbook-account-crud',
	frameworkVersion: '2',
	custom: {
		dynamodb: {
			stages: ['dev'],
			start: {
				port: 8000,
				migrate: true,
				seed: true,
			},
		},
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
		},
	},
	plugins: [
		'serverless-esbuild',
		'serverless-offline',
		'serverless-dynamodb-local',
	],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
		lambdaHashingVersion: '20201221',
	},
	// import the function via paths
	functions: {
		authCode,
		callback,
		getToken,
		createAccount,
		queryAccount,
		getAccount,
		updateAccount,
	},
	'resources': {
		'Resources': {
			'tokenTable': {
				'Type': 'AWS::DynamoDB::Table',
				'Properties': {
					'TableName': 'TokenTable',
					'AttributeDefinitions': [
						{
							'AttributeName': 'Code',
							'AttributeType': 'S',
						},
					],
					'KeySchema': [
						{
							'AttributeName': 'Code',
							'KeyType': 'HASH',
						},
					],
					'ProvisionedThroughput': {
						'ReadCapacityUnits': 1,
						'WriteCapacityUnits': 1,
					},
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
