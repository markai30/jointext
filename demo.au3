#include<ie.au3>
#include<windowsconstants.au3>
#include<guiconstants.au3>
$oIE = _IECreateEmbedded ()
    GUICreate("Embedded Web control Test", 640, 580, _
        (@DesktopWidth - 640) / 2, (@DesktopHeight - 580) / 2, _
        BitOR($WS_OVERLAPPEDWINDOW, $WS_VISIBLE, $WS_CLIPSIBLINGS, $WS_CLIPCHILDREN))
    $GUIActiveX = GUICtrlCreateObj($oIE, 0, 0, 640, 580);
	$File = "index.html";
	FileOpen($File,0);
	$HTML = FileRead($File);
	ConsoleWrite($HTML);
   ;GUISetState()    ;Show GUI
    $sHTML = $HTML

    _IENavigate ($oIE, "about:blank")
    _IEDocWriteHTML ($oIE, $sHTML)
    _IEAction ($oIE, "refresh")
GUISetState()
    While 1
        $msg = GUIGetMsg()
        Switch $Msg
            Case $GUI_EVENT_CLOSE
            MsgBox(0, "GUI Event", "You clicked CLOSE! Exiting...")
            ExitLoop
        EndSwitch
    WEnd
    GUIDelete()
    Exit