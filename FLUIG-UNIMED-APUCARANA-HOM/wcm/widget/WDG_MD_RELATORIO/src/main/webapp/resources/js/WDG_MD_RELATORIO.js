var WDG_MD_RELATORIO = SuperWidget.extend({
    //variáveis da widget
    myTable: null,
    tableData: null,
    dataInit: null,
    dataTable: {},
    filtros: [],

    //método iniciado quando a widget é carregada
    init: function() 
    {
        if (!this.isEditMode)
        {
        	let that = this;
        	let dados = that.fLoadDataset();
        	that.fLoadDataTable(dados);
        }
        else
        {
        	
        }
    },
    
    //BIND de eventos
    bindings: {
        local: {
            'processa-aprovacao': ['click_fProcessaAprovacao'],
            'processa-reprovacao': ['click_fProcessaReprovacao'],
            'consulta-relatorio': ['click_fConsulta'],
            'pagina-anterior-relatorio': ['click_fPaginaAnterior'],
            'proxima-pagina-relatorio': ['click_fProximaPagina'],
            'obter-xml': ['click_fObterXML'],
            'adiciona-filtro': ['click_fAdicionaFiltro'],
            'eliminar-filtros': ['click_fEliminarFiltros'],
            'mais-detalhes': ['click_fMaisDetalhes'],
            'seleciona-campo':['change_fSelecionaCampo'],
            'remove-filtro': ['click_fRemoveFiltro'],
            'obter-csv': ['click_fObterCSV'],
            'obter-xls': ['click_fObterXLS']
        },
        global: {

        }
    },
    
    fObterCSV: function(htmlElement, event)
    {
    	let that = this;
    	that.JSONToCSVConvertor(JSON.stringify(that.tableData), "Relatório orçamentário " + new Date().toLocaleDateString(), true);
    },
    
    fObterXLS: function(htmlElement, event)
    {
    	let that = this;
        let cabecalho = [];
        
    	for(let campo in that.tableData[0])
    	{
    		cabecalho.push(campo);
    	}

        var downloadXlsx = pubcore, 
        testdata = {
    	cols: cabecalho.map(c => ({'name': c})),
    	rows: that.tableData,
   
      types:{column3:'n'}, 
    	filename: 'relatorio_orcamentario_'+new Date().toLocaleDateString()+'.xlsx'
    }

      downloadXlsx(testdata)
    },
    
    toExcelUrl: function(data) {
        var tsv = data.map(function(row) {
        	return row.join('\t'); 
        	}).join('\n');
        var blob = new Blob([tsv], {type:'application/vnd.ms-excel;charset=utf-8'});
        return URL.createObjectURL(blob);
    },
    
    JSONToCSVConvertor: function(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        
        var CSV = '';    
        //Set Report title in first row or line
        
        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                
                //Now convert each value to string and comma-seprated
                row += index + ';';
            }

            row = row.slice(0, -1);
            
            //append Label row with line break
            CSV += row + '\r\n';
        }
        
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + (arrData[i][index] ? arrData[i][index] : '') + '";';
            }

            row.slice(0, row.length - 1);
            
            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        
        //Generate a file name
        var fileName = "";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");   
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName  + ".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    fRemoveFiltro: function(htmlElement, event)
    {
    	let that = this;
    	let index = $(htmlElement.parentElement.parentElement).index();
    	that.filtros.splice(index, 1);
    	that.fRenderFiltro(that.filtros);
    	that.fConsulta();
    	that.fLimpaCampos();
    },
    
    fSelecionaCampo: function(htmlElement, event)
    {
    	let that = this;
    	that.fAutoComplete(that.tableData, htmlElement.value);
    },
    
    fAutoComplete: function(dados, campo)
    {
    	function substringMatcher(strs) 
    	{
    	    return function findMatches(q, cb) {
    	        var matches, substrRegex;
    	 
    	        matches = [];
    	 
    	        substrRegex = new RegExp(q, 'i');
    	 
    	        $.each(strs, function (i, str) {
    	            if (substrRegex.test(str)) {
    	                matches.push({
    	                    description: str
    	                });
    	            }
    	        });
    	        cb(matches);
    	    };
    	}
    	
    	let that = this;
    	let array = []
    	
    	campo = campo.split(";");
    		
    	for(let indice = 0; indice < dados.length; indice++)
    	{
    		let valor = dados[indice][campo[0]] + (campo[1] != undefined && campo[1] != null && campo[1].trim() != "" ? " - " + dados[indice][campo[1]]: '');
    		if (array.indexOf(valor) == -1)
    		{
    			array.push(valor);
    		}
    	}
    	
    	if (that.myAutocomplete) that.myAutocomplete.destroy();
    	
    	that.myAutocomplete = FLUIGC.autocomplete('#txt_adidescri', {
            source: substringMatcher(array),
            name: 'dsFormOrcamento',
            displayKey: 'description',
            tagClass: 'tag-gray',
            type: 'tagAutocomplete'
        });
    },
    
    fAdicionaFiltro: function(htmlElement, event)
    {
    	let that = this;
    	let filtro = {};
    	let mensagens = [];
    	let por = $("#stxt_adipor").val();
    	let descricao = $("#txt_adidescri").val();
    	let condicao = $("#stxt_condfiltro").val();
    	//----------------------------------------------------------------------------//
    	filtro.por = por;
    	filtro.descricao = descricao;
    	filtro.condicao = condicao;
    	//-------------------------------------------------------------------------------------------------------------//
    	for (campo in filtro)
    	{
    		if (filtro[campo] == undefined || filtro[campo] == null || filtro[campo].trim() == "")
    		{
    			mensagens.push("O campo '"+ campo+ "' está indefinido, nulo ou vazio")
    		}
    	}

    	if (mensagens && mensagens.length)
    	{
	        FLUIGC.toast({
	            message: mensagens[0],
	            type: 'warning'
	        });
    	} 
    	else
    	{
    		that.filtros.push(filtro);
    		that.fLimpaCampos();
        	//----------------------------------------------------------------//
        	that.fRenderFiltro(that.filtros);
        	that.fConsulta();
    	}
    },
    
    fLimpaCampos: function()
    {
    	let that = this;
    	$("#stxt_adipor, #txt_adidescri, #stxt_condfiltro").val("");
    	if (that.myAutocomplete) 
    	{
    		that.myAutocomplete.removeAll();
    	}
    },
    
    fRenderFiltro: function(dados = [])
    {
    	let tpl = $('.tpl-continuous-scroll').html();
        let html = Mustache.render(tpl, {"items": dados});
        $('[data-your-scroll-content]').html(html);
    },
    
    fMaisDetalhes: function(htmlElement, event)
    {
    	let that = this;
    	let length = that.myTable.getData().length;
    	
    	if (length && that.myTable.selectedRows().length)
    	{
    		let indice = that.myTable.selectedRows()[0];
    		let source = that.myTable.getRow(indice)
    		that.fModal('maisDetalhes', [{"Janeiro": source.orcJan, "Fevereiro": source.orcFev, "Marco": source.orcMar, "Abril": source.orcAbr, "Maio": source.orcMai, "Junho": source.orcJun, "Julho": source.orcJul, "Agosto": source.orcAgo, "Setembro": source.orcSet, "Outubro": source.orcOut, "Novembro": source.orcNov, "Dezembro": source.orcDez, "Total": source.totalOrcado}]);
    	}
    },
    
    fObterXML: function(htmlElement, event)
    {
    	let that = this;
    	that.fMontaXML(that.tableData);
    },
    
    fMontaXML: function(dados = [])
    {
    	//let parser, xmlDoc;
    	let that = this;
    	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    	xml += '<root>';
    	xml += '<processo idProcesso="0001" dtMovimento="'+new Date().toLocaleDateString()+'">';
    	xml += '<itens>';
    	//parser = new DOMParser();
    	//xmlDoc = parser.parseFromString(xml,"text/xml");
    	
    	for(let indice = 0; indice < dados.length; indice++)
    	{
    		
    		let classe = "";
    		let tipo = "";
    		let codcontaOrcamentaria = dados[indice].codcontaOrcamentaria;
    		
    		if (codcontaOrcamentaria != undefined && 
    				codcontaOrcamentaria != null && codcontaOrcamentaria.trim() != "")
    		{	
	    		let c = codcontaOrcamentaria.charAt(0)
	    		
	    		switch(parseInt(c))
	    		{
	    			case 1: classe="000001"; tipo="1"; break;
	    			case 2: classe="000002"; tipo="2"; break;
	    			case 3: classe="000003"; tipo="2"; break;
	    		}
	    		
	    		switch(parseInt(codcontaOrcamentaria))
	    		{
	    			case 112: 
	    			case 114:
	    			case 1141:
	    			case 11411:
	    			case 11412:
	    			case 1142:
	    			case 11421: 
	    			case 132: tipo="2"; break;
	    			case 2331: 
	    			case 23311: 
	    			case 234:
	    			case 2341:
	    			case 23411:
	    			case 23412: tipo="1"; break;
	    		}
	    		
	    		
	    		tipo = "1";
	    		
	    		let coditemContabil = (dados[indice].coditemContabil ? dados[indice].coditemContabil : '');
	    		let codcentroCustoDespesa = (dados[indice].codcentroCustoDespesa ? dados[indice].codcentroCustoDespesa: '');
	    		let codmeuCentroCusto = (dados[indice].codmeuCentroCusto ? dados[indice].codmeuCentroCusto: '');
	    		xml += '<!--INÍCIO ITEM '+(indice+1)+'-->';
	    		//JANEIRO
	    		xml += '<item DTPLANEJ="01/01/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcJan.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//FEVEREITO
	    		xml += '<item DTPLANEJ="01/02/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcFev.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//MARÇO
	    		xml += '<item DTPLANEJ="01/03/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcMar.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//ABRIL
	    		xml += '<item DTPLANEJ="01/04/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcAbr.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//MAIO
	    		xml += '<item DTPLANEJ="01/05/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcMai.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//JUNHO
	    		xml += '<item DTPLANEJ="01/06/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcJun.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//JULHO
	    		xml += '<item DTPLANEJ="01/07/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcJul.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//AGOSTO
	    		xml += '<item DTPLANEJ="01/08/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcAgo.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//SETEMBRO
	    		xml += '<item DTPLANEJ="01/09/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcSet.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//OUTUBRO
	    		xml += '<item DTPLANEJ="01/10/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcOut.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//NOVEMBRO
	    		xml += '<item DTPLANEJ="01/11/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcNov.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		//DEZEMBRO
	    		xml += '<item DTPLANEJ="01/12/'+dados[indice].selAno+'" VALOR="'+dados[indice].orcDez.replaceAll(".", "").replace(",", ".")+'" CO="'+dados[indice].codcontaOrcamentaria+'" CLASSE="'+classe+'" CC="'+codcentroCustoDespesa+'" ITCTB="'+coditemContabil+'" CLVLR="'+codmeuCentroCusto+'" IDREF="00001" ID="1" TIPO="'+tipo+'"/>';
	    		
	    		xml += '<!--FIM ITEM '+(indice+1)+'-->';
    		}
    	}
    	
    	xml += '</itens>';
    	xml += '</processo>';
    	xml += '</root>';
    	
    	that.fDownload("relatorioOrcamentario__"+new Date().toLocaleDateString()+".xml", xml);
    },
    
    fLoad: function()
    {
    	
    },
    
    fPaginaAnterior: function(htmlElement, event)
    {
    	let that = this;
    	if (that.currentPageIndex > 0)
    	{
        	that.currentPageIndex--;
    		let inicio = that.currentPageIndex*10;
    		let fim = (that.currentPageIndex+1)*10;
    		that.myTable.reload(that.tableData.slice(inicio, fim));
    	}
    },
    
    fProximaPagina: function(htmlElement, event)
    {
    	let that = this;
    	let nPages = Math.ceil(that.tableData.length / 10);
    	if (that.currentPageIndex < nPages-1)
    	{
        	that.currentPageIndex++;
        	let inicio = that.currentPageIndex*10;
        	let fim = (that.currentPageIndex+1)*10;
        	that.myTable.reload(that.tableData.slice(inicio, fim));
    	}
    },
    
    fLoadDataset: function(constraints = [])
    {
    	let that = this;
    	constraints.push(DatasetFactory.createConstraint('statusProcess', 'Cancelada', 'Cancelada', ConstraintType.MUST_NOT));
    	let dados = DatasetFactory.getDataset('dsFormOrcamento', null, constraints, ["documentid;desc"]).values;
    	//----------------------------------------------------------------------------------------------------------------------------//
    	return dados;
    },
    
   	fDownload : function(filename, text) 
   	{
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		  element.setAttribute('download', filename);
		  element.style.display = 'none';
		  document.body.appendChild(element);
		  element.click();
		  document.body.removeChild(element);
	},
    
    fLoadDataTable: function(dados = [])
    {

    	//-------------------------------------------------------------------------------------------------------------//
    	let that = this;

    	that.myTable = FLUIGC.datatable('#idtableRelatorio', {
    	    dataRequest: dados,
            renderContent: '.template_datatable',
            header: [
            	{'title': ''},
            	{'title': 'Ano'},
                {'title': 'Data Solicitação'},
                {'title': 'C.C Solicitante'},
                {'title': 'C.C Despesa'},
                {'title': 'Conta Orçamentária'},
                {'title': 'Item contábil'},
                {'title': 'Tipo Orçamento'},
                {'title': 'Status'},
                {'title': 'Solicitante'} 
            ],
    	    //multiSelect: true,
    	    //classSelected: 'info',
    	    tableStyle: 'table-condensed table-hover',
    	    search: {
    	        enabled: false,
    	        onSearch: function(response) {
    	            // DO SOMETHING
    	        },
    	        onlyEnterkey: true,
    	        searchAreaStyle: 'col-md-4'
    	    },
    	    scroll: {
    	        target: '#idtableRelatorio',
    	        enabled: true,
    	        onScroll: function() {
    	            // DO SOMETHING
    	        }
    	    },
    	    actions: {
    	        enabled: true,
    	        template: '.template_area_buttons_relatorio',
    	        actionAreaStyle: 'col-md-8'
    	    },
    	    navButtons: {
    	        enabled: false,
    	        forwardstyle: 'btn-info',
    	        backwardstyle: 'btn-info',
    	    },
    	   // mobileMainColumns: [0,1,3,5,6],
    	}, function(err, data) {
    	    // DO SOMETHING (error or success)
    		if(data) {
                dataInit = data;
            }
            else if (err) {
                FLUIGC.toast({
                    message: err,
                    type: 'danger'
                });
            }
    	});
    	that.tableData = that.myTable.getData();
    	that.currentPageIndex = 0;
    	that.myTable.reload(that.tableData.slice(0,10));
    	$("#TotalRelatorio").text("R$ "+ that.fSoma(0.00, dados, 'totalOrcado').toFixed(2));
    },
    
    fSoma: function(total = 0.00, dados, campo)
    {
    	for(let indice = 0; indice < dados.length; indice++)
    	{
    		let _valor = dados[indice][campo];
    		if (_valor != undefined && _valor != null && _valor.trim() != "")
    		{
    			let valor = parseFloat(_valor.replace(".",""));
    			if (!Number.isNaN(valor))
    			total += valor;
    		}
    	}
    	return total;
    },
    
    fConsulta: function(htmlElement, event)
    {
    	let that = this;
    	let dados = that.fLoadDataset();
    	for(let indice = 0; indice < that.filtros.length; indice++)
    	{
    		let condicao = that.filtros[indice].condicao;
    		let por = that.filtros[indice].por.split(";");
    		let descricao = that.filtros[indice].descricao.split("-");
	    	switch(condicao)
	    	{
	    		case "=": 
	    			dados = dados.filter(function(element)
	    			{
	    				return element[por[0]] == descricao[0].trim();
	    			});
	    			break;
	    		case "!=": 
	    			dados = dados.filter(function(element)
	    			{
	    				return element[por[0]] != descricao[0].trim();
	    			});
	    			break;
	    		case "<":
	    			dados = dados.filter(function(element)
	    			{
	    				return parseFloat(element[por[0]]) < parseFloat(descricao[0].trim());
	    			});
	    			break;
	    		case ">": 
	    			dados = dados.filter(function(element)
	    			{
	    				return parseFloat(element[por[0]]) > parseFloat(descricao[0].trim());
	    			});
	    			break;
	    		case "<=": 
	    			dados = dados.filter(function(element)
	    			{
	    				return parseFloat(element[por[0]]) <= parseFloat(descricao[0].trim());
	    			});
	    			break;
	    		case ">=": 
	    			dados = dados.filter(function(element)
	    			{
	    				return parseFloat(element[por[0]]) >= parseFloat(descricao[0].trim());
	    			});
	    			break;
	    		case "QC": 
	    			dados = dados.filter(function(element)
	    			{
	    				if (element[por[0]] != undefined && element[por[0]] != null)
	    					return element[por[0]].toUpperCase().indexOf(descricao[0].trim().toUpperCase()) >= 0;	
	    			});
	    			break;
	    		case "QNC": 
	    			dados = dados.filter(function(element)
	    			{
	    				if (element[por[0]] != undefined && element[por[0]] != null)
	    					return element[por[0]].toUpperCase().indexOf(descricao[0].trim().toUpperCase()) == -1;
	    				
	    			});
	    			break;
	    	}
    	}
    	
    	that.fLoadDataTable(dados);
    },
    
    fModal: function(tabela, dados = [])
    {
    	let that = this;
    	let cConteudo = "";
    	let cTitulo = '';
    	let renderContent = [];
    	for(campo in dados[0]) renderContent.push(campo);
    	
    	debugger
    	
        cConteudo +="   <div class='row'>";
        cConteudo +="   <div class='form-field col-xs-12 col-sm-12 col-md-12'>";
        cConteudo +="   <div class='btn-group form-field col-xs-12 col-sm-12 col-md-12' style='text-align: center;'>";
        cConteudo +="   </div>";
        cConteudo +="   </div>";
        cConteudo +="   </div>";

        cConteudo +="   <div style='height: 200px;'>";
		cConteudo +="	<div id='idtable__"+that.instanceId+"'>";
    	cConteudo += "	</div>";
        cConteudo +="   </div>";

    	var myModal = FLUIGC.modal({
    	    title:cTitulo,
    	    content: cConteudo,
    	    id: 'fluig-modal-mais-detalhes',
    	    actions: [{
    	    	'label': 'OK',
    	    	'bind': 'data-modal-mais-detalhes',
    	    	'autoClose': true
    	    }],
    	    size: 'full'	
    	}, function(err, data) {
    	    if(err) {
    	        // do error handling
    	    } else {
    	        // do something with data
    	    	that.dataTable[tabela] = FLUIGC.datatable('#idtable__' + that.instanceId, {
    	    	    dataRequest: dados,
    	    	    multiSelect: true,
    	    	    renderContent: renderContent,
    	    	    header: [
//    	                {'title': 'Nome'},
//    	                {'title': 'Solicitante'},    
//    	                {'title': 'Valor'},
//    	                {'title': 'Data'}
    	    	    ],
    	            search: {
    	                enabled: false
    	                },
    	            navButtons: {
    	            	enabled: false
    	            },
    				scroll: {
    					target: ".target",
    					enabled: false
    				},
    	            actions: {
    	            	enabled: true,
    	            	template : '',
    	            	actionAreaStyle: 'col-md-9'
    	            },
    	            classSelected: 'info',
    	    	}, function(err, data) {
    	    	    // DO SOMETHING (error or success)
    	    	});
    	    }
    	});
    }
});

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}