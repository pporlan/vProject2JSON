// ------------------
// Globals
// ------------------
var exportLegacyProjects = false;
var exportSubObjects = false;
var exportProperties = false;
var projects = [];
var files = [];
var directory = "";

// ---------------------------------
// Export project to JSON
// ---------------------------------
function exportProject(projectInfo, timestamp)
{
	if(!timestamp){
		timestamp = new Date().toISOString().slice(0, 19).replace(/\D/g, "");
		projects = [];
		files = [];
	}

	if(projects.indexOf(projectInfo.id()) !== -1){
		return;
	}
	projects.push(projectInfo.id());

	var projectData = {
		id      : projectInfo.id(),
		alias   : projectInfo.alias(),
		name    : projectInfo.name(),
		type    : projectInfo.type(),
		version : projectInfo.version(),
		objects : []
	};
	
	for(var i in objectTypes()){
		for(var j = 0; j < projectInfo.objectCount(i); j++){
			projectData.objects.push(getObjectData(projectInfo.objectInfo(i, j)));
		}
	}

	// ------------------------
	// Write JSON file
	// ------------------------
	var path = directory + "/" + timestamp + "_" + projectInfo.id() + ".json";
	var path = directory + "/" + timestamp + "_" + (projectInfo.alias() ? projectInfo.alias() : projectInfo.name()).replace(/\W/g, "") + "_" + projectInfo.id() + ".json";
	files.push(path);
	var file = theExtension.newFile(path);
	file.open(0x0002);
	file.write(JSON.stringify(projectData, null, '\t'));
	file.flush();
	file.close();
	
	if(exportLegacyProjects){
		for(var i = 0; i < projectInfo.legacyProjectCount(); i++){
			exportProject(projectInfo.legacyProjectInfo(i), timestamp);
		}
	}
}

function getObjectData(objectInfo){
	var objectData = {
		id         : objectInfo.id(),
		comments   : objectInfo.comments(),
		name       : objectInfo.name(),
		type       : objectInfo.type(),
		typeName   : getObjectTypeName(objectInfo.type()),
	};
	if(exportProperties){
		objectData.properties = [];
		for(var i = 0; i < objectInfo.propertyCount(); i++){
			var property = {
				name         : objectInfo.propertyName(i),
				dataType     : objectInfo.propertyDataType(i),
				dataTypeName : getPropertyDataTypeName(objectInfo.propertyDataType(i)),
				editType     : objectInfo.propertyEditType(i),
				editTypeName : getPropertyEditTypeName(objectInfo.propertyEditType(i)),
				data         : getPropertyData(objectInfo.propertyDataType(i), objectInfo.propertyData(i)),
			};
			objectData.properties.push(property);
		}
	}
	if(exportSubObjects){
		objectData.subObjects = [];
		for(var i in objectTypes()){
			for(var j = 0; j < objectInfo.subObjectCount(i); j++){
				objectData.subObjects.push(getObjectData(objectInfo.subObjectInfo(i, j)));
			}
		}
	}
	return objectData;
}

function getPropertyData(type, data){
	//return data;
	return JSON.stringify(data);
}

// -------------------------------------
// Object types
// -------------------------------------
function objectTypes(){
	/*
	return [
		VObjectInfo.TypeTable,
		VObjectInfo.TypeField,
		VObjectInfo.TypeIndex,
		VObjectInfo.TypeIndexPart,
		VObjectInfo.TypePluralBind,
		VObjectInfo.TypeUpdate,
		VObjectInfo.TypeUpdateComponent,
		VObjectInfo.TypeComplexIndex,
		VObjectInfo.TypeComplexIndexPart,
		VObjectInfo.TypeVariable,
		VObjectInfo.TypeStaticTable,
		VObjectInfo.TypeStaticTableItem,
		VObjectInfo.TypeTrigger,
		VObjectInfo.TypePicture,
		VObjectInfo.TypeGrid,
		VObjectInfo.TypeGridCol,
		VObjectInfo.TypeTree,
		VObjectInfo.TypeSlot,
		VObjectInfo.TypeForm,
		VObjectInfo.TypeControl,
		VObjectInfo.TypeSubcontrol,
		VObjectInfo.TypeMultiView,
		VObjectInfo.TypeLogicPrinter,
		VObjectInfo.TypeReport,
		VObjectInfo.TypeReportSection,
		VObjectInfo.TypeReportControl,
		VObjectInfo.TypeReportGrouping,
		VObjectInfo.TypeReportCalcution,
		VObjectInfo.TypeQuery,
		VObjectInfo.TypeQueryComponent,
		VObjectInfo.TypeFilterGlass,
		VObjectInfo.TypeFinder,
		VObjectInfo.TypeFinderIndex,
		VObjectInfo.TypeBasket,
		VObjectInfo.TypeProcess,
		VObjectInfo.TypeFunction,
		VObjectInfo.TypeEventConnection,
		VObjectInfo.TypeEventSlot,
		VObjectInfo.TypeInstruction,
		VObjectInfo.TypeDll,
		VObjectInfo.TypeAction,
		VObjectInfo.TypeMenu,
		VObjectInfo.TypeToolbar,
		VObjectInfo.TypeActionLauncher,
		VObjectInfo.TypeListPipe,
		VObjectInfo.TypeRecordPipe,
		VObjectInfo.TypeTcpProtocol,
		VObjectInfo.TypeConstant,
		VObjectInfo.TypeFrame,
		VObjectInfo.TypeDock,
		VObjectInfo.TypeFormBlock,
		VObjectInfo.TypeDrop,
		VObjectInfo.TypeQueue,
		VObjectInfo.TypeScheme,
		VObjectInfo.TypeSchemeItem,
		VObjectInfo.TypeDllFunction,
		VObjectInfo.TypeInsertion,
		VObjectInfo.TypeSerialPort,
		VObjectInfo.TypeDllFunctionParam,
		VObjectInfo.TypeAttachedFile,
		VObjectInfo.TypeSvgImage,
		VObjectInfo.TypeSvgControl,
		VObjectInfo.TypeSubindexator,
		VObjectInfo.TypeIntercomunicator,
		VObjectInfo.TypeStyleCondition,
		VObjectInfo.TypeViewFlow,
		VObjectInfo.TypeListAlternator,
		VObjectInfo.TypeComboView,
		VObjectInfo.TypeListView,
		VObjectInfo.TypeQmlList,
		VObjectInfo.TypeUserRole,
		VObjectInfo.TypeAuxModel,
		VObjectInfo.TypeAdvancedGrid,
		VObjectInfo.TypeAdvancedGridCol,
		VObjectInfo.TypeAdvancedGridBand,
		VObjectInfo.TypeQmlForm,
		VObjectInfo.TypeFieldMigrator,
		VObjectInfo.TypeFormExtRecord,
		VObjectInfo.TypeChart,
		VObjectInfo.TypeSeries,
		VObjectInfo.TypeAxis,
		VObjectInfo.TypeNone
	];
	*/
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
		25,
		26,
		27,
		28,
		29,
		30,
		31,
		32,
		33,
		34,
		35,
		37,
		38,
		39,
		40,
		41,
		42,
		43,
		44,
		45,
		46,
		47,
		51,
		52,
		53,
		54,
		55,
		56,
		57,
		58,
		60,
		61,
		62,
		63,
		64,
		65,
		66,
		67,
		68,
		69,
		70,
		71,
		72,
		73,
		74,
		75,
		76,
		77,
		78,
		79,
		80,
		81,
		82,
		83,
		84,
		85,
		-1,
	];
}

// -------------------------------------
// Get object type name
// -------------------------------------
function getObjectTypeName(objectType){
	var name = "";
	/*
	switch(objectType){
		case VObjectInfo.TypeTable :
			name = "TypeTable";
			break;
		case VObjectInfo.TypeField :
			name = "TypeField";
			break;
		case VObjectInfo.TypeIndex :
			name = "TypeIndex";
			break;
		case VObjectInfo.TypeIndexPart :
			name = "TypeIndexPart";
			break;
		case VObjectInfo.TypePluralBind :
			name = "TypePluralBind";
			break;
		case VObjectInfo.TypeUpdate :
			name = "TypeUpdate";
			break;
		case VObjectInfo.TypeUpdateComponent :
			name = "TypeUpdateComponent";
			break;
		case VObjectInfo.TypeComplexIndex :
			name = "TypeComplexIndex";
			break;
		case VObjectInfo.TypeComplexIndexPart :
			name = "TypeComplexIndexPart";
			break;
		case VObjectInfo.TypeVariable :
			name = "TypeVariable";
			break;
		case VObjectInfo.TypeStaticTable :
			name = "TypeStaticTable";
			break;
		case VObjectInfo.TypeStaticTableItem :
			name = "TypeStaticTableItem";
			break;
		case VObjectInfo.TypeTrigger :
			name = "TypeTrigger";
			break;
		case VObjectInfo.TypePicture :
			name = "TypePicture";
			break;
		case VObjectInfo.TypeGrid :
			name = "TypeGrid";
			break;
		case VObjectInfo.TypeGridCol :
			name = "TypeGridCol";
			break;
		case VObjectInfo.TypeTree :
			name = "TypeTree";
			break;
		case VObjectInfo.TypeSlot :
			name = "TypeSlot";
			break;
		case VObjectInfo.TypeForm :
			name = "TypeForm";
			break;
		case VObjectInfo.TypeControl :
			name = "TypeControl";
			break;
		case VObjectInfo.TypeSubcontrol :
			name = "TypeSubcontrol";
			break;
		case VObjectInfo.TypeMultiView :
			name = "TypeMultiView";
			break;
		case VObjectInfo.TypeLogicPrinter :
			name = "TypeLogicPrinter";
			break;
		case VObjectInfo.TypeReport :
			name = "TypeReport";
			break;
		case VObjectInfo.TypeReportSection :
			name = "TypeReportSection";
			break;
		case VObjectInfo.TypeReportControl :
			name = "TypeReportControl";
			break;
		case VObjectInfo.TypeReportGrouping :
			name = "TypeReportGrouping";
			break;
		case VObjectInfo.TypeReportCalcution :
			name = "TypeReportCalcution";
			break;
		case VObjectInfo.TypeQuery :
			name = "TypeQuery";
			break;
		case VObjectInfo.TypeQueryComponent :
			name = "TypeQueryComponent";
			break;
		case VObjectInfo.TypeFilterGlass :
			name = "TypeFilterGlass";
			break;
		case VObjectInfo.TypeFinder :
			name = "TypeFinder";
			break;
		case VObjectInfo.TypeFinderIndex :
			name = "TypeFinderIndex";
			break;
		case VObjectInfo.TypeBasket :
			name = "TypeBasket";
			break;
		case VObjectInfo.TypeProcess :
			name = "TypeProcess";
			break;
		case VObjectInfo.TypeFunction :
			name = "TypeFunction";
			break;
		case VObjectInfo.TypeEventConnection :
			name = "TypeEventConnection";
			break;
		case VObjectInfo.TypeEventSlot :
			name = "TypeEventSlot";
			break;
		case VObjectInfo.TypeInstruction :
			name = "TypeInstruction";
			break;
		case VObjectInfo.TypeDll :
			name = "TypeDll";
			break;
		case VObjectInfo.TypeAction :
			name = "TypeAction";
			break;
		case VObjectInfo.TypeMenu :
			name = "TypeMenu";
			break;
		case VObjectInfo.TypeToolbar :
			name = "TypeToolbar";
			break;
		case VObjectInfo.TypeActionLauncher :
			name = "TypeActionLauncher";
			break;
		case VObjectInfo.TypeListPipe :
			name = "TypeListPipe";
			break;
		case VObjectInfo.TypeRecordPipe :
			name = "TypeRecordPipe";
			break;
		case VObjectInfo.TypeTcpProtocol :
			name = "TypeTcpProtocol";
			break;
		case VObjectInfo.TypeConstant :
			name = "TypeConstant";
			break;
		case VObjectInfo.TypeFrame :
			name = "TypeFrame";
			break;
		case VObjectInfo.TypeDock :
			name = "TypeDock";
			break;
		case VObjectInfo.TypeFormBlock :
			name = "TypeFormBlock";
			break;
		case VObjectInfo.TypeDrop :
			name = "TypeDrop";
			break;
		case VObjectInfo.TypeQueue :
			name = "TypeQueue";
			break;
		case VObjectInfo.TypeScheme :
			name = "TypeScheme";
			break;
		case VObjectInfo.TypeSchemeItem :
			name = "TypeSchemeItem";
			break;
		case VObjectInfo.TypeDllFunction :
			name = "TypeDllFunction";
			break;
		case VObjectInfo.TypeInsertion :
			name = "TypeInsertion";
			break;
		case VObjectInfo.TypeSerialPort :
			name = "TypeSerialPort";
			break;
		case VObjectInfo.TypeDllFunctionParam :
			name = "TypeDllFunctionParam";
			break;
		case VObjectInfo.TypeAttachedFile :
			name = "TypeAttachedFile";
			break;
		case VObjectInfo.TypeSvgImage :
			name = "TypeSvgImage";
			break;
		case VObjectInfo.TypeSvgControl :
			name = "TypeSvgControl";
			break;
		case VObjectInfo.TypeSubindexator :
			name = "TypeSubindexator";
			break;
		case VObjectInfo.TypeIntercomunicator :
			name = "TypeIntercomunicator";
			break;
		case VObjectInfo.TypeStyleCondition :
			name = "TypeStyleCondition";
			break;
		case VObjectInfo.TypeViewFlow :
			name = "TypeViewFlow";
			break;
		case VObjectInfo.TypeListAlternator :
			name = "TypeListAlternator";
			break;
		case VObjectInfo.TypeComboView :
			name = "TypeComboView";
			break;
		case VObjectInfo.TypeListView :
			name = "TypeListView";
			break;
		case VObjectInfo.TypeQmlList :
			name = "TypeQmlList";
			break;
		case VObjectInfo.TypeUserRole :
			name = "TypeUserRole";
			break;
		case VObjectInfo.TypeAuxModel :
			name = "TypeAuxModel";
			break;
		case VObjectInfo.TypeAdvancedGrid :
			name = "TypeAdvancedGrid";
			break;
		case VObjectInfo.TypeAdvancedGridCol :
			name = "TypeAdvancedGridCol";
			break;
		case VObjectInfo.TypeAdvancedGridBand :
			name = "TypeAdvancedGridBand";
			break;
		case VObjectInfo.TypeQmlForm :
			name = "TypeQmlForm";
			break;
		case VObjectInfo.TypeFieldMigrator :
			name = "TypeFieldMigrator";
			break;
		case VObjectInfo.TypeFormExtRecord :
			name = "TypeFormExtRecord";
			break;
		case VObjectInfo.TypeChart :
			name = "TypeChart";
			break;
		case VObjectInfo.TypeSeries :
			name = "TypeSeries";
			break;
		case VObjectInfo.TypeAxis :
			name = "TypeAxis";
			break;
		case VObjectInfo.TypeNone :
			name = "TypeNone";
		default :
			name = "Desconocido";
	}
	*/
	switch(objectType){
		case 0 :
			name = "TypeTable";
			break;
		case 1 :
			name = "TypeField";
			break;
		case 2 :
			name = "TypeIndex";
			break;
		case 3 :
			name = "TypeIndexPart";
			break;
		case 4 :
			name = "TypePluralBind";
			break;
		case 5 :
			name = "TypeUpdate";
			break;
		case 6 :
			name = "TypeUpdateComponent";
			break;
		case 7 :
			name = "TypeComplexIndex";
			break;
		case 8 :
			name = "TypeComplexIndexPart";
			break;
		case 9 :
			name = "TypeVariable";
			break;
		case 10 :
			name = "TypeStaticTable";
			break;
		case 11 :
			name = "TypeStaticTableItem";
			break;
		case 12 :
			name = "TypeTrigger";
			break;
		case 13 :
			name = "TypePicture";
			break;
		case 14 :
			name = "TypeGrid";
			break;
		case 15 :
			name = "TypeGridCol";
			break;
		case 16 :
			name = "TypeTree";
			break;
		case 17 :
			name = "TypeSlot";
			break;
		case 18 :
			name = "TypeForm";
			break;
		case 19 :
			name = "TypeControl";
			break;
		case 20 :
			name = "TypeSubcontrol";
			break;
		case 21 :
			name = "TypeMultiView";
			break;
		case 22 :
			name = "TypeLogicPrinter";
			break;
		case 23 :
			name = "TypeReport";
			break;
		case 24 :
			name = "TypeReportSection";
			break;
		case 25 :
			name = "TypeReportControl";
			break;
		case 26 :
			name = "TypeReportGrouping";
			break;
		case 27 :
			name = "TypeReportCalcution";
			break;
		case 28 :
			name = "TypeQuery";
			break;
		case 29 :
			name = "TypeQueryComponent";
			break;
		case 30 :
			name = "TypeFilterGlass";
			break;
		case 31 :
			name = "TypeFinder";
			break;
		case 32 :
			name = "TypeFinderIndex";
			break;
		case 33 :
			name = "TypeBasket";
			break;
		case 34 :
			name = "TypeProcess";
			break;
		case 35 :
			name = "TypeFunction";
			break;
		case 37 :
			name = "TypeEventConnection";
			break;
		case 38 :
			name = "TypeEventSlot";
			break;
		case 39 :
			name = "TypeInstruction";
			break;
		case 40 :
			name = "TypeDll";
			break;
		case 41 :
			name = "TypeAction";
			break;
		case 42 :
			name = "TypeMenu";
			break;
		case 43 :
			name = "TypeToolbar";
			break;
		case 44 :
			name = "TypeActionLauncher";
			break;
		case 44 :
			name = "TypeListPipe";
			break;
		case 46 :
			name = "TypeRecordPipe";
			break;
		case 47 :
			name = "TypeTcpProtocol";
			break;
		case 51 :
			name = "TypeConstant";
			break;
		case 52 :
			name = "TypeFrame";
			break;
		case 53 :
			name = "TypeDock";
			break;
		case 54 :
			name = "TypeFormBlock";
			break;
		case 55 :
			name = "TypeDrop";
			break;
		case 56 :
			name = "TypeQueue";
			break;
		case 57 :
			name = "TypeScheme";
			break;
		case 58 :
			name = "TypeSchemeItem";
			break;
		case 60 :
			name = "TypeDllFunction";
			break;
		case 61 :
			name = "TypeInsertion";
			break;
		case 62 :
			name = "TypeSerialPort";
			break;
		case 63 :
			name = "TypeDllFunctionParam";
			break;
		case 64 :
			name = "TypeAttachedFile";
			break;
		case 65 :
			name = "TypeSvgImage";
			break;
		case 66 :
			name = "TypeSvgControl";
			break;
		case 67 :
			name = "TypeSubindexator";
			break;
		case 68 :
			name = "TypeIntercomunicator";
			break;
		case 69 :
			name = "TypeStyleCondition";
			break;
		case 70 :
			name = "TypeViewFlow";
			break;
		case 71 :
			name = "TypeListAlternator";
			break;
		case 72 :
			name = "TypeComboView";
			break;
		case 73 :
			name = "TypeListView";
			break;
		case 74 :
			name = "TypeQmlList";
			break;
		case 75 :
			name = "TypeUserRole";
			break;
		case 76 :
			name = "TypeAuxModel";
			break;
		case 77 :
			name = "TypeAdvancedGrid";
			break;
		case 78 :
			name = "TypeAdvancedGridCol";
			break;
		case 79 :
			name = "TypeAdvancedGridBand";
			break;
		case 80 :
			name = "TypeQmlForm";
			break;
		case 81 :
			name = "TypeFieldMigrator";
			break;
		case 82 :
			name = "TypeFormExtRecord";
			break;
		case 83 :
			name = "TypeChart";
			break;
		case 84 :
			name = "TypeSeries";
			break;
		case 85 :
			name = "TypeAxis";
			break;
		case -1 :
			name = "TypeNone";
		default :
			name = "Desconocido";
	}
	return name;
}

// -------------------------------------
// Property data types
// -------------------------------------
function propertyDataTypes(){
	/*
	return [
		VObjectInfo.IdentificadorPrimario,
		VObjectInfo.IdentificadorRef,
		VObjectInfo.IdentificadorTotal,
		VObjectInfo.StringIdiomas,
		VObjectInfo.String,
		VObjectInfo.StringList,
		VObjectInfo.Formula,
		VObjectInfo.FormulaList,
		VObjectInfo.Bool,
		VObjectInfo.Double,
		VObjectInfo.Int8,
		VObjectInfo.Uint8,
		VObjectInfo.Int16,
		VObjectInfo.Uint16,
		VObjectInfo.Int32,
		VObjectInfo.Uint32,
		VObjectInfo.Int64,
		VObjectInfo.Uint64,
		VObjectInfo.Color,
		VObjectInfo.Font,
		VObjectInfo.Imagen,
		VObjectInfo.Region,
		VObjectInfo.StringVariable,
		VObjectInfo.IdCompuestoControl,
		VObjectInfo.PathFileScript,
	];
	*/
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
	];
}

// -------------------------------------
// Get edit property data type name
// -------------------------------------
function getPropertyDataTypeName(dataType){
	var name = "";
	/*
	switch(dataType){
		case VObjectInfo.IdentificadorPrimario :
			name = "IdentificadorPrimario";
			break;
		case VObjectInfo.IdentificadorRef :
			name = "IdentificadorRef";
			break;
		case VObjectInfo.IdentificadorTotal :
			name = "IdentificadorTotal";
			break;
		case VObjectInfo.StringIdiomas :
			name = "StringIdiomas";
			break;
		case VObjectInfo.String :
			name = "String";
			break;
		case VObjectInfo.StringList :
			name = "StringList";
			break;
		case VObjectInfo.Formula :
			name = "Formula";
			break;
		case VObjectInfo.FormulaList :
			name = "FormulaList";
			break;
		case VObjectInfo.Bool :
			name = "Bool";
			break;
		case VObjectInfo.Double :
			name = "Double";
			break;
		case VObjectInfo.Int8 :
			name = "Int8";
			break;
		case VObjectInfo.Uint8 :
			name = "Uint8";
			break;
		case VObjectInfo.Int16 :
			name = "Int16";
			break;
		case VObjectInfo.Uint16 :
			name = "Uint16";
			break;
		case VObjectInfo.Int32 :
			name = "Int32";
			break;
		case VObjectInfo.Uint32 :
			name = "Uint32";
			break;
		case VObjectInfo.Int64 :
			name = "Int64";
			break;
		case VObjectInfo.Uint64 :
			name = "Uint64";
			break;
		case VObjectInfo.Color :
			name = "Color";
			break;
		case VObjectInfo.Font :
			name = "Font";
			break;
		case VObjectInfo.Imagen :
			name = "Imagen";
			break;
		case VObjectInfo.Region :
			name = "Region";
			break;
		case VObjectInfo.StringVariable :
			name = "StringVariable";
			break;
		case VObjectInfo.IdCompuestoControl :
			name = "IdCompuestoControl";
			break;
		case VObjectInfo.PathFileScript :
			name = "PathFileScript";
		default :
			name = "Desconocido";
	}
	*/
	switch(dataType){
		case 0 :
			name = "IdentificadorPrimario";
			break;
		case 1 :
			name = "IdentificadorRef";
			break;
		case 2 :
			name = "IdentificadorTotal";
			break;
		case 3 :
			name = "StringIdiomas";
			break;
		case 4 :
			name = "String";
			break;
		case 5 :
			name = "StringList";
			break;
		case 6 :
			name = "Formula";
			break;
		case 7 :
			name = "FormulaList";
			break;
		case 8 :
			name = "Bool";
			break;
		case 9 :
			name = "Double";
			break;
		case 10 :
			name = "Int8";
			break;
		case 11 :
			name = "Uint8";
			break;
		case 12 :
			name = "Int16";
			break;
		case 13 :
			name = "Uint16";
			break;
		case 14 :
			name = "Int32";
			break;
		case 15 :
			name = "Uint32";
			break;
		case 16 :
			name = "Int64";
			break;
		case 17 :
			name = "Uint64";
			break;
		case 18 :
			name = "Color";
			break;
		case 19 :
			name = "Font";
			break;
		case 20 :
			name = "Imagen";
			break;
		case 21 :
			name = "Region";
			break;
		case 22 :
			name = "StringVariable";
			break;
		case 23 :
			name = "IdCompuestoControl";
			break;
		case 24 :
			name = "PathFileScript";
		default :
			name = "Desconocido";
	}
	return name;
}

// -------------------------------------
// Property edit types
// -------------------------------------
function propertyEditTypes(){
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
	];
}

// -------------------------------------
// Get edit property edit type name
// -------------------------------------
function getPropertyEditTypeName(editType){
	var name = "";
	switch(editType){
		case 0:
			name = "El default para el tipo de dato";
			break;
		case 1:
			name = "AutoCalculada. No editable";
			break;
		case 2:
			name = "Combo Enum";
			break;
		case 3:
			name = "Combo que permite edición";
			break;
		case 4:
			name = "Combo que muestra todos los campos de su origen + sus maestros";
			break;
		case 5:
			name = "Combo que muestra los campos de tipo objeto dibujo + sus maestros";
			break;
		case 6:
			name = "Combo de Strings";
			break;
		case 7:
			name = "SerialPortWindows: browser puerto serie Windows";
			break;
		case 8:
			name = "SerialPortPosix: browser puerto serie Posix";
			break;
		case 9:
			name = "Browser de plataformas SO";
			break;
		case 10:
			name = "Browser de ficheros";
			break;
		case 11:
			name = "Browser de directorios";
			break;
		case 12:
			name = "Combo de estilos (flags)";
			break;
		default:
			name = "Desconocido";
	}
	return name;
}
