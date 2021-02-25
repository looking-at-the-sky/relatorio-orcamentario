<div id="WDG_MD_RELATORIO" class="super-widget wcm-widget-class fluig-style-guide"
    data-params="WDG_MD_RELATORIO.instance()">
<div class="row">
    <div class="col-md-12">
    <div class="panel-group">
        <div class="panel" id="p-quad-ativ">
            <div class="panel-heading" id="p-h-quad-ativ">
	            <div class="col-md-8">
	                <h3 style="color:#000000; margin:0px 25px;" >
	                        Relatório
	                </h3>
	            </div>
	            <div class="col-md-4">
<!-- 	            		<button class="btn btn-primary" data-obter-xml>Obter XML</button> -->
						<div class="btn-group" style="float: right">
						    <button type="button" class="btn btn-primary" data-obter-xml>Obter XML</button>
						    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
								<i class="flaticon flaticon-chevron-down icon-sm"></i>
						    </button>
						    <ul class="dropdown-menu" role="menu">
						        <li><a href="#" data-obter-csv>Obter CSV</a></li>
						        <li><a href="#" data-obter-xls>Obter XLS</a></li>
						    </ul>
						</div>
	            </div>
            </div>
            <div>
                <div class="panel-body">
                    <div class="panel-group">
                        <div class="panel" id="p-head-interno">
                            <div class="panel-heading" id="p-h-quad-ativ-interno">
                                <h4 style="color:#000;">
                                   
                                        Filtro
                                   
                                </h4>
                            </div>
                            <div>
                                <div class="panel-body">
                                <div class="row" id="camposRelatorio">
                                        <div class='form-group  col-md-4 col-xs-12 col-sm-2'>
                                            <label for="stxt_adipor">${i18n.getTranslation('stxt_adipor')}</label>
                                            <select class='form-control' id="stxt_adipor" name="stxt_adipor" data-seleciona-campo>
                                            
                                                <option value="" selected disabled>Selecionar...</option>
                                                <option value="selAno">Ano</option>
                                                <option value="dataSolicitacao">Data solicita&ccedil;&atilde;o</option>
                                                <option value="codCCSolicitante;desCCSolicitante">C.C Solicitante</option>
                                                <option value="codcentroCustoDespesa;centroCustoDespesa">C.C Despesa</option>
                                                <option value="codcontaOrcamentaria;contaOrcamentaria">Conta Or&ccedil;ament&aacute;ria</option>
                                                <option value="coditemContabil">Item Cont&aacute;bil</option>
                                                <option value="tipoOrcamento">Tipo Or&ccedil;amento</option>
                                                <option value="statusProcess">Status</option>
                                                <option value="nomeSolicitante">Solicitante</option>
                                            </select>
                                        </div>

                                        <div class='form-group  col-md-3 col-xs-12 col-sm-2'>
                                            <label for="stxt_condfiltro">${i18n.getTranslation('stxt_condfiltro')}</label>
                                            <select class='form-control' id="stxt_condfiltro" name="stxt_condfiltro">
                                                <option value="" selected disabled>Selecionar...</option>
	                                            <option value="=">=</option>
                                                <option value="!=">!=</option>
                                                <option value="<"><</option>
                                                <option value=">">></option>
                                                <option value="<="><=</option>
                                                <option value=">=">>=</option>
                                            </select>
                                        </div>

                                        <div class='form-group  col-md-3 col-xs-12 col-sm-2'>
                                            <label for="txt_adidescri">${i18n.getTranslation('txt_adidescri')}</label>
                                            <input type="text" class="form-control" id="txt_adidescri"
                                                name="txt_adidescri">
                                        </div>
                                        
                                        <div class="col-md-2 col-xs-12 col-sm-2">
                                        	<label></label><br />
                                        	<div class="fs-margin-auto form-group">
                                        	    <button type="button" class="btn btn-primary form-control" data-adiciona-filtro>Adicionar filtro</button>
											</div>
                                        </div>
                                        
                                    </div>
                                    
                                    <div id="filtro_itens" class="row" data-your-scroll-content></div>
                                        <script type="text/template" class="tpl-continuous-scroll">
                                        <ul class="pagination">
									        {{#items}}
									            <li><a class="fs-cursor-pointer"><span style="text-transform: uppercase;">{{por}}</span> {{condicao}} <span style="text-transform: uppercase;">{{descricao}}</span><i class="text-danger fluigicon fluigicon-remove icon-sm" data-remove-filtro></i></a></li>
									        {{/items}}
									    </ul>
									    </script>
                                    </div>
                                
                                    <div class='row fs-display-none'>
                                    <div class="col-md-12">
                                        <div class='form-group  col-md-12 col-xs-12 col-sm-2'>
                                            <button type="button" class="form-control btn btn-primary" data-consulta-relatorio>Consultar</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

              <div class="panel-body" >
                <div class="panel-group" >
                    <div class="panel panel-default" style="border-radius: 0px 0px 50px 50px;">
                        <!-- <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a class="collapse-icon" data-toggle="collapse" data-parent="#accordionRel"
                                        href="#collapseTwo">
                                        Teste
                                    </a>
                                </h4>
                            </div>-->
							<!--                     Table -->

							<div class="table-responsive">
								<div id="idtableRelatorio" ></div>
							</div>

<!--                     End Table -->

                        <div class="row">
	                         <div class="col-md-12" style="margin-top: 15px">
	                         	 <div class="col-md-10"></div>
                                 <div class="col-md-2">
                                     <p
                                         class="fs-txt-center" style="font-family: Arial;font-style: normal;font-weight: normal;font-size: 24px;line-height: 26px;">
                                         Total</p>
                                 </div>
                             </div>
                                <div class="col-md-12">
                                	<div class="col-md-10"></div>
                                    <div class="col-md-2">
                                        <p
                                            id="TotalRelatorio" class="fs-txt-center" style="font-family: Arial;font-style: normal;font-weight: bold;font-size: 24px;line-height: 26px;">
                                            R$ 0,00</p>
                                    </div>
                                </div>
	                         </div>
                        </div>
                    </div>
                </div>
            </div>
                    
                </div>
            </div>
          
        </div>
    </div>
</div>
</div>

<script type="text/template" class="template_area_buttons_relatorio">
<div style="margin-left: 5px; margin-top: 5px">
<button class="btn btn-primary" data-pagina-anterior-relatorio><<</button>
<button class="btn btn-primary" data-proxima-pagina-relatorio>>></button>
</div>
</script>

<script type="text/template" class="template_datatable">
    <tr>
    	<td><a data-mais-detalhes><i class="fluigicon fluigicon-search icon-sm"></i></a></td>
    	<td>{{selAno}}</td>
    	<td>{{dataSolicitacao}}</td>
    	<td>{{codCCSolicitante}} - {{desCCSolicitante}}</td>
    	<td>{{codcentroCustoDespesa}} - {{centroCustoDespesa}}</td>
		<td>{{codcontaOrcamentaria}} - {{contaOrcamentaria}}</td>
		<td>{{coditemContabil}} - {{itemContabil}}</td>
		<td>{{tipoOrcamento}}</td>
		<td>{{statusProcess}}</td>
		<td>{{nomeSolicitante}}</td>
    </tr>
</script>
<script src='/webdesk/vcXMLRPC.js' type="text/javascript"></script>
<script src='https://cdn.rawgit.com/pubcore/download-xlsx/master/dist/index.js' type="text/javascript"></script>