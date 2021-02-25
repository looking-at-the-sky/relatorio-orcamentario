function beforeTaskSave(colleagueId,nextSequenceId,userList){
	var WKNumState = getValue("WKNumState");
	
	if (WKNumState == 12) {
		hAPI.setCardValue('aprovarOrcamento','');
		hAPI.setCardValue('obsAprovOrcamento','');
	}
}