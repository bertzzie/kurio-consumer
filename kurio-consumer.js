const Client = require('node-rest-client').Client;
const Headers = require('./kurio-headers')

const _client = new Client();
const HOSTNAME = 'https://hack.kurio.co.id/v1';

// private methods 
const _headersWithAuth = function(authToken) {
	return Object.assign(Headers, {"Authorization": "Bearer " + authToken['access_token']});
};

// AUTH
const login = function (email, password, callback) {
	const params = {
		'email': email,
		'password': password,
		'device_token': 'yourdevicetoken' // wut?
	};

	const args = {
		'data': params,
		'headers': Headers
	};

	var result = {};
	_client.post(HOSTNAME + '/auth/login', args, function (data, response) {
		callback({'access_token': data['token']['access_token']});
	});
};

const register = function (email, password, name, callback) {
	const params = {
		'email': email,
		'password': password,
		'name': name
	};

	const args = {
		'data': params,
		'headers': Headers
	};

	_client.post(HOSTNAME + '/auth/signup', args, function (data, response) {
		callback(data);
	});
};
// AUTH ENDS

// FEED
const feedTopic = function (authToken, axisType, axisID, fullDetail, num, cursor, callback) {
	const args = { 'headers': _headersWithAuth(authToken) };
	const finalNum = num || 20;
	const finalCursor = cursor || '1';
	const url  = HOSTNAME + '/feed/' + axisType + ':' + axisID + '?num=' + finalNum + '&cursor=' + finalCursor;
	const finalURL = fullDetail ? url + '&detail=true' : url;

	_client.get(finalURL, args, function (data, response) {
		callback(data);
	});
};

const feedTopStory = function (authToken, num, cursor, callback) {
	const args = { 'headers': _headersWithAuth(authToken) };
	const finalNum = num || 20;
	const finalCursor = cursor || '1';
	const url  = HOSTNAME + '/feed/top_stories' + '?num=' + finalNum + '&cursor=' + finalCursor;

	_client.get(url, args, function (data, response) {
		callback(data);
	});
};

// axis list format:
// [{axis: 'topic', value: 44}, {axis: 'source', value: 99}, ...]
const feedMultiFeed = function (authToken, axisList, num, callback) {
	const args = { 'headers': _headersWithAuth(authToken) };
	const finalNum = num || 20;
	const axisStr  = axisList.map(function (ax) { return ax['axis'] + ':' + ax['value']});
	const finalAxs = axisStr.join(',')
	const url  = HOSTNAME + '/feed/' + finalAxs + '?num=' + finalNum

	_client.get(url, args, function (data, response) {
		callback(data);
	});
};
// FEED ENDS

// Article
const getArticle = function (authToken, id, callback) {
	const args = { 'headers': _headersWithAuth(authToken) };
	const url = HOSTNAME + '/article/' + id;

	_client.get(url, args, function (data, response) {
		callback(data);
	});
};

const expandArticleHash = function (authToken, hash, callback) {
	const args = { 'headers': _headersWithAuth(authToken) };
	const url = HOSTNAME + '/article/hash/' + hash;

	_client.get(url, args, function (data, response) {
		callback(data);
	});
};

const _getRelatedType = function (relatedType) {
	const r = relatedType || 'same_context';
	const f = Array.isArray(r) ? r.join(',') : r;

	return r;
}

const relatedArticle = function (authToken, id, relatedType, num) {
	const args      = { 'headers': _headersWithAuth(authToken) };
	const finalType = _getRelatedType(relatedType);
	const url       = HOSTNAME + '/article/' + id + '/related/' + hash;

	_client.get(url, args, function (data, response) {
		callback(data);
	});
}
// Article ENDS

// Favorite Feed
const favoriteFeed = function (authToken, num, cursor, callback) {
	const args = { 'headers': _headersWithAuth(authToken) };
	const finalNum = num || 20;
	const finalCur = cursor || '1'
	const url  = HOSTNAME + '/feed/favorites?num=' + finalNum + '&cursor=' + finalCur;

	_client.get(url, args, function (data, response) {
		callback(data);
	});
};

const favoriteArticle = function (authToken, id, callback) {
	const args      = { 'headers': _headersWithAuth(authToken) };
	const url       = HOSTNAME + '/article/' + id + '/favorite';

	_client.post(url, args, function (data, response) {
		callback(data);
	});
};
// Favorite Feed ENDS

// AXIS
const getUserAxisList = function (authToken, callback) {
	const args = {
		'headers': _headersWithAuth(authToken)
	};

	_client.get(HOSTNAME + '/axis/me', args, function (data, response) {
		callback(data);
	});
};

const syncUserAxisList = function (authToken, data, callback) {
	const args = {
		'headers': _headersWithAuth(authToken),
		'data': data
	};

	_client.put(HOSTNAME + '/axis/me', args, function (responseData, response) {
		callback(responseData);
	});
};

const followAxis = function (authToken, axisType, axisID, callback) {
	const args = {
		'headers': _headersWithAuth(authToken)
	}
	const url = HOSTNAME + '/axis/' + axisType + ':' + axisID + '/follow';
	_client.post(url, args, function (data, response) {
		callback(data);
	});
};

const unfollowAxis = function (authToken, axisType, axisID, callback) {
	const args = {
		'headers': _headersWithAuth(authToken)
	}
	const url = HOSTNAME + '/axis/' + axisType + ':' + axisID + '/follow';
	_client.delete(url, args, function (data, response) {
		callback(data);
	});
};
// AXIS ENDS

// EXPLORE
const exploreMenu = function (authToken, callback) {
	const args = {
		'headers': _headersWithAuth(authToken)
	}

	_client.get(HOSTNAME + '/explore', args, function (data, response) {
		callback(data)
	})
};

const exploreTopicGroup = function(authToken, id, callback) {
	const args = {
		'headers': _headersWithAuth(authToken)
	};

	const url = HOSTNAME + '/explore/group/' + id
	_client.get(url, args, function (data, response) {
		callback(data);
	});
};
// EXPLORE ENDS

module.exports = {
	'login': login,
	'register': register,
	'feedTopic': feedTopic,
	'feedTopStory': feedTopStory,
	'feedMultiFeed': feedMultiFeed,
	'getArticle': getArticle,
	'expandArticleHash': expandArticleHash,
	'relatedArticle': relatedArticle,
	'favoriteFeed': favoriteFeed,
	'favoriteArticle': favoriteArticle,
	'getUserAxisList': getUserAxisList,
	'syncUserAxisList': syncUserAxisList,
	'followAxis': followAxis,
	'unfollowAxis': unfollowAxis,
	'exploreMenu': exploreMenu,
	'exploreTopicGroup': exploreTopicGroup
};