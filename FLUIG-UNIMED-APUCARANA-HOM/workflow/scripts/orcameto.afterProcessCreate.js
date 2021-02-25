function afterProcessCreate(processId){
	hAPI.setCardValue("txtWKNumProcess", getValue("WKNumProces"));
	hAPI.setCardValue("statusProcess", "Aberta");
}