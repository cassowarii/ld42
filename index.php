<html>
<head><title>
    game time fun time
</title>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=100%, target-densitydpi=device-dpi, user-scalable=no" />
</head>
<body style="background:#000; color:#fff; touch-action: none; position: fixed; overflow-y: hidden; width: 100%">
<div style="text-align: center; width:100%; max-width:840px; margin: auto; margin-top: 10px; position: relative;">
    <h4>i don't know what its called yet</h4>
<canvas id="canvas" width="540" height="540" style="max-width:100%"> </canvas>
<br />
<button id="pause">pause</button>
<button id="mute">mute</button>
<br />
<div style="text-align:left;width:100%;margin-top:10px;">
</div>
</div>
<div style="text-align:center;margin-top:10px;"><tt>
<?php
$fh = fopen("countlog.txt","r");
if ($fh) {
    $count = fread($fh, filesize("countlog.txt"));
} else {
    $count = 0;
}
fclose($fh);
$count=$count + 1 ;
$array = str_split($count);
$text = join(' ', $array);
if ($count > 100) {
    echo $text ;
}
$fh = fopen("countlog.txt","w");
fwrite($fh, $count);
fclose($fh);
?>
</tt></div>
</body>
<script src="ready.js"></script>
<script src="game.js"></script>
</html>
