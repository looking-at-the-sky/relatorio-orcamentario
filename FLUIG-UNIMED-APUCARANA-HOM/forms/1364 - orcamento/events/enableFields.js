function enableFields(form){
	var WKNumState = getValue('WKNumState');
	
	if (WKNumState == 0 || WKNumState == 4) {
		form.setEnabled('tipoOrcamento', true);
	} else if (WKNumState == 5 || WKNumState == 12) {
		form.setEnabled('meuCentroCusto', false);
	}
}