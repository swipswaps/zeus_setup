/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_CONTAINER_TEMPLATES (ID,NAME,DESCRIPTION,IMAGE,PROTOCOL,PORT) VALUES (?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_CONTAINER_TEMPLATES_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.name);
        statement.setString(++i, entity.description);
        statement.setString(++i, entity.image);
        statement.setString(++i, entity.protocol);
        statement.setInt(++i, entity.port);
        statement.executeUpdate();
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_CONTAINER_TEMPLATES WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_CONTAINER_TEMPLATES';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE ZEUS_CONTAINER_TEMPLATES SET NAME = ?,DESCRIPTION = ?,IMAGE = ?,PROTOCOL = ?,PORT = ? WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.name);
        statement.setString(++i, entity.description);
        statement.setString(++i, entity.image);
        statement.setString(++i, entity.protocol);
        statement.setInt(++i, entity.port);
        var id = entity.id;
        statement.setInt(++i, id);
        statement.executeUpdate();
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_CONTAINER_TEMPLATES WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.id);
        statement.executeUpdate();
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_CONTAINER_TEMPLATES';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'zues_container_templates',
		type: 'object',
		properties: [
		{
			name: 'id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'description',
			type: 'string'
		},
		{
			name: 'image',
			type: 'string'
		},
		{
			name: 'protocol',
			type: 'string'
		},
		{
			name: 'port',
			type: 'integer'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.id = resultSet.getInt('ID');
    result.name = resultSet.getString('NAME');
    result.description = resultSet.getString('DESCRIPTION');
    result.image = resultSet.getString('IMAGE');
    result.protocol = resultSet.getString('PROTOCOL');
	result.port = resultSet.getInt('PORT');
    return result;
}

