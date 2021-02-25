function afterTaskSave(colleagueId,nextSequenceId,userList){
	var WKNumState  = getValue("WKNumState");
	var userId      = getValue("WKUser");
	var numProcesso = getValue("WKNumProces");
	var aprovado    = hAPI.getCardValue("aprovarOrcamento");
	var observacao  = hAPI.getCardValue("obsAprovOrcamento");
	
	if (WKNumState == 5) {
		aprovado   = '<span>Aprovado: ' + aprovado + '</span>';
		observacao = '<p style="color: red;">' + observacao + '</p>';
		hAPI.setTaskComments(userId, numProcesso, 0, aprovado + observacao);
	}
}