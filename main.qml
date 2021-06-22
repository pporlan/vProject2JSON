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
        if(theExtension.currentProjectInfo().id() == "")
        {
            errors += "Debe abrir un proyecto\n";
        }
        // Comprobamos si hay seleccionado directorio
        if(directoryTextField.text == "")
        {
            errors += "Debe seleccionar un directorio\n";
        }
        if(errors != ""){
            showMessage("Error:\n" + errors, StandardIcon.Critical);
            return;
        }
        Global.generateObjectMD5 = generateObjectMD5CheckBox.checked;
        Global.exportLegacyProjects = exportLegacyProjectsCheckBox.checked;
        Global.exportProperties = exportPropertiesCheckBox.checked;
        Global.exportSubObjects = exportSubObjectsCheckBox.checked;
        Global.directory = directoryTextField.text;
        try{
            progressInfo.visible = true;
            Global.exportProject(theExtension.currentProjectInfo());
            progressInfo.visible = false;
        }
        catch(e){
            showMessage("Error:\n" + e, StandardIcon.Critical);
        }
        

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

    Component.onCompleted:
    {
        directoryTextField.text = theApp.homePath();
        if (Qt.platform.os === "windows")
        {
            fileDialog.folder = "file:///" + directoryTextField.text
        }
        else
        {
            fileDialog.folder = "file://" + directoryTextField.text
        }
    }

    ColumnLayout
    {
        anchors.fill: parent
        spacing: 0

        ToolBar
        {
            Layout.fillWidth: true

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
                    }
                }

                CheckBox {
                    id : generateObjectMD5CheckBox
                    checked: false
                    text: "Generar MD5 de objetos"
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
        

        Rectangle
        {
            id: progressInfo
            anchors.centerIn: parent
            visible: false

            property string description: "test"

            ProgressBar
            {
                id: typeProgressBar
                anchors.centerIn: parent
                value: 0
                maximumValue: 100
                minimumValue: 0
            }

            Text
            {
                id: typeProgressCount
                text: progressInfo.description
                horizontalAlignment: Text.AlignHCenter
                anchors.bottom : typeProgressBar.top
                anchors.left : typeProgressBar.left
                anchors.right : typeProgressBar.right
            }

            ProgressBar
            {
                id: objectProgressBar
                value: 0
                maximumValue: 100
                minimumValue: 0
                anchors.top : objectProgressCount.bottom
                anchors.left : objectProgressCount.left
                anchors.right : objectProgressCount.right
            }

            Text
            {
                id: objectProgressCount
                text: objectProgressBar.value + " %"
                horizontalAlignment: Text.AlignHCenter
                anchors.top : typeProgressBar.bottom
                anchors.left : typeProgressBar.left
                anchors.right : typeProgressBar.right
            }
        }
    }

    FileDialog {
        id: fileDialog
        title: "Seleccionar directorio"
        selectFolder: true
        folder: directoryTextField.text
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

/*##^##
Designer {
    D{i:0;autoSize:true;height:480;width:640}
}
##^##*/
