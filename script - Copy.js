$mutiFile = ""
$number = 0;
$FileJoin = "";
$limitFile = 0;
$maxFile = 0;
$NameFileJoin = "";
$NumberJoin = 0;
$ZipDownload = new JSZip();
$ListFile = "";
$NameList = "";
$typeJoin = "";
$numberSplit = 0;
$FileSplit = "";
$NameFileSplit = "";
$NumberFileSplit = 0;
$UploadType = true;

$('input[name="upload-type-file"]').change(function() {
  if (this.value == "file") {
    $UploadType = true;
		$('#fileJoin').removeAttr("webkitdirectory");
  } else {
    $UploadType = false;
		$('#fileJoin').attr("webkitdirectory","webkitdirectory");
  }
})

$('input[name="split-type"]').change(function() {
  if (this.value == "split") {
    $('.limit-line').slideDown(500);
  } else {
    $('.limit-line').slideUp(500);
  }
})

$('input[name="join-type"]').change(function() {
  if (this.value == "split") {
    $('.limit-file').slideUp(500);
  } else {
    $('.limit-file').slideDown(500);
  }
})

$('#fileSplit').on("change", function($data) {
  //console.log($data);
  $ZipDownload = new JSZip();
  $FileSplit = "";
  $numberSplit = 0;
  $maxFileSplit = 0;
  $NumberFileSplit = 0;
  $FileSplit = document.getElementById("fileSplit").files;
  var $check = $('input[name="split-type"]:checked').val();

  $('.type-status').text("Tách File");
  $('.text-load').text("Đang phân tích file, vui lòng chờ...");
  $('.complete-gif').hide();
  $('.loading-gif').show();
  $('.loading-run').addClass("active");
  $('.list-file').html("")
  setTimeout(function() {
    splitTxt($FileSplit[$numberSplit], $numberSplit, $FileSplit, $check);
  }, 2000);

});


function splitTxt(fileToLoad, $number, $mutiFile, $check) {
  // Biến lấy tên file
  var $name = fileToLoad.name;
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    // Đọc dữ liệu của file;
    var $textdata = fileLoadedEvent.target.result;
    splitText($textdata, $name, $number, $mutiFile, $check);
  }
  fileReader.readAsText(fileToLoad, "UTF-8");
}
$maxFileSplit = 0

function splitText($textdata, $name, $number, $mutiFile, $check) {
  $textSave = $textdata;
  if ($check == "join") {
    var $result = $textdata.split(/\r\n\=\=SplitFile\=\=/);
    if ($result.length == 1) {
      alert("File " + $name + " không được nối bằng tool, nên không tách được.");
      $('.loading-run').removeClass("active");
      return false;
    }
    if ($numberSplit < $FileSplit.length) {
      for (var $j = 0; $j < $result.length; $j++) {
        var $block = $result[$j];
        var $split = $block.split(/NameFILE\|(.+)\r\n/gi);
        if ($split.length > 1) {
          var $name = $split[1];
          var $text = $split[2];
          var $list = '<li class="item-file split-item"><label class="file-item">' + $name + '</label></li>';
          $('.list-file').append($list);
          $maxFileSplit = $maxFileSplit + 1;
          $('.type-status').text("Đã tách " + $maxFileSplit + " file.")
          ////console.log($list);
          $ZipDownload.file($name, $text);
        }
      }
    }

    $numberSplit = $numberSplit + 1;
    if ($numberSplit == $FileSplit.length) {
      completeSplit();
      return false;
    }
    splitTxt($FileSplit[$numberSplit], $numberSplit, $FileSplit, $check);
  } else {
    var $split = $textSave.split(/\r\n/);
    var $result = "";
    if ($check == 1) {
      var $split = $textSave.split(/\n/);
    }
    var $maxLine = Number($('input.input-val.input-split').val());
    var $limitLine = $maxLine;
    for (var $j = 0; $j < $split.length; $j++) {
      $result += $split[$j] + "\r\n";
      ////console.log($limitLine);
      if ($j == $limitLine) {
        $NameFileSplit = $name + "_" + $NumberFileSplit + ".txt";
        $NumberFileSplit = $NumberFileSplit + 1;
        $('.type-status').text("Đã tách " + $NumberFileSplit + " file.")
        var $list = '<li class="item-file split-item"><label class="file-item">' + $NameFileSplit + '</label></li>';
        $('.list-file').append($list);
        $limitLine = $maxLine + $limitLine;
        $ZipDownload.file($NameFileSplit, $result);
        $result = "";
      }
      if (($j + 1) == $split.length) {
        $NameFileSplit = $name + "_" + $NumberFileSplit + ".txt";
        $NumberFileSplit = $NumberFileSplit + 1;
        $('.type-status').text("Đã tách " + $NumberFileSplit + " file.")
        var $list = '<li class="item-file split-item"><label class="file-item">' + $NameFileSplit + '</label></li>';
        $('.list-file').append($list);
        $ZipDownload.file($NameFileSplit, $result);
        completeSplit();
        $result = "";
      }
    }
  }
}



function completeSplit() {
  ////console.log("Đã tách xong");
  $('.text-load').text("Đã tách file xong.");
  $('.loading-gif').hide();
  $('.complete-gif').show();
  document.getElementById('fileSplit').value = "";
  setTimeout(function() {
    $ZipDownload.generateAsync({
      type: "blob"
    }).then(function(content) {
      saveAs(content, "All File Split.zip");
    });
    $('.loading-run').removeClass("active");
  }, 2000);
}

$('#fileJoin').on("change", function($data) {
  //console.log($data);
  $mutiFile = "";
  $number = 0;
  $NumberJoin = 0;
  $typeJoin = "";
  $limitFile = Number($('input[name="number-join"]').val());
  $typeJoin = $('input[name="join-type"]:checked').val();
	$ZipDownload = new JSZip();
  $('.type-status').text("Nối File");
  $('.text-load').text("Đang phân tích file, vui lòng chờ...");
  $('.complete-gif').hide();
  $('.loading-gif').show();
  $('.loading-run').addClass("active");
  $('.list-file').html("")
  $maxFile = $limitFile;
  $mutiFile = document.getElementById("fileJoin").files;
  var $type = $mutiFile[0].type;
  // Tạo list tên file
  setTimeout(function() {
    ////console.log($type);
    postFile($number, $mutiFile);
  }, 2000);
});


function postFile($number, $mutiFile) {
  // Nếu chưa đến file cuối thì tạo icont load và icont comple ở file hoàn thành
  getTxt($mutiFile[$number], $number, $mutiFile);

}

// Hàm đọc dữ liệu từng file dựa theo số thứ tự được gửi vào
function getTxt(fileToLoad, $number, $mutiFile) {
  // Biến lấy tên file
  var $name = fileToLoad.name;
	if(fileToLoad.webkitRelativePath){
		$name = fileToLoad.webkitRelativePath;
	}
	
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		// Đọc dữ liệu của file;
		var $textdata = fileLoadedEvent.target.result;
		convertText($textdata, $name, $number, $mutiFile);
	}
	fileReader.readAsText(fileToLoad, "UTF-8");
}

function collect() {
  var $class = $(this).attr("class");
  //console.log($class);
  if ($class.indexOf("active") == -1) {
    $(this).addClass("active");
    $(this).attr("title", "Nhấn để mở rộng.");
    $(this).find(".list-item-child").slideUp(500);
  } else {
    $(this).removeClass("active");
    $(this).attr("title", "Nhấn để thu gọn lại.");
    $(this).find(".list-item-child").slideDown(500);
  }
}

function convertText($textdata, $name, $number, $mutiFile) {
  //console.log("type: " + $typeJoin)
  if ($typeJoin == "join") {
		if($name.indexOf(".txt") > -1){
			$FileJoin += "NameFILE|" + $name + "\r\n" + $textdata + "\r\n" + "==SplitFile==" + "\r\n";
			$NameList += "<li class=\"Item-child\">" + $name + "</li>";
		}
    var $check = $mutiFile.length - $number;
    if ($number == $limitFile /*&& $check > $maxFile*/ ) {
      $limitFile = $maxFile + $limitFile;
      $NameFileJoin = "File_Join_" + $NumberJoin + ".txt";
      $NumberJoin = $NumberJoin + 1;
			$ZipDownload.file($NameFileJoin, $FileJoin);
      $FileJoin = "";
      $ListFile += '<li class="item-file" onclick="collect.call(this)" title="Nhấn để thu gọn lại.">';
      $ListFile += '<label class="file-item">' + $NameFileJoin + '</label>';
      $ListFile += '<ul class="list-item-child">' + $NameList + '</ul></li>';
      $('.type-status').text("Đã nối " + $NumberJoin + " file.")
      $('.list-file').append($ListFile);
      $ListFile = "";
      $NameList = "";
			
      //console.log("Gộp lại 1 file: " + $limitFile + "|" + $number + "|" + $maxFile + "|" + $check);
    }
    //console.log("Check: " + $check + "| Maxfile: " + $maxFile)
    //console.log("MaxMuti: " + $mutiFile.length + "| NumberFile: " + $number)
    if ( /*$check < $maxFile &&*/ ($mutiFile.length - 1) == $number) {
      $limitFile = $maxFile + $number;
      $NameFileJoin = "File_Join_" + $NumberJoin + ".txt";
      $NumberJoin = $NumberJoin + 1;
			$ZipDownload.file($NameFileJoin, $FileJoin);
			$ListFile += '<li class="item-file" onclick="collect.call(this)" title="Nhấn để thu gọn lại.">';
			$ListFile += '<label class="file-item">' + $NameFileJoin + '</label>';
			$ListFile += '<ul class="list-item-child">' + $NameList + '</ul></li>';
			$('.list-file').append($ListFile);
			$('.type-status').text("Đã nối " + $NumberJoin + " file.");
			$ListFile = "";
			$NameList = "";
      //console.log("Tới file gộp cuối");
      compleJoin();
      return false;
    }
    //console.log("Chuyển sang file mới");
    $number = $number + 1;
    postFile($number, $mutiFile);
    //console.log("Số:" + $number);
  }
  if ($typeJoin == "split") {
    $FileJoin += $textdata + "\r\n"
    $('.type-status').text("Đã nối " + ($number + 1) + " file.");
    $ListFile = '<li class="item-file" onclick="collect.call(this)" title="Nhấn để thu gọn lại."><label class="file-item">' + $name + '</label></li>';
    $('.list-file').append($ListFile);
    if (($number + 1) == $mutiFile.length) {
      $ZipDownload.file($name.replace(/\_\d+\.txt/,".txt"), $FileJoin);
      compleJoin();
      return false;
    }
    $number = $number + 1;
    postFile($number, $mutiFile);
  }
}

function compleJoin() {

  $('.text-load').text("Đã nối file xong.");
  $('.loading-gif').hide();
  $('.complete-gif').show();
  document.getElementById('fileJoin').value = "";
  setTimeout(function() {
    $ZipDownload.generateAsync({
      type: "blob"
    }).then(function(content) {
      saveAs(content, "All File Join.zip");
    });
    $('.loading-run').removeClass("active");
  }, 2000);

}