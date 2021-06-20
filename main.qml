import QtQuick 2.6
import QtQuick.Controls 1.5
import QtQuick.Controls.Styles 1.3
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.2

import VExtensions 1.0

import "export.js" as Global

Rectangle
{
	id: page

	SystemPalette { id: myPalette; colorGroup: SystemPalette.Active }
	color: myPalette.window	
	function run()
	{
		var errors = "";
		// Comprobamos si tenemos un proyecto abierto
		if( theExtension.currentProjectInfo().id() == "" )
		{
			errors += "Debe abrir un proyecto\n";
		}
		// Comprobamos si hay seleccionado directorio
		if( directoryTextField.text == "" )
		{
			errors += "Debe seleccionar un directorio\n";
		}
		if(errors != ""){
			showMessage("Error:\n" + errors, StandardIcon.Critical);
			return;
		}

		Global.exportLegacyProjects = exportLegacyProjectsCheckBox.checked;
		Global.exportProperties = exportPropertiesCheckBox.checked;
		Global.exportSubObjects = exportSubObjectsCheckBox.checked;
		Global.directory = directoryTextField.text
		Global.exportProject(theExtension.currentProjectInfo());
		if(Global.files.length == 1){
			Qt.openUrlExternally(Global.files[0])
		}
		else if(Global.files.length > 1){
			Qt.openUrlExternally(Global.directory)
		}
		else{
			showMessage("Error", StandardIcon.Critical);
		}
	}
	
	function showMessage(text, icon)
	{
		messageDialog.text = text
		messageDialog.icon = icon
		messageDialog.open()
	}
	
	ColumnLayout
	{
		anchors.fill: parent
		spacing: 0

		ToolBar
		{
			Layout.fillWidth: true
			// Layout.preferredHeight: childrenRect.height

			RowLayout
			{
				anchors.verticalCenter: parent.verticalCenter

				ToolButton
				{
					id: exportButton
					Layout.alignment : Qt.AlignVCenter
					text: "Exportar JSON"
					tooltip: "Exportar JSON"
					style: ButtonStyle
					{
						label: RowLayout
						{
							Text
							{
								id: textButton
								text: control.text;
							}
						}
					}

					onClicked:
					{
						run();
					}
				}
			}
		}
		
		Rectangle
		{
			Layout.fillWidth:  true
			Layout.fillHeight: true
			
			ColumnLayout {

				RowLayout {
					
					Button {
						id: buttonShowFileDialog
						text: "Seleccionar directorio"
						onClicked:
						{
							fileDialog.visible = true
						}
					}
					
					TextField {
						id: directoryTextField
						readOnly: true
						text: shortcuts.home
					}
				}
			
				CheckBox {
					id : exportSubObjectsCheckBox
					checked: false
					text: "Exportar subobjetos"
				}
				CheckBox {
					id : exportPropertiesCheckBox
					checked: false
					text: "Exportar propiedades de objetos"
				}
				CheckBox {
					id : exportLegacyProjectsCheckBox
					checked: false
					text: "Exportar proyectos heredados"
				}
			}
		}
	}
	
	FileDialog {
		id: fileDialog
		title: "Seleccionar directorio"
		selectFolder: true
		folder: shortcuts.home
		onAccepted: {
			if (Qt.platform.os === "windows")
			{
				directoryTextField.text = fileDialog.fileUrl.toString().replace("file:///", "")
			}
			else
			{
				directoryTextField.text = fileDialog.fileUrl.toString().replace("file://", "")
			}
			fileDialog.visible = false
		}
		onRejected: {
			fileDialog.visible = false
		}
	}
	
	MessageDialog
	{
		id: messageDialog
		icon: StandardIcon.Information
		standardButtons: StandardButton.Close
		modality: Qt.ApplicationModal
	}
	
}
