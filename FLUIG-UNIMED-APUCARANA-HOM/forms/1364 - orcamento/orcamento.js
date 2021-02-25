var processo = (function() {
	var retorno = {
			init: function() {
				var that = this;

				var WKNumState = getWKNumState();
				var WKUser     = getWKUser();
				
				$("#divSelecionarAno").hide();
				$("#divTipoOrcamento").hide();
				$("#divAprovacaoOrcamento").hide();
				
				$(".moneyOrc").maskMoney({thousands:'.', decimal:',', allowZero:true, affixesStay: true});
				
				$(".moneyOrc").on("change", function(){
					that.calcularTotalOrcado();
				});
				
				$("#btn_addOrcamentoDetMes").on("click", function() {
					var tipoOrcamento = $("input[name='tipoOrcamento']:checked").val();
					var tpOrcAssist   = (tipoOrcamento == 'Assistencial' ? true : false);
					var codmeuCC      = $("#codmeuCentroCusto").val();
					var meuCC         = ($("#meuCentroCusto").val() == null ? '' : $("#meuCentroCusto").val()[0]);
					var codccDesp     = $("#codcentroCustoDespesa").val();
					var ccDesp        = ($("#centroCustoDespesa").val() == null ? '' : $("#centroCustoDespesa").val()[0]);
					var codContOrca   = $("#codcontaOrcamentaria").val();
					var ContOrca      = ($("#contaOrcamentaria").val() == null ? '' : $("#contaOrcamentaria").val()[0]);
					var coditemContab = $("#coditemContabil").val();
					var itemContab    = (($("#itemContabil").val() == null || $("#itemContabil").val().length == 0) ? '' : $("#itemContabil").val()[0]);
					var itemContabN   = $("#itemContabilNaoCad").val();
					var coditemC      = (coditemContab.trim() == '' ? '' : coditemContab);
					var itemC         = (itemContab.trim() == '' ? itemContabN : itemContab);
					
					if (tpOrcAssist) {
						codmeuCC      = '';
						meuCC         = '';
						codccDesp     = '';
						ccDesp        = '';
						coditemContab = '';
						itemContab    = '';
						itemContabN   = '';
						coditemC      = '';
						itemC         = '';
					}
					
					if (meuCC.trim() == '' && !tpOrcAssist) {
						FLUIGC.toast({
							title: 'ATENÇÃO: ',
							message: 'O campo <b>Meu Centro de Custo</b> é obrigatório!',
							type: 'warning'
						});
					} else if (ccDesp.trim() == '' && !tpOrcAssist) {
						FLUIGC.toast({
							title: 'ATENÇÃO: ',
							message: 'O campo <b>Centro de custo da despesa</b> é obrigatório!',
							type: 'warning'
						});
					} else if (ContOrca.trim() == '') {
						FLUIGC.toast({
							title: 'ATENÇÃO: ',
							message: 'O campo <b>Conta Orçamentária</b> é obrigatório!',
							type: 'warning'
						});
					} else {
						var existeSolicitacao = that.verificaSolicitacao();
						
						if (existeSolicitacao.length > 0) {
							FLUIGC.toast({
								title: 'ATENÇÃO: ',
								message: 'Já existe solicitação em aberto para o Centro de Custo <strong>' + codmeuCC + ' - ' + meuCC + '</strong>!<br> Solicitação: ' + existeSolicitacao[0].txtWKNumProcess,
								type: 'warning',
								timeout: 'slow'
							});
						} else {
							var temDupli    = that.validaDuplicidade();
							var sequenciaPf = $("#sequenciaPF").val();
							
							if (sequenciaPf.trim() != '') {
								temDupli = false;
							}

							if (temDupli) {
								FLUIGC.toast({
									title: 'ATENÇÃO: ',
									message: 'Registro já adicionado!',
									type: 'warning'
								});
							} else {
								var solicitante = that.buscaSolicitante(WKUser);
								
								var seqPF = '';
								
								if (sequenciaPf.trim() == '') {
									wdkAddChild("tbOrcamento");
									seqPF = newId;
								} else {
									seqPF = sequenciaPf;
								}
								
								var date   = new Date();
								var ano    = date.getFullYear();
								var mes    = date.getMonth() + 1;
								mes = (mes <= 9 ? "0" + mes : mes);
								var dia    = date.getDate();
								dia = (dia <= 9 ? "0" + dia : dia);
								
								$("#dataInclusao___" + seqPF).val(dia + "/" + mes + "/" + ano);
								$("#solicitanteInclu___" + seqPF).val(solicitante.colleagueName);
								
								$("#tipoOrcamentoPF___" + seqPF).val(tipoOrcamento.trim());
								$("#codcc___" + seqPF).val(codmeuCC.trim());
								$("#cc___" + seqPF).val(meuCC.trim());
								$("#codccDespesa___" + seqPF).val(codccDesp.trim());
								$("#ccDespesa___" + seqPF).val(ccDesp.trim());
								$("#codcontaOrc___" + seqPF).val(codContOrca.trim());
								$("#contaOrc___" + seqPF).val(ContOrca.trim());
								$("#coditemContab___" + seqPF).val(coditemC.trim());
								$("#itemContab___" + seqPF).val(itemC.trim());
								
								$("#janeiro___" + seqPF).val($("#orcJan").val());
								$("#fevereiro___" + seqPF).val($("#orcFev").val());
								$("#marco___" + seqPF).val($("#orcMar").val());
								$("#abril___" + seqPF).val($("#orcAbr").val());
								$("#maio___" + seqPF).val($("#orcMai").val());
								$("#junho___" + seqPF).val($("#orcJun").val());
								$("#julho___" + seqPF).val($("#orcJul").val());
								$("#agosto___" + seqPF).val($("#orcAgo").val());
								$("#setembro___" + seqPF).val($("#orcSet").val());
								$("#outubro___" + seqPF).val($("#orcOut").val());
								$("#novembro___" + seqPF).val($("#orcNov").val());
								$("#dezembro___" + seqPF).val($("#orcDez").val());
								$("#totalAno___" + seqPF).val($("#totalOrcado").val());
								$("#observacaoOrc___" + seqPF).val($("#observacao").val());
								
								$(".limpaCampo").val("");
								$(".limpaValor").val("0,00");
								
								that.verificaQtdeRegistrosPF();
								that.carregaOrcamentos();
							}
						}
					}
				});
				
				$(document).on("click", ".btn_edit", function(){
					var seqPF = $(this).data("sequencia");
					
					$("#sequenciaPF").val(seqPF);

					$("#codcentroCustoDespesa").val($("#codccDespesa___" + seqPF).val());
					//$("#centroCustoDespesa").val($("#ccDespesa___" + seqPF).val());
					centroCustoDespesa.setValue($("#ccDespesa___" + seqPF).val());
					$("#codcontaOrcamentaria").val($("#codcontaOrc___" + seqPF).val());
					//$("#contaOrcamentaria").val($("#contaOrc___" + seqPF).val());
					contaOrcamentaria.setValue($("#contaOrc___" + seqPF).val());
					$("#coditemContabil").val($("#coditemContab___" + seqPF).val());
					//$("#itemContabil").val($("#itemContab___" + seqPF).val());
					itemContabil.setValue($("#itemContab___" + seqPF).val());
					
					$("#orcJan").val($("#janeiro___" + seqPF).val());
					$("#orcFev").val($("#fevereiro___" + seqPF).val());
					$("#orcMar").val($("#marco___" + seqPF).val());
					$("#orcAbr").val($("#abril___" + seqPF).val());
					$("#orcMai").val($("#maio___" + seqPF).val());
					$("#orcJun").val($("#junho___" + seqPF).val());
					$("#orcJul").val($("#julho___" + seqPF).val());
					$("#orcAgo").val($("#agosto___" + seqPF).val());
					$("#orcSet").val($("#setembro___" + seqPF).val());
					$("#orcOut").val($("#outubro___" + seqPF).val());
					$("#orcNov").val($("#novembro___" + seqPF).val());
					$("#orcDez").val($("#dezembro___" + seqPF).val());
					$("#totalOrcado").val($("#totalAno___" + seqPF).val());
					$("#observacao").val($("#observacaoOrc___" + seqPF).val());
					
					$("#centroCustoDespesa").focus();
				});
				
				$(document).on("click", ".btn_delete", function(){
					var seqPF = $(this).data("sequencia");
					$("#cc___" + seqPF).parent().parent().remove();
					that.carregaOrcamentos();
					
					that.verificaQtdeRegistrosPF();
				});
				
				$(document).on("click", ".btn_modal", function(){
					var seqPF = $(this).data("sequencia");
					
					var html = '';
					html += '<div class="row">';
					html += '	<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">';
					html += '		<label class="control-label"><strong>Meu Centro de Custo</strong></label><br>';
					html += '		<input type="text" class="fs-no-style-input" readonly="readonly" value=' + $("#cc___" + seqPF).val() + '>';
					html += '	</div>';
					html += '	<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">';
					html += '		<label class="control-label"><strong>Centro de custo da despesa</strong></label><br>';
					html += '		<input type="text" class="fs-no-style-input" readonly="readonly" value=' + $("#ccDespesa___" + seqPF).val() + '>';
					html += '	</div>';
					html += '</div>';
			    	
					html += '<div class="row">';
					html += '	<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">';
					html += '		<label class="control-label"><strong>Conta Orçamentária</strong></label><br>';
					html += '		<input type="text" class="fs-no-style-input" readonly="readonly" value=' + $("#contaOrc___" + seqPF).val() + '>';
					html += '	</div>';
						
					html += '	<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">';
					html += '		<label class="control-label"><strong>Item Contábil (Evento)</strong></label><br>';
					html += '		<input type="text" class="fs-no-style-input" readonly="readonly" value=' + $("#itemContab___" + seqPF).val() + '>';
					html += '	</div>';
					html += '</div>';
					
					html += '<div class="panel panel-default">';
					html += '	<div class="panel-heading">';
					html += '		<h3 class="panel-title">Orçamento Detalhado por mês</h3>';
					html += '	</div>';
					html += '	<div class="panel-body">';
					html += '		<div class="row">';
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Janeiro</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#janeiro___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Fevereiro</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#fevereiro___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Março</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#marco___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Abril</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#abril___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Maio</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#maio___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Junho</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#junho___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Julho</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#julho___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Agosto</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#agosto___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Setembro</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#setembro___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Outubro</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#outubro___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Novembro</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#novembro___" + seqPF).val() + '">';
					html += '			</div>';
								
					html += '			<div class="form-group col-xs-12 col-sm-4 col-md-3 col-lg-3">';
					html += '				<label class="control-label">Dezembro</label>';
					html += '				<input type="text" class="fs-no-style-input" readonly="readonly" value="R$ ' + $("#dezembro___" + seqPF).val() + '">';
					html += '			</div>';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="panel-footer">';
					html += '		<h3 class="panel-title">TOTAL ORÇADO: R$ <input type="text" class="fs-no-style-input" readonly="readonly" value="' + $("#totalAno___" + seqPF).val() + '"></h3>';
					html += '	</div>';
					html += '</div>';
					
					html += '<div class="row">';
					html += '	<div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">';
					html += '		<label class="control-label">Observação</label><br>	';
					html += '		<textarea class="fs-no-style-input" rows="3">' + $("#observacaoOrc___" + seqPF).val() + '</textarea>';
					html += '	</div>';
					html += '</div>';
					
					var myModal = FLUIGC.modal({
					    title: 'Detalhes do Orçamento',
					    content: html,
					    size: 'large',
					    id: 'fluig-modal',
					    actions: [{
					        'label': 'Close',
					        'autoClose': true
					    }]
					}, function(err, data) {
					    if(err) {
					        // do error handling
					    } else {
					        // do something with data
					    }
					});

				});
				
				that.carregaOrcamentos();
				
				if (WKNumState == 0 || WKNumState == 4) {
					var solicitante = that.buscaSolicitante(WKUser);
					
					$("#divSelecionarAno").show();
					
					var date   = new Date();
					var ano    = date.getFullYear();
					var mes    = date.getMonth() + 1;
					mes = (mes <= 9 ? "0" + mes : mes);
					var dia    = date.getDate();
					dia = (dia <= 9 ? "0" + dia : dia);
					
					var prxAno = ano + 1;

					var chkAno = false;
					if ($("#selAno").val() == '') {
						chkAno = true;
					}
					
					var option1 = $("<option>");
					option1.val(ano);
					option1.text(ano);

					var option2 = $("<option>");
					option2.val(prxAno);
					option2.text(prxAno);
					
					if (chkAno) {
						option2.prop("selected", true);
					} else {
						option1.prop("selected", true);
					}
					
					$("#selecionarAno").append(option1);
					$("#selecionarAno").append(option2);
					
					$("#selecionarAno").on("change", function(index, value){
						var sel = $(this).val();
						$("#selAno").val(sel);
						$("#spanAno").html(sel);
					});

					$("#selAno").val(prxAno);
					$("#spanAno").html(prxAno);
															
					$("#dataSolicitacao").val(dia + "/" + mes + "/" + ano);
					$("#nomeSolicitante").val(solicitante.colleagueName);
					
					if ($("#desmeuCentroCusto").val() == '') {
						that.buscaDadosAdicionais(retorno => {
							$("#codCCSolicitante").val(retorno.content.extData.COD_CC_USER);
							$("#desCCSolicitante").val(retorno.content.extData.DES_CC_USER);
							
							$("#codmeuCentroCusto").val(retorno.content.extData.COD_CC_USER);
							$("#desmeuCentroCusto").val(retorno.content.extData.DES_CC_USER);
							$("#meuCentroCusto").val(retorno.content.extData.DES_CC_USER);
							$("#aprovadorOrc").val("Pool:Group:" + retorno.content.extData.COD_CC_APROV);
						});
					} else {
						$("#meuCentroCusto").val($("#desmeuCentroCusto").val());
					}
					
					var ccSol = $("#codCCSolicitante").val();
					var mCC   = $("#codmeuCentroCusto").val();
					
					if (ccSol == '11002' || ccSol == '11102' || ccSol == '11105' || ccSol == '11106') {
						$("#meuCentroCusto").attr('disabled', false);
						if (ccSol == '11102') {
							$("#divTipoOrcamento").show();
						}
					} else {
						$("#meuCentroCusto").attr('disabled', true);
						
						var intervalo = window.setInterval(function() {
							if ($("#meuCentroCusto").attr('disabled') == undefined) {
								$("#meuCentroCusto").attr('disabled', true);
							} else {
								clearInterval(intervalo);
							}
						}, 500);
					}
					
					var intervalo1 = window.setInterval(function() {
						if ($("#meuCentroCusto").attr('disabled') == undefined) {
							that.trataTipoOrcamento();
						} else {
							clearInterval(intervalo1);
						}
					}, 500);

					that.carregarDadosSolPrincipal();
					
					that.verificaQtdeRegistrosPF();
					
				} else if (WKNumState == 5) {
					$("#divAprovacaoOrcamento").show();
				} else if (WKNumState == 12) {
				}
				
			}, // init
			
			validaDuplicidade: function() {
				var temDuplicidade = false;
				
				var codmeuCC      = $("#codmeuCentroCusto").val();
				var meuCC         = ($("#meuCentroCusto").val() == null ? '' : $("#meuCentroCusto").val()[0]);
				var codccDesp     = $("#codcentroCustoDespesa").val();
				var ccDesp        = ($("#centroCustoDespesa").val() == null ? '' : $("#centroCustoDespesa").val()[0]);
				var codContOrca   = $("#codcontaOrcamentaria").val();
				var ContOrca      = ($("#contaOrcamentaria").val() == null ? '' : $("#contaOrcamentaria").val()[0]);
				var coditemContab = $("#coditemContabil").val();
				var itemContab    = (($("#itemContabil").val() == null || $("#itemContabil").val().length == 0) ? '' : $("#itemContabil").val()[0]);
				var itemContabN   = $("#itemContabilNaoCad").val();
				var coditemC      = (coditemContab.trim() == '' ? '' : coditemContab);
				var itemC         = (itemContab.trim() == '' ? itemContabN : itemContab);
				
				$("input[id^='cc___']").each(function(index, value){
					var seqPF = $(this).attr("id").split("___")[1];
					
					if (codmeuCC.trim() == $("#codcc___" + seqPF).val().trim() 
							&& meuCC.trim() == $("#cc___" + seqPF).val().trim()
							&& codccDesp.trim() == $("#codccDespesa___" + seqPF).val().trim()
							&& ccDesp.trim() == $("#ccDespesa___" + seqPF).val().trim()
							&& codContOrca.trim() == $("#codcontaOrc___" + seqPF).val().trim()
							&& ContOrca.trim() == $("#contaOrc___" + seqPF).val().trim()
							&& coditemC.trim() == $("#coditemContab___" + seqPF).val().trim()
							&& itemC.trim() == $("#itemContab___" + seqPF).val().trim()) {
						temDuplicidade = true;
					}
				});
				return temDuplicidade;
			}, // validaDuplicidade
			
			calcularTotalOrcado: function() {
				var that = this;
				var totalOrc = 0;
				$(".moneyOrc").each(function(){
					var vlOrc = $(this).maskMoney('unmasked')[0];
					totalOrc = parseFloat(totalOrc) + parseFloat(vlOrc);
				});
				
				that.trataValoresComMask(totalOrc, $("#totalOrcado"));
				/*
				totalOrc = totalOrc.toFixed(2);
				totalOrc = totalOrc.split(".").join(",");
				
				$("#totalOrcado").val(totalOrc);
				
				$("#totalOrcado").maskMoney({thousands:'.', decimal:',', allowZero:true, affixesStay: true});
				$("#totalOrcado").maskMoney('mask');
				$("#totalOrcado").maskMoney('destroy');
				*/
			}, // calcularCampos
			
			convertParaFloat: function(valor) {
				return parseFloat(valor.split(".").join("").split(",").join("."));
			}, // convertParaFloat
			
			trataTipoOrcamento: function() {
				var that = this;
				var tipoOrcamento = $("input[name='tipoOrcamento']:checked").val();
				that.activeDisableTipoOrcamento(tipoOrcamento);
				
				$("input[name='tipoOrcamento']").on("click", function(index, value){
					var selecionado = $(this).val();
					that.activeDisableTipoOrcamento(selecionado);
				});
			}, // trataTipoOrcamento
			
			activeDisableTipoOrcamento: function(selecionado) {
				if (selecionado == 'Assistencial') {
					$("#meuCentroCusto").attr('disabled', true);
					$("#centroCustoDespesa").attr('disabled', true);
					$("#itemContabil").attr('disabled', true);
					$("#itemContabilNaoCad").attr('disabled', true);
				} else {
					$("#meuCentroCusto").attr('disabled', false);
					$("#centroCustoDespesa").attr('disabled', false);
					$("#itemContabil").attr('disabled', false);
					$("#itemContabilNaoCad").attr('disabled', false);
				}
			}, // activeDisableTipoOrcamento
			
			verificaQtdeRegistrosPF: function() {
				var qtde = $("input[id^='cc___']").length;
				if (qtde > 0) {
					$("#meuCentroCusto").attr("disabled", true);
				} else {
					$("#meuCentroCusto").attr("disabled", false);
				}
			}, // verificaQtdeRegistrosPF
			
			carregaOrcamentos: function() {
				var that = this;
				var jTemplate = {linhas: new Array()};
				$("input[id^='cc___']").each(function(index, value){
					var seqPF = $(this).attr("id").split("___")[1];
					
					var IC = '';
					if ($("#coditemContab___" + seqPF).val().trim() != '' && $("#itemContab___" + seqPF).val().trim() != '') {
						IC = $("#coditemContab___" + seqPF).val().trim() + ' - ' + $("#itemContab___" + seqPF).val().trim();
					}
					
					jTemplate.linhas.push({
						seqPF: seqPF,
						data: $("#dataInclusao___" + seqPF).val(),
						solicitante: $("#solicitanteInclu___" + seqPF).val(),
						centroCusto: $("#codcc___" + seqPF).val().trim() + ' - ' + $("#cc___" + seqPF).val().trim(),
						centroCustoDesp: $("#codccDespesa___" + seqPF).val().trim() + ' - ' + $("#ccDespesa___" + seqPF).val().trim(),
						contaOrcament: $("#codcontaOrc___" + seqPF).val().trim() + ' - ' + $("#contaOrc___" + seqPF).val().trim(),
						itemContab: IC,
						total: $("#totalAno___" + seqPF).val(),
						agrupador: false,
						agrupadorCCDesp: false
					});
				});
				
				//that.agrupaItemContabil(jTemplate);
				that.agrupaCCDespesa(jTemplate);
			}, // carregaOrcamentos
			
			agrupaCCDespesa: function(jTemplate) {
				var that = this;
				
				const array = jTemplate.linhas;
				const resultCCDespesa = [];
				const map = new Map();
				for (const item of array) {
					var concatenado = item.centroCustoDesp + '|' + item.itemContab;

					if(!map.has(concatenado)){
				        map.set(concatenado, true);    // set any value to Map
				        resultCCDespesa.push({
							seqPF: item.seqPF,
							data: item.data,
							solicitante: item.solicitante,
							centroCusto: item.centroCusto,
							centroCustoDesp: item.centroCustoDesp,
							contaOrcament: item.contaOrcament,
							itemContab: item.itemContab,
							total: item.total
				        });
				    }
				}
				
				const comparar = (a, b) => {
					var z = 'zzzzzzzzzz';
					a.centroCustoDesp = (a.centroCustoDesp == '' ? z : a.centroCustoDesp);
					b.centroCustoDesp = (b.centroCustoDesp == '' ? z : b.centroCustoDesp);
					if (a.centroCustoDesp > b.centroCustoDesp) {
						a.centroCustoDesp = (a.centroCustoDesp == z ? '' : a.centroCustoDesp);
						b.centroCustoDesp = (b.centroCustoDesp == z ? '' : b.centroCustoDesp);
						return 1;
					}
					if (a.centroCustoDesp < b.centroCustoDesp) {
						a.centroCustoDesp = (a.centroCustoDesp == z ? '' : a.centroCustoDesp);
						b.centroCustoDesp = (b.centroCustoDesp == z ? '' : b.centroCustoDesp);
						return -1;
					}
					
					return 0;
				};
				resultCCDespesa.sort(comparar);
				
				const filterCCDespesaIC = (query1, query2) => {
					return jTemplate.linhas.filter(el => el.centroCustoDesp == query1 && el.itemContab == query2);
				};
				
				const filterCCDespesa = (query) => {
					return jTemplate.linhas.filter(el => el.centroCustoDesp == query);
				};
				
				const reducer      = (valorTotal, elemento) => valorTotal += that.convertParaFloat(elemento.total);
				const reducerGeral = (valorTotal, elemento) => {
					if (elemento.centroCusto.trim() != '') {
						valorTotal += that.convertParaFloat(elemento.total)
					}
					return valorTotal;
				};
				
				const jRegistros = {};
				jRegistros.linhas = new Array();
				
				var CCDespAnterior = '';
				var ICAnterior     = '';
				// Faz o agrupamento por Centro de Custo da Despesa
				resultCCDespesa.forEach(function(elemento, indice){
					const retorno = filterCCDespesaIC(elemento.centroCustoDesp, elemento.itemContab);
					
					if (CCDespAnterior.trim() != '') {
						if (CCDespAnterior != elemento.centroCustoDesp) {
							const retornoCCDesp = filterCCDespesa(CCDespAnterior);
							const totalCCDespesa = retornoCCDesp.reduce(reducer, 0);
							
							var input = $("<input>");
							input.attr("type", "hidden");
							input.attr("id","totCCDespesa_" + elemento.seqPF);
							input.val(totalCCDespesa);
							$("body").append(input);
							
							var totalCCDespesa2 = that.trataValoresComMask(totalCCDespesa, $("#totCCDespesa_" + elemento.seqPF));
							
							jRegistros.linhas.push({
								seqPF: '',
								data: '',
								solicitante: '',
								centroCusto: '',
								centroCustoDesp: CCDespAnterior,
								contaOrcament: '',
								itemContab: ICAnterior,
								total: totalCCDespesa2,
								agrupador: false,
								agrupadorCCDesp: true,
								agrupadorGeral: false
							});
						}
					}
					CCDespAnterior = elemento.centroCustoDesp;
					ICAnterior     = elemento.itemContab;
					
					jRegistros.linhas = jRegistros.linhas.concat(retorno);
					
					// TOTALIZA ITEM CONTABIL
					const totalCCDespesaIC = retorno.reduce(reducer, 0);
					
					var input = $("<input>");
					input.attr("type", "hidden");
					input.attr("id","totCCDespesaIC_" + elemento.seqPF);
					input.val(totalCCDespesaIC);
					$("body").append(input);
					
					var totalCCDespesaIC2 = that.trataValoresComMask(totalCCDespesaIC, $("#totCCDespesaIC_" + elemento.seqPF));
					
					jRegistros.linhas.push({
						seqPF: '',
						data: '',
						solicitante: '',
						centroCusto: '',
						centroCustoDesp: elemento.centroCustoDesp,
						contaOrcament: '',
						itemContab: elemento.itemContab,
						total: totalCCDespesaIC2,
						agrupador: true,
						agrupadorCCDesp: false,
						agrupadorGeral: false
					});
					// FIM - TOTALIZA ITEM CONTABIL
					
				});
				
				const retornoCCDesp1  = filterCCDespesa(CCDespAnterior);
				const totalCCDespesa1 = retornoCCDesp1.reduce(reducer, 0);
				
				var input = $("<input>");
				input.attr("type", "hidden");
				input.attr("id","totCCDespesa1_");
				input.val(totalCCDespesa1);
				$("body").append(input);
				
				var totalCCDespesa2 = that.trataValoresComMask(totalCCDespesa1, $("#totCCDespesa1_"));
				
				jRegistros.linhas.push({
					seqPF: '',
					data: '',
					solicitante: '',
					centroCusto: '',
					centroCustoDesp: CCDespAnterior,
					contaOrcament: '',
					itemContab: ICAnterior,
					total: totalCCDespesa2,
					agrupador: false,
					agrupadorCCDesp: true,
					agrupadorGeral: false
				});
				
				
				const totalGeral = jRegistros.linhas.reduce(reducerGeral, 0);
				
				var input = $("<input>");
				input.attr("type", "hidden");
				input.attr("id","totGeral");
				input.val(totalGeral);
				$("body").append(input);
				
				var totalGeral1 = that.trataValoresComMask(totalGeral, $("#totGeral"));
				
				jRegistros.linhas.push({
					seqPF: '',
					data: '',
					solicitante: '',
					centroCusto: $("#codmeuCentroCusto").val() + ' - ' + $("#desmeuCentroCusto").val(),
					centroCustoDesp: '',
					contaOrcament: '',
					itemContab: '',
					total: totalGeral1,
					agrupador: false,
					agrupadorCCDesp: false,
					agrupadorGeral: true
				});

				var template = document.getElementById('templateOrcamento').innerHTML;
				var rendered = Mustache.render(template, jRegistros);
				document.getElementById('divOrcamento').innerHTML = rendered;
			}, // agrupaCCDespesa
			
			agrupaItemContabil: function(jTemplate) {
				var that = this;
				const array = jTemplate.linhas;
				const resultItemContab = [];
				const map = new Map();
				for (const item of array) {
				    if(!map.has(item.itemContab)){
				        map.set(item.itemContab, true);    // set any value to Map
				        resultItemContab.push({
							seqPF: item.seqPF,
							data: item.data,
							solicitante: item.solicitante,
							centroCusto: item.centroCusto,
							centroCustoDesp: item.centroCustoDesp,
							contaOrcament: item.contaOrcament,
							itemContab: item.itemContab,
							total: item.total
				        });
				    }
				}
				
				const comparar = (a, b) => {
					var z = 'zzzzzzzzzz';
					a.itemContab = (a.itemContab == '' ? z : a.itemContab);
					b.itemContab = (b.itemContab == '' ? z : b.itemContab);
					if (a.itemContab > b.itemContab) {
						a.itemContab = (a.itemContab == z ? '' : a.itemContab);
						b.itemContab = (b.itemContab == z ? '' : b.itemContab);
						return 1;
					}
					if (a.itemContab < b.itemContab) {
						a.itemContab = (a.itemContab == z ? '' : a.itemContab);
						b.itemContab = (b.itemContab == z ? '' : b.itemContab);
						return -1;
					}
					
					return 0;
				};
				resultItemContab.sort(comparar);

				const filterItems = (query) => {
					return jTemplate.linhas.filter(el => el.itemContab == query);
				};
				
				const filterCCDesp = (query) => {
					return jTemplate.linhas.filter(el => el.itemContab == '' && el.centroCustoDesp == query);
				};
				
				const reducer = (valorTotal, elemento) => valorTotal += that.convertParaFloat(elemento.total);
				const reducerGeral = (valorTotal, elemento) => {
					if (elemento.centroCusto.trim() != '') {
						valorTotal += that.convertParaFloat(elemento.total)
					}
					return valorTotal;
				};

				const jRegistros = {};
				jRegistros.linhas = new Array();
				
				// Faz o agrupamento por Item Contábil
				resultItemContab.forEach(function(elemento, indice){
					const retorno = filterItems(elemento.itemContab);
					
					if (elemento.itemContab.trim() == '') {
						const aCCDesp = retorno;
						const resultCCDesp = [];
						const map = new Map();
						for (const item of aCCDesp) {
						    if(!map.has(item.centroCustoDesp)){
						        map.set(item.centroCustoDesp, true);    // set any value to Map
						        resultCCDesp.push({
									seqPF: item.seqPF,
									data: item.data,
									solicitante: item.solicitante,
									centroCusto: item.centroCusto,
									centroCustoDesp: item.centroCustoDesp,
									contaOrcament: item.contaOrcament,
									itemContab: item.itemContab,
									total: item.total
						        });
						    }
						}
						
						resultCCDesp.forEach(function(elemento1, indice1){
							const retornoCCDesp = filterCCDesp(elemento1.centroCustoDesp);
							jRegistros.linhas = jRegistros.linhas.concat(retornoCCDesp);
							
							const totalCCDesp = retornoCCDesp.reduce(reducer, 0);
							
							var input = $("<input>");
							input.attr("type", "hidden");
							input.attr("id","totCCDesp_" + elemento1.seqPF);
							input.val(totalCCDesp);
							$("body").append(input);
							
							var totalCCDesp1 = that.trataValoresComMask(totalCCDesp, $("#totCCDesp_" + elemento1.seqPF));
							
							jRegistros.linhas.push({
								seqPF: '',
								data: '',
								solicitante: '',
								centroCusto: '',
								centroCustoDesp: elemento1.centroCustoDesp,
								contaOrcament: '',
								itemContab: elemento1.itemContab,
								total: totalCCDesp1,
								agrupador: false,
								agrupadorCCDesp: true,
								agrupadorGeral: false
							});
						});
					} else {
						jRegistros.linhas = jRegistros.linhas.concat(retorno);
					}

					const totalItemContab = retorno.reduce(reducer, 0);
					
					var input = $("<input>");
					input.attr("type", "hidden");
					input.attr("id","totItemContabil_" + elemento.seqPF);
					input.val(totalItemContab);
					$("body").append(input);
					
					var totalItemC = that.trataValoresComMask(totalItemContab, $("#totItemContabil_" + elemento.seqPF));
					
					jRegistros.linhas.push({
						seqPF: '',
						data: '',
						solicitante: '',
						centroCusto: '',
						centroCustoDesp: elemento.centroCustoDesp,
						contaOrcament: '',
						itemContab: elemento.itemContab,
						total: totalItemC,
						agrupador: true,
						agrupadorCCDesp: false,
						agrupadorGeral: false
					});
				});
				
				const totalGeral = jRegistros.linhas.reduce(reducerGeral, 0);
				
				var input = $("<input>");
				input.attr("type", "hidden");
				input.attr("id","totGeral");
				input.val(totalGeral);
				$("body").append(input);
				
				var totalGeral1 = that.trataValoresComMask(totalGeral, $("#totGeral"));
				
				jRegistros.linhas.push({
					seqPF: '',
					data: '',
					solicitante: '',
					centroCusto: $("#codmeuCentroCusto").val() + ' - ' + $("#desmeuCentroCusto").val(),
					centroCustoDesp: '',
					contaOrcament: '',
					itemContab: '',
					total: totalGeral1,
					agrupador: false,
					agrupadorCCDesp: false,
					agrupadorGeral: true
				});
				
				console.log('jRegistros');
				console.log(jRegistros);

				var template = document.getElementById('templateOrcamento').innerHTML;
				//var rendered = Mustache.render(template, jTemplate);
				var rendered = Mustache.render(template, jRegistros);
				document.getElementById('divOrcamento').innerHTML = rendered;
			}, // agrupaItemContabil
			
			trataValoresComMask: function(valor, campo) {
				valor = valor.toFixed(2);
				valor = valor.split(".").join(",");
				
				campo.val(valor);
				
				campo.maskMoney({thousands:'.', decimal:',', allowZero:true, affixesStay: true});
				campo.maskMoney('mask');
				campo.maskMoney('destroy');
				
				return campo.val();
			}, // trataValoresComMask
			
			filterByItemContabil: function(obj) {
				if ('itemContab' in obj && typeof(obj.itemContab) === 'string' && !isNaN(obj.itemContab)) {
					return true;
				} else {
					return false;
				}
			}, // filterByItemContabil
			
			buscaSolicitante: function(user) {
				try {
					//Campos que irá trazer
					var fields = new Array("colleaguePK.colleagueId", "colleagueName", "mail", "login");
					
					//Monta as constraints para consulta
					var constraints = new Array();
					constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST));
					
					//Define os campos para ordenação
					var sortingFields = new Array("colleagueName");
					
					//Busca o dataset
					var dataset = DatasetFactory.getDataset("colleague", fields, constraints, sortingFields);
					var count   = dataset.values.length;
					
					if (count == 0) {
						alert("Solicitante não encontrado!");
					} else {
						return dataset.values[0];
					}
				} catch (e) {
					// TODO: handle exception
					console.log("ERRO: " + e);
					alert("ERRO: " + e);
				}
			}, // FIM - buscaSolicitante
			
		    buscaDadosAdicionais: function(callback) {
		    	$.ajax({
		    	     url : "/api/public/2.0/users/getCurrent",
		    	     type : 'get',
		    	     async: false
		    	})
		    	.done(function(msg){
		    	     callback(msg);
		    	})
		    	.fail(function(jqXHR, textStatus, msg){
		    		callback(msg);
		    	}); 
		    }, // buscaDadosAdicionais
		    
		    verificaSolicitacao: function() {
		    	var selAno          = $("#selAno").val();
		    	var ccSol           = $("#codCCSolicitante").val();
		    	var tipoOrcamento   = $("input[name='tipoOrcamento']:checked").val();
		    	var meuCC           = $("#codmeuCentroCusto").val();
		    	var txtWKNumProcess = $("#txtWKNumProcess").val();

		    	if (ccSol == '11002' || ccSol == '11102' || ccSol == '11105' || ccSol == '11106') {
		    		return new Array();
		    	} else {
					try {
						//Campos que irá trazer
						var fields = new Array();
						
						//Monta as constraints para consulta
						var constraints = new Array();
						constraints.push(DatasetFactory.createConstraint("selAno", selAno, selAno, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint("tipoOrcamento", tipoOrcamento, tipoOrcamento, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint("codCCSolicitante", ccSol, ccSol, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint("statusProcess", 'Cancelada', 'Cancelada', ConstraintType.MUST_NOT));
						
						//if (ccSol == '11002' || ccSol == '11102' || ccSol == '11105' || ccSol == '11106') {
						//	constraints.push(DatasetFactory.createConstraint("codmeuCentroCusto", meuCC, meuCC, ConstraintType.MUST));
						//} else {
							constraints.push(DatasetFactory.createConstraint("codmeuCentroCusto", ccSol, ccSol, ConstraintType.MUST));
						//}
						
						constraints.push(DatasetFactory.createConstraint("txtWKNumProcess", txtWKNumProcess, txtWKNumProcess, ConstraintType.MUST_NOT));
						constraints.push(DatasetFactory.createConstraint("userSecurityId", 'admin', 'admin', ConstraintType.MUST_NOT));
						
						//Define os campos para ordenação
						var sortingFields = new Array();
						
						//Busca o dataset
						var dataset = DatasetFactory.getDataset("dsFormOrcamento", fields, constraints, sortingFields);
						
						return dataset.values;
					} catch (e) {
						// TODO: handle exception
						console.log("ERRO: " + e);
						alert("ERRO: " + e);
						return false;
					}
		    	}
		    }, // verificaSolicitacao
		    
		    verificaSolicitacao2: function() {
		    	var selAno          = $("#selAno").val();
		    	var ccSol           = $("#codCCSolicitante").val();
		    	var tipoOrcamento   = $("input[name='tipoOrcamento']:checked").val();
		    	var meuCC           = $("#codmeuCentroCusto").val();
		    	var ccDesp          = $("#codcentroCustoDespesa").val();
		    	var coditemContabil = $("#coditemContabil").val();
		    	var contaOrc        = $("#codcontaOrcamentaria").val();
		    	var txtWKNumProcess = $("#txtWKNumProcess").val();

		    	//if (ccSol == '11002' || ccSol == '11102' || ccSol == '11105' || ccSol == '11106') {
		    	//	return new Array();
		    	//} else {
					try {
						//Campos que irá trazer
						var fields = new Array();
						
						//Monta as constraints para consulta
						var constraints = new Array();
						constraints.push(DatasetFactory.createConstraint("selAno", selAno, selAno, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint("tipoOrcamento", tipoOrcamento, tipoOrcamento, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint("codCCSolicitante", ccSol, ccSol, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint("statusProcess", 'Finalizada', 'Finalizada', ConstraintType.MUST));
						
						if (ccSol == '11002' || ccSol == '11102' || ccSol == '11105' || ccSol == '11106') {
							constraints.push(DatasetFactory.createConstraint("codmeuCentroCusto", meuCC, meuCC, ConstraintType.MUST));
							constraints.push(DatasetFactory.createConstraint("codcentroCustoDespesa", ccDesp, ccDesp, ConstraintType.MUST));
							constraints.push(DatasetFactory.createConstraint("coditemContabil", coditemContabil, coditemContabil, ConstraintType.MUST));
							constraints.push(DatasetFactory.createConstraint("codcontaOrcamentaria", contaOrc, contaOrc, ConstraintType.MUST));
						} else {
							constraints.push(DatasetFactory.createConstraint("codmeuCentroCusto", ccSol, ccSol, ConstraintType.MUST));
						}
						
						constraints.push(DatasetFactory.createConstraint("txtWKNumProcess", txtWKNumProcess, txtWKNumProcess, ConstraintType.MUST_NOT));
						constraints.push(DatasetFactory.createConstraint("userSecurityId", 'admin', 'admin', ConstraintType.MUST_NOT));
						
						//Define os campos para ordenação
						var sortingFields = new Array();
						
						//Busca o dataset
						var dataset = DatasetFactory.getDataset("dsFormOrcamento", fields, constraints, sortingFields);
						
						return dataset.values;
					} catch (e) {
						// TODO: handle exception
						console.log("ERRO: " + e);
						alert("ERRO: " + e);
						return false;
					}
		    	//}
		    }, // verificaSolicitacao2		    
		    
		    carregarDadosSolPrincipal: function() {
		    	var that = this;
		    	
		    	$("#tbOrcamento tbody tr").not('tr:first-child').remove();
		    	
		    	var existeSolicitacao = that.verificaSolicitacao2();
		        
		        if (existeSolicitacao.length > 0) {
		        	var index = existeSolicitacao.length - 1;
			        var documentId      = existeSolicitacao[index]['metadata#id'];
			        var documentVersion = existeSolicitacao[index]['metadata#version'];
			        var numProcess      = existeSolicitacao[index]['txtWKNumProcess'];
			        
			        $("#numProcessPrincipal").val(numProcess);
			        
					FLUIGC.toast({
						title: 'ATENÇÃO: ',
						message: 'Já existe solicitação Finalizada para esse Centro de Custo e Período, serão carregadas as informações nesta solicitação!',
						type: 'info'
					});
			        
			    	try {		
			    	    var constraints = new Array();
			    	    constraints.push(DatasetFactory.createConstraint("tablename", "tbOrcamento" ,"tbOrcamento", ConstraintType.MUST));
			    	    constraints.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
			    	    constraints.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));
			    	    constraints.push(DatasetFactory.createConstraint("userSecurityId", 'admin', 'admin', ConstraintType.MUST_NOT));
			    	    
			    	    var dataset = DatasetFactory.getDataset("dsFormOrcamento", null, constraints, null);
			    	    
			    	    if (dataset.values.length > 0) {
			    	    	var linhas = dataset.values;
			    	    	for (var i in linhas) {
								wdkAddChild("tbOrcamento");
								var seqPF = newId;
																
								$("#dataInclusao___" + seqPF).val(linhas[i]['dataInclusao']);
								$("#solicitanteInclu___" + seqPF).val(linhas[i]['solicitanteInclu']);
								
								$("#tipoOrcamentoPF___" + seqPF).val(linhas[i]['tipoOrcamentoPF']);
								$("#codcc___" + seqPF).val(linhas[i]['codcc']);
								$("#cc___" + seqPF).val(linhas[i]['cc']);
								$("#codccDespesa___" + seqPF).val(linhas[i]['codccDespesa']);
								$("#ccDespesa___" + seqPF).val(linhas[i]['ccDespesa']);
								$("#codcontaOrc___" + seqPF).val(linhas[i]['codcontaOrc']);
								$("#contaOrc___" + seqPF).val(linhas[i]['contaOrc']);
								$("#coditemContab___" + seqPF).val(linhas[i]['coditemContab']);
								$("#itemContab___" + seqPF).val(linhas[i]['itemContab']);
								
								$("#janeiro___" + seqPF).val(linhas[i]['janeiro']);
								$("#fevereiro___" + seqPF).val(linhas[i]['fevereiro']);
								$("#marco___" + seqPF).val(linhas[i]['marco']);
								$("#abril___" + seqPF).val(linhas[i]['abril']);
								$("#maio___" + seqPF).val(linhas[i]['maio']);
								$("#junho___" + seqPF).val(linhas[i]['junho']);
								$("#julho___" + seqPF).val(linhas[i]['julho']);
								$("#agosto___" + seqPF).val(linhas[i]['agosto']);
								$("#setembro___" + seqPF).val(linhas[i]['setembro']);
								$("#outubro___" + seqPF).val(linhas[i]['outubro']);
								$("#novembro___" + seqPF).val(linhas[i]['novembro']);
								$("#dezembro___" + seqPF).val(linhas[i]['dezembro']);
								$("#totalAno___" + seqPF).val(linhas[i]['totalAno']);
								$("#observacaoOrc___" + seqPF).val(linhas[i]['observacaoOrc']);
								
								$(".limpaCampo").val("");
								$(".limpaValor").val("0,00");
								
			    	    	}
			    	    }
					} catch (e) {
						console.log("ERRO: " + e);
						alert("ERRO: " + e);
						return false;
					}
		        } else {
		        	
		        }
		        
				that.verificaQtdeRegistrosPF();
				that.carregaOrcamentos();
		    }, // carregarDadosSolPrincipal
	}
	
	return retorno;
})();

function setSelectedZoomItem(selectedItem) {
	var that = processo;
	if (selectedItem.inputId == "meuCentroCusto"){
		$("#codmeuCentroCusto").val(selectedItem["CTT_CUSTO"].trim());
		$("#desmeuCentroCusto").val(selectedItem["CTT_DESC01"].trim());
		
		that.carregarDadosSolPrincipal();
	} else if (selectedItem.inputId == "centroCustoDespesa"){
		$("#codcentroCustoDespesa").val(selectedItem['CTT_CUSTO'].trim());
		
		that.carregarDadosSolPrincipal();
	} else if (selectedItem.inputId == "itemContabil"){
		$("#coditemContabil").val(selectedItem['CTD_ITEM'].trim());
		
		that.carregarDadosSolPrincipal();
	} else if (selectedItem.inputId == "contaOrcamentaria"){
		$("#codcontaOrcamentaria").val(selectedItem['AK5_CODIGO'].trim());
		
		that.carregarDadosSolPrincipal();
	}
}

function removedZoomItem(removedItem) {
	var that = processo;
	if (removedItem.inputId == "meuCentroCusto"){
		$("#codmeuCentroCusto").val('');
		$("#desmeuCentroCusto").val('');
				
		that.carregarDadosSolPrincipal();
	} else if (removedItem.inputId == "centroCustoDespesa"){
		$("#codcentroCustoDespesa").val('');
	} else if (removedItem.inputId == "itemContabil"){
		$("#coditemContabil").val('');
	} else if (removedItem.inputId == "contaOrcamentaria"){
		$("#codcontaOrcamentaria").val('');
	}
}

var beforeSendValidate = function(numState,nextState){
    if (numState == 0 || numState == 4) {
    } else if (numState == 5) {
    	if ($("#aprovarOrcamento").val() == '') {
    		throw("Informe se o orçamento foi Aprovado!");
    	} else if ($("#aprovarOrcamento").val() == 'Não' && $("#obsAprovOrcamento").val() == '') {
    		throw("Informe uma Observação!");
    	}
    }
}