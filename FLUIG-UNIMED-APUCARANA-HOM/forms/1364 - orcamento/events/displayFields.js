function displayFields(form,customHTML){
	log.info("####### ORCAMENTO - DISPLAY FIELDS ######");
	form.setShowDisabledFields(true);
	
	var formMode   = form.getFormMode();
	var mobile     = form.getMobile();
	var WKNumState = getValue("WKNumState");
	var user       = getValue("WKUser");
	var processo   = getValue("WKNumProces");
	
	if (WKNumState != 0 && WKNumState != 4) {
		form.setValue('meuCentroCusto', form.getValue('desmeuCentroCusto'));
	}
	
	customHTML.append("<script>");
	customHTML.append("		function getFormMode(){ return '" + formMode + "'};");
	customHTML.append("		function getMobile(){ return '" + mobile + "'};");
	customHTML.append("		function getWKNumState(){ return " + WKNumState + "};");
	customHTML.append("		function getWKUser(){ return '" + user + "'};");
	customHTML.append("		function getWKNumProces(){ return " + processo + "};");
	customHTML.append("		processo.init()");
	customHTML.append("</script>");
}