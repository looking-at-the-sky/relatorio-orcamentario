function createDataset(fields, constraints, sortFields) {
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch(e) {
		return processErrorResult(e, constraints);
	}
}

function callService(fields, constraints, sortFields) {
	var databaseData = data();
	var resultFields, queryClauses;

	resultFields = getOutputFields(databaseData.outputValues);
	queryClauses = verifyConstraints(databaseData, constraints);

	var result = DatabaseManager.select(databaseData.fluigService, databaseData.operation, resultFields, queryClauses, databaseData.extraParams);

	return result;
}

function defineStructure() {
	var databaseData = data();
	var columns = getOutputFields(databaseData.outputValues);

	for (column in columns) {
		var columnName = removeInvalidChars(columns[column]);
		if (!DatabaseManager.isReservedWord(columnName)) {
			addColumn(columnName);
		} else {
			addColumn('ds_' + columnName);
		}
	}
	if (databaseData.extraParams.key) {
		setKey([databaseData.extraParams.key]);
	}
}

function onSync(lastSyncDate) {
	var databaseData = data();
	var synchronizedDataset = DatasetBuilder.newDataset();

	try {
		var resultDataset = processResult(callService());
		if (resultDataset != null) {
			var values = resultDataset.getValues();
			for (var i = 0; i < values.length; i++) {
				if (databaseData.extraParams.key) {
					synchronizedDataset.addOrUpdateRow(values[i]);
				} else {
					synchronizedDataset.addRow(values[i]);
				}
			}
		}

	} catch(e) {
		log.info('Dataset synchronization error : ' + e.message);

	}
	return synchronizedDataset;
}

function verifyConstraints(params, constraints) {
	var allConstraints = new Array();

	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			if (constraints[i].getFieldName().toLowerCase() == 'sqllimit') {
				params.extraParams['limit'] = constraints[i].getInitialValue();
			} else {
				allConstraints.push(constraints[i]);
			}
		}
	}

	if (allConstraints.length == 0) {
		for (i in params.inputValues) {
			for (j in params.inputValues[i]) {
				var param = params.inputValues[i][j];
				var constraint = DatasetFactory.createConstraint(param.fieldName, param.initialValue, param.finalValue, param.constraintType);
				constraint.setLikeSearch(param.likeSearch);
				constraint.setFieldType(DatasetFieldType.valueOf(param.fieldType));
				allConstraints.push(constraint);
			}
		}
	}
	return allConstraints;
}

function getOutputFields(outputValues) {
	var outputFields = new Array();
	if (outputValues != null) {
		for (field in outputValues) {
			if (outputValues[field].result) {
				outputFields.push(field);
			}
		}
	}
	return outputFields;
}

function processResult(result) {
	var databaseData = data();
	var dataset = DatasetBuilder.newDataset();
	var columns = getOutputFields(databaseData.outputValues);

	for (column in columns) {
		dataset.addColumn(columns[column]);
	}

	for (var i = 0; i < result.size(); i++) {
		var datasetRow = new Array();
		var item = result.get(i);
		for (param in columns) {
			datasetRow.push(item.get(columns[param]));
		}
		dataset.addRow(datasetRow);
	}

	return dataset;
}

function processErrorResult(error, constraints) {
	var dataset = DatasetBuilder.newDataset();

	dataset.addColumn('error');
	dataset.addRow([error.message]);

	return dataset;
}

function removeInvalidChars(columnName) {
	var invalidChars = '#';
	var newChar = '_';
	for (var i = 0; i < invalidChars.length; i++) {
		columnName = columnName.split(invalidChars[i]).join(newChar);
	}

	return columnName;
}

function data() {
	return {
  "fluigService" : "Protheus",
  "operation" : "AK5030",
  "tableType" : "TABLE",
  "parameters" : [ ],
  "inputValues" : {
    "AK5_CCO" : [ ],
    "AK5_CODIGO" : [ ],
    "AK5_COSUP" : [ ],
    "AK5_DEBCRE" : [ ],
    "AK5_DESCRI" : [ ],
    "AK5_DTINC" : [ ],
    "AK5_DTINI" : [ ],
    "AK5_FILIAL" : [ ],
    "AK5_MASC" : [ ],
    "AK5_MSBLQL" : [ {
      "fieldName" : "AK5_MSBLQL",
      "initialValue" : "2",
      "finalValue" : "2",
"constraintType" :  ConstraintType.MUST,
      "likeSearch" : false,
      "fieldType" : "STRING",
      "MUST" : true,
      "MUST_NOT" : false,
      "SHOULD" : false
    } ],
    "AK5_TIPO" : [ {
      "fieldName" : "AK5_TIPO",
      "initialValue" : "2",
      "finalValue" : "2",
"constraintType" :  ConstraintType.MUST,
      "likeSearch" : false,
      "fieldType" : "STRING",
      "MUST" : true,
      "MUST_NOT" : false,
      "SHOULD" : false
    } ],
    "AK5_UINTFL" : [ ],
    "AK5_USERGA" : [ ],
    "AK5_USERGI" : [ ],
    "D_E_L_E_T_" : [ ],
    "R_E_C_D_E_L_" : [ {
      "fieldName" : "R_E_C_D_E_L_",
      "initialValue" : "0",
      "finalValue" : "0",
"constraintType" :  ConstraintType.MUST,
      "likeSearch" : false,
      "fieldType" : "NUMBER"
    } ],
    "R_E_C_N_O_" : [ ]
  },
  "inputAssignments" : { },
  "outputValues" : {
    "AK5_CCO" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_CODIGO" : {
      "result" : true,
      "type" : "CHAR"
    },
    "AK5_COSUP" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_DEBCRE" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_DESCRI" : {
      "result" : true,
      "type" : "CHAR"
    },
    "AK5_DTINC" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_DTINI" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_FILIAL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_MASC" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_MSBLQL" : {
      "result" : true,
      "type" : "CHAR"
    },
    "AK5_TIPO" : {
      "result" : true,
      "type" : "CHAR"
    },
    "AK5_UINTFL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_USERGA" : {
      "result" : false,
      "type" : "CHAR"
    },
    "AK5_USERGI" : {
      "result" : false,
      "type" : "CHAR"
    },
    "D_E_L_E_T_" : {
      "result" : false,
      "type" : "CHAR"
    },
    "R_E_C_D_E_L_" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "R_E_C_N_O_" : {
      "result" : false,
      "type" : "NUMBER"
    }
  },
  "outputAssignments" : { },
  "extraParams" : { }
}
;
}