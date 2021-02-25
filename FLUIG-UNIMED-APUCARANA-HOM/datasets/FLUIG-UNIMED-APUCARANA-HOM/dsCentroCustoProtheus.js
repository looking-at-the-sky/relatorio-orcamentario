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
  "operation" : "CTT030",
  "tableType" : "TABLE",
  "parameters" : [ ],
  "inputValues" : {
    "CTT_ACAT01" : [ ],
    "CTT_ACAT02" : [ ],
    "CTT_ACAT03" : [ ],
    "CTT_ACAT04" : [ ],
    "CTT_ACATIV" : [ ],
    "CTT_ACCLVL" : [ ],
    "CTT_ACITEM" : [ ],
    "CTT_AT01OB" : [ ],
    "CTT_AT02OB" : [ ],
    "CTT_AT03OB" : [ ],
    "CTT_AT04OB" : [ ],
    "CTT_ATOBRG" : [ ],
    "CTT_BAIRRO" : [ ],
    "CTT_BLOQ" : [ {
      "fieldName" : "CTT_BLOQ",
      "initialValue" : "2",
      "finalValue" : "2",
"constraintType" :  ConstraintType.MUST,
      "likeSearch" : false,
      "fieldType" : "STRING"
    } ],
    "CTT_BOOK" : [ ],
    "CTT_CCLP" : [ ],
    "CTT_CCO" : [ ],
    "CTT_CCPON" : [ ],
    "CTT_CCRED" : [ ],
    "CTT_CCSUP" : [ ],
    "CTT_CCVM" : [ ],
    "CTT_CEI" : [ ],
    "CTT_CEI2" : [ ],
    "CTT_CEP" : [ ],
    "CTT_CESCRI" : [ ],
    "CTT_CLASSE" : [ {
      "fieldName" : "CTT_CLASSE",
      "initialValue" : "2",
      "finalValue" : "2",
"constraintType" :  ConstraintType.MUST,
      "likeSearch" : false,
      "fieldType" : "STRING"
    } ],
    "CTT_CLOBRG" : [ ],
    "CTT_CNAE" : [ ],
    "CTT_CODMUN" : [ ],
    "CTT_CODTER" : [ ],
    "CTT_COMPL" : [ ],
    "CTT_CPART" : [ ],
    "CTT_CRGNV1" : [ ],
    "CTT_CSINCO" : [ ],
    "CTT_CUSTO" : [ ],
    "CTT_DESC01" : [ ],
    "CTT_DESC02" : [ ],
    "CTT_DESC03" : [ ],
    "CTT_DESC04" : [ ],
    "CTT_DESC05" : [ ],
    "CTT_DTBLFI" : [ ],
    "CTT_DTBLIN" : [ ],
    "CTT_DTEXIS" : [ ],
    "CTT_DTEXSF" : [ ],
    "CTT_EMAIL" : [ ],
    "CTT_ENDER" : [ ],
    "CTT_ESTADO" : [ ],
    "CTT_FAP" : [ ],
    "CTT_FILIAL" : [ ],
    "CTT_FILMAT" : [ ],
    "CTT_FPAS" : [ ],
    "CTT_ICTPAT" : [ ],
    "CTT_INTRES" : [ ],
    "CTT_ITOBRG" : [ ],
    "CTT_LOCAL" : [ ],
    "CTT_LOGRDS" : [ ],
    "CTT_LOGRNR" : [ ],
    "CTT_LOGRTP" : [ ],
    "CTT_MAT" : [ ],
    "CTT_MUNIC" : [ ],
    "CTT_NOME" : [ ],
    "CTT_NORMAL" : [ ],
    "CTT_NRINCT" : [ ],
    "CTT_NRINPR" : [ ],
    "CTT_OCORRE" : [ ],
    "CTT_OPERAC" : [ ],
    "CTT_PERCAC" : [ ],
    "CTT_PEREMP" : [ ],
    "CTT_PERFPA" : [ ],
    "CTT_PERRAT" : [ ],
    "CTT_RECFAT" : [ ],
    "CTT_RES" : [ ],
    "CTT_RESERV" : [ ],
    "CTT_RETIDO" : [ ],
    "CTT_RGNV2" : [ ],
    "CTT_RGNV3" : [ ],
    "CTT_RHEXP" : [ ],
    "CTT_STATUS" : [ ],
    "CTT_TIPO" : [ ],
    "CTT_TIPO00" : [ ],
    "CTT_TIPO01" : [ ],
    "CTT_TIPO2" : [ ],
    "CTT_TPINCT" : [ ],
    "CTT_TPINPR" : [ ],
    "CTT_TPLOT" : [ ],
    "CTT_TPO01" : [ ],
    "CTT_TPO02" : [ ],
    "CTT_TPO03" : [ ],
    "CTT_TPO04" : [ ],
    "CTT_UINTFL" : [ ],
    "CTT_USERGA" : [ ],
    "CTT_USERGI" : [ ],
    "CTT_VALFAT" : [ ],
    "D_E_L_E_T_" : [ {
      "fieldName" : "D_E_L_E_T_",
      "initialValue" : "*",
      "finalValue" : "",
"constraintType" :  ConstraintType.MUST_NOT,
      "likeSearch" : false,
      "fieldType" : "STRING",
      "MUST" : false,
      "MUST_NOT" : true,
      "SHOULD" : false
    } ],
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
    "CTT_ACAT01" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ACAT02" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ACAT03" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ACAT04" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ACATIV" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ACCLVL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ACITEM" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_AT01OB" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_AT02OB" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_AT03OB" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_AT04OB" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ATOBRG" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_BAIRRO" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_BLOQ" : {
      "result" : true,
      "type" : "CHAR"
    },
    "CTT_BOOK" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CCLP" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CCO" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CCPON" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CCRED" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CCSUP" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CCVM" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CEI" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CEI2" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CEP" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CESCRI" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CLASSE" : {
      "result" : true,
      "type" : "CHAR"
    },
    "CTT_CLOBRG" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CNAE" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CODMUN" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CODTER" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_COMPL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CPART" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CRGNV1" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CSINCO" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_CUSTO" : {
      "result" : true,
      "type" : "CHAR"
    },
    "CTT_DESC01" : {
      "result" : true,
      "type" : "CHAR"
    },
    "CTT_DESC02" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DESC03" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DESC04" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DESC05" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DTBLFI" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DTBLIN" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DTEXIS" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_DTEXSF" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_EMAIL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ENDER" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ESTADO" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_FAP" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "CTT_FILIAL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_FILMAT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_FPAS" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ICTPAT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_INTRES" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_ITOBRG" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_LOCAL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_LOGRDS" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_LOGRNR" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_LOGRTP" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_MAT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_MUNIC" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_NOME" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_NORMAL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_NRINCT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_NRINPR" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_OCORRE" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_OPERAC" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_PERCAC" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "CTT_PEREMP" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "CTT_PERFPA" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "CTT_PERRAT" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "CTT_RECFAT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_RES" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_RESERV" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_RETIDO" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "CTT_RGNV2" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_RGNV3" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_RHEXP" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_STATUS" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TIPO" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TIPO00" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TIPO01" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TIPO2" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPINCT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPINPR" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPLOT" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPO01" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPO02" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPO03" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_TPO04" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_UINTFL" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_USERGA" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_USERGI" : {
      "result" : false,
      "type" : "CHAR"
    },
    "CTT_VALFAT" : {
      "result" : false,
      "type" : "NUMBER"
    },
    "D_E_L_E_T_" : {
      "result" : false,
      "type" : "CHAR"
    },
    "R_E_C_D_E_L_" : {
      "result" : true,
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